import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { CalendarPreview, CalendarRangePreview } from '@/components/stepwise/docs/calendar-preview'
import { PropsTable } from '@/components/stepwise/docs/props-table'

const usageCode = `import { Calendar, CalendarRange } from '@/components/stepwise/calendar'

// Single date — uncontrolled
<Calendar defaultSelected={new Date()} />

// Single date — controlled
const [date, setDate] = useState<Date | null>(null)
<Calendar selected={date} onSelect={setDate} />

// Date range — controlled
const [from, setFrom] = useState<Date | null>(null)
const [to,   setTo]   = useState<Date | null>(null)
<CalendarRange
  from={from}
  to={to}
  onRangeChange={(f, t) => { setFrom(f); setTo(t) }}
/>`

const tocItems = [
  { id: 'preview',   label: 'Calendar',        child: false },
  { id: 'range',     label: 'CalendarRange',   child: false },
  { id: 'cal-props', label: 'Calendar props',  child: false },
  { id: 'rng-props', label: 'CalendarRange props', child: false },
]

export default async function CalendarPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Calendar</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Standalone month-view calendar components. Includes single-date and date-range
            variants, each with animated month transitions, a spring-animated selection pill,
            and a scrollable month/year picker. For an input-triggered picker, see{' '}
            <a href="/docs/date-picker" className="underline underline-offset-2">Date Picker</a>.
          </Text>
        </div>

        {/* Installation */}
        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add calendar" />
        </section>

        {/* Calendar preview */}
        <section id="preview" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Calendar</Text>
          <PreviewCode
            minHeight={480}
            preview={<CalendarPreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* CalendarRange preview */}
        <section id="range" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">CalendarRange</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            First click sets the start, second click sets the end. Hovering previews
            the would-be range. Clicking an already-selected start clears the selection.
          </Text>
          <PreviewCode
            minHeight={520}
            preview={<CalendarRangePreview />}
            code={<CodeBlock code={usageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* Calendar props */}
        <section id="cal-props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Calendar props</Text>
          <PropsTable rows={[
            { name: 'defaultSelected', type: 'Date',                  desc: 'Initial selected date for uncontrolled usage.' },
            { name: 'selected',        type: 'Date | null',           desc: 'Controlled selected date. Pass null to clear.' },
            { name: 'onSelect',        type: '(date: Date) => void',  desc: 'Called when the user clicks a date.' },
            { name: 'className',       type: 'string',                desc: 'Additional classes on the outermost Surface.' },
          ]} />
        </section>

        {/* CalendarRange props */}
        <section id="rng-props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">CalendarRange props</Text>
          <PropsTable rows={[
            { name: 'from',          type: 'Date | null',                                    desc: 'Controlled range start date.' },
            { name: 'to',            type: 'Date | null',                                    desc: 'Controlled range end date.' },
            { name: 'onRangeChange', type: '(from: Date | null, to: Date | null) => void',   desc: 'Called whenever either endpoint changes.' },
            { name: 'className',     type: 'string',                                         desc: 'Additional classes on the outermost Surface.' },
          ]} />
        </section>

      </div>

      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
