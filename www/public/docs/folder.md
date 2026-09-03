# Folder

A tactile folder - unified skeleton cards (or your own photos) tuck behind a frosted-glass front pocket.

## Install

```bash
npx stepwise-ui add folder
```

Exports: `Folder`, `SkeletonCard`

## Usage

```tsx
import { Folder } from '@/components/stepwise/folder'
import { Image02Icon } from '@hugeicons/core-free-icons'

// peek={0} → an empty folder; peek={3} (default) → filled
<Folder label="Japan 2024" count="83 photos" icon={Image02Icon} peek={3} />
```

## What gets written

- `components/stepwise/folder.tsx`
- `lib/utils/cn.ts`

Also installs: [tooltip](https://ui.stepwise.studio/docs/tooltip.md)

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/folder
Whole library as text: https://ui.stepwise.studio/llms.txt
