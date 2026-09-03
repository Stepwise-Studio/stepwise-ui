import pc from 'picocolors'
import { autocompleteMultiselect, intro, outro, isCancel, cancel, confirm, log } from '@clack/prompts'
import { fetchIndex } from '../utils/registry.js'
import {
  findProjectRoot, installedComponents, checkPathAlias, addPathAlias,
  findGlobalCss, hasDarkVariant, addDarkVariant, DARK_VARIANT, configHasComments,
} from '../utils/project.js'
import { add } from './add.js'

/** Broadest first, matching `list`. */
const CATEGORY_ORDER = ['foundations', 'primitives', 'components']

const rank = (c: string) => {
  const i = CATEGORY_ORDER.indexOf(c)
  return i === -1 ? CATEGORY_ORDER.length : i
}

/**
 * Browse the registry and install what you pick, in one step.
 *
 * The non-interactive path matters as much as the interactive one: agents and
 * CI have no TTY to drive a picker, so this bails with the command that does
 * the same job unattended rather than hanging on a prompt nobody can answer.
 */
export async function init() {
  let root: string
  try {
    root = findProjectRoot()
  } catch (err) {
    console.error(pc.red(`✗ ${(err as Error).message}`))
    process.exitCode = 1
    return
  }

  // Both ends have to be a terminal: the picker reads keystrokes from stdin
  // and repaints stdout.
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    console.error(pc.red('✗ init needs an interactive terminal.'))
    console.error(pc.dim('  Use "stepwise-ui add <components...>" instead, or'))
    console.error(pc.dim('  "stepwise-ui list --all" to see what is available.'))
    process.exitCode = 1
    return
  }

  let items
  try {
    items = await fetchIndex()
  } catch (err) {
    console.error(pc.red(`✗ ${(err as Error).message}`))
    process.exitCode = 1
    return
  }

  const already = new Set(installedComponents(root, items.map(i => i.name)))

  const options = [...items]
    .sort((a, b) => rank(a.category) - rank(b.category) || a.name.localeCompare(b.name))
    .map(c => ({
      value: c.name,
      label: already.has(c.name) ? `${c.name} ${pc.dim('(installed)')}` : c.name,
      hint: c.description,
    }))

  intro(pc.bold('Stepwise UI'))

  const picked = await autocompleteMultiselect<string>({
    message: 'Pick components to add',
    options,
    placeholder: `Search ${items.length} components...`,
    maxItems: 10,
    required: false,
  })

  if (isCancel(picked)) {
    cancel('Nothing installed.')
    return
  }
  if (picked.length === 0) {
    outro(pc.dim('Nothing selected.'))
    return
  }

  // Offer the two bits of project setup the components need but cannot do for
  // themselves. Asked before installing so the project is ready the moment the
  // files land, and always asked rather than assumed - these are the user's
  // own config files.
  await offerSetup(root)

  outro(`Adding ${picked.join(', ')}`)

  // Re-selecting something already present is a normal thing to do (to pull a
  // newer version), so let `add` handle it under its usual rules: identical
  // files are skipped, changed ones are reported rather than clobbered.
  await add(picked, {})
}

/** Dark variant + `@/` alias, each offered only when actually missing. */
async function offerSetup(root: string) {
  const css = findGlobalCss(root)
  if (css && !hasDarkVariant(css)) {
    const rel = css.slice(root.length + 1)
    const yes = await confirm({
      message: `Add the dark-mode variant to ${rel}? Without it every "dark:" class does nothing.`,
    })
    if (isCancel(yes)) { cancel('Nothing installed.'); process.exit(0) }
    if (yes) {
      addDarkVariant(css)
      log.success(`Added ${DARK_VARIANT} to ${rel}`)
    } else {
      log.warn(`Skipped. Add this to ${rel} yourself:\n  ${DARK_VARIANT}`)
    }
  }

  if (!checkPathAlias(root).ok) {
    // Adding the alias means rewriting the file as JSON, so say so up front
    // when that would actually cost something.
    const note = configHasComments(root)
      ? ' This rewrites the file as JSON and will drop its comments.'
      : ''
    const yes = await confirm({
      message: `Add the "@/*" path alias to tsconfig.json? Components import each other through it.${note}`,
    })
    if (isCancel(yes)) { cancel('Nothing installed.'); process.exit(0) }
    if (yes) {
      const res = addPathAlias(root)
      if (res.ok) log.success(`Added "@/*" to ${res.file}`)
      else log.warn(res.message!)
    }
  }
}
