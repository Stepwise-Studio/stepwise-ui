import fs from 'node:fs'
import path from 'node:path'
import pc from 'picocolors'
import { fetchComponent, type ComponentManifest } from '../utils/registry.js'
import {
  findProjectRoot,
  detectPackageManager,
  missingDependencies,
  installPackages,
  checkPathAlias,
} from '../utils/project.js'

/**
 * Resolve every component to install, following registryDependencies.
 *
 * Done up front and as a set so a diamond (two components both needing
 * `button`) fetches and writes it once, and a cycle can't spin forever.
 */
async function resolveGraph(names: string[]) {
  const manifests = new Map<string, ComponentManifest>()
  const failed: string[] = []
  const queue = [...names]

  while (queue.length > 0) {
    const name = queue.shift()!
    if (manifests.has(name) || failed.includes(name)) continue

    try {
      const manifest = await fetchComponent(name)
      manifests.set(name, manifest)
      queue.push(...manifest.registryDependencies)
    } catch (err) {
      console.error(pc.red(`  ✗ ${(err as Error).message}`))
      failed.push(name)
    }
  }

  return { manifests, failed }
}

export async function add(components: string[], opts: { yes?: boolean }) {
  let root: string
  try {
    root = findProjectRoot()
  } catch (err) {
    console.error(pc.red(`✗ ${(err as Error).message}`))
    process.exitCode = 1
    return
  }

  const { manifests, failed } = await resolveGraph(components)
  if (manifests.size === 0) {
    process.exitCode = 1
    return
  }

  const requested = new Set(components)
  const pulled = [...manifests.keys()].filter(n => !requested.has(n))
  if (pulled.length > 0) {
    console.log(pc.dim(`  Also required: ${pulled.sort().join(', ')}`))
  }

  // ---- write files -------------------------------------------------------
  // Shared files (lib/utils/cn.ts, primitives/surface.tsx) ship with every
  // component that uses them, so the same path arrives many times per run.
  // Identical content is a no-op, not something worth telling the user about.
  const written = new Set<string>()
  let writeCount = 0
  let skipCount = 0

  for (const manifest of manifests.values()) {
    for (const file of manifest.files) {
      if (written.has(file.path)) continue
      written.add(file.path)

      const dest = path.join(root, file.path)

      if (fs.existsSync(dest)) {
        const current = fs.readFileSync(dest, 'utf-8')
        if (current === file.content) continue // already up to date
        if (!opts.yes) {
          console.log(
            pc.yellow(`  ~ ${file.path} ${pc.dim('(differs - use --yes to overwrite)')}`),
          )
          skipCount++
          continue
        }
      }

      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.writeFileSync(dest, file.content, 'utf-8')
      console.log(`  ${pc.green('✓')} ${file.path}`)
      writeCount++
    }
  }

  // ---- install dependencies ---------------------------------------------
  // One install for the whole run - installing per component would re-run the
  // package manager dozens of times on a multi-component add.
  const required = [...new Set([...manifests.values()].flatMap(m => m.dependencies))]
  const missing = missingDependencies(required, root)

  if (missing.length > 0) {
    const pm = detectPackageManager(root)
    console.log(`\n  ${pc.dim('Installing:')} ${missing.join(', ')}`)
    try {
      installPackages(missing, root, pm)
    } catch {
      console.error(pc.red('  ✗ Failed to install dependencies. Run manually:'))
      console.error(
        pc.dim(`    ${pm} ${pm === 'npm' ? 'install' : 'add'} ${missing.join(' ')}`),
      )
      process.exitCode = 1
    }
  }

  // Peers are frameworks (next, react) - installing one into a project that
  // chose a different stack would be worse than the error, so only report it.
  const peers = new Set<string>()
  for (const [name, manifest] of manifests) {
    for (const p of manifest.peerDependencies ?? []) {
      if (missingDependencies([p], root).length > 0) peers.add(`${p} (${name})`)
    }
  }
  if (peers.size > 0) {
    console.log(
      `\n  ${pc.yellow('!')} Requires packages this project doesn't have: ` +
        `${[...peers].sort().join(', ')}\n` +
        pc.dim('    Install them yourself - they are framework-level choices.'),
    )
  }

  // Components import each other through `@/…`, so without the alias none of
  // what we just wrote will compile. Worth saying once, at the end.
  const alias = checkPathAlias(root)
  if (!alias.ok) {
    console.log(
      `\n  ${pc.yellow('!')} ${alias.message}\n` +
        pc.dim('    Stepwise components import each other via "@/…" paths.'),
    )
  }

  // Report what actually happened - a run where every file was skipped has
  // added nothing, and saying otherwise hides the skip the user needs to see.
  if (writeCount === 0 && skipCount === 0) {
    console.log(pc.dim('\n  Everything already up to date.'))
  } else {
    const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
    const parts = [plural(manifests.size, 'component'), plural(writeCount, 'file') + ' written']
    if (skipCount > 0) parts.push(pc.yellow(`${skipCount} skipped`))
    console.log(`\n${pc.green('✓')} ${parts.join(', ')}.`)
  }

  if (failed.length > 0) process.exitCode = 1
}
