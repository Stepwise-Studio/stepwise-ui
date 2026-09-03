# Breadcrumbs

A navigation trail that collapses its middle into a menu once the path gets deep.

## Install

```bash
npx stepwise-ui add breadcrumbs
```

Exports: `Breadcrumbs`

## Usage

```tsx
import { Breadcrumbs } from '@/components/stepwise/breadcrumbs'

// \
```

## What gets written

- `components/stepwise/breadcrumbs.tsx`
- `lib/utils/cn.ts`

Also installs: [dropdown-menu](https://ui.stepwise.studio/docs/dropdown-menu.md)

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/breadcrumbs
Whole library as text: https://ui.stepwise.studio/llms.txt
