# Arc Carousel

A continuously drifting strip of photographs riding a shallow arc.

## Install

```bash
npx stepwise-ui add arc-carousel
```

Exports: `ArcCarousel`

## Usage

```tsx
import { ArcCarousel } from '@/components/stepwise/arc-carousel'

<ArcCarousel items={photos} />
```

## What gets written

- `components/stepwise/arc-carousel.tsx`
- `lib/utils/cn.ts`

Also installs: [frame](https://ui.stepwise.studio/docs/frame.md)

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/arc-carousel
Whole library as text: https://ui.stepwise.studio/llms.txt
