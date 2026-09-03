# Shimmer Text

A CSS-only shimmer for thinking and loading states.

## Install

```bash
npx stepwise-ui add shimmer-text
```

Exports: `ShimmerText`

## Usage

```tsx
import { ShimmerText } from '@/components/stepwise/shimmer-text'

// The AI "thinking / generating" label - a highlight band
// sweeps across muted text on an infinite loop. Pure CSS.
<ShimmerText>Generating response…</ShimmerText>

// Tune the sweep speed (seconds)
<ShimmerText duration={1.4}>Summarizing sources</ShimmerText>
```

## What gets written

- `components/stepwise/shimmer-text.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/shimmer-text
Whole library as text: https://ui.stepwise.studio/llms.txt
