# Frame

The raw, unopinionated content container - the base every other card builds on.

## Install

```bash
npx stepwise-ui add frame
```

Exports: `Frame`, `FrameContent`, `FrameDescription`, `FrameFooter`, `FrameHeader`, `FrameTitle`

## Usage

```tsx
import { Frame } from '@/components/stepwise/frame'

// raw building block - reach for it when nothing else fits: settings rows,
// list items, one-off content blocks. For a pre-built shape, use Profile
// Card, Product Card, Pricing Card, or Stat Card instead.
<Frame className="p-5">
  Whatever you want goes here.
</Frame>
```

## What gets written

- `components/stepwise/frame.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/utils/cn.ts`

npm packages: `@lisse/react`, `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/frame
Whole library as text: https://ui.stepwise.studio/llms.txt
