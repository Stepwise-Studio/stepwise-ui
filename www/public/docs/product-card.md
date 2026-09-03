# Product Card

An e-commerce product card with an image carousel, colour swatches, size selector and a price footer.

## Install

```bash
npx stepwise-ui add product-card
```

Exports: `ProductCard`

## Usage

```tsx
import { ProductCard } from '@/components/stepwise/product-card'

<ProductCard
  images={['/book.jpg']}
  // or, with no photo on hand yet:
  previewIcon={<span className="text-[64px]">📕</span>}
  name="Hardcover Novel"
  tag={{ label: 'New', color: 'sky' }}
  // shown behind a "View Details" toggle, not up front
  description="Cloth-bound hardcover with a ribbon marker and matte-laminated jacket."
  price={24}
  showWishlist
  ctaLabel="Add to Cart"
  onAddToCart={() => console.log('added')}
/>
```

## What gets written

- `components/stepwise/primitives/surface.tsx`
- `components/stepwise/product-card.tsx`
- `lib/utils/cn.ts`

Also installs: [button](https://ui.stepwise.studio/docs/button.md), [color-swatch](https://ui.stepwise.studio/docs/color-swatch.md)

npm packages: `@hugeicons/core-free-icons`, `@hugeicons/react`, `@lisse/react`, `clsx`, `motion`, `tailwind-merge`

## Setup this needs

React 19, Tailwind CSS v4, an `@/*` path alias to the project root, and a
class-based dark variant in the global stylesheet:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

---

Full page: https://ui.stepwise.studio/docs/product-card
Whole library as text: https://ui.stepwise.studio/llms.txt
