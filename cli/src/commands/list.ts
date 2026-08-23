import pc from 'picocolors'
import { fetchIndex } from '../utils/registry.js'

/** Broadest category first, so the list reads as a hierarchy. */
const CATEGORY_ORDER = ['foundations', 'primitives', 'components']

export async function list() {
  let items
  try {
    items = await fetchIndex()
  } catch (err) {
    console.error(pc.red(`✗ ${(err as Error).message}`))
    process.exitCode = 1
    return
  }

  const byCategory = new Map<string, typeof items>()
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

  console.log(`\n${pc.bold('Stepwise UI')} — ${items.length} components\n`)

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

  console.log(pc.dim(`Add one with: ${pc.cyan('npx stepwise-ui add <name>')}\n`))
}
