# Spinner

A circular spinner that resolves into a tick or a cross when it finishes.

## Install

```bash
npx stepwise-ui add spinner
```

Exports: `SPINNER_ARC_DURATION`, `Spinner`

## Usage

```tsx
import { Spinner } from '@/components/stepwise/spinner'

// "arc" is the default - a general-purpose spinner for any surface
<Spinner size="sm" />
<Spinner size="default" />
<Spinner size="lg" />
```

## What gets written

- `components/stepwise/spinner.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/spinner
Whole library as text: https://ui.stepwise.studio/llms.txt
