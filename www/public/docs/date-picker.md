# Date Picker

Input-triggered date picker with three variants: click-to-pick, date range, and a typed DD/MM/YYYY field.

## Install

```bash
npx stepwise-ui add date-picker
```

Exports: `DatePicker`

## Usage

```tsx
import { DatePicker } from '@/components/stepwise/date-picker'

// Single date
const [date, setDate] = useState<Date | null>(null)
<DatePicker variant="date" label="Date" value={date} onChange={setDate} />

// Date range
const [from, setFrom] = useState<Date | null>(null)
const [to,   setTo]   = useState<Date | null>(null)
<DatePicker
  variant="range"
  label="Date range"
  from={from}
  to={to}
  onRangeChange={(f, t) => { setFrom(f); setTo(t) }}
/>

// Typed date (DD/MM/YYYY) - also has a calendar icon to open the picker
const [dob, setDob] = useState<Date | null>(null)
<DatePicker variant="text" label="Date of birth" value={dob} onChange={setDob} />
```

## What gets written

- `components/stepwise/date-picker.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/theme.tsx`
- `lib/utils/cn.ts`

Also installs: [calendar](https://ui.stepwise.studio/docs/calendar.md)

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/date-picker
Whole library as text: https://ui.stepwise.studio/llms.txt
