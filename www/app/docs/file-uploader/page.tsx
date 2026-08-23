import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  FileUploaderDropzonePreview,
  FileUploaderCompactPreview,
} from '@/components/stepwise/docs/file-uploader-preview'

const dropzoneCode = `import { FileUploader, type FileEntry } from '@/components/stepwise/file-uploader'

const [files, setFiles] = useState<FileEntry[]>([])

const onFiles = (incoming: File[]) => {
  setFiles(prev => [
    ...prev,
    ...incoming.map(f => ({ id: crypto.randomUUID(), file: f })),
  ])
}

// default variant — a real Folder as the drop target. Drag files onto it
// or click "Select" to browse; it tilts open on hover and shows progress
// both on the pocket and on each file's own card as it peeks out. Hovering
// a card shows its name — click the × on one to remove it (confirmed via
// the Modal component before it's actually gone).
<FileUploader
  files={files}
  onFiles={onFiles}
  onRemove={id => setFiles(prev => prev.filter(f => f.id !== id))}
  maxMB={10}
/>`

const compactCode = `<FileUploader
  variant="compact"
  files={files}
  onFiles={onFiles}
  onRemove={onRemove}
/>`

const toc = [
  { id: 'dropzone', label: 'Dropzone',  child: false },
  { id: 'compact',  label: 'Compact',   child: false },
  { id: 'props',    label: 'Props',     child: false },
]

export default function FileUploaderPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">File Uploader</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Two variants for picking and displaying files. The component is purely presentational —
            you own progress tracking and the upload logic, passing file entries back in via{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">files</code>.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add file-uploader" />
        </section>

        <section id="dropzone" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Dropzone</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            One drop target, not two widgets glued together — the dashed box{' '}
            <em>is</em> the{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">Folder</code>&apos;s
            own hit area. Hover, tap, or focus it to see what&apos;s inside — each card shows its
            name on hover, and its own remove button, confirmed through the{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">Modal</code>{' '}
            component before anything&apos;s actually gone. Try it — drag one of the files below
            onto it.
          </Text>
          <PreviewCode
            minHeight={480}
            preview={<FileUploaderDropzonePreview />}
            code={<CodeBlock code={dropzoneCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="compact" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Compact</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            The same{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">Button</code>{' '}
            with <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">slideIcon</code>{' '}
            you&apos;ll find everywhere else — it&apos;s also its own drop target. Drag a file over
            it and the icon swaps to an incoming arrow; the label answers with the file count once
            something&apos;s selected.
          </Text>
          <PreviewCode
            minHeight={220}
            preview={<FileUploaderCompactPreview />}
            code={<CodeBlock code={compactCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'variant',   type: '"dropzone" | "compact"',            desc: 'Visual layout. Default "dropzone".' },
            { name: 'color',     type: 'string',                            desc: '"dropzone" variant only — folder body color. Default: amber (#f5d98b).' },
            { name: 'files',     type: 'FileEntry[]',                       desc: 'Controlled file list with optional progress.' },
            { name: 'onFiles',   type: '(files: File[]) => void',           desc: 'Called with accepted File objects. Caller tracks progress.' },
            { name: 'onRemove',  type: '(id: string) => void',              desc: 'Called after the remove is confirmed in the Modal.' },
            { name: 'accept',    type: 'string',                            desc: 'MIME types or file extensions (e.g. ".pdf,.docx").' },
            { name: 'multiple',  type: 'boolean',                           desc: 'Allow multiple files. Default true.' },
            { name: 'maxMB',     type: 'number',                            desc: 'Silently skip files over this size (MB).' },
          ]} />
        </section>

      </div>

      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
