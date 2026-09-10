import type { Metadata } from 'next'
import { Surface } from '@/components/stepwise/primitives/surface'
import { PrescriptionPlate } from '@/components/riso/illustrations'
import { PrescriptionFlow } from '@/components/site/prescription-flow'
import { Container } from '@/components/site/section'

export const metadata: Metadata = {
  title      : 'Upload a prescription',
  description: 'Send us a photo of your prescription and a registered pharmacist will check it.',
}

/**
 * Prescription upload.
 *
 * PLACEHOLDER COPY — see COPY-TODO.md. The list of what makes a prescription
 * valid is a regulatory statement and must be confirmed before launch.
 *
 * The upload sits on the left because it is what you came to do; the plate and
 * the "what we look for" list sit on the right as reference. On a phone the
 * uploader comes first and the reference follows it.
 */
export default function PrescriptionsPage() {
  return (
    <div className="py-10 sm:py-14 lg:py-16">
      <Container>
        <header className="max-w-[36rem]">
          <h1 className="text-balance text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-zinc-800 dark:text-zinc-100 sm:text-[40px]">
            Send us your prescription
          </h1>
          <p className="mt-4 text-pretty text-[16px] leading-[1.6] text-zinc-500 dark:text-zinc-400">
            A clear photo from your phone is enough. A registered pharmacist
            reads every one, and nothing ships until they have.
          </p>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] lg:gap-16">
          <div className="max-w-[36rem]">
            <PrescriptionFlow />
          </div>

          <aside className="flex flex-col gap-8">
            <Surface radius={26} className="aspect-[21/19] w-full overflow-hidden">
              <PrescriptionPlate />
            </Surface>

            <div>
              <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-800 dark:text-zinc-100">
                What the pharmacist looks for
              </h2>
              <ul className="mt-3 flex flex-col">
                {[
                  'The prescribing doctor’s name and registration number.',
                  'A date within the last six months.',
                  'The patient’s name, legible.',
                  'Each medicine with its strength and dosage.',
                  'The whole sheet in frame, corners included.',
                ].map(line => (
                  <li
                    key={line}
                    className="border-t border-[var(--ui-border-subtle)] py-2.5 text-pretty text-[14px] leading-relaxed text-zinc-500 first:border-t-0 first:pt-0 dark:text-zinc-400"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  )
}
