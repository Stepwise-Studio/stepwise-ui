# Scroll Area

A scroll container that hides the scrollbar by default, or renders a slim custom one.

## Install

```bash
npx stepwise-ui add scroll-area
```

Exports: `ScrollArea`

## Usage

```tsx
import { ScrollArea } from '@/components/stepwise/scroll-area'

<ScrollArea maxHeight={220} showScrollbar className="w-[240px] …">
  {items.map(item => <Row key={item} />)}
</ScrollArea>
```

## What gets written

- `components/stepwise/scroll-area.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/scroll-area
Whole library as text: https://ui.stepwise.studio/llms.txt
