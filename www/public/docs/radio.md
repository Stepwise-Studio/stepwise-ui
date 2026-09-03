# Radio

Squircle radio button in three sizes.

## Install

```bash
npx stepwise-ui add radio
```

Exports: `Radio`

## Usage

```tsx
import { Radio } from '@/components/stepwise/radio'

<Radio label="Unchecked" />
<Radio label="Checked" defaultChecked />
```

## What gets written

- `components/stepwise/radio.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/radio
Whole library as text: https://ui.stepwise.studio/llms.txt
