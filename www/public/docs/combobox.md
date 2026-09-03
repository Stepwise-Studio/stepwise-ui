# Combobox

A dropdown you can type into.

## Install

```bash
npx stepwise-ui add combobox
```

Exports: `Combobox`

## Usage

```tsx
import { Combobox } from '@/components/stepwise/combobox'

const options = [
  { value: 'next',  label: 'Next.js', description: 'The React framework for the web' },
  { value: 'remix', label: 'Remix',   description: 'Full stack web framework' },
]

<Combobox
  label="Framework"
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Search frameworks…"
/>
```

## What gets written

- `components/stepwise/combobox.tsx`
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

Full page: https://ui.stepwise.studio/docs/combobox
Whole library as text: https://ui.stepwise.studio/llms.txt
