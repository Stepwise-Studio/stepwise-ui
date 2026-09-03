# Calendar

Standalone month-view calendar components.

## Install

```bash
npx stepwise-ui add calendar
```

Exports: `Calendar`, `CalendarRange`

## Usage

```tsx
import { Calendar, CalendarRange } from '@/components/stepwise/calendar'

// Single date - uncontrolled
<Calendar defaultSelected={new Date()} />

// Single date - controlled
const [date, setDate] = useState<Date | null>(null)
<Calendar selected={date} onSelect={setDate} />

// Date range - controlled
const [from, setFrom] = useState<Date | null>(null)
const [to,   setTo]   = useState<Date | null>(null)
<CalendarRange
  from={from}
  to={to}
  onRangeChange={(f, t) => { setFrom(f); setTo(t) }}
/>
```

## What gets written

- `components/stepwise/calendar.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/utils/cn.ts`

npm packages: `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/calendar
Whole library as text: https://ui.stepwise.studio/llms.txt
