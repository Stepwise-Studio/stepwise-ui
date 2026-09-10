import { HugeiconsIcon } from '@hugeicons/react'
import { PrescriptionIcon, ShoppingBag02Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/stepwise/button'
import { Surface } from '@/components/stepwise/primitives/surface'
import { DeliveryPlate } from '@/components/riso/illustrations'
import { Container, Section } from '@/components/site/section'

/**
 * Final CTA — Section 11.
 *
 * PLACEHOLDER COPY — see COPY-TODO.md. The two CTA labels are NOT placeholders:
 * they are the locked hero labels, repeated deliberately so the page ends on
 * the same two doors it opened with.
 *
 * The last rich section before the footer. One plate, one heading, the same two
 * actions - and no third "or sign up for our newsletter" afterthought.
 */
export function FinalCta() {
  return (
    <Section tone="raised">
      <Container>
        <Surface
          radius={32}
          className="grid items-center gap-8 overflow-hidden bg-[var(--surface-sunken)] p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] lg:gap-14 lg:p-14"
          lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
        >
          <div className="max-w-[30rem]">
            <h2 className="text-balance text-[28px] font-semibold leading-[1.08] tracking-[-0.04em] text-zinc-800 dark:text-zinc-100 sm:text-[36px] lg:text-[42px]">
              Order it once. Forget about it after that.
            </h2>
            <p className="mt-4 text-pretty text-[15px] leading-[1.6] text-zinc-500 dark:text-zinc-400 sm:text-[17px]">
              Upload a prescription or start from the shelf. Either way a
              pharmacist checks the order before it leaves us.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href="/prescriptions"
                size="lg"
                icon={<HugeiconsIcon icon={PrescriptionIcon} size={18} strokeWidth={2} color="currentColor" />}
              >
                Upload Prescription
              </Button>
              <Button
                href="/medicines"
                size="lg"
                variant="outline"
                icon={<HugeiconsIcon icon={ShoppingBag02Icon} size={18} strokeWidth={1.8} color="currentColor" />}
              >
                Browse Medicines
              </Button>
            </div>
          </div>

          <Surface radius={22} className="aspect-[5/4] w-full overflow-hidden">
            <DeliveryPlate />
          </Surface>
        </Surface>
      </Container>
    </Section>
  )
}
