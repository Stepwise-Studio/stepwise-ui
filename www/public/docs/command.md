# Command

A searchable ⌘K command menu with grouped items, fuzzy matching, full keyboard navigation, and per-item shortcuts.

## Install

```bash
npx stepwise-ui add command
```

Exports: `CommandPalette`

## Usage

```tsx
import { CommandPalette } from '@/components/stepwise/command'

const groups = [
  { heading: 'Navigation', items: [
    { id: 'home', label: 'Go to Home', icon: <HomeIcon />, shortcut: ['G', 'H'] },
    { id: 'docs', label: 'Go to Docs', keywords: 'guides', shortcut: ['G', 'D'] },
  ]},
  { heading: 'Actions', items: [
    { id: 'new',   label: 'Create new project', shortcut: ['⌘', 'N'], onSelect: create },
    { id: 'theme', label: 'Toggle theme', keywords: 'dark light' },
  ]},
]

// ⌘K / Ctrl+K opens it automatically (hotkey defaults to true)
<CommandPalette open={open} onOpenChange={setOpen} groups={groups} />
```

## What gets written

- `components/stepwise/command.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/utils/cn.ts`

Also installs: [kbd](https://ui.stepwise.studio/docs/kbd.md), [scroll-area](https://ui.stepwise.studio/docs/scroll-area.md)

npm packages: `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/command
Whole library as text: https://ui.stepwise.studio/llms.txt
