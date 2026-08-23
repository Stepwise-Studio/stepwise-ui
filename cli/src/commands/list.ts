import pc from 'picocolors'
import { fetchIndex } from '../utils/registry.js'

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
    const cat = item.category
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat)!.push(item)
  }

  console.log(`\n${pc.bold('Stepwise UI')} — available components\n`)
  for (const [cat, comps] of byCategory) {
    console.log(pc.dim(cat))
    for (const c of comps) {
      console.log(`  ${pc.cyan(c.name.padEnd(20))} ${c.description}`)
    }
    console.log()
  }
}
