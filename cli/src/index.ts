import { Command } from 'commander'
import pc from 'picocolors'
import { add } from './commands/add.js'
import { list } from './commands/list.js'

const program = new Command()

program
  .name('stepwise-ui')
  .description('Add Stepwise UI components to your project')
  .version('0.1.0')

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
  .description('List all available components')
  .action(async () => {
    await list()
  })

program.addHelpText('after', `
${pc.dim('Examples:')}
  ${pc.cyan('npx stepwise-ui list')}                    ${pc.dim('see everything available')}
  ${pc.cyan('npx stepwise-ui add button')}              ${pc.dim('add one component')}
  ${pc.cyan('npx stepwise-ui add button input toast')}  ${pc.dim('add several at once')}
  ${pc.cyan('npx stepwise-ui add date-picker')}         ${pc.dim('dependencies come along')}

${pc.dim('Docs:')} ${pc.cyan('https://ui.stepwise.studio')}
`)

program.parse()
