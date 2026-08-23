import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { CommandPreview } from '@/components/stepwise/docs/command-preview'

const code = `import { CommandPalette } from '@/components/stepwise/command'

const groups = [
  { heading: 'Navigation', items: [
    { id: 'home', label: 'Go to Home', icon: <HomeIcon />, shortcut: ['G', 'H'] },
    { id: 'docs', label: 'Go to Docs', keywords: 'guides', shortcut: ['G', 'D'] },
  ]},
  { heading: 'Actions', items: [
    { id: 'new',   label: 'Create new project', shortcut: ['⌘', 'N'], onSelect: create },
    { id: 'theme', label: 'Toggle theme', keywords: 'dark light' },
  ]},
]

// ⌘K / Ctrl+K opens it automatically (hotkey defaults to true)
<CommandPalette open={open} onOpenChange={setOpen} groups={groups} />`

const toc = [
  { id: 'demo',  label: 'Demo',  child: false },
  { id: 'props', label: 'Props', child: false },
]

export default function CommandPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Command Palette</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A searchable ⌘K command menu with grouped items, fuzzy matching, full keyboard
            navigation, and per-item shortcuts. Binds ⌘K / Ctrl+K by default.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add command" />
        </section>

        <section id="demo" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Demo</Text>
          <PreviewCode minHeight={200} preview={<CommandPreview />} code={<CodeBlock code={code} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'groups',       type: 'CommandGroup[]', desc: 'Grouped commands, each with an optional heading.' },
            { name: 'open',         type: 'boolean', desc: 'Controlled open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', desc: 'Fires on open/close.' },
            { name: 'hotkey',       type: 'boolean', desc: 'Bind ⌘K / Ctrl+K to toggle. Default true.' },
            { name: 'placeholder',  type: 'string', desc: 'Search input placeholder.' },
          ]} />
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 mt-2">
            Each item accepts id, label, icon, keywords (extra search terms), shortcut, and onSelect.
          </Text>
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
