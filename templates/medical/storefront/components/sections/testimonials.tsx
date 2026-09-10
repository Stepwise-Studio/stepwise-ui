import { Surface } from '@/components/stepwise/primitives/surface'
import { Container, Section, SectionHeading } from '@/components/site/section'
import { cn } from '@/lib/utils/cn'

/**
 * Testimonials / Customer Stories — Section 09.
 *
 * PLACEHOLDER COPY — every quote and name here is invented. See COPY-TODO.md.
 * Real testimonials must be attributable, and inventing them is the one kind of
 * placeholder that becomes a lie if it ships.
 *
 * One long quote and two short ones rather than three matching cards. The
 * initials stand in for an avatar deliberately: a stock photograph of a
 * stranger is the tell that a testimonial is not real.
 */

type Quote = { body: string; name: string; detail: string }

const FEATURED: Quote = {
  body:
    'My mother is on four regular medicines and I used to spend a Sunday every ' +
    'month getting them. I uploaded the prescription once. Now it turns up, the ' +
    'strips match what the doctor wrote, and I have my Sunday back.',
  name  : 'Ananya R.',
  detail: 'Bengaluru · ordering for two years',
}

const SHORT: Quote[] = [
  {
    body  : 'Someone actually called me because the dosage on the sheet looked off. It was. I did not expect that from an app.',
    name  : 'Vikram S.',
    detail: 'Pune',
  },
  {
    body  : 'The insulin arrived cold, with the temperature log in the box. That is the whole reason I switched.',
    name  : 'Meera J.',
    detail: 'Chennai',
  },
]

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2)
}

function Attribution({ q, muted }: { q: Quote; muted?: boolean }) {
  return (
    <figcaption className="mt-6 flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600/12 text-[12px] font-semibold text-sky-700 dark:bg-sky-400/15 dark:text-sky-300"
      >
        {initials(q.name)}
      </span>
      <span className="flex flex-col">
        <span className="text-[14px] font-semibold tracking-[-0.02em] text-zinc-800 dark:text-zinc-100">
          {q.name}
        </span>
        <span className={cn('text-[12.5px]', muted ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-500 dark:text-zinc-400')}>
          {q.detail}
        </span>
      </span>
    </figcaption>
  )
}

export function Testimonials() {
  return (
    <Section tone="sunken" id="stories">
      <Container>
        <SectionHeading
          title="What people actually say"
          support="Three of the ones we did not have to ask for."
        />

        <div className="squircle-fill mt-10 grid gap-4 lg:mt-12 lg:grid-cols-[1.25fr_1fr] lg:gap-5">
          <Surface
            radius={24}
            className="flex h-full flex-col justify-between bg-[var(--surface-raised)] p-7 sm:p-9"
            lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
          >
            <blockquote className="text-pretty text-[19px] leading-[1.5] tracking-[-0.02em] text-zinc-700 dark:text-zinc-200 sm:text-[22px]">
              {/* Curly quotes, not the straight typewriter ones. */}
              “{FEATURED.body}”
            </blockquote>
            <Attribution q={FEATURED} />
          </Surface>

          <div className="squircle-fill grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
            {SHORT.map(q => (
              <Surface
                key={q.name}
                radius={20}
                className="flex h-full flex-col justify-between bg-[var(--surface-raised)] p-6"
                lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border-subtle)' } }}
              >
                <blockquote className="text-pretty text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                  “{q.body}”
                </blockquote>
                <Attribution q={q} muted />
              </Surface>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
