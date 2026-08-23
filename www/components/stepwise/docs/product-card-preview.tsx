'use client'

import { ProductCard } from '@/components/stepwise/product-card'

export function ProductCardDefaultPreview() {
  return (
    <ProductCard
      previewIcon={<span className="text-[64px]">🧴</span>}
      name="Winter skin care combo"
      tag={{ label: '✦ Organic', color: 'pink' }}
      description="A gentle, fragrance-free routine for dry winter skin — cleanser, moisturizer, and lip balm in one bundle."
      price={109}
      showWishlist
      ctaLabel="Add to Cart"
    />
  )
}

export function ProductCardObjectPreview() {
  return (
    <ProductCard
      previewIcon={<span className="text-[64px]">🛋️</span>}
      name="Single seater sofa"
      tag={{ label: '✦ New Arrival', color: 'indigo' }}
      description="The CozyNest single seater sofa offers unparalleled comfort with its plush cushions and sleek design."
      price={120}
      stats={[
        { label: 'Happy Buyers',       value: '1.6K' },
        { label: 'Rating',             value: '4.8'  },
        { label: 'Extended Warranty',  value: '5 Yrs' },
      ]}
      showWishlist
      ctaLabel="Add to Cart"
    />
  )
}

export function ProductCardTshirtPreview() {
  return (
    <ProductCard
      previewIcon={<span className="text-[64px]">👕</span>}
      name="Summer wear T-shirt"
      tag={{ label: '★ 4.8', color: 'green' }}
      description="The TrendyThreads summer T-shirt is crafted from lightweight, breathable fabric, ensuring comfort during warm days."
      price={15}
      colors={['#38bdf8', '#f97316', '#f43f5e', '#22c55e', '#6366f1', '#eab308', '#14b8a6']}
      sizes={['XS', 'S', 'M', 'XL', '2XL']}
      showWishlist
      ctaLabel="Add to Cart"
    />
  )
}
