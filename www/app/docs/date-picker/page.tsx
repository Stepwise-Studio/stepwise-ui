import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { DatePickerPreview } from '@/components/stepwise/docs/date-picker-preview'
import { PropsTable } from '@/components/stepwise/docs/props-table'

const usageCode = `import { DatePicker } from '@/components/stepwise/date-picker'

// Single date
const [date, setDate] = useState<Date | null>(null)
<DatePicker variant="date" label="Date" value={date} onChange={setDate} />

// Date range
const [from, setFrom] = useState<Date | null>(null)
const [to,   setTo]   = useState<Date | null>(null)
<DatePicker
  variant="range"
  label="Date range"
  from={from}
  to={to}
  onRangeChange={(f, t) => { setFrom(f); setTo(t) }}
/>

// Typed date (DD/MM/YYYY) — also has a calendar icon to open the picker
const [dob, setDob] = useState<Date | null>(null)
<DatePicker variant="text" label="Date of birth" value={dob} onChange={setDob} />`

const tocItems = [
  { id: 'preview',  label: 'Preview',   child: false },
  { id: 'variants', label: 'Variants',  child: false },
  { id: 'props',    label: 'Props',     child: false },
]

export default async function DatePickerPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Date Picker</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Input-triggered date picker with three variants: click-to-pick, date range, and
            a typed DD/MM/YYYY field. The calendar drops below the input (or above if space is tight),
            animated with a blurred slide. For the standalone calendar component, see{' '}
            <a href="/docs/calendar" className="underline underline-offset-2">Calendar</a>.
          </Text>
        </div>

        {/* Installation */}
        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add date-picker" />
        </section>

        {/* Preview */}
        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            minHeight={280}
            allowOverflow
            preview={<DatePickerPreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* Variants */}
        <section id="variants" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Variants</Text>
          <PropsTable rows={[
            { name: 'date',  type: 'variant', desc: 'Click the input to open a calendar. Selecting a date fills the input and closes the picker.' },
            { name: 'range', type: 'variant', desc: 'Opens a range calendar. First click sets start, second sets end. Hover previews the range.' },
            { name: 'text',  type: 'variant', desc: 'Type a date as DD/MM/YYYY. The calendar icon also opens the visual picker — both update the same value.' },
          ]} />
        </section>

        {/* Props */}
        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'variant',       type: '"date" | "range" | "text"',                    desc: 'Picker variant. Default: "date".' },
            { name: 'label',         type: 'string',                                       desc: 'Label shown above the input.' },
            { name: 'placeholder',   type: 'string',                                       desc: 'Placeholder text. Defaults to a sensible value per variant.' },
            { name: 'value',         type: 'Date | null',                                  desc: 'Controlled date value (date and text variants).' },
            { name: 'onChange',      type: '(date: Date | null) => void',                  desc: 'Called when the date changes.' },
            { name: 'from',          type: 'Date | null',                                  desc: 'Range start date (range variant).' },
            { name: 'to',            type: 'Date | null',                                  desc: 'Range end date (range variant).' },
            { name: 'onRangeChange', type: '(from: Date | null, to: Date | null) => void', desc: 'Called when either range endpoint changes.' },
            { name: 'className',     type: 'string',                                       desc: 'Additional classes for the outer wrapper.' },
          ]} />
        </section>

      </div>

      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
