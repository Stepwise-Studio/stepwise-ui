import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { PricingCardTiersPreview } from '@/components/stepwise/docs/pricing-card-preview'

const code = `import { PricingCard } from '@/components/stepwise/pricing-card'

<PricingCard
  planName="Pro"
  description="For teams shipping to production."
  price={29}
  badge="Most popular"
  highlighted
  ctaLabel="Start free trial"
  features={[
    { label: 'Unlimited projects' },
    { label: 'Priority support' },
    { label: 'Custom domains' },
    { label: 'Up to 10 team seats' },
  ]}
/>`

const toc = [
  { id: 'tiers', label: 'Tiers', child: false },
  { id: 'props', label: 'Props', child: false },
]

export default function PricingCardPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Pricing Card</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A subscription tier card with two looks: plain, and the recommended-tier
            treatment. Pass <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">highlighted</code> to
            invert the card to the opposite polarity of the page and trace its edge with a glow.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add pricing-card" />
        </section>

        <section id="tiers" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Tiers</Text>
          <PreviewCode
            minHeight={560}
            preview={<PricingCardTiersPreview />}
            code={<CodeBlock code={code} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'planName',    type: 'string',            desc: 'Plan name.' },
            { name: 'price',       type: 'number | string',   desc: 'Numeric price, or a string like "Custom".' },
            { name: 'period',      type: 'string',             desc: 'Shown after the price. Default "/month".' },
            { name: 'currency',    type: 'string',             desc: 'Currency symbol. Default "$".' },
            { name: 'description', type: 'string',             desc: 'One-line plan summary.' },
            { name: 'features',    type: 'PricingFeature[]',   desc: '{ label, included? } — included defaults true; false strikes it through.' },
            { name: 'ctaLabel',    type: 'string',             desc: 'CTA button label. Default "Get started".' },
            { name: 'onCta',       type: '() => void',         desc: 'CTA click handler.' },
            { name: 'highlighted', type: 'boolean',            desc: 'The recommended-tier treatment — inverts the card, adds a rainbow border glow.' },
            { name: 'badge',       type: 'string',             desc: 'Dot chip next to the plan name, e.g. "Most popular".' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
