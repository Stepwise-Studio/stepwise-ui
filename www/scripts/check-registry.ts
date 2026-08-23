/**
 * Validates the generated registry before it ships.
 *
 * A broken registry fails on the user's machine, mid-install, after files are
 * already written — so every one of these is checked here instead:
 *   - every `src` file exists
 *   - every registryDependency resolves to a real component
 *   - no dependency cycles (the CLI recurses, so a cycle hangs it)
 *   - no npm dependency the www app doesn't itself install
 *   - every component has a description
 *   - every component file under components/stepwise is shipped by something
 *
 * Run: npm run registry:check
 */
import fs from 'node:fs'
import path from 'node:path'
import { registry } from '../registry/index.js'

const wwwRoot = path.resolve(import.meta.dirname, '..')
const errors: string[] = []
const warnings: string[] = []

const names = new Set(registry.map(c => c.name))

// ---- files exist, descriptions present ------------------------------------

for (const c of registry) {
  if (!c.description) errors.push(`${c.name}: empty description`)
  if (c.files.length === 0) errors.push(`${c.name}: no files`)

  for (const f of c.files) {
    if (!fs.existsSync(path.join(wwwRoot, f.src))) {
      errors.push(`${c.name}: missing source file ${f.src}`)
    }
    if (path.isAbsolute(f.dest) || f.dest.includes('..')) {
      errors.push(`${c.name}: unsafe dest path ${f.dest}`)
    }
  }

  // The entry file must be among the shipped files, or `add` writes deps
  // without the component itself.
  const entry = `components/stepwise/${c.name}.tsx`
  if (!c.files.some(f => f.src === entry)) {
    errors.push(`${c.name}: entry file ${entry} not in files[]`)
  }
}

// ---- registry dependencies resolve, no cycles -----------------------------

const deps = new Map(registry.map(c => [c.name, c.registryDependencies]))

for (const c of registry) {
  for (const d of c.registryDependencies) {
    if (!names.has(d)) errors.push(`${c.name}: unknown registryDependency "${d}"`)
    if (d === c.name) errors.push(`${c.name}: depends on itself`)
  }
}

const state = new Map<string, 'visiting' | 'done'>()
function visit(name: string, stack: string[]) {
  if (state.get(name) === 'done') return
  if (state.get(name) === 'visiting') {
    errors.push(`dependency cycle: ${[...stack, name].join(' → ')}`)
    return
  }
  state.set(name, 'visiting')
  for (const d of deps.get(name) ?? []) {
    if (names.has(d)) visit(d, [...stack, name])
  }
  state.set(name, 'done')
}
for (const c of registry) visit(c.name, [])

// ---- npm dependencies are real -------------------------------------------

const pkg = JSON.parse(
  fs.readFileSync(path.join(wwwRoot, 'package.json'), 'utf-8'),
) as { dependencies?: Record<string, string> }
const installed = new Set(Object.keys(pkg.dependencies ?? {}))

for (const c of registry) {
  for (const d of [...c.dependencies, ...c.peerDependencies]) {
    if (!installed.has(d)) {
      errors.push(`${c.name}: dependency "${d}" is not installed in www — typo?`)
    }
  }
  const overlap = c.dependencies.filter(d => c.peerDependencies.includes(d))
  if (overlap.length > 0) {
    errors.push(`${c.name}: "${overlap.join(', ')}" listed as both dependency and peer`)
  }
}

// ---- nothing left behind --------------------------------------------------

const shipped = new Set(registry.flatMap(c => c.files.map(f => f.src)))
const componentFiles: string[] = []
;(function walk(dir: string) {
  for (const e of fs.readdirSync(path.join(wwwRoot, dir), { withFileTypes: true })) {
    const rel = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name !== 'docs') walk(rel)
    } else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts')) {
      componentFiles.push(rel)
    }
  }
})('components/stepwise')

for (const f of componentFiles.sort()) {
  if (!shipped.has(f)) warnings.push(`${f} is not shipped by any component`)
}

// ---- report ---------------------------------------------------------------

for (const w of warnings) console.warn(`  ! ${w}`)
for (const e of errors) console.error(`  ✗ ${e}`)

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s) — registry is not safe to publish.`)
  process.exit(1)
}

console.log(
  `\n✓ ${registry.length} component(s) valid` +
    (warnings.length ? ` (${warnings.length} warning(s))` : ''),
)
