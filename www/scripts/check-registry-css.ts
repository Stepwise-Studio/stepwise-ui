/**
 * Does every shipped component carry the CSS it references?
 *
 * Components are distributed as source copied into someone else's project, so
 * anything they need has to be inside the files the registry hands over. For a
 * long time it was not: rules for the glow, the button ripple, the slider
 * thumb and the --ui-border tokens lived only in this site's app/globals.css,
 * which the registry never ships. Every component looked perfect in these docs
 * and arrived broken - the glow simply did not exist, and borders fell back to
 * currentColor.
 *
 * This reads public/r/*.json - the exact bytes an installer receives - and
 * deliberately never looks at app/globals.css. Reading that file is what let
 * the bug hide: it made references resolve here that resolve nowhere else.
 *
 * Runs as part of `registry:build`, so `next build` fails rather than shipping
 * a component that cannot render on arrival.
 */
import fs from 'node:fs'
import path from 'node:path'

interface RegistryFile { path: string; content: string }
interface Manifest { name: string; files: RegistryFile[] }

const R_DIR = path.join(process.cwd(), 'public', 'r')

/** Tailwind v4 generates these from its own theme in any project. */
const TAILWIND_THEME_VAR = /^--(?:color|spacing|text|font|font-weight|radius|leading|tracking|breakpoint|container|shadow|blur|ease|animate)-/

/** Class names that belong to this project rather than to Tailwind. */
const PROJECT_CLASS = /['"`\s]((?:stepwise|t)-[\w-]+|no-scrollbar|input-shaking)['"`\s]/g

/** Only what the component itself declares, in its own <style> tags. */
const ownCss = (src: string) =>
  (src.match(/<style[^>]*>[\s\S]*?<\/style>/g) ?? []).join(' ')

function check(m: Manifest): string[] {
  const src = m.files.map(f => f.content).join(' ')
  const mine = ownCss(src)
  const found = new Set<string>()

  // A custom property read with no fallback and no local definition renders as
  // an invalid value - for a colour that silently means `currentColor`.
  for (const match of src.matchAll(/var\(\s*(--[\w-]+)\s*(\)|,)/g)) {
    const [, name, tail] = match
    if (tail !== ')' || TAILWIND_THEME_VAR.test(name)) continue
    const setsItself =
      new RegExp(`['"\\[]${name}['"\\]]?\\s*:`).test(src) ||
      new RegExp(`${name}\\s*:`).test(mine)
    if (!setsItself) found.add(`var(${name}) is read with no fallback`)
  }

  // Names used as an `animation:` value are keyframes, not classes. Skip the
  // ones that appear only inside a comment.
  const prose = new Set([...src.matchAll(/^\s*\*.*animation:\s*([\w-]+)/gm)].map(x => x[1]))
  const keyframeNames = new Set([...src.matchAll(/animation:\s*([\w-]+)/g)].map(x => x[1]))

  for (const match of src.matchAll(PROJECT_CLASS)) {
    const cls = match[1]
    if (keyframeNames.has(cls)) continue
    if (new RegExp(`(?<![\\w-])\\.${cls}(?![\\w-])`).test(mine)) continue
    if (new RegExp(`@keyframes\\s+${cls}`).test(mine)) continue
    found.add(`.${cls} is used but never defined`)
  }

  for (const name of keyframeNames) {
    if (prose.has(name) || /^(none|inherit|initial|unset)$/.test(name)) continue
    if (new RegExp(`animation:\\s*${name}\\s*[?:]`).test(src)) continue // JS ternary
    if (!new RegExp(`@keyframes\\s+${name}`).test(mine)) {
      found.add(`@keyframes ${name} is never shipped`)
    }
  }

  return [...found].sort()
}

const manifests = fs.readdirSync(R_DIR)
  .filter(f => f.endsWith('.json') && f !== 'index.json')
  .map(f => JSON.parse(fs.readFileSync(path.join(R_DIR, f), 'utf-8')) as Manifest)

let broken = 0
for (const m of manifests.sort((a, b) => a.name.localeCompare(b.name))) {
  const problems = check(m)
  if (!problems.length) continue
  broken++
  console.error(`  ✗ ${m.name}`)
  for (const p of problems) console.error(`      ${p}`)
}

if (broken) {
  console.error(
    `\n${broken} of ${manifests.length} components would install broken.\n` +
    'Keep the CSS inside the component: Tailwind utilities, inline style, or\n' +
    'motion/element.animate() for anything that needs keyframes.',
  )
  process.exit(1)
}

console.log(`✓ all ${manifests.length} components ship their own CSS`)
