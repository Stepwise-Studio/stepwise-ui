import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  PricingCardStandardFlatPreview,
  PricingCardStandardFramedPreview,
  PricingCardPopularFlatPreview,
  PricingCardPopularFramedPreview,
} from '@/components/stepwise/docs/pricing-card-preview'

const standardFlatCode = `import { PricingCard } from '@/components/stepwise/pricing-card'

<PricingCard
  planName="Solo"
  description="Perfect for individuals looking to get started!"
  price={25}
  features={[
    { label: 'User Management' },
    { label: 'Analytics Dashboard' },
    { label: 'Automated Reporting' },
    { label: 'Custom API Development', included: false },
  ]}
/>`

const standardFramedCode = `<PricingCard
  planName="Solo"
  description="Perfect for individuals looking to get started!"
  price={25}
  surface="framed"
  features={[
    { label: 'User Management' },
    { label: 'Analytics Dashboard' },
    { label: 'Automated Reporting' },
    { label: 'Custom API Development', included: false },
  ]}
/>`

const popularFlatCode = `<PricingCard
  planName="Team"
  description="Perfect for a team of minimum 4"
  price={20}
  period="/month/seat"
  highlighted
  features={[
    { label: 'User Management' },
    { label: 'Analytics Dashboard' },
    { label: 'Automated Reporting' },
    { label: 'User Authentication and Security' },
  ]}
/>`

const popularFramedCode = `<PricingCard
  planName="Team"
  description="Perfect for a team of minimum 4"
  price={20}
  period="/month/seat"
  highlighted
  surface="framed"
  features={[
    { label: 'User Management' },
    { label: 'Analytics Dashboard' },
    { label: 'Automated Reporting' },
    { label: 'User Authentication and Security' },
  ]}
/>`

const toc = [
  { id: 'standard-flat',   label: 'Standard - Flat',        child: false },
  { id: 'standard-framed', label: 'Standard - Framed',      child: false },
  { id: 'popular-flat',    label: 'Most Popular - Flat',    child: false },
  { id: 'popular-framed',  label: 'Most Popular - Framed',  child: false },
  { id: 'props',           label: 'Props',                  child: false },
]

export default function PricingCardPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Pricing Card</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A subscription tier card with a gradient price and a tick/dash feature list. Pass{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">highlighted</code> for
            the recommended-tier treatment - the header inverts to the opposite polarity of the page and the CTA
            becomes a <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">GlowButton</code>.
            Either surface style, <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">surface="flat"</code> or{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">surface="framed"</code>,
            works with either tier.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add pricing-card" />
        </section>

        <section id="standard-flat" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Standard - Flat</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            One uniform surface, and the CTA is a regular slide-icon <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Button</code>.
          </Text>
          <PreviewCode
            minHeight={560}
            preview={<PricingCardStandardFlatPreview />}
            code={<CodeBlock code={standardFlatCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="standard-framed" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Standard - Framed</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Same tier, <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">surface="framed"</code> insets
            the header in its own panel with a thin outer frame.
          </Text>
          <PreviewCode
            minHeight={560}
            preview={<PricingCardStandardFramedPreview />}
            code={<CodeBlock code={standardFramedCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="popular-flat" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Most Popular - Flat</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">highlighted</code> inverts
            the header and swaps the CTA for a <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">GlowButton</code>.
          </Text>
          <PreviewCode
            minHeight={560}
            preview={<PricingCardPopularFlatPreview />}
            code={<CodeBlock code={popularFlatCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="popular-framed" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Most Popular - Framed</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            The recommended-tier treatment with the framed surface.
          </Text>
          <PreviewCode
            minHeight={560}
            preview={<PricingCardPopularFramedPreview />}
            code={<CodeBlock code={popularFramedCode} lang="tsx" className="rounded-none" flat />}
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
            { name: 'features',    type: 'PricingFeature[]',   desc: '{ label, included? } - included defaults true; false dashes and mutes it.' },
            { name: 'ctaLabel',    type: 'string',             desc: 'CTA button label. Default "Upgrade now".' },
            { name: 'onCta',       type: '() => void',         desc: 'CTA click handler.' },
            { name: 'highlighted', type: 'boolean',            desc: 'The recommended-tier treatment - header inverts, CTA becomes a GlowButton.' },
            { name: 'surface',     type: '"flat" | "framed"',  desc: '"flat" - one uniform surface (default). "framed" - the header sits in its own inset panel with a thin outer frame.' },
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
