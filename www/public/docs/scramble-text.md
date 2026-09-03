# Scramble Text

A scramble reveal: every character churns at once, then locks in from left to right while the rest keep going until the last one settles.

## Install

```bash
npx stepwise-ui add scramble-text
```

Exports: `ScrambleText`

## Usage

```tsx
import { ScrambleText } from '@/components/stepwise/scramble-text'

// Default - a softer letter decode (intensity 0.45)
<ScrambleText>Stepwise Interface Kit</ScrambleText>

// Dial up the chaos, or slow the resolve
<ScrambleText intensity={0.9} speed={42}>
  Stepwise Interface Kit
</ScrambleText>

// Binary glyph pool + replay each time it re-enters the viewport
<ScrambleText charset="01" intensity={0.7} replayInView>
  10110101
</ScrambleText>
```

## What gets written

- `components/stepwise/scramble-text.tsx`
- `lib/utils/cn.ts`

npm packages: `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/scramble-text
Whole library as text: https://ui.stepwise.studio/llms.txt
