import { Surface } from '@/components/stepwise/primitives/surface'
import { SpotPlate, type SpotName } from '@/components/riso/illustrations'
import { Container, Section, SectionHeading } from '@/components/site/section'

/**
 * How It Works — Section 06.
 *
 * PLACEHOLDER COPY — see COPY-TODO.md.
 *
 * Four steps as a timeline, not four cards. There is no card surface, nothing
 * is centred, and the connecting rule runs behind the plates on desktop so the
 * row reads as one sequence rather than as four unrelated tiles. Numbers are
 * set in the largest type in the section because the order is the content.
 */

const STEPS: { spot: SpotName; title: string; body: string }[] = [
  {
    spot : 'search',
    title: 'Find what you need',
    body : 'Search by name or salt, or browse a category. Every pack shows its composition up front.',
  },
  {
    spot : 'prescription',
    title: 'Add your prescription',
    body : 'Only if something in your basket needs one. A photo from your phone is fine.',
  },
  {
    spot : 'pharmacist',
    title: 'We check the order',
    body : 'A registered pharmacist verifies the prescription and the batch before it leaves us.',
  },
  {
    spot : 'delivery',
    title: 'It arrives sealed',
    body : 'Packed cold where it matters, tracked the whole way, and delivered to your door.',
  },
]

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <Container>
        <SectionHeading
          title="Four steps, and you are done"
          support="From the search box to your door, with a pharmacist in the middle of it."
        />

        <div className="relative mt-12">
          {/* The connecting rule. Dashed, behind the plates, and only on the
              widths where the steps actually sit in a row. */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[46px] hidden border-t border-dashed border-[var(--ui-border)] lg:block"
          />

          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                {/* The width lives on this wrapper, not on the Surface. lisse
                    hosts the border overlay in a block-level wrapper of its own
                    that stretches to the column; sizing only the inner element
                    leaves a 92px plate inside a full-width frame. */}
                <div className="relative h-[92px] w-[92px]">
                  <Surface
                    radius={20}
                    className="h-[92px] w-[92px] overflow-hidden"
                    lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
                  >
                    <SpotPlate name={step.spot} />
                  </Surface>
                </div>

                <div className="mt-5 flex items-baseline gap-2.5">
                  <span className="text-[13px] font-semibold tabular-nums text-sky-600 dark:text-sky-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-[17px] font-semibold tracking-[-0.03em] text-zinc-800 dark:text-zinc-100">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-2 max-w-[20rem] text-pretty text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  )
}
