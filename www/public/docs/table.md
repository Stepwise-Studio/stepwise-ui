# Table

A typed, column-driven data table with alternating rows, a dark header, and horizontal scroll on overflow.

## Install

```bash
npx stepwise-ui add table
```

Exports: `Table`

## Usage

```tsx
import { Table, type TableColumn } from '@/components/stepwise/table'

type User = { name: string; role: string; status: string }

const columns: TableColumn<User>[] = [
  { key: 'name',   header: 'Name',   width: '1fr' },
  { key: 'role',   header: 'Role',   width: '120px' },
  {
    key: 'status', header: 'Status', width: '120px',
    render: (v) => <StatusBadge status={v} />,
  },
]

<Table columns={columns} rows={data} getKey={r => r.name} />
```

## What gets written

- `components/stepwise/primitives/surface.tsx`
- `components/stepwise/table.tsx`
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

Full page: https://ui.stepwise.studio/docs/table
Whole library as text: https://ui.stepwise.studio/llms.txt
