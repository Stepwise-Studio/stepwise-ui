# Profile Card

A profile card for a person or an agent, in a full banner variant and a compact row.

## Install

```bash
npx stepwise-ui add profile-card
```

Exports: `ProfileCard`

## Usage

```tsx
import { ProfileCard } from '@/components/stepwise/profile-card'

<ProfileCard
  variant="default"
  bannerSrc="/banner.jpg"
  avatarSrc="/your-photo.jpg"
  name="Snoofy Ackerman"
  verified
  role="Marketing Agent"
  bio="Snoofy is a digital assistant…"
  stats={[
    { label: 'Client Works',  value: '5'   },
    { label: 'Posts Drafted', value: '100' },
    { label: 'Ongoing Tasks', value: '20'  },
  ]}
  ctaLabel="Get in touch"
/>
```

## What gets written

- `components/stepwise/profile-card.tsx`
- `lib/utils/cn.ts`

Also installs: [avatar](https://ui.stepwise.studio/docs/avatar.md), [button](https://ui.stepwise.studio/docs/button.md), [frame](https://ui.stepwise.studio/docs/frame.md)

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/profile-card
Whole library as text: https://ui.stepwise.studio/llms.txt
