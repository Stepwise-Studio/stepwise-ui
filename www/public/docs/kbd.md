# Kbd

A keyboard key cap.

## Install

```bash
npx stepwise-ui add kbd
```

Exports: `Kbd`

## Usage

```tsx
import { Kbd } from '@/components/stepwise/kbd'

<Kbd keys={['⌘', 'K']} />
<Kbd keys={['⌘', '⇧', 'P']} />
<Kbd>Esc</Kbd>
```

## What gets written

- `components/stepwise/kbd.tsx`
- `lib/utils/cn.ts`

npm packages: `@lisse/react`, `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/kbd
Whole library as text: https://ui.stepwise.studio/llms.txt
