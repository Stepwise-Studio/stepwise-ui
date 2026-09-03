# Circle Annotation

A hand-drawn circle scribbled around the text with generous inner padding, drawn on when scrolled into view.

## Install

```bash
npx stepwise-ui add circle-annotation
```

Exports: `CircleAnnotation`

## Usage

```tsx
import { CircleAnnotation } from '@/components/stepwise/circle-annotation'

// Scribbles a hand-drawn circle around the text when in view
Every detail is <CircleAnnotation color="#e11d48">intentional</CircleAnnotation>.

// More breathing room + slower draw
<CircleAnnotation color="#0284c7" padding={18} duration={1.4} delay={0.3}>
  reviewed
</CircleAnnotation>
```

## What gets written

- `components/stepwise/circle-annotation.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `roughjs`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/circle-annotation
Whole library as text: https://ui.stepwise.studio/llms.txt
