# Tooltip

A lightweight, edge-aware tooltip that flips placement automatically when it would clip against the viewport.

## Install

```bash
npx stepwise-ui add tooltip
```

Exports: `Tooltip`

## Usage

```tsx
import { Tooltip } from '@/components/stepwise/tooltip'

// Basic - top by default
<Tooltip content="Save to cloud">
  <button>Save</button>
</Tooltip>

// Explicit side
<Tooltip content="Opens settings panel" side="right">
  <IconButton icon={<Settings />} />
</Tooltip>

// Flips automatically near viewport edges
<Tooltip content="Left-aligned but flips right near the edge" side="left">
  <button>Hover me</button>
</Tooltip>

// Rich content
<Tooltip content={<span>Press <kbd>⌘K</kbd> to open</span>} side="bottom">
  <button>Keyboard shortcut</button>
</Tooltip>
```

## What gets written

- `components/stepwise/primitives/surface.tsx`
- `components/stepwise/tooltip.tsx`
- `lib/utils/cn.ts`

npm packages: `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/tooltip
Whole library as text: https://ui.stepwise.studio/llms.txt
