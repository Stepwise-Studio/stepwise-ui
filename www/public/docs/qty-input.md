# Qty Input

A compact +/− stepper for cart quantities, numeric settings, or any bounded integer.

## Install

```bash
npx stepwise-ui add qty-input
```

Exports: `QtyInput`

## Usage

```tsx
import { QtyInput } from '@/components/stepwise/qty-input'

const [qty, setQty] = useState(1)

<QtyInput value={qty} onChange={setQty} min={1} max={99} />
```

## What gets written

- `components/stepwise/primitives/surface.tsx`
- `components/stepwise/qty-input.tsx`
- `lib/utils/cn.ts`

npm packages: `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/qty-input
Whole library as text: https://ui.stepwise.studio/llms.txt
