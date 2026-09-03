# Squiggly Underline

A hand-drawn, wavy underline that draws itself on when scrolled into view.

## Install

```bash
npx stepwise-ui add squiggly-underline
```

Exports: `SquigglyUnderline`

## Usage

```tsx
import { SquigglyUnderline } from '@/components/stepwise/squiggly-underline'

// Draws a wavy underline on when it scrolls into view - color tints text + stroke
The <SquigglyUnderline color="#e11d48">most important</SquigglyUnderline> detail.

// Tune the wave + draw speed (wave metrics scale from font size by default)
<SquigglyUnderline duration={1.2} delay={0.25} replayInView>
  emphasis
</SquigglyUnderline>
```

## What gets written

- `components/stepwise/squiggly-underline.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/squiggly-underline
Whole library as text: https://ui.stepwise.studio/llms.txt
