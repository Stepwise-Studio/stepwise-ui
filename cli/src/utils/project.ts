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
