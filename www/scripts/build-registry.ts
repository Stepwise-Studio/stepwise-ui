import fs from 'node:fs'
import path from 'node:path'
import { registry } from '../registry/index.js'

const wwwRoot = path.resolve(import.meta.dirname, '..')
const outDir = path.join(wwwRoot, 'public', 'r')

fs.mkdirSync(outDir, { recursive: true })

/**
 * Runtime values a component file exports.
 *
 * Without this, the only way to learn that `frame` also exports `FrameHeader`,
 * `FrameTitle` and four more - or that `toast` exports a `toast()` function
 * alongside `<Toaster />` - is to download and parse the source. Types are
 * excluded deliberately: an agent writing JSX needs the values.
 */
function extractExports(source: string): string[] {
  const names = new Set<string>()

  for (const m of source.matchAll(/^export\s+(?:async\s+)?(?:function|const|class)\s+(\w+)/gm)) {
    names.add(m[1])
  }
  // `export { A, B as C }` - take the exported (right-hand) name.
  for (const block of source.matchAll(/^export\s*\{([^}]+)\}/gm)) {
    for (const part of block[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim()
      if (name && /^[A-Za-z_]\w*$/.test(name) && name !== 'default') names.add(name)
    }
  }
  return [...names].sort()
}

/**
 * The first fenced code constant on the component's docs page, which by
 * convention is its simplest import-and-render example. Pulled from the docs
 * rather than duplicated in the registry so there is one copy to keep correct.
 */
function extractExample(name: string): string | undefined {
  const ownPage = path.join(wwwRoot, 'app', 'docs', name, 'page.tsx')
  if (fs.existsSync(ownPage)) {
    const m = /const\s+\w*[Cc]ode\s*=\s*`([^`]{20,})`/.exec(fs.readFileSync(ownPage, 'utf-8'))
    if (m) return m[1].trim()
  }

  // Not every component gets its own page - `spinner` is documented on the
  // shared /docs/loaders page, for instance. Fall back to whichever page has a
  // snippet that actually imports this component.
  const docsDir = path.join(wwwRoot, 'app', 'docs')
  const importPath = `@/components/stepwise/${name}'`
  for (const dir of fs.readdirSync(docsDir)) {
    const page = path.join(docsDir, dir, 'page.tsx')
    if (!fs.existsSync(page)) continue
    for (const m of fs.readFileSync(page, 'utf-8').matchAll(/const\s+\w*[Cc]ode\s*=\s*`([^`]{20,})`/g)) {
      if (m[1].includes(importPath)) return m[1].trim()
    }
  }
  return undefined
}

// Derived once, reused by both index.json and the per-component manifests.
const meta = new Map<string, { exports: string[]; example?: string }>()
for (const comp of registry) {
  const main = comp.files.find(f => f.dest.endsWith(`${comp.name}.tsx`))
  const source = main ? fs.readFileSync(path.join(wwwRoot, main.src), 'utf-8') : ''
  meta.set(comp.name, {
    exports: source ? extractExports(source) : [],
    example: extractExample(comp.name),
  })
}

// index.json - lightweight list for the CLI to discover components.
// `exports` and `example` are included here so an agent can learn what exists
// and how to call it from one 20-40 KB request, instead of pulling ~570 KB of
// component source across 62 manifests just to read the signatures.
const index = registry.map(c => ({
  name: c.name,
  description: c.description,
  category: c.category,
  dependencies: c.dependencies,
  peerDependencies: c.peerDependencies,
  registryDependencies: c.registryDependencies,
  exports: meta.get(c.name)!.exports,
  example: meta.get(c.name)!.example,
}))
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2))

/* Fonts and other binary assets cannot be embedded the way source files are:
 * reading a .woff2 as utf-8 corrupts it, and base64 would put ~600 KB of
 * padding into a manifest every consumer downloads. They are published as a
 * URL instead, and the CLI fetches the bytes directly. */
const BINARY = /\.(woff2?|ttf|otf|png|jpe?g|webp|avif|gif|ico|mp4|webm)$/i

// [name].json - full manifest with embedded file contents
for (const comp of registry) {
  const files = comp.files.map(f =>
    BINARY.test(f.src)
      ? { path: f.dest, url: '/' + f.src.replace(/^public\//, '') }
      : { path: f.dest, content: fs.readFileSync(path.join(wwwRoot, f.src), 'utf-8') },
  )

  const manifest = {
    name: comp.name,
    description: comp.description,
    category: comp.category,
    dependencies: comp.dependencies,
    peerDependencies: comp.peerDependencies,
    registryDependencies: comp.registryDependencies,
    exports: meta.get(comp.name)!.exports,
    example: meta.get(comp.name)!.example,
    files,
  }

  fs.writeFileSync(
    path.join(outDir, `${comp.name}.json`),
    JSON.stringify(manifest, null, 2),
  )

  console.log(`  ✓ ${comp.name}`)
}

// Remove manifests for components that no longer exist.
//
// Without this the directory only ever grows: deleting a component removed its
// source and its docs page, but left `public/r/<name>.json` behind, still
// served and still installable. `npx stepwise-ui add test-button` succeeded
// against a component that had been gone for months - it just never appeared
// in `list`, because that reads index.json.
const expected = new Set([...registry.map(c => `${c.name}.json`), 'index.json'])
const stale = fs.readdirSync(outDir).filter(f => f.endsWith('.json') && !expected.has(f))

for (const file of stale) {
  fs.unlinkSync(path.join(outDir, file))
  console.log(`  ✗ removed stale ${file}`)
}

console.log(`\nBuilt ${registry.length} component(s) → public/r/`)
