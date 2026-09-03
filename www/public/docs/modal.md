# Modal

A confirmation dialog that blocks the page until the user makes a choice.

## Install

```bash
npx stepwise-ui add modal
```

Exports: `Modal`

## Usage

```tsx
import { Modal } from '@/components/stepwise/modal'

const [open, setOpen] = useState(false)

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Save changes?"
  description="Saving will update your published content immediately."
  confirmLabel="Save changes"
  onConfirm={() => { /* ... */ setOpen(false) }}
/>
```

## What gets written

- `components/stepwise/modal.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/utils/cn.ts`

Also installs: [button](https://ui.stepwise.studio/docs/button.md)

npm packages: `@lisse/react`, `clsx`, `iconsax-react`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/modal
Whole library as text: https://ui.stepwise.studio/llms.txt
