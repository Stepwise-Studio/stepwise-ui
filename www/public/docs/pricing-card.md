# Pricing Card

A subscription tier card with a gradient price and a tick/dash feature list.

## Install

```bash
npx stepwise-ui add pricing-card
```

Exports: `PricingCard`

## Usage

```tsx
import { PricingCard } from '@/components/stepwise/pricing-card'

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
/>
```

## What gets written

- `components/stepwise/pricing-card.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/utils/cn.ts`

Also installs: [button](https://ui.stepwise.studio/docs/button.md), [chip](https://ui.stepwise.studio/docs/chip.md), [glow-button](https://ui.stepwise.studio/docs/glow-button.md)

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/pricing-card
Whole library as text: https://ui.stepwise.studio/llms.txt
