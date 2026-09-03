# Avatar

Circular user representation in two variants - a neutral-fill initial, or a photo.

## Install

```bash
npx stepwise-ui add avatar
```

Exports: `Avatar`, `AvatarGroup`

## Usage

```tsx
import { Avatar } from '@/components/stepwise/avatar'

<Avatar name="Asta" />                    // default
<Avatar name="Asta" src="/photo.jpg" />   // image
```

## What gets written

- `components/stepwise/avatar.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/utils/cn.ts`

Also installs: [fade-text](https://ui.stepwise.studio/docs/fade-text.md), [tooltip](https://ui.stepwise.studio/docs/tooltip.md)

npm packages: `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/avatar
Whole library as text: https://ui.stepwise.studio/llms.txt
