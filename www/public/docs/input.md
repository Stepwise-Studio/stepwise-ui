# Input

A text field with five built-in variants - name, email, username, password, and plain text.

## Install

```bash
npx stepwise-ui add input
```

Exports: `Input`

## Usage

```tsx
import { Input } from '@/components/stepwise/input'

// Basic - each variant ships with a sensible default label and placeholder
<Input variant="name" />
<Input variant="email" />
<Input variant="username" />
<Input variant="password" />
<Input variant="text" label="Bio" placeholder="Tell us about yourself" />

// Custom label
<Input variant="email" label="Work Email" />

// Custom placeholder
<Input variant="name" placeholder="First name only" />

// Icon control - suppress or move the icon
<Input variant="name" showIcon={false} />
<Input variant="email" iconSide="right" />

// External error (server / form library)
<Input variant="email" error="That email is already taken." />

// Hint text
<Input variant="username" hint="Letters, numbers, and underscores only." />

// Disabled
<Input variant="name" defaultValue="Ada Lovelace" disabled />
```

## What gets written

- `components/stepwise/input.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/theme.tsx`
- `lib/utils/cn.ts`

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/input
Whole library as text: https://ui.stepwise.studio/llms.txt
