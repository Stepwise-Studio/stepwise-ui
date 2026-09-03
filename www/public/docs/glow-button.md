# Glow Button

A CTA button with a colour glow drifting along the inside of its bottom edge.

## Install

```bash
npx stepwise-ui add glow-button
```

Exports: `GlowButton`

## Usage

```tsx
import { GlowButton } from '@/components/stepwise/glow-button'

<GlowButton>Install on Figma</GlowButton>
```

## What gets written

- `components/stepwise/glow-button.tsx`
- `lib/theme.tsx`
- `lib/utils/cn.ts`

npm packages: `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/glow-button
Whole library as text: https://ui.stepwise.studio/llms.txt
