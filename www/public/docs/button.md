# Button

Squircle button in three sizes and five variants.

## Install

```bash
npx stepwise-ui add button
```

Exports: `Button`

## Usage

```tsx
import { Button } from '@/components/stepwise/button'

<Button variant="solid">solid</Button>
<Button variant="outline">outline</Button>
<Button variant="ghost">ghost</Button>
<Button variant="soft">soft</Button>
<Button variant="destructive">destructive</Button>
```

## What gets written

- `components/stepwise/button.tsx`
- `lib/theme.tsx`
- `lib/utils/cn.ts`

npm packages: `@lisse/react`, `class-variance-authority`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/button
Whole library as text: https://ui.stepwise.studio/llms.txt
