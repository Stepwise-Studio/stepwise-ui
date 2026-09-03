# Slider

An inline field slider: a labelled squircle row with a thin handle and the live value, matching Input's corner radius and smoothing.

## Install

```bash
npx stepwise-ui add slider
```

Exports: `Slider`

## Usage

```tsx
import { Slider } from '@/components/stepwise/slider'

const [width, setWidth] = useState(40)

<Slider label="Width" value={width} onChange={setWidth} min={0} max={100} />
```

## What gets written

- `components/stepwise/primitives/surface.tsx`
- `components/stepwise/slider.tsx`
- `lib/utils/cn.ts`

npm packages: `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/slider
Whole library as text: https://ui.stepwise.studio/llms.txt
