# Chip

Pill-shaped label in six semantic colors and three variants - soft, solid, and outline.

## Install

```bash
npx stepwise-ui add chip
```

Exports: `Chip`

## Usage

```tsx
<Chip color="danger"  variant="soft">Danger</Chip>
<Chip color="warning" variant="soft">Warning</Chip>
<Chip color="success" variant="soft">Success</Chip>
<Chip color="info"    variant="soft">Info</Chip>
<Chip color="magical" variant="soft">Magical</Chip>
<Chip color="idle"    variant="soft">Idle</Chip>
```

## What gets written

- `components/stepwise/chip.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/chip
Whole library as text: https://ui.stepwise.studio/llms.txt
