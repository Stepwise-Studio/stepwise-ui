# Drawer

A panel that slides in from any edge of the screen.

## Install

```bash
npx stepwise-ui add drawer
```

Exports: `Drawer`

## Usage

```tsx
import { Drawer } from '@/components/stepwise/drawer'

const [open, setOpen] = useState(false)

<Drawer open={open} onClose={() => setOpen(false)} side="right" title="Settings">
  <p>Drawer content here.</p>
</Drawer>
```

## What gets written

- `components/stepwise/drawer.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/utils/cn.ts`

npm packages: `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/drawer
Whole library as text: https://ui.stepwise.studio/llms.txt
