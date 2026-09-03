import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

/** Walk up from cwd to find the nearest package.json */
export function findProjectRoot(cwd = process.cwd()): string {
  let dir = cwd
  while (true) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir
    const parent = path.dirname(dir)
    if (parent === dir) throw new Error('Could not find a package.json in this directory or any parent.')
    dir = parent
  }
}

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

export function detectPackageManager(root: string): PackageManager {
  if (fs.existsSync(path.join(root, 'bun.lockb')))       return 'bun'
  if (fs.existsSync(path.join(root, 'pnpm-lock.yaml')))  return 'pnpm'
  if (fs.existsSync(path.join(root, 'yarn.lock')))       return 'yarn'
  return 'npm'
}

export function installPackages(packages: string[], root: string, pm: PackageManager) {
  const cmd: Record<PackageManager, string> = {
    npm:  `npm install ${packages.join(' ')}`,
    pnpm: `pnpm add ${packages.join(' ')}`,
    yarn: `yarn add ${packages.join(' ')}`,
    bun:  `bun add ${packages.join(' ')}`,
  }
  execSync(cmd[pm], { cwd: root, stdio: 'inherit' })
}

/**
 * Registry names already present in this project.
 *
 * Matched by filename against the registry index rather than by reading any
 * manifest, because there isn't one: components are plain source files the
 * user owns and may rename or move. A name that no longer matches simply
 * stops being reported, which is the honest answer.
 */
export function installedComponents(root: string, known: string[]): string[] {
  const dir = path.join(root, 'components', 'stepwise')
  if (!fs.existsSync(dir)) return []

  const present = new Set(
    fs.readdirSync(dir)
      .filter(f => f.endsWith('.tsx'))
      .map(f => f.slice(0, -4)),
  )
  return known.filter(name => present.has(name)).sort()
}

/**
 * Verify the project maps `@/*` to its root - every Stepwise component imports
 * its siblings and `@/lib/utils/cn` through that alias, so without it nothing
 * we write will resolve.
 */
export function checkPathAlias(root: string): { ok: boolean; message: string } {
  const configFile = ['tsconfig.json', 'jsconfig.json']
    .map(f => path.join(root, f))
    .find(f => fs.existsSync(f))

  if (!configFile) {
    return { ok: false, message: 'No tsconfig.json or jsconfig.json found.' }
  }

  const raw = fs.readFileSync(configFile, 'utf-8')
  // tsconfig allows comments and trailing commas, so a strict JSON.parse can
  // fail on a perfectly valid config - match the alias directly instead.
  const hasAlias = /"@\/\*"\s*:\s*\[[^\]]*\]/.test(raw)

  return hasAlias
    ? { ok: true, message: '' }
    : {
        ok: false,
        message: `Add an "@/*" path alias to ${path.basename(configFile)}.`,
      }
}

/** Return packages from the manifest that are not yet in package.json */
export function missingDependencies(packages: string[], root: string): string[] {
  const pkgPath = path.join(root, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
  const installed = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ])
  return packages.filter(p => !installed.has(p))
}

/* ── project setup ───────────────────────────────────────────────────────────
 * `add` only ever reports on these, because it runs unattended (scripts, CI,
 * agents) and silently editing someone's config there would be hostile.
 * `init` is interactive, so it can offer to make the change and ask first.
 */

/** The project's global stylesheet, if one can be found in the usual places. */
export function findGlobalCss(root: string): string | null {
  const candidates = [
    'app/globals.css', 'src/app/globals.css',
    'styles/globals.css', 'src/styles/globals.css',
    'src/index.css', 'src/App.css', 'app/global.css',
  ]
  return candidates.map(c => path.join(root, c)).find(f => fs.existsSync(f)) ?? null
}

export const DARK_VARIANT = '@custom-variant dark (&:where(.dark, .dark *));'

export function hasDarkVariant(cssFile: string): boolean {
  return /@custom-variant\s+dark\b/.test(fs.readFileSync(cssFile, 'utf-8'))
}

/**
 * Insert the dark variant directly after the Tailwind import, which is where it
 * has to sit for the variant to be registered before any rule uses it.
 */
export function addDarkVariant(cssFile: string) {
  const src = fs.readFileSync(cssFile, 'utf-8')
  const block = `\n/* Stepwise components use a class-based dark variant. */\n${DARK_VARIANT}\n`
  const importLine = /^\s*@import\s+["']tailwindcss["'].*$/m.exec(src)

  const next = importLine
    ? src.slice(0, importLine.index + importLine[0].length) + '\n' + block + src.slice(importLine.index + importLine[0].length)
    : block + src
  fs.writeFileSync(cssFile, next, 'utf-8')
}

/**
 * Split a JSONC document into string literals and everything else.
 *
 * Naively regexing for `//` or block comments is wrong here, because tsconfig
 * globs contain both delimiters: `"**\/*.ts"` holds a `/*`, and a later entry
 * holds a `*\/`. A regex reads that pair as one long comment and deletes the
 * whole `include` array. Masking strings first is what makes the rest safe.
 */
function maskStrings(raw: string): { masked: string; strings: string[] } {
  const strings: string[] = []
  let masked = ''
  let i = 0
  while (i < raw.length) {
    if (raw[i] === '"') {
      let j = i + 1
      while (j < raw.length) {
        if (raw[j] === '\\') { j += 2; continue }
        if (raw[j] === '"') { j++; break }
        j++
      }
      masked += `\u0000${strings.length}\u0000`
      strings.push(raw.slice(i, j))
      i = j
      continue
    }
    masked += raw[i]
    i++
  }
  return { masked, strings }
}

const restoreStrings = (s: string, strings: string[]) =>
  s.replace(/\u0000(\d+)\u0000/g, (_, n) => strings[Number(n)])

/** Comments outside of string literals. */
function stripComments(masked: string): string {
  return masked
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
}

/**
 * True when the config carries real comments, which a JSON rewrite would drop.
 * Used to warn only the people who actually have something to lose.
 */
export function configHasComments(root: string): boolean {
  const file = ['tsconfig.json', 'jsconfig.json']
    .map(f => path.join(root, f))
    .find(f => fs.existsSync(f))
  if (!file) return false
  const { masked } = maskStrings(fs.readFileSync(file, 'utf-8'))
  return masked !== stripComments(masked)
}

/** Add `@/*` -> project root to tsconfig/jsconfig, preserving the rest. */
export function addPathAlias(root: string): { ok: boolean; file?: string; message?: string } {
  const file = ['tsconfig.json', 'jsconfig.json']
    .map(f => path.join(root, f))
    .find(f => fs.existsSync(f))

  if (!file) return { ok: false, message: 'No tsconfig.json or jsconfig.json to edit.' }

  const raw = fs.readFileSync(file, 'utf-8')
  let parsed: { compilerOptions?: Record<string, unknown> }
  try {
    // Comments and trailing commas are legal in tsconfig, neither is legal
    // JSON. Strings are masked first so globs are never mistaken for comment
    // delimiters. Bail rather than guess if it still will not parse.
    const { masked, strings } = maskStrings(raw)
    const cleaned = stripComments(masked).replace(/,(\s*[}\]])/g, '$1')
    parsed = JSON.parse(restoreStrings(cleaned, strings))
  } catch {
    return { ok: false, message: `Could not parse ${path.basename(file)}; add the alias by hand.` }
  }

  const opts = (parsed.compilerOptions ??= {})
  opts.baseUrl ??= '.'
  const paths = (opts.paths ??= {}) as Record<string, string[]>
  paths['@/*'] = ['./*']

  fs.writeFileSync(file, JSON.stringify(parsed, null, 2) + '\n', 'utf-8')
  return { ok: true, file: path.basename(file) }
}
