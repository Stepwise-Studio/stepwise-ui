# Color Picker

A saturation and value field over a hue rail, with an eyedropper for sampling colours already on the page.

## Install

```bash
npx stepwise-ui add color-picker
```

Exports: `ColorPicker`

## Usage

```tsx
import { ColorPicker } from '@/components/stepwise/color-picker'

const [color, setColor] = useState('#3b82f6')

<ColorPicker value={color} onChange={setColor} />
```

## What gets written

- `components/stepwise/color-picker.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/utils/cn.ts`

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/color-picker
Whole library as text: https://ui.stepwise.studio/llms.txt
