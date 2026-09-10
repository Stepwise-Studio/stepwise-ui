import { HugeiconsIcon } from '@hugeicons/react'
import { PrescriptionIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/stepwise/button'
import { Surface } from '@/components/stepwise/primitives/surface'
import { PrescriptionPlate } from '@/components/riso/illustrations'
import { Container, Section } from '@/components/site/section'

/**
 * Prescription Upload — Section 05.
 *
 * PLACEHOLDER COPY. The source document locks sections 1–4 only; everything
 * written here is a stand-in in the same editorial voice and is listed in
 * COPY-TODO.md for the owner to replace.
 *
 * A split section rather than a banner: the three points on the left are what
 * actually reassures someone about handing over a prescription, and they need
 * room to be read.
 */

const POINTS = [
  {
    title: 'A photo is enough',
    body : 'A clear picture from your phone works. JPG, PNG, WEBP, HEIC or PDF, up to 5 MB.',
  },
  {
    title: 'A pharmacist checks it',
    body : 'A registered pharmacist reads every prescription before anything ships.',
  },
  {
    title: 'You keep the record',
    body : 'Uploaded prescriptions stay in your account, so repeat orders take one tap.',
  },
]

export function PrescriptionCta() {
  return (
    <Section tone="sunken" id="prescriptions">
      <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-16">
        <div className="max-w-[32rem]">
          <h2 className="text-balance text-[26px] font-semibold leading-[1.12] tracking-[-0.035em] text-zinc-800 dark:text-zinc-100 sm:text-[32px] lg:text-[38px]">
            Have a prescription? Send it over.
          </h2>
          <p className="mt-3 text-pretty text-[15px] leading-[1.6] text-zinc-500 dark:text-zinc-400 sm:text-[16px]">
            Upload it once and we will read it, match the medicines, and put the
            order together for you. No typing out names you cannot pronounce.
          </p>

          {/* A numbered list, not three cards with centred icons. The numbers
              carry the sequence; the rule between rows carries the grouping. */}
          <ol className="mt-8 flex flex-col">
            {POINTS.map((p, i) => (
              <li
                key={p.title}
                className="flex gap-4 border-t border-[var(--ui-border-subtle)] py-4 first:border-t-0 first:pt-0"
              >
                <span className="mt-0.5 w-5 shrink-0 text-[14px] font-semibold tabular-nums text-sky-600 dark:text-sky-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-800 dark:text-zinc-100">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-pretty text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <Button
              href="/prescriptions"
              size="lg"
              icon={<HugeiconsIcon icon={PrescriptionIcon} size={18} strokeWidth={2} color="currentColor" />}
            >
              Upload Prescription
            </Button>
          </div>
        </div>

        <Surface radius={28} className="aspect-[4/3] w-full overflow-hidden lg:aspect-[21/19]">
          <PrescriptionPlate />
        </Surface>
      </Container>
    </Section>
  )
}
