# Fade Text

Fades text in and out, word by word or character by character.

## Install

```bash
npx stepwise-ui add fade-text
```

Exports: `FadeText`

## Usage

```tsx
import { FadeText } from '@/components/stepwise/fade-text'

// Fades in word by word on mount (blurred rise, staggered)
<FadeText>Ship delightful interfaces faster</FadeText>

// Toggle \
```

## What gets written

- `components/stepwise/fade-text.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/fade-text
Whole library as text: https://ui.stepwise.studio/llms.txt
