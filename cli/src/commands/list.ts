import pc from 'picocolors'
import { fetchIndex } from '../utils/registry.js'
import { findProjectRoot, installedComponents } from '../utils/project.js'

/** Broadest category first, so the list reads as a hierarchy. */
const CATEGORY_ORDER = ['foundations', 'primitives', 'components']

type Item = Awaited<ReturnType<typeof fetchIndex>>[number]

function printGrouped(items: Item[]) {
  const byCategory = new Map<string, Item[]>()
  for (const item of items) {
    if (!byCategory.has(item.category)) byCategory.set(item.category, [])
    byCategory.get(item.category)!.push(item)
  }

  const categories = [...byCategory.keys()].sort((a, b) => {
    const rank = (c: string) => {
      const i = CATEGORY_ORDER.indexOf(c)
      return i === -1 ? CATEGORY_ORDER.length : i
    }
    return rank(a) - rank(b) || a.localeCompare(b)
  })

  const nameWidth = Math.max(...items.map(i => i.name.length)) + 2
  // Descriptions are full sentences from the docs; clip them to the terminal
  // so each component stays on one line and the list stays scannable.
  const descWidth = Math.max(24, (process.stdout.columns || 80) - nameWidth - 4)

  for (const category of categories) {
    const comps = byCategory.get(category)!.sort((a, b) => a.name.localeCompare(b.name))
    console.log(pc.dim(category))
    for (const c of comps) {
      const desc =
        c.description.length > descWidth
          ? `${c.description.slice(0, descWidth - 1).trimEnd()}…`
          : c.description
      console.log(`  ${pc.cyan(c.name.padEnd(nameWidth))}${pc.dim(desc)}`)
    }
    console.log()
  }
}

/**
 * By default, what this project already has. `--all` prints the whole
 * registry instead - the non-interactive counterpart to `init`, for scripts
 * and agents that cannot drive a picker.
 */
export async function list(opts: { all?: boolean } = {}) {
  let items
  try {
    items = await fetchIndex()
  } catch (err) {
    console.error(pc.red(`✗ ${(err as Error).message}`))
    process.exitCode = 1
    return
  }

  if (opts.all) {
    console.log(`\n${pc.bold('Stepwise UI')} - ${items.length} components available\n`)
    printGrouped(items)
    console.log(pc.dim(`Add one with: ${pc.cyan('npx stepwise-ui add <name>')}\n`))
    return
  }

  let root: string
  try {
    root = findProjectRoot()
  } catch (err) {
    console.error(pc.red(`✗ ${(err as Error).message}`))
    process.exitCode = 1
    return
  }

  const names = new Set(installedComponents(root, items.map(i => i.name)))

  // Say what this command reports before saying the count is zero. "No
  // components" on its own reads like the command failed, when an empty
  // project is simply the expected starting state.
  if (names.size === 0) {
    console.log(`\n${pc.bold('Installed')} - none yet`)
    console.log(pc.dim(`  This lists components already added to this project.`))
    console.log(pc.dim(`  All ${items.length} are available to install:\n`))
    console.log(`  ${pc.cyan('npx stepwise-ui list --all')} ${pc.dim('see everything available')}`)
    console.log(`  ${pc.cyan('npx stepwise-ui init')}       ${pc.dim('browse and pick some')}\n`)
    return
  }

  console.log(
    `\n${pc.bold('Installed')} - ${names.size} of ${items.length} components\n`,
  )
  printGrouped(items.filter(i => names.has(i.name)))
  console.log(pc.dim(`Add more with: ${pc.cyan('npx stepwise-ui init')}\n`))
}
