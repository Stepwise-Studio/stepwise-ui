import { defineConfig } from 'tsup'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
  // Single source of truth for the version. It used to be typed literally into
  // src/index.ts as well, so `npm version` would bump package.json and ship a
  // binary that still reported the old number from `--version`.
  define: { __CLI_VERSION__: JSON.stringify(pkg.version) },
})
