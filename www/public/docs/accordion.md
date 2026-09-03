# Accordion

Collapsible panels with spring-eased height animation and a rotating chevron.

## Install

```bash
npx stepwise-ui add accordion
```

Exports: `Accordion`

## Usage

```tsx
import { Accordion } from '@/components/stepwise/accordion'

const items = [
  { id: 'q1', title: 'Why does this exist?', content: 'Because we rebuilt the same…' },
  { id: 'q2', title: 'How long did this take?', content: 'Longer than planned…' },
]

<Accordion items={items} />
```

## What gets written

- `components/stepwise/accordion.tsx`
- `components/stepwise/primitives/chevron.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/utils/cn.ts`

Also installs: [typography](https://ui.stepwise.studio/docs/typography.md)

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/accordion
Whole library as text: https://ui.stepwise.studio/llms.txt
