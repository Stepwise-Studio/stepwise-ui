import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { FolderShowcasePreview, FolderFanPreview, FolderColorPreview } from '@/components/stepwise/docs/folder-preview'

const showcaseCode = `import { Folder } from '@/components/stepwise/folder'
import { Image02Icon } from '@hugeicons/core-free-icons'

// peek={0} → an empty folder; peek={3} (default) → filled
<Folder label="Japan 2024" count="83 photos" icon={Image02Icon} peek={3} />`

const colorCode = `const SWATCH = ['#dfe1e7', '#26272c', '#f5d98b', '#bfdbfe', '#fbcfe8', '#bbf7d0']
const [color, setColor] = useState(SWATCH[0])

// the icon adopts a darker shade of the folder color
<Folder color={color} icon={icon} label="Design assets" count="24 files" />
<ColorSwatch colors={SWATCH} value={color} onChange={setColor} />`

const fanCode = `// Hovering fans the cards out into an arc above the folder — hovering a
// card shows its name. Past five, arrows page through and wrap around.
const files = [{ name: 'Deposition_transcript.pdf' }, { name: 'Exhibit_A_photos.zip' }, /* … */]
<Folder files={files} label="Case files" icon={File01Icon} />`

const toc = [
  { id: 'showcase', label: 'Showcase',    child: false },
  { id: 'fan',      label: 'Fan on hover', child: false },
  { id: 'colors',   label: 'Colors & icon', child: false },
  { id: 'props',    label: 'Props',       child: false },
]

export default function FolderPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Folder</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A tactile folder — unified skeleton cards (or your own photos) tuck behind a
            frosted-glass front pocket. Pick a Hugeicons badge, any body color, and squircle
            corners throughout. It also powers{' '}
            <a href="/docs/file-uploader" className="underline underline-offset-2">File Uploader</a>'s{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">folder</code>{' '}
            variant — see that page for the real drag-and-drop, opens-on-hover, upload-progress demo.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add folder" />
        </section>

        <section id="showcase" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Showcase</Text>
          <PreviewCode minHeight={520} preview={<FolderShowcasePreview />} code={<CodeBlock code={showcaseCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="fan" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Fan on hover</Text>
          <Text variant="body" className="text-zinc-500 dark:text-zinc-400 -mt-1">
            Opening lifts the cards clear of the pocket and spreads them along a shallow arc —
            the middle card sits highest, the outer ones ease down and tilt away. Hover opens it
            on a pointer, tap on touch, and keyboard focus works too. Hovering a card shows its
            name. The fan shows up to five at a time; arrows appear whenever there&apos;s more
            than one file, and paging wraps around at either end instead of stopping. It tightens
            the spread — and drops to fewer cards — when there isn&apos;t room for the full fan.
          </Text>
          <PreviewCode minHeight={560} preview={<FolderFanPreview />} code={<CodeBlock code={fanCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="colors" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Colors &amp; icon</Text>
          <Text variant="body" className="text-zinc-500 dark:text-zinc-400 -mt-1">
            Drive the folder color live with the <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">ColorSwatch</code> component, and pick any Hugeicons badge — it adopts a darker shade of the folder.
          </Text>
          <PreviewCode minHeight={560} preview={<FolderColorPreview />} code={<CodeBlock code={colorCode} lang="tsx" className="rounded-none" flat />} />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'label',       type: 'string',       desc: 'Title under the folder.' },
            { name: 'count',       type: 'string',       desc: 'Count / subtitle line.' },
            { name: 'color',       type: 'string',       desc: 'Folder body color (any CSS color).' },
            { name: 'icon',        type: 'IconSvgElement', desc: 'A Hugeicons icon shown on the front pocket.' },
            { name: 'files',       type: 'FolderFile[]', desc: '{ thumb, name, progress } — photo, skeleton card, or both; name shows in a tooltip on hover.' },
            { name: 'peek',        type: 'number',       desc: 'Skeleton cards to show when no files given. Default 3.' },
            { name: 'blur',        type: 'number',       desc: 'Frosted-glass blur on the pocket, px. Default 6.' },
            { name: 'size',        type: 'number',       desc: 'Folder width in px. Default 260.' },
            { name: 'progress',    type: 'number',       desc: 'Overall upload progress 0–100.' },
            { name: 'showLabel',   type: 'boolean',      desc: 'Show the title. Default true.' },
            { name: 'showCount',   type: 'boolean',      desc: 'Show the count line. Default true.' },
            { name: 'interactive', type: 'boolean',      desc: 'Enable drag-drop + click-to-browse.' },
            { name: 'toggleOnClick', type: 'boolean',    desc: 'Tap toggles the fan — the touch/keyboard path to the hover reveal. Off when an ancestor owns the click. Defaults to on unless interactive.' },
            { name: 'onFiles',     type: '(files: File[]) => void', desc: 'Fires with dropped/selected files.' },
            { name: 'className',   type: 'string',       desc: 'Merged onto the root.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
