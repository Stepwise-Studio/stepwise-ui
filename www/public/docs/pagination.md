# Pagination

Page number navigation with smart ellipsis, prev/next arrows, and an active-page squircle pill.

## Install

```bash
npx stepwise-ui add pagination
```

Exports: `Pagination`

## Usage

```tsx
import { Pagination } from '@/components/stepwise/pagination'

const [page, setPage] = useState(1)

<Pagination page={page} totalPages={12} onChange={setPage} />
```

## What gets written

- `components/stepwise/pagination.tsx`
- `components/stepwise/primitives/surface.tsx`
- `lib/utils/cn.ts`

npm packages: `@lisse/react`, `clsx`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/pagination
Whole library as text: https://ui.stepwise.studio/llms.txt
