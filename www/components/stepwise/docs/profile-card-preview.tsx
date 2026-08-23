'use client'

import { ProfileCard } from '@/components/stepwise/profile-card'

const STATS = [
  { label: 'Client Works',   value: '5'   },
  { label: 'Posts Drafted',  value: '100' },
  { label: 'Ongoing Tasks',  value: '20'  },
]

export function ProfileCardDefaultPreview() {
  return (
    <ProfileCard
      variant="default"
      name="Snoofy Ackerman"
      verified
      role="Marketing Agent"
      bio="Snoofy is a digital assistant which can help you with drafting social media posts, scheduling them across every platform, and also tracking how they perform for you!"
      stats={STATS}
      ctaLabel="Get in touch"
    />
  )
}

export function ProfileCardCompactPreview() {
  return (
    <ProfileCard
      variant="compact"
      name="Snoofy Ackerman"
      verified
      role="Marketing Agent"
      bio="Snoofy is a digital assistant which can help you with drafting social media posts, scheduling them across every platform, and also tracking how they perform for you!"
      stats={STATS}
      ctaLabel="Get in touch"
    />
  )
}
