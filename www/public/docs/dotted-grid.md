# Dotted Grid

A static dot grid for section backgrounds.

## Install

```bash
npx stepwise-ui add dotted-grid
```

Exports: `DottedGrid`

## Usage

```tsx
import { DottedGrid } from '@/components/stepwise/dotted-grid'

<div className="relative h-64">
  <DottedGrid />
</div>
```

## What gets written

- `components/stepwise/dotted-grid.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/dotted-grid
Whole library as text: https://ui.stepwise.studio/llms.txt
