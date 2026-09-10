import { MedicineCard } from '@/components/site/medicine-card'
import { Container, Section, SectionHeading } from '@/components/site/section'
import { getMedicines } from '@/lib/medusa/client'

/**
 * Popular Medicines — Section 04. **Copy is locked** (heading, support line and
 * the section link label).
 *
 * Deliberately the quiet section after the bento: no illustration plates, no
 * paper tint, just four product cards on the page ground. It is also the only
 * section on the homepage whose imagery is photography rather than Riso.
 */
export async function PopularMedicines() {
  const medicines = await getMedicines({ limit: 4 })

  return (
    <Section id="popular">
      <Container>
        <SectionHeading
          title="Popular medicines"
          support="Everyday essentials, ready when you need them."
          action={{ label: 'View all medicines', href: '/medicines' }}
        />

        {/* Two columns on a phone rather than one: these cards are compact and a
            single stacked column turns four products into a long scroll. */}
        <div className="squircle-fill mt-10 grid grid-cols-2 gap-4 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {medicines.map(m => (
            <MedicineCard key={m.id} medicine={m} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
