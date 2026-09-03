'use client'

import { ProductCard } from '@/components/stepwise/product-card'

export function ProductCardBasicPreview() {
  return (
    <ProductCard
      images={['https://images.unsplash.com/photo-1510936470381-68e4c0a5e24b?w=800&q=80&auto=format&fit=crop']}
      name="Hardcover Novel"
      tag={{ label: 'New', color: 'sky' }}
      description="A quality cloth-bound hardcover with a ribbon marker and matte-laminated jacket. Printed on cream, acid-free paper built to last."
      price={24}
      showWishlist
      ctaLabel="Add to Cart"
    />
  )
}

export function ProductCardStatsPreview() {
  return (
    <ProductCard
      images={['https://images.unsplash.com/photo-1784638889238-feb6277ca95f?w=800&q=80&auto=format&fit=crop']}
      name="Nordic Lounge Chair"
      tag={{ label: 'New Arrival', color: 'sky' }}
      imagePosition="center 55%"
      description="Solid oak legs, breathable wool-blend upholstery, and a low-slung frame built for long afternoons. Assembles in minutes, no tools needed."
      price={340}
      stats={[
        { label: 'Sold',     value: '2.1K' },
        { label: 'Rating',   value: '4.9'  },
        { label: 'Warranty', value: '5 Yrs' },
      ]}
      showWishlist
      ctaLabel="Add to Cart"
    />
  )
}

export function ProductCardVariantsPreview() {
  return (
    <ProductCard
      images={['https://images.unsplash.com/photo-1651761179569-4ba2aa054997?w=800&q=80&auto=format&fit=crop']}
      name="Classic Cotton Tee"
      tag={{ label: '4.8 ★', color: 'green' }}
      description="100% combed cotton, pre-shrunk and garment-dyed for a soft, broken-in feel from the very first wear."
      price={28}
      colors={['#38bdf8', '#f97316', '#f43f5e', '#22c55e', '#6366f1', '#eab308', '#14b8a6']}
      sizes={['XS', 'S', 'M', 'XL', '2XL']}
      showWishlist
      ctaLabel="Add to Cart"
    />
  )
}
