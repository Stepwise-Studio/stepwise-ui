import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { DropdownBasicPreview, DropdownTextOnlyPreview, DropdownNestedPreview, DropdownAlignPreview } from '@/components/stepwise/docs/dropdown-menu-preview'

const basicCode = `import { DropdownMenu } from '@/components/stepwise/dropdown-menu'

<DropdownMenu
  trigger={<Button size="sm">Actions</Button>}
  items={[
    { heading: 'Manage' },
    { label: 'Edit', icon: <EditIcon />, shortcut: '⌘E' },
    { label: 'Duplicate', icon: <CopyIcon />, shortcut: '⌘D' },
    { separator: true },
    { label: 'Delete', icon: <TrashIcon />, destructive: true },
  ]}
/>`

const textOnlyCode = `<DropdownMenu
  trigger={<Button size="sm">Account</Button>}
  items={[
    { label: 'Profile' },
    { label: 'Billing' },
    { label: 'Team settings' },
    { separator: true },
    { label: 'Sign out', destructive: true },
  ]}
/>`

const nestedCode = `<DropdownMenu
  trigger={<Button size="sm">File Actions</Button>}
  items={[
    { label: 'Edit', icon: <EditIcon />, shortcut: '⌘E' },
    {
      label: 'Share',
      icon: <ShareIcon />,
      items: [
        { label: 'Copy link', icon: <LinkIcon /> },
        { label: 'Invite by email', icon: <MailIcon /> },
      ],
    },
    { separator: true },
    { label: 'Delete', icon: <TrashIcon />, destructive: true },
  ]}
/>`

const alignCode = `<DropdownMenu trigger={<Button size="sm">Aligned start</Button>} items={…} />
<DropdownMenu align="end" trigger={<Button size="sm">Aligned end</Button>} items={…} />`

const toc = [
  { id: 'default',     label: 'Default',      child: false },
  { id: 'text-only', label: 'Text only',  child: false },
  { id: 'nested',    label: 'Nested',     child: false },
  { id: 'align',     label: 'Alignment',  child: false },
  { id: 'props',     label: 'Props',      child: false },
]

export default function DropdownMenuPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Dropdown Menu</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            An anchored action menu that grows from its trigger. Supports icons, keyboard
            shortcuts, group headings, separators, destructive items, and nested submenus.
            Full roving-focus keyboard navigation. Closes on outside click or Escape.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add dropdown-menu" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode minHeight={240} allowOverflow preview={<DropdownBasicPreview />} code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="text-only" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Text only</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Omit <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">icon</code> on
            every item — no icon gutter is reserved, labels start flush at the leading edge.
          </Text>
          <PreviewCode minHeight={220} allowOverflow preview={<DropdownTextOnlyPreview />} code={<CodeBlock code={textOnlyCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="nested" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Nested</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Give an item its own <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">items</code> array
            and it becomes a submenu trigger — a trailing chevron replaces the shortcut slot, and it
            opens on hover, click, or <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">→</code>.
            Flips to the left edge automatically if it would overflow the viewport.
          </Text>
          <PreviewCode minHeight={340} allowOverflow preview={<DropdownNestedPreview />} code={<CodeBlock code={nestedCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="align" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Alignment</Text>
          <PreviewCode minHeight={220} allowOverflow preview={<DropdownAlignPreview />} code={<CodeBlock code={alignCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'trigger', type: 'ReactNode', desc: 'Element that toggles the menu.' },
            { name: 'items',   type: 'DropdownEntry[]', desc: 'Items, { separator: true }, or { heading }.' },
            { name: 'align',   type: "'start' | 'end'", desc: 'Edge to anchor to. Default start.' },
            { name: 'className', type: 'string', desc: 'Merged onto the wrapper.' },
          ]} />
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 mt-2">
            Each item accepts <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">label</code>,{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">icon</code>,{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">shortcut</code>,{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">onSelect</code>,{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">destructive</code>,{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">disabled</code>, and{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">items</code>{' '}
            (nested <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">DropdownEntry[]</code>{' '}
            — presence turns the row into a submenu trigger and its own{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">onSelect</code> is ignored).
          </Text>
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
