# Scale

A ruler-tick strip - diagonal hairlines at a fixed pitch.

## Install

```bash
npx stepwise-ui add scale
```

Exports: `Scale`

## Usage

```tsx
import { Scale } from '@/components/stepwise/scale'

// thickness sets the strip's height in px. --pattern sets the line colour and
// is optional - Scale ships a neutral grey that works on either theme.
<Scale orientation="horizontal" thickness={24} />

// Or pick your own line colour
<Scale orientation="horizontal" thickness={24} style={{ '--pattern': '#d4d4d8' }} />
```

## What gets written

- `components/stepwise/scale.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/scale
Whole library as text: https://ui.stepwise.studio/llms.txt
