# Popover

A generic floating panel anchored to a trigger - put any content inside.

## Install

```bash
npx stepwise-ui add popover
```

Exports: `Popover`

## Usage

```tsx
import { Popover } from '@/components/stepwise/popover'

<Popover trigger={<Button>Open popover</Button>}>
  <div className="flex flex-col gap-3">
    <Input label="" aria-label="Project name" placeholder="stepwise-ui" />
    <Button size="sm" fullWidth>Save</Button>
  </div>
</Popover>
```

## What gets written

- `components/stepwise/popover.tsx`
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

Full page: https://ui.stepwise.studio/docs/popover
Whole library as text: https://ui.stepwise.studio/llms.txt
