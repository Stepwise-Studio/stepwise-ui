import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  ProductCardBasicPreview,
  ProductCardStatsPreview,
  ProductCardVariantsPreview,
} from '@/components/stepwise/docs/product-card-preview'

const basicCode = `import { ProductCard } from '@/components/stepwise/product-card'

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
/>`

const tshirtCode = `<ProductCard
  images={['/tee.jpg']}
  name="Classic Cotton Tee"
  tag={{ label: '4.8 ★', color: 'green' }}
  price={28}
  colors={['#38bdf8', '#f97316', '#f43f5e', '#22c55e']}
  sizes={['XS', 'S', 'M', 'XL', '2XL']}
  showWishlist
  ctaLabel="Add to Cart"
/>`

const toc = [
  { id: 'basic',    label: 'Basic',            child: false },
  { id: 'stats',    label: 'With Stats',       child: false },
  { id: 'variants', label: 'With Color & Size', child: false },
  { id: 'props',    label: 'Props',            child: false },
]

export default function ProductCardPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Product Card</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            An e-commerce product card with an image carousel, colour swatches, size selector and a price footer. Supports image carousels, an optional wishlist
            toggle, color swatches, size selector, stats rows, and a price + CTA footer. A
            description (when given) stays tucked behind a "View Details" toggle instead of
            always showing.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add product-card" />
        </section>

        <section id="basic" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Basic</Text>
          <PreviewCode
            minHeight={480}
            preview={<ProductCardBasicPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="stats" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">With Stats</Text>
          <PreviewCode
            minHeight={520}
            preview={<ProductCardStatsPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="variants" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">With Color & Size</Text>
          <PreviewCode
            minHeight={560}
            preview={<ProductCardVariantsPreview />}
            code={<CodeBlock code={tshirtCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'images',      type: 'string[]',             desc: 'Image URLs. Shows a dot carousel when more than one.' },
            { name: 'imagePosition', type: 'string',             desc: 'CSS object-position for the image. Default "center" - tune when the product isn\'t centered in the source photo.' },
            { name: 'previewIcon', type: 'React.ReactNode',      desc: 'Shown over a themed gradient when images is empty - pass a large emoji or icon.' },
            { name: 'name',        type: 'string',               desc: 'Product name.' },
            { name: 'tag',         type: 'ProductCardTag',       desc: 'Label chip shown next to the name.' },
            { name: 'description', type: 'string',               desc: 'Revealed behind a "View Details" toggle - not shown up front.' },
            { name: 'price',       type: 'number',               desc: 'Numeric price.' },
            { name: 'currency',    type: 'string',               desc: 'Currency symbol. Default "$".' },
            { name: 'colors',      type: 'string[]',             desc: 'Hex color swatches, rendered with ColorSwatch.' },
            { name: 'sizes',       type: 'string[]',             desc: 'Size labels (XS, S, M…).' },
            { name: 'stats',       type: 'ProductStat[]',        desc: 'Stats row (buyers, rating, warranty…).' },
            { name: 'showWishlist',type: 'boolean',              desc: 'Shows a wishlist heart icon on the image. Default false - opt in per card.' },
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
