# Typography

A semantic type scale built on Inter Display.

## Install

```bash
npx stepwise-ui add typography
```

Exports: `Text`

## Usage

```tsx
import { Text } from '@/components/stepwise/typography'
```

## What gets written

- `components/stepwise/typography.tsx`
- `lib/utils/cn.ts`
- `components/stepwise/fonts.css`
- `fonts/LICENSE-Inter.txt`
- `fonts/InterDisplay-Regular.woff2`
- `fonts/InterDisplay-Medium.woff2`
- `fonts/InterDisplay-SemiBold.woff2`
- `fonts/InterDisplay-Bold.woff2`

npm packages: `class-variance-authority`, `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/typography
Whole library as text: https://ui.stepwise.studio/llms.txt
