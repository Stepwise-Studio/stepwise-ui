# Toggle

A switch with some weight to it.

## Install

```bash
npx stepwise-ui add toggle
```

Exports: `Toggle`

## Usage

```tsx
import { Toggle } from '@/components/stepwise/toggle'

const [on, setOn] = useState(true)

// no visible label - needs ariaLabel so screen readers know what it does
<Toggle checked={on} onChange={setOn} ariaLabel="Toggle" />
```

## What gets written

- `components/stepwise/toggle.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/toggle
Whole library as text: https://ui.stepwise.studio/llms.txt
