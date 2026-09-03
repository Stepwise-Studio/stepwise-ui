# Progress

A linear progress bar.

## Install

```bash
npx stepwise-ui add progress
```

Exports: `Progress`

## Usage

```tsx
import { Progress } from '@/components/stepwise/progress'

// animates the fill on value change - pass aria-label (or label) when
// nothing else on the page already says what's loading
<Progress value={progress} aria-label="Loading" />
```

## What gets written

- `components/stepwise/progress.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/progress
Whole library as text: https://ui.stepwise.studio/llms.txt
