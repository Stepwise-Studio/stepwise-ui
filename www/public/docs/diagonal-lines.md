# Diagonal Lines

Diagonal hairlines for section backgrounds, leaning left or right.

## Install

```bash
npx stepwise-ui add diagonal-lines
```

Exports: `DiagonalLines`

## Usage

```tsx
import { DiagonalLines } from '@/components/stepwise/diagonal-lines'

<div className="relative h-64">
  <DiagonalLines />
</div>
```

## What gets written

- `components/stepwise/diagonal-lines.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/diagonal-lines
Whole library as text: https://ui.stepwise.studio/llms.txt
