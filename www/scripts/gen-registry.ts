/**
 * Regenerates registry/index.ts from the filesystem.
 *
 * Source of truth is docs/nav.ts (what's publicly documented) plus the actual
 * import graph of each component - so a component's files, npm dependencies
 * and registry dependencies never drift from the code. Descriptions are
 * lifted from each docs page's intro paragraph.
 *
 * Run: npm run registry:gen
 */
import fs from 'node:fs'
import path from 'node:path'

const wwwRoot = path.resolve(import.meta.dirname, '..')

/**
 * Frameworks and runtimes the consuming app provides. Never auto-installed -
 * installing Next.js into someone's Vite app would be worse than the error -
 * but recorded so the CLI can warn when a component needs one the project
 * doesn't have.
 */
const PEER_PACKAGES = new Set(['react', 'react-dom', 'next'])

/** Import specifier → npm package name. */
function packageOf(spec: string): string {
  const parts = spec.split('/')
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

/** Docs slug → component file basename, where they differ. */
const SLUG_TO_FILE: Record<string, string> = {
  loaders: 'spinner',
}

/**
 * Files documented on a component's page that its entry file doesn't import,
 * so the import graph can't find them.
 *
 * Empty now that SocialButton has its own page and registry entry. It used to
 * live here because it was documented under Button while importing Button
 * rather than the reverse - which meant `add button` wrote a file nothing in
 * the project imported. Prefer giving a component its own entry over listing
 * it here; the dependency then points the right way and installs on demand.
 */
const EXTRA_FILES: Record<string, string[]> = {}

/**
 * Non-source files a component needs, with an explicit destination because the
 * source path is a build-time location and the install path is not.
 *
 * The font is here rather than in a registry entry of its own because the
 * registry is nav-driven - every entry comes from a docs page - and a typeface
 * is not a component. Attaching it to `typography` also makes it the default:
 * `add typography` brings the family the scale was drawn against, and the docs
 * explain how to point the scale at a different one.
 */
const ASSET_FILES: Record<string, { src: string; dest: string }[]> = {
  typography: [
    { src: 'components/stepwise/fonts.css', dest: 'components/stepwise/fonts.css' },
    { src: 'public/fonts/LICENSE-Inter.txt', dest: 'fonts/LICENSE-Inter.txt' },
    { src: 'public/fonts/InterDisplay-Regular.woff2',  dest: 'fonts/InterDisplay-Regular.woff2' },
    { src: 'public/fonts/InterDisplay-Medium.woff2',   dest: 'fonts/InterDisplay-Medium.woff2' },
    { src: 'public/fonts/InterDisplay-SemiBold.woff2', dest: 'fonts/InterDisplay-SemiBold.woff2' },
    { src: 'public/fonts/InterDisplay-Bold.woff2',     dest: 'fonts/InterDisplay-Bold.woff2' },
  ],
}

// ---------------------------------------------------------------- nav parsing

type Category = 'foundations' | 'components' | 'primitives'

interface NavEntry {
  /** Registry name - the argument to `stepwise-ui add`. */
  name: string
  /** Docs slug, for locating the description. */
  slug: string
  category: Category
}

/** Section label in nav.ts → registry category. */
const SECTION_CATEGORY: Record<string, Category> = {
  'All Components': 'components',
  Cards: 'components',
  Carousels: 'components',
  Backgrounds: 'components',
  'Text Effects': 'components',
}

/** Nav sections that are prose docs, not components. Listed explicitly rather
 *  than skipped by default so a genuinely mis-labelled component section still
 *  throws below instead of silently vanishing from the registry. */
const NON_COMPONENT_SECTIONS = new Set(['Getting Started'])

/** Registry names that belong in `foundations` regardless of nav section. */
const FOUNDATIONS = new Set(['typography'])

function readNav(): NavEntry[] {
  const src = fs.readFileSync(
    path.join(wwwRoot, 'components/stepwise/docs/nav.ts'),
    'utf-8',
  )

  // Map each exported array name to its section label via the docsNav block,
  // so a renamed section doesn't silently lose its category.
  const docsNavBlock = src.slice(src.indexOf('export const docsNav'))
  const arrayToLabel = new Map<string, string>()
  for (const m of docsNavBlock.matchAll(
    /label:\s*'([^']+)',\s*items:\s*(\w+)/g,
  )) {
    arrayToLabel.set(m[2], m[1])
  }

  const entries: NavEntry[] = []
  const seen = new Set<string>()

  for (const [arrayName, label] of arrayToLabel) {
    if (NON_COMPONENT_SECTIONS.has(label)) continue

    const section = SECTION_CATEGORY[label]
    if (!section) throw new Error(`Unmapped nav section: "${label}"`)

    const decl = src.indexOf(`export const ${arrayName}`)
    if (decl === -1) throw new Error(`nav.ts array not found: ${arrayName}`)
    // Start at the `[` that opens the array literal, not the one in the
    // `DocsNavItem[]` type annotation that precedes it.
    const start = src.indexOf('= [', decl) + 2
    const block = src.slice(start, src.indexOf(']', start))

    for (const m of block.matchAll(/href:\s*'\/docs\/([^']+)'/g)) {
      const slug = m[1]
      const name = SLUG_TO_FILE[slug] ?? slug
      if (seen.has(name)) continue
      seen.add(name)
      entries.push({
        name,
        slug,
        category: FOUNDATIONS.has(name) ? 'foundations' : section,
      })
    }
  }

  return entries.sort((a, b) => a.name.localeCompare(b.name))
}

// ----------------------------------------------------------- import resolving

/** Resolve an import specifier to a path relative to www/, or null if external. */
function resolveLocal(spec: string, fromFile: string): string | null {
  let base: string
  if (spec.startsWith('@/')) base = spec.slice(2)
  else if (spec.startsWith('.')) {
    base = path.normalize(path.join(path.dirname(fromFile), spec))
  } else return null

  for (const candidate of [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    `${base}/index.tsx`,
    `${base}/index.ts`,
  ]) {
    if (fs.existsSync(path.join(wwwRoot, candidate))) {
      const stat = fs.statSync(path.join(wwwRoot, candidate))
      if (stat.isFile()) return candidate
    }
  }
  throw new Error(`Unresolved import "${spec}" in ${fromFile}`)
}

function importsOf(relPath: string): string[] {
  const src = fs.readFileSync(path.join(wwwRoot, relPath), 'utf-8')
  const specs = new Set<string>()
  // Covers `from '…'` (static + type imports) and bare `import '…'` side effects.
  for (const m of src.matchAll(/(?:from|import)\s+'([^']+)'/g)) specs.add(m[1])
  return [...specs]
}

// ----------------------------------------------------------- graph collection

interface Resolved {
  files: string[]
  dependencies: string[]
  peerDependencies: string[]
  registryDependencies: string[]
}

/**
 * Walk the local import graph from a component's entry file.
 *
 * A local import that is itself a registry component becomes a
 * registryDependency and its subtree is NOT inlined - the CLI installs it
 * separately. Everything else local (lib/utils/cn, primitives/*, lib/theme)
 * is bundled into this component's file list, since it has no docs page of
 * its own and nothing else would ever install it.
 */
function collect(
  entryFile: string,
  entryByFile: Map<string, string>,
  extraFiles: string[] = [],
): Resolved {
  const files = new Set<string>()
  const packages = new Set<string>()
  const peers = new Set<string>()
  const registryDeps = new Set<string>()

  const queue = [entryFile, ...extraFiles]
  while (queue.length) {
    const file = queue.shift()!
    if (files.has(file)) continue
    files.add(file)

    for (const spec of importsOf(file)) {
      const local = resolveLocal(spec, file)
      if (local === null) {
        const pkg = packageOf(spec)
        if (PEER_PACKAGES.has(pkg)) peers.add(pkg)
        else packages.add(pkg)
        continue
      }
      // Another documented component - hand it to the CLI as a registry dep.
      const depName = entryByFile.get(local)
      if (depName && local !== entryFile) {
        registryDeps.add(depName)
        continue
      }
      queue.push(local)
    }
  }

  return {
    files: [...files].sort(),
    dependencies: [...packages].sort(),
    peerDependencies: [...peers].sort(),
    registryDependencies: [...registryDeps].sort(),
  }
}

// ----------------------------------------------------------- descriptions

/** First sentence of the docs page intro, with JSX stripped. */
function describe(slug: string, name: string): string {
  const page = path.join(wwwRoot, 'app/docs', slug, 'page.tsx')
  if (!fs.existsSync(page)) {
    console.warn(`  ! no docs page for "${name}" - description left empty`)
    return ''
  }

  const src = fs.readFileSync(page, 'utf-8')
  const start = src.indexOf('variant="h5-soft"')
  if (start === -1) {
    console.warn(`  ! no intro paragraph for "${name}" - description left empty`)
    return ''
  }

  const body = src.slice(src.indexOf('>', start) + 1, src.indexOf('</Text>', start))

  const text = body
    .replace(/\{'\s*'\}/g, ' ') // JSX whitespace escapes
    .replace(/<[^>]+>/g, '') // nested tags (<code>, <strong>)
    .replace(/\{[^}]*\}/g, '') // any remaining expressions
    .replace(/\s+/g, ' ')
    .trim()

  // First sentence - a period followed by a space or end of string. Guards
  // against splitting inside "16:9." style values by requiring a letter before.
  const match = text.match(/^.*?[a-z0-9)”’](\.)(?:\s|$)/i)
  return (match ? match[0] : text).trim()
}

// ----------------------------------------------------------------- generate

const nav = readNav()

// file path → registry name, for classifying imports as registry deps
const entryByFile = new Map<string, string>()
for (const entry of nav) {
  const file = `components/stepwise/${entry.name}.tsx`
  if (!fs.existsSync(path.join(wwwRoot, file))) {
    throw new Error(`No component file for "${entry.name}" (expected ${file})`)
  }
  entryByFile.set(file, entry.name)
}

const components = nav.map(entry => {
  const entryFile = `components/stepwise/${entry.name}.tsx`
  const resolved = collect(entryFile, entryByFile, EXTRA_FILES[entry.name])
  return {
    name: entry.name,
    description: describe(entry.slug, entry.name),
    category: entry.category,
    ...resolved,
  }
})

const body = components
  .map(c => {
    const arr = (items: string[]) =>
      items.length === 0 ? '[]' : `[${items.map(i => `'${i}'`).join(', ')}]`
    const files = [
      ...c.files.map(f => ({ src: f, dest: f })),
      ...(ASSET_FILES[c.name] ?? []),
    ]
      .map(f => `      { src: '${f.src}', dest: '${f.dest}' },`)
      .join('\n')
    return `  {
    name: '${c.name}',
    description: ${JSON.stringify(c.description)},
    category: '${c.category}',
    dependencies: ${arr(c.dependencies)},
    peerDependencies: ${arr(c.peerDependencies)},
    registryDependencies: ${arr(c.registryDependencies)},
    files: [
${files}
    ],
  },`
  })
  .join('\n')

const out = `// Generated by scripts/gen-registry.ts - do not edit by hand.
// Run \`npm run registry:gen\` after adding or changing a component.

export interface RegistryFile {
  /** Path relative to www/ root - where the source lives */
  src: string
  /** Path relative to user's project root - where it gets written */
  dest: string
}

export interface RegistryComponent {
  name: string
  description: string
  category: 'foundations' | 'components' | 'primitives'
  /** npm packages the component requires at runtime - installed by the CLI */
  dependencies: string[]
  /** Frameworks the host app must already provide - warned about, never installed */
  peerDependencies: string[]
  /** Other stepwise components this one depends on */
  registryDependencies: string[]
  files: RegistryFile[]
}

export const registry: RegistryComponent[] = [
${body}
]
`

fs.writeFileSync(path.join(wwwRoot, 'registry/index.ts'), out)

console.log(`\nGenerated ${components.length} component(s) → registry/index.ts`)
