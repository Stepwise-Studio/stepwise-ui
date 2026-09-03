# Separator

A thin divider between content.

## Install

```bash
npx stepwise-ui add separator
```

Exports: `Separator`

## Usage

```tsx
import { Separator } from '@/components/stepwise/separator'

<Separator />
```

## What gets written

- `components/stepwise/separator.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/separator
Whole library as text: https://ui.stepwise.studio/llms.txt
