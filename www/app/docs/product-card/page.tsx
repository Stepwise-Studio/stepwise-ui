import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  ProductCardDefaultPreview,
  ProductCardObjectPreview,
  ProductCardTshirtPreview,
} from '@/components/stepwise/docs/product-card-preview'

const basicCode = `import { ProductCard } from '@/components/stepwise/product-card'

<ProductCard
  images={['/product.jpg']}
  // or, with no photo on hand yet:
  previewIcon={<span className="text-[64px]">🧴</span>}
  name="Winter skin care combo"
  tag={{ label: '✦ Organic', color: 'pink' }}
  // shown behind a "View Details" toggle, not up front
  description="A gentle, fragrance-free routine for dry winter skin."
  price={109}
  showWishlist
  ctaLabel="Add to Cart"
  onAddToCart={() => console.log('added')}
/>`

const tshirtCode = `<ProductCard
  images={['/tshirt.jpg']}
  name="Summer wear T-shirt"
  tag={{ label: '★ 4.8', color: 'green' }}
  price={15}
  colors={['#38bdf8', '#f97316', '#f43f5e', '#22c55e']}
  sizes={['XS', 'S', 'M', 'XL', '2XL']}
  showWishlist
  ctaLabel="Add to Cart"
/>`

const toc = [
  { id: 'default',  label: 'Default',  child: false },
  { id: 'object',   label: 'Object',   child: false },
  { id: 'tshirt',   label: 'T-shirt',  child: false },
  { id: 'props',    label: 'Props',    child: false },
]

export default function ProductCardPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Product Card</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            A flexible e-commerce product card. Supports image carousels, an optional wishlist
            toggle, color swatches, size selector, stats rows, and a price + CTA footer. A
            description (when given) stays tucked behind a "View Details" toggle instead of
            always showing.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add product-card" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <PreviewCode
            minHeight={480}
            preview={<ProductCardDefaultPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="object" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Object with stats</Text>
          <PreviewCode
            minHeight={520}
            preview={<ProductCardObjectPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="tshirt" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Apparel with colour & size</Text>
          <PreviewCode
            minHeight={560}
            preview={<ProductCardTshirtPreview />}
            code={<CodeBlock code={tshirtCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'images',      type: 'string[]',             desc: 'Image URLs. Shows a dot carousel when more than one.' },
            { name: 'previewIcon', type: 'React.ReactNode',      desc: 'Shown over a themed gradient when images is empty — pass a large emoji or icon.' },
            { name: 'name',        type: 'string',               desc: 'Product name.' },
            { name: 'tag',         type: 'ProductCardTag',       desc: 'Label chip shown next to the name.' },
            { name: 'description', type: 'string',               desc: 'Revealed behind a "View Details" toggle — not shown up front.' },
            { name: 'price',       type: 'number',               desc: 'Numeric price.' },
            { name: 'currency',    type: 'string',               desc: 'Currency symbol. Default "$".' },
            { name: 'colors',      type: 'string[]',             desc: 'Hex color swatches, rendered with ColorSwatch.' },
            { name: 'sizes',       type: 'string[]',             desc: 'Size labels (XS, S, M…).' },
            { name: 'stats',       type: 'ProductStat[]',        desc: 'Stats row (buyers, rating, warranty…).' },
            { name: 'showWishlist',type: 'boolean',              desc: 'Shows a wishlist heart icon on the image. Default false — opt in per card.' },
            { name: 'ctaLabel',    type: 'string',               desc: 'CTA button label. Default "Add to Cart".' },
            { name: 'onAddToCart', type: '() => void',           desc: 'CTA click handler.' },
            { name: 'onWishlist',  type: '() => void',           desc: 'Wishlist toggle handler.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
