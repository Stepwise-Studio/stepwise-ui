import fs from 'node:fs'
import path from 'node:path'
import { registry } from '../registry/index.js'

const wwwRoot = path.resolve(import.meta.dirname, '..')
const outDir = path.join(wwwRoot, 'public', 'r')

fs.mkdirSync(outDir, { recursive: true })

// index.json — lightweight list for the CLI to discover components
const index = registry.map(c => ({
  name: c.name,
  description: c.description,
  category: c.category,
  dependencies: c.dependencies,
  registryDependencies: c.registryDependencies,
}))
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2))

// [name].json — full manifest with embedded file contents
for (const comp of registry) {
  const files = comp.files.map(f => ({
    path: f.dest,
    content: fs.readFileSync(path.join(wwwRoot, f.src), 'utf-8'),
  }))

  const manifest = {
    name: comp.name,
    description: comp.description,
    category: comp.category,
    dependencies: comp.dependencies,
    registryDependencies: comp.registryDependencies,
    files,
  }

  fs.writeFileSync(
    path.join(outDir, `${comp.name}.json`),
    JSON.stringify(manifest, null, 2),
  )

  console.log(`  ✓ ${comp.name}`)
}

console.log(`\nBuilt ${registry.length} component(s) → public/r/`)
