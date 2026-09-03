# Dot Grid Loader

A 3×3 grid of animated dots, in four rhythms.

## Install

```bash
npx stepwise-ui add dot-grid-loader
```

Exports: `DotGridLoader`

## Usage

```tsx
import { DotGridLoader } from '@/components/stepwise/dot-grid-loader'

<DotGridLoader pattern="wave" />
```

## What gets written

- `components/stepwise/dot-grid-loader.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/dot-grid-loader
Whole library as text: https://ui.stepwise.studio/llms.txt
