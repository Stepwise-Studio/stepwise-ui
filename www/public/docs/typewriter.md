# Typewriter

Types a string out character by character with a blinking caret.

## Install

```bash
npx stepwise-ui add typewriter
```

Exports: `Typewriter`

## Usage

```tsx
import { Typewriter } from '@/components/stepwise/typewriter'

// Cycle a list: type → hold → backspace → next (loops)
We build{' '}
<Typewriter words={['design systems', 'component libraries', 'delightful UIs']} />

// A single string types once and holds, caret keeps blinking
<Typewriter words="Hello, world" />
```

## What gets written

- `components/stepwise/typewriter.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/typewriter
Whole library as text: https://ui.stepwise.studio/llms.txt
