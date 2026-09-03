# Color Swatch

A row of color circles with a single active selection - the ring springs between swatches as you pick.

## Install

```bash
npx stepwise-ui add color-swatch
```

Exports: `ColorSwatch`

## Usage

```tsx
import { ColorSwatch } from '@/components/stepwise/color-swatch'

const [color, setColor] = useState('#3b82f6')

<ColorSwatch
  colors={['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']}
  value={color}
  onChange={setColor}
/>
```

## What gets written

- `components/stepwise/color-swatch.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/color-swatch
Whole library as text: https://ui.stepwise.studio/llms.txt
