# Dropdown Menu

An anchored action menu that grows from its trigger.

## Install

```bash
npx stepwise-ui add dropdown-menu
```

Exports: `DROPDOWN_PANEL_CLASS`, `DropdownMenu`, `DropdownMenuList`

## Usage

```tsx
import { DropdownMenu } from '@/components/stepwise/dropdown-menu'

<DropdownMenu
  trigger={<Button size="sm">Actions</Button>}
  items={[
    { heading: 'Manage' },
    { label: 'Edit', icon: <EditIcon />, shortcut: '⌘E' },
    { label: 'Duplicate', icon: <CopyIcon />, shortcut: '⌘D' },
    { separator: true },
    { label: 'Delete', icon: <TrashIcon />, destructive: true },
  ]}
/>
```

## What gets written

- `components/stepwise/dropdown-menu.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/utils/cn.ts`

Also installs: [separator](https://ui.stepwise.studio/docs/separator.md)

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/dropdown-menu
Whole library as text: https://ui.stepwise.studio/llms.txt
