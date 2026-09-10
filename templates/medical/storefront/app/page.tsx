import { Hero } from '@/components/sections/hero'
import { Categories } from '@/components/sections/categories'
import { PopularMedicines } from '@/components/sections/popular-medicines'
import { PrescriptionCta } from '@/components/sections/prescription-cta'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Trust } from '@/components/sections/trust'
import { Offers } from '@/components/sections/offers'
import { Testimonials } from '@/components/sections/testimonials'
import { Faq } from '@/components/sections/faq'
import { FinalCta } from '@/components/sections/final-cta'

/* Section order is locked by the spec, not by taste - it alternates a visually
 * rich section against a quieter one so the page never stacks two illustrated
 * blocks back to back. Navbar and Footer live in `layout.tsx`, so this file
 * holds sections 2-11 of the twelve. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <PopularMedicines />
      <PrescriptionCta />
      <HowItWorks />
      <Trust />
      <Offers />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  )
}
