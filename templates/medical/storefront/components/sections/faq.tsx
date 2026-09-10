import { Accordion } from '@/components/stepwise/accordion'
import { Container, Section, SectionHeading } from '@/components/site/section'

/**
 * FAQ — Section 10.
 *
 * PLACEHOLDER COPY — see COPY-TODO.md. The delivery windows, the returns rule
 * and the refrigeration claim are all operational facts the owner has to
 * confirm before this ships.
 *
 * The vendored `Accordion` handles the disclosure motion (grid-rows growth,
 * chevron flip, reduced-motion guard), so this section is only content and a
 * measure cap. One column, capped near 65 characters, because answers are
 * read rather than scanned.
 */

const ITEMS = [
  {
    id: 'genuine',
    title: 'How do I know the medicines are genuine?',
    content:
      'Everything we stock comes from distributors authorised by the manufacturer, and each pack keeps its batch number and expiry through to your invoice. If a batch is recalled we can tell exactly who received it, and we call them.',
  },
  {
    id: 'prescription',
    title: 'Which medicines need a prescription?',
    content:
      'Any medicine marked "Prescription needed" on its card and its page. Add one to your basket and checkout stays locked until a pharmacist has approved the prescription you upload — that check runs on our side, not in the browser.',
  },
  {
    id: 'upload',
    title: 'What counts as a valid prescription?',
    content:
      'A photo or scan of a prescription from a registered practitioner, dated within the last six months, showing the doctor’s name and registration number, your name, and the medicines with their dosage. A clear phone photo is enough.',
  },
  {
    id: 'delivery',
    title: 'How long does delivery take?',
    content:
      'Two to four days across most of the country, and same-day in the cities we run our own riders in. Cold-chain items ship only on days we can complete the route without an overnight stop.',
  },
  {
    id: 'returns',
    title: 'Can I return medicines?',
    content:
      'Sealed, non-refrigerated packs can be returned within seven days of delivery. Opened packs, refrigerated items and anything dispensed against a prescription cannot be — that is a safety rule, not a policy we chose.',
  },
  {
    id: 'privacy',
    title: 'Who can see my prescription?',
    content:
      'The pharmacist reviewing your order, and nobody else. Prescriptions are stored encrypted, are never used for advertising, and are never shared with a third party without a legal obligation to do so.',
  },
]

export function Faq() {
  return (
    <Section id="faq">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-16">
          <SectionHeading
            title="Questions people ask"
            support="If yours is not here, the pharmacy line is answered by a person."
            className="lg:sticky lg:top-24 lg:self-start"
          />
          <div className="max-w-[40rem]">
            <Accordion items={ITEMS} defaultOpen="genuine" />
          </div>
        </div>
      </Container>
    </Section>
  )
}
