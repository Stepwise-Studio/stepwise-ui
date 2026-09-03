# Toast

Global notification toasts in four types - success, warning, error, and info.

## Install

```bash
npx stepwise-ui add toast
```

Exports: `Toaster`, `toast`

## Usage

```tsx
// Add <Toaster /> once at your app root (e.g. layout.tsx)
import { Toaster } from '@/components/stepwise/toast'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
```

## What gets written

- `components/stepwise/toast.tsx`

npm packages: `iconsax-react`, `motion`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/toast
Whole library as text: https://ui.stepwise.studio/llms.txt
