import { HugeiconsIcon } from '@hugeicons/react'
import {
  DeliveryTruck01Icon, SecurityCheckIcon, Stethoscope02Icon, StoreVerified01Icon,
} from '@hugeicons/core-free-icons'
import { Surface } from '@/components/stepwise/primitives/surface'
import { TrustPlate } from '@/components/riso/illustrations'
import { Container, Section } from '@/components/site/section'

/**
 * Trust / Assurance — Section 07.
 *
 * PLACEHOLDER COPY — see COPY-TODO.md. The licence number in particular is a
 * legal statement and must be replaced with the real one before launch.
 *
 * Assurances as rows with a leading icon, not as a grid of badge cards. Each
 * one makes a specific, checkable claim; a row that could be printed on any
 * pharmacy's site has been cut rather than padded out to fill a fourth tile.
 */

const ASSURANCES = [
  {
    icon : StoreVerified01Icon,
    title: 'Licensed and inspected',
    body : 'We hold a retail drug licence and stock only from distributors authorised by the manufacturer.',
  },
  {
    icon : Stethoscope02Icon,
    title: 'A pharmacist reads every prescription',
    body : 'Not an algorithm. If something looks wrong on the sheet, we call you before we dispense it.',
  },
  {
    icon : DeliveryTruck01Icon,
    title: 'Cold chain where it matters',
    body : 'Insulin and other cold-chain items travel in a temperature-logged box, or we do not ship them.',
  },
  {
    icon : SecurityCheckIcon,
    title: 'Your prescription stays yours',
    body : 'Prescriptions are stored encrypted, visible only to the pharmacist on your order. Never sold, never shared.',
  },
]

export function Trust() {
  return (
    <Section tone="raised" id="trust">
      <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:gap-16">
        <Surface radius={28} className="aspect-[10/9] w-full overflow-hidden">
          <TrustPlate />
        </Surface>

        <div className="max-w-[34rem]">
          <h2 className="text-balance text-[26px] font-semibold leading-[1.12] tracking-[-0.035em] text-zinc-800 dark:text-zinc-100 sm:text-[32px] lg:text-[38px]">
            The boring parts, taken seriously
          </h2>
          <p className="mt-3 text-pretty text-[15px] leading-[1.6] text-zinc-500 dark:text-zinc-400 sm:text-[16px]">
            Sourcing, storage and who gets to see your prescription. None of it
            is exciting. All of it is the reason to buy medicine from us rather
            than from whoever is cheapest.
          </p>

          <ul className="mt-8 flex flex-col">
            {ASSURANCES.map(a => (
              <li
                key={a.title}
                className="flex gap-4 border-t border-[var(--ui-border-subtle)] py-4 first:border-t-0 first:pt-0"
              >
                {/* 1.8 stroke beside 15px semibold text - the icon carries the
                    same optical weight as the line it labels. */}
                <HugeiconsIcon
                  icon={a.icon}
                  size={19}
                  strokeWidth={1.8}
                  color="currentColor"
                  className="mt-0.5 shrink-0 text-sky-600 dark:text-sky-400"
                />
                <div>
                  <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-zinc-800 dark:text-zinc-100">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-pretty text-[14px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {a.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
