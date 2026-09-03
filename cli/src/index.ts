import { Command } from 'commander'
import pc from 'picocolors'
import { add } from './commands/add.js'
import { list } from './commands/list.js'
import { init } from './commands/init.js'

/** Replaced at build time by tsup from package.json - see tsup.config.ts. */
declare const __CLI_VERSION__: string

const program = new Command()

program
  .name('stepwise-ui')
  .description('Add Stepwise UI components to your project')
  .version(__CLI_VERSION__)

program
  .command('init')
  .description('Browse every component and install the ones you pick')
  .action(async () => {
    await init()
  })

program
  .command('add <components...>')
  .description('Add one or more components to your project')
  .option('-y, --yes', 'overwrite existing files without prompting')
  .action(async (components: string[], opts: { yes?: boolean }) => {
    await add(components, opts)
  })

program
  .command('list')
  .alias('ls')
  .description("List the Stepwise components in this project")
  .option('-a, --all', 'list every component in the registry instead')
  .action(async (opts: { all?: boolean }) => {
    await list(opts)
  })

program.addHelpText('after', `
${pc.dim('Examples:')}
  ${pc.cyan('npx stepwise-ui init')}                    ${pc.dim('browse and pick - start here')}
  ${pc.cyan('npx stepwise-ui list')}                    ${pc.dim("what's already in this project")}
  ${pc.cyan('npx stepwise-ui list --all')}              ${pc.dim('every component available')}
  ${pc.cyan('npx stepwise-ui add button')}              ${pc.dim('add one by name')}
  ${pc.cyan('npx stepwise-ui add button input toast')}  ${pc.dim('add several at once')}
  ${pc.cyan('npx stepwise-ui add date-picker')}         ${pc.dim('dependencies come along')}

${pc.dim('Docs:')} ${pc.cyan('https://ui.stepwise.studio')}
`)

program.parse()
