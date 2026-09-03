/**
 * A markdown twin for every component's docs page.
 *
 * The HTML pages are React, so an agent asking for `text/markdown` gets a wall
 * of markup it has to strip. Serving proper markdown needs content negotiation,
 * which needs a Worker - and this site is deliberately assets-only, where every
 * request is free and there is nothing to fall over. So the twins live at a
 * predictable path instead: /docs/<name> is the page, /docs/<name>.md is the
 * same component as markdown. No edge logic, no negotiation, and the URL is
 * guessable from the one an agent already has.
 *
 * Everything here comes from the built registry, which is what the CLI installs
 * - so a twin cannot describe a component differently from what actually lands
 * in someone's project.
 */
import fs from 'node:fs'
import path from 'node:path'

const SITE = 'https://ui.stepwise.studio'
const wwwRoot = process.cwd()
const rDir = path.join(wwwRoot, 'public', 'r')
const outDir = path.join(wwwRoot, 'public', 'docs')

interface IndexEntry {
  name: string
  description: string
  category: string
  registryDependencies: string[]
  exports: string[]
  example?: string
}

interface Manifest {
  name: string
  dependencies: string[]
  peerDependencies: string[]
  files: { path: string }[]
}

const index: IndexEntry[] = JSON.parse(fs.readFileSync(path.join(rDir, 'index.json'), 'utf-8'))

/** Title Case from a registry slug: `apple-select` -> `Apple Select`. */
const title = (name: string) =>
  name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')

fs.mkdirSync(outDir, { recursive: true })

for (const entry of index) {
  const manifest: Manifest = JSON.parse(
    fs.readFileSync(path.join(rDir, `${entry.name}.json`), 'utf-8'),
  )

  const lines = [
    `# ${title(entry.name)}`,
    '',
    entry.description,
    '',
    '## Install',
    '',
    '```bash',
    `npx stepwise-ui add ${entry.name}`,
    '```',
    '',
  ]

  if (entry.exports?.length) {
    lines.push(`Exports: ${entry.exports.map(e => `\`${e}\``).join(', ')}`, '')
  }

  if (entry.example) {
    lines.push('## Usage', '', '```tsx', entry.example, '```', '')
  }

  lines.push('## What gets written', '')
  for (const f of manifest.files) lines.push(`- \`${f.path}\``)
  lines.push('')

  if (entry.registryDependencies.length) {
    lines.push(
      `Also installs: ${entry.registryDependencies.map(d => `[${d}](${SITE}/docs/${d}.md)`).join(', ')}`,
      '',
    )
  }

  const npm = manifest.dependencies.filter(d => d !== 'react')
  if (npm.length) {
    lines.push(`npm packages: ${npm.map(d => `\`${d}\``).join(', ')}`, '')
  }

  lines.push(
    '## Setup this needs',
    '',
    'React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a',
    'class-based dark variant in the global stylesheet:',
    '',
    '```css',
    '@custom-variant dark (&:where(.dark, .dark *));',
    '```',
    '',
    '---',
    '',
    `Full page: ${SITE}/docs/${entry.name}`,
    `Whole library as text: ${SITE}/llms.txt`,
    '',
  )

  fs.writeFileSync(path.join(outDir, `${entry.name}.md`), lines.join('\n'), 'utf-8')
}

console.log(`✓ ${index.length} markdown twin(s) → public/docs/`)
