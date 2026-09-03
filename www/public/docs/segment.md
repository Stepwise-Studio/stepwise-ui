# Segment

A segmented control for switching between mutually exclusive options - the active indicator slides with a spring.

## Install

```bash
npx stepwise-ui add segment
```

Exports: `Segment`

## Usage

```tsx
<Segment variant="underline" options={options} value={v} onChange={setV} />
```

## What gets written

- `components/stepwise/primitives/surface.tsx`
- `components/stepwise/segment.tsx`
- `lib/utils/cn.ts`

npm packages: `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/segment
Whole library as text: https://ui.stepwise.studio/llms.txt
