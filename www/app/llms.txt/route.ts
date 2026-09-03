import fs from 'node:fs'
import path from 'node:path'

export const dynamic = 'force-static'

const SITE = 'https://ui.stepwise.studio'

interface IndexEntry {
  name: string
  description: string
  category: string
  registryDependencies: string[]
  exports: string[]
  example?: string
}

// Read from the built registry index rather than `registry/index.ts`: this is
// the same file the CLI fetches, and it is the only place `exports` and
// `example` exist (both are derived in scripts/build-registry.ts). `prebuild`
// regenerates it before `next build`, so it is always present and current.
const registry: IndexEntry[] = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'public', 'r', 'index.json'), 'utf-8'),
)

/**
 * llms.txt - the whole library in one plain-text request.
 *
 * Deliberately includes each component's exports and a usage snippet. Without
 * them an agent has to pull ~570 KB of component source across 62 manifests
 * just to learn that `frame` also exports `FrameHeader`, or how to call
 * `toast()`. Everything here is derived from the registry at build time, so it
 * cannot drift from what the CLI actually installs.
 */
export async function GET() {
  const byCategory = new Map<string, IndexEntry[]>()
  for (const c of registry) {
    if (!byCategory.has(c.category)) byCategory.set(c.category, [])
    byCategory.get(c.category)!.push(c)
  }

  const lines: string[] = [
    '# Stepwise UI',
    '',
    '> A growing collection of React components for building modern products.',
    '> Components are installed as source into the project rather than imported',
    '> from a package, so they can be edited directly after installing.',
    '',
    '## How to install a component',
    '',
    'Run the CLI. No config file, nothing to install globally:',
    '',
    '    npx stepwise-ui add <component>',
    '',
    'Multiple at once, dependencies resolved automatically:',
    '',
    '    npx stepwise-ui add button input toast',
    '',
    'There is also `npx stepwise-ui init`, an interactive picker. It needs a real',
    'terminal, so use `add` when running unattended, and `npx stepwise-ui list --all`',
    'to enumerate components without a picker.',
    '',
    '`add` never edits the project config. `init` offers to add the two things below',
    'and asks first; note that accepting the alias offer rewrites tsconfig.json as',
    'plain JSON, which drops any comments in it. Doing the setup yourself avoids that.',
    '',
    'Files are written to `components/stepwise/` and `lib/`, and the npm packages',
    'they import are installed automatically. React itself is never installed -',
    'the CLI reports it as missing and leaves the choice to you.',
    '',
    '## Required setup',
    '',
    'Requires React 19, Tailwind CSS v4 and TypeScript.',
    '',
    'Components import each other through the `@/` path alias, so `tsconfig.json`',
    'must map `@/*` to the project root.',
    '',
    'IMPORTANT: dark mode is class-based, not `prefers-color-scheme`. Add this to',
    'the global stylesheet or every `dark:` class in every component silently does',
    'nothing:',
    '',
    '    @custom-variant dark (&:where(.dark, .dark *));',
    '',
    '`ThemeProvider` (written to `lib/theme.tsx`) is only needed for a light/dark',
    'toggle. Components render correctly without it.',
    '',
    '## Theming borders',
    '',
    'Every squircle border reads `--ui-border`, and dividers and inner card edges',
    'read `--ui-border-subtle`. Components carry a neutral grey as the built-in',
    'value, so neither has to be defined - define them to retint every border at',
    'once:',
    '',
    '    :root { --ui-border: #d4d4d8; --ui-border-subtle: #e4e4e7; }',
    '    html.dark { --ui-border: #3f3f46; --ui-border-subtle: #27272a; }',
    '',
    '## Docs',
    '',
    `- [Introduction](${SITE}/docs/introduction): what the library is and how it works`,
    `- [Quick Start](${SITE}/docs/quick-start): project setup, step by step`,
    `- [CLI](${SITE}/docs/cli): every command and flag`,
    '',
    '## Registry API',
    '',
    `- ${SITE}/r/index.json - every component with description, exports and example`,
    `- ${SITE}/r/<name>.json - one component, including full file contents`,
    '',
    `## Components (${registry.length})`,
    '',
  ]

  for (const [category, comps] of byCategory) {
    lines.push(`### ${category}`, '')
    for (const c of comps) {
      lines.push(`#### ${c.name}`)
      lines.push('')
      lines.push(c.description)
      lines.push('')
      lines.push(`- Install: \`npx stepwise-ui add ${c.name}\``)
      lines.push(`- Docs: ${SITE}/docs/${c.name}`)
      if (c.exports?.length) lines.push(`- Exports: ${c.exports.join(', ')}`)
      if (c.registryDependencies.length) {
        lines.push(`- Also installs: ${c.registryDependencies.join(', ')}`)
      }
      if (c.example) {
        lines.push('', '```tsx', c.example, '```')
      }
      lines.push('')
    }
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
