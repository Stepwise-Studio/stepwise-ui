import fs from 'node:fs'
import path from 'node:path'
import pc from 'picocolors'
import { fetchComponent } from '../utils/registry.js'
import {
  findProjectRoot,
  detectPackageManager,
  missingDependencies,
  installPackages,
} from '../utils/project.js'

export async function add(components: string[], opts: { yes?: boolean }) {
  const root = findProjectRoot()
  const pm = detectPackageManager(root)

  for (const name of components) {
    console.log(`\n${pc.cyan('◆')} Adding ${pc.bold(name)}…`)

    let manifest
    try {
      manifest = await fetchComponent(name)
    } catch (err) {
      console.error(pc.red(`  ✗ ${(err as Error).message}`))
      process.exitCode = 1
      continue
    }

    // Write files
    for (const file of manifest.files) {
      const dest = path.join(root, file.path)
      const dir = path.dirname(dest)
      fs.mkdirSync(dir, { recursive: true })

      const exists = fs.existsSync(dest)
      if (exists && !opts.yes) {
        console.log(pc.yellow(`  ~ ${file.path} (already exists, skipping — use --yes to overwrite)`))
        continue
      }

      fs.writeFileSync(dest, file.content, 'utf-8')
      console.log(`  ${pc.green('✓')} ${file.path}`)
    }

    // Install missing deps
    const missing = missingDependencies(manifest.dependencies, root)
    if (missing.length > 0) {
      console.log(`\n  ${pc.dim('Installing:')} ${missing.join(', ')}`)
      try {
        installPackages(missing, root, pm)
      } catch {
        console.error(pc.red(`  ✗ Failed to install dependencies. Run manually:`))
        console.error(pc.dim(`    ${pm} ${pm === 'npm' ? 'install' : 'add'} ${missing.join(' ')}`))
      }
    }

    // Recurse into registry dependencies
    if (manifest.registryDependencies.length > 0) {
      console.log(`  ${pc.dim('Registry deps:')} ${manifest.registryDependencies.join(', ')}`)
      await add(manifest.registryDependencies, { yes: opts.yes })
    }

    console.log(`  ${pc.green('✓')} Done`)
  }
}
