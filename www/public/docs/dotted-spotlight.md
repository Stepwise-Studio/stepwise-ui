# Dotted Spotlight

A dot grid with a mouse-follow flashlight - dots brighten near the cursor.

## Install

```bash
npx stepwise-ui add dotted-spotlight
```

Exports: `DottedSpotlight`

## Usage

```tsx
import { DottedSpotlight } from '@/components/stepwise/dotted-spotlight'

<div className="relative h-64">
  <DottedSpotlight />
</div>
```

## What gets written

- `components/stepwise/dotted-spotlight.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/dotted-spotlight
Whole library as text: https://ui.stepwise.studio/llms.txt
