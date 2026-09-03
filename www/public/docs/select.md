# Select

Single-option selector with an input-like trigger and a floating panel below it, matching Combobox.

## Install

```bash
npx stepwise-ui add select
```

Exports: `Select`

## Usage

```tsx
import { Select } from '@/components/stepwise/select'

const options = [
  { value: 'next',    label: 'Next.js' },
  { value: 'remix',   label: 'Remix' },
  { value: 'astro',   label: 'Astro' },
]

<Select options={options} placeholder="Choose a framework" />
```

## What gets written

- `components/stepwise/primitives/chevron.tsx`
- `components/stepwise/primitives/surface.tsx`
- `components/stepwise/select.tsx`
- `lib/theme.tsx`
- `lib/utils/cn.ts`

Also installs: [scroll-area](https://ui.stepwise.studio/docs/scroll-area.md)

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/select
Whole library as text: https://ui.stepwise.studio/llms.txt
