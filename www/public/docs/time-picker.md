# Time Picker

A field that matches Input, opening a split readout with snap columns and a sliding AM/PM control.

## Install

```bash
npx stepwise-ui add time-picker
```

Exports: `TimePicker`

## Usage

```tsx
import { TimePicker } from '@/components/stepwise/time-picker'

const [time, setTime] = useState('09:30')

// value is always 24h "HH:mm", whatever the display format
<TimePicker label="Start time" value={time} onChange={setTime} />
```

## What gets written

- `components/stepwise/primitives/surface.tsx`
- `components/stepwise/time-picker.tsx`
- `lib/theme.tsx`
- `lib/utils/cn.ts`

Also installs: [segment](https://ui.stepwise.studio/docs/segment.md)

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/time-picker
Whole library as text: https://ui.stepwise.studio/llms.txt
