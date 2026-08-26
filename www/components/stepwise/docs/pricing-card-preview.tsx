'use client'

import { PricingCard } from '@/components/stepwise/pricing-card'

export function PricingCardTiersPreview() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-6 py-4">
      <PricingCard
        planName="Starter"
        description="For solo builders trying things out."
        price={0}
        period="/forever"
        ctaLabel="Start for free"
        features={[
          { label: 'Up to 3 projects' },
          { label: 'Community support' },
          { label: 'Custom domains', included: false },
          { label: 'Team seats', included: false },
        ]}
      />
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
      />
    </div>
  )
}
