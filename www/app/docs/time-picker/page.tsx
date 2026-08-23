import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  TimePickerPreview,
  TimePicker24Preview,
} from '@/components/stepwise/docs/time-picker-preview'

const basicCode = `import { TimePicker } from '@/components/stepwise/time-picker'

const [time, setTime] = useState('09:30')

// value is always 24h "HH:mm", whatever the display format
<TimePicker label="Start time" value={time} onChange={setTime} />`

const code24 = `<TimePicker
  label="Ends at"
  value={time}
  onChange={setTime}
  use12Hour={false}
  step={15}
/>`

const toc = [
  { id: 'default', label: 'Default', child: false },
  { id: 'h24',   label: '24-hour', child: false },
  { id: 'props', label: 'Props', child: false },
]

export default function TimePickerPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Time Picker</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A field that matches Input, opening a split readout with snap columns and a sliding
            AM/PM control. Scroll, tap, or type digits. The value is always 24-hour{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">"HH:mm"</code>.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add time-picker" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Click a number or type into the underlined hour and minute. Arrow keys step; scroll or drag the wheels.
          </Text>
          <PreviewCode
            minHeight={400}
            allowOverflow
            preview={<TimePickerPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="h24" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">24-hour</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Drop AM/PM with{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">use12Hour={'{false}'}</code>
            {' '}and set the minute increment with{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">step</code>.
          </Text>
          <PreviewCode
            minHeight={400}
            allowOverflow
            preview={<TimePicker24Preview />}
            code={<CodeBlock code={code24} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'value',       type: 'string',                  desc: '24-hour "HH:mm".' },
            { name: 'onChange',    type: '(value: string) => void', desc: 'Fires with 24-hour "HH:mm".' },
            { name: 'label',       type: 'string',                  desc: 'Label above the field.' },
            { name: 'placeholder', type: 'string',                  desc: 'Shown when no time is set. Default "Select time".' },
            { name: 'use12Hour',   type: 'boolean',                 desc: '12-hour display with AM/PM. Default true.' },
            { name: 'step',        type: 'number',                  desc: 'Minute increment. Default 5.' },
            { name: 'disabled',    type: 'boolean',                 desc: 'Disables the field.' },
            { name: 'className',   type: 'string',                  desc: 'Merged onto the outer wrapper.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', desc: 'Fires when the panel opens or closes.' },
          ]} />
        </section>

      </div>

      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
