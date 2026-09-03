# Multiselect

Multi-option selector with removable pills in the trigger for selected values.

## Install

```bash
npx stepwise-ui add multiselect
```

Exports: `Multiselect`

## Usage

```tsx
import { Multiselect } from '@/components/stepwise/multiselect'

const options = [
  { value: 'vanilla',   label: 'Vanilla' },
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'pistachio', label: 'Pistachio' },
]

<Multiselect options={options} placeholder="Choose flavors" />
```

## What gets written

- `components/stepwise/multiselect.tsx`
- `components/stepwise/primitives/chevron.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/theme.tsx`
- `lib/utils/cn.ts`

Also installs: [scroll-area](https://ui.stepwise.studio/docs/scroll-area.md)

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `iconsax-react`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/multiselect
Whole library as text: https://ui.stepwise.studio/llms.txt
