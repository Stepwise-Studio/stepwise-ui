# Zigzag Lines

A zig-zag line pattern for section backgrounds.

## Install

```bash
npx stepwise-ui add zigzag-lines
```

Exports: `ZigzagLines`

## Usage

```tsx
import { ZigzagLines } from '@/components/stepwise/zigzag-lines'

<div className="relative h-64">
  <ZigzagLines />
</div>
```

## What gets written

- `components/stepwise/zigzag-lines.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/zigzag-lines
Whole library as text: https://ui.stepwise.studio/llms.txt
