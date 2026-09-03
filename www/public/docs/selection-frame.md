# Selection Frame

That box Figma draws around a selected frame - corner handles and a crisp accent stroke.

## Install

```bash
npx stepwise-ui add selection-frame
```

Exports: `SelectionFrame`

## Usage

```tsx
import { SelectionFrame } from '@/components/stepwise/selection-frame'

<SelectionFrame padding={6}>
  <span className="text-[28px] font-semibold">Consistent by Default</span>
</SelectionFrame>
```

## What gets written

- `components/stepwise/selection-frame.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/selection-frame
Whole library as text: https://ui.stepwise.studio/llms.txt
