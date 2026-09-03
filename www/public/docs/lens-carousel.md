# Lens Carousel

Photographs pinched by a lens across the row: full size at either rim, smallest through the middle.

## Install

```bash
npx stepwise-ui add lens-carousel
```

Exports: `LensCarousel`

## Usage

```tsx
import { LensCarousel } from '@/components/stepwise/lens-carousel'

<LensCarousel items={photos} />
```

## What gets written

- `components/stepwise/lens-carousel.tsx`
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

Full page: https://ui.stepwise.studio/docs/lens-carousel
Whole library as text: https://ui.stepwise.studio/llms.txt
