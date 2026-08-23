import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { TypewriterPreview } from '@/components/stepwise/docs/text-effects-preview'

const usageCode = `import { Typewriter } from '@/components/stepwise/typewriter'

// Cycle a list: type → hold → backspace → next (loops)
We build{' '}
<Typewriter words={['design systems', 'component libraries', 'delightful UIs']} />

// A single string types once and holds, caret keeps blinking
<Typewriter words="Hello, world" />`

const tocItems = [
  { id: 'preview',      label: 'Preview',      child: false },
  { id: 'installation', label: 'Installation', child: false },
  { id: 'usage',        label: 'Usage',        child: false },
  { id: 'props',        label: 'Props',        child: false },
]

export default function TypewriterPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Typewriter</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Types a string on character by character with a blinking caret. Pass an array to
            cycle words — type, hold, backspace, next. A single string types once and holds.
          </Text>
        </div>

        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            preview={<TypewriterPreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="installation" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add typewriter" />
        </section>

        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <CodeBlock code={usageCode} lang="tsx" />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'words',       type: 'string | string[]', desc: 'One string types and holds; an array cycles through them.' },
            { name: 'typeSpeed',   type: 'number',            desc: 'ms per character while typing. Default 65.' },
            { name: 'deleteSpeed', type: 'number',            desc: 'ms per character while deleting. Default 35.' },
            { name: 'holdTime',    type: 'number',            desc: 'ms to hold a completed word before deleting. Default 1400.' },
            { name: 'loop',        type: 'boolean',           desc: 'Loop the sequence. Default true when multiple words.' },
            { name: 'className',   type: 'string',            desc: 'Extra classes on the text.' },
            { name: 'caretClassName', type: 'string',         desc: 'Extra classes on the blinking caret.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
