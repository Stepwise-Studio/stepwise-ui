# Apple Select

An iOS-style text highlight with a translucent band and a lollipop handle at each end.

## Install

```bash
npx stepwise-ui add apple-select
```

Exports: `APPLE_ACCENTS`, `AppleSelect`

## Usage

```tsx
import { AppleSelect } from '@/components/stepwise/apple-select'

// the author picks the highlighted range - it's fixed, not draggable
<AppleSelect
  text="Introduced with iOS 3 in June 2009 was the ability to select…"
  selection={[43, 60]}
/>
```

## What gets written

- `components/stepwise/apple-select.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/apple-select
Whole library as text: https://ui.stepwise.studio/llms.txt
