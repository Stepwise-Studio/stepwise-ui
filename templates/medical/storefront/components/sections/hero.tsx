import { HugeiconsIcon } from '@hugeicons/react'
import { PrescriptionIcon, ShoppingBag02Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/stepwise/button'
import { Surface } from '@/components/stepwise/primitives/surface'
import { HeroPlate } from '@/components/riso/illustrations'
import { Container } from '@/components/site/section'

/**
 * Hero — Section 02. **Copy is locked**: heading, support line and both CTA
 * labels are transcribed exactly and must not be reworded.
 *
 * Split composition (direction A): text left, illustration right, CTA group
 * beneath the text, and a lot of empty paper. The plate is a portrait on
 * desktop and drops to a 4:3 landscape band below `lg`, where a portrait
 * illustration would push the CTAs off the first screen.
 *
 * ── No entrance animation, deliberately ─────────────────────────────────────
 * This started as a three-chunk staggered rise. It was removed: a JS-driven
 * entrance means the H1, the support line and both CTAs are served at
 * `opacity: 0` and only become visible once the client bundle has hydrated and
 * run. Anything that delays or breaks that - a throttled background tab, a slow
 * connection, a JS error anywhere else on the page - leaves the most important
 * content on the site invisible. It is not a trade worth making for half a
 * second of polish, so this section is server-rendered and static. The page's
 * motion lives where motion belongs: on things the reader does.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Container className="grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] lg:gap-16 lg:py-24">
        <div className="max-w-[34rem]">
          <h1 className="text-balance text-[38px] font-semibold leading-[1.04] tracking-[-0.045em] text-zinc-800 dark:text-zinc-100 sm:text-[52px] lg:text-[64px]">
            Your medicines. Made simpler.
          </h1>

          <p className="mt-5 max-w-[30rem] text-pretty text-[16px] leading-[1.6] text-zinc-500 dark:text-zinc-400 sm:text-[18px]">
            Order genuine medicines online or upload your prescription and let us
            take care of the rest.
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

        {/* The plate is a printed sheet pinned to the page, not a UI card - it
            carries the largest radius on the site. The squircle comes from
            Surface; a plain `rounded-*` is never acceptable here. */}
        <Surface
          radius={28}
          className="order-first aspect-[4/3] w-full overflow-hidden lg:order-last lg:aspect-[13/14]"
        >
          <HeroPlate />
        </Surface>
      </Container>
    </section>
  )
}
