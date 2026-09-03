# Checkbox

Squircle checkbox in three sizes.

## Install

```bash
npx stepwise-ui add checkbox
```

Exports: `Checkbox`

## Usage

```tsx
import { Checkbox } from '@/components/stepwise/checkbox'

<Checkbox label="Unchecked" />
<Checkbox label="Checked" defaultChecked />
<Checkbox label="Indeterminate" indeterminate />
```

## What gets written

- `components/stepwise/checkbox.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/checkbox
Whole library as text: https://ui.stepwise.studio/llms.txt
