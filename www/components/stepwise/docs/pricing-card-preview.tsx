'use client'

import { PricingCard } from '@/components/stepwise/pricing-card'

const SOLO_FEATURES = [
  { label: 'User Management' },
  { label: 'Analytics Dashboard' },
  { label: 'Automated Reporting' },
  { label: 'Integrations with Third-Party Apps' },
  { label: 'Custom API Development', included: false },
  { label: 'Real-Time Data Syncing', included: false },
  { label: 'User Authentication and Security', included: false },
]

const TEAM_FEATURES = [
  { label: 'User Management' },
  { label: 'Analytics Dashboard' },
  { label: 'Automated Reporting' },
  { label: 'Integrations with Third-Party Apps' },
  { label: 'Custom API Development' },
  { label: 'Real-Time Data Syncing' },
  { label: 'User Authentication and Security' },
]

export function PricingCardStandardFlatPreview() {
  return (
    <PricingCard
      planName="Solo"
      description="Perfect for individuals looking to get started!"
      price={25}
      features={SOLO_FEATURES}
    />
  )
}

export function PricingCardStandardFramedPreview() {
  return (
    <PricingCard
      planName="Solo"
      description="Perfect for individuals looking to get started!"
      price={25}
      surface="framed"
      features={SOLO_FEATURES}
    />
  )
}

export function PricingCardPopularFlatPreview() {
  return (
    <PricingCard
      planName="Team"
      description="Perfect for a team of minimum 4"
      price={20}
      period="/month/seat"
      highlighted
      features={TEAM_FEATURES}
    />
  )
}

export function PricingCardPopularFramedPreview() {
  return (
    <PricingCard
      planName="Team"
      description="Perfect for a team of minimum 4"
      price={20}
      period="/month/seat"
      highlighted
      surface="framed"
      features={TEAM_FEATURES}
    />
  )
}
