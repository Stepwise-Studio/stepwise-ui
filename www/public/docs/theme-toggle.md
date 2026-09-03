# Theme Toggle

A button that switches between light and dark mode with a circular expand view-transition animation and cross-fading icon swap.

## Install

```bash
npx stepwise-ui add theme-toggle
```

Exports: `ThemeToggle`

## Usage

```tsx
import { ThemeToggle } from '@/components/stepwise/theme-toggle'

export default function MyLayout({ children }) {
  return (
    <header className="flex items-center justify-between px-4 h-14">
      <Logo />
      <ThemeToggle />
    </header>
  )
}
```

## What gets written

- `components/stepwise/theme-toggle.tsx`
- `lib/theme.tsx`
- `lib/utils/cn.ts`

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/theme-toggle
Whole library as text: https://ui.stepwise.studio/llms.txt
