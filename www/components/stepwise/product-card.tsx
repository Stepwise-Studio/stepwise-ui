'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Button } from '@/components/stepwise/button'
import { ColorSwatch } from '@/components/stepwise/color-swatch'

export interface ProductCardTag {
  label : string
  color : 'pink' | 'indigo' | 'green' | 'amber' | 'zinc'
}

export interface ProductStat {
  label : string
  value : string | number
}

export interface ProductCardProps {
  images?      : string[]
  /**
   * Shown centered over a themed gradient when `images` is empty — pass a
   * large emoji or icon so the image-less state still reads as a real
   * product tile instead of a generic broken-photo placeholder.
   */
  previewIcon? : React.ReactNode
  name         : string
  tag?         : ProductCardTag
  /** Revealed on demand behind a "View Details" toggle, not shown up front. */
  description? : string
  price?       : number
  currency?    : string
  colors?      : string[]
  sizes?       : string[]
  selectedSize?: string
  stats?       : ProductStat[]
  showWishlist?: boolean
  ctaLabel?    : string
  onAddToCart? : () => void
  onWishlist?  : () => void
  className?   : string
}

const tagStyles: Record<ProductCardTag['color'], string> = {
  pink:   'bg-pink-50 dark:bg-pink-950/40 text-pink-500',
  indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500',
  green:  'bg-green-50 dark:bg-green-950/40 text-green-600',
  amber:  'bg-amber-50 dark:bg-amber-950/40 text-amber-500',
  zinc:   'bg-zinc-100 dark:bg-zinc-800 text-zinc-500',
}

const previewGradient: Record<ProductCardTag['color'], string> = {
  pink:   'from-pink-100 to-rose-200 dark:from-pink-950/60 dark:to-rose-900/40',
  indigo: 'from-indigo-100 to-violet-200 dark:from-indigo-950/60 dark:to-violet-900/40',
  green:  'from-emerald-100 to-green-200 dark:from-emerald-950/60 dark:to-green-900/40',
  amber:  'from-amber-100 to-orange-200 dark:from-amber-950/60 dark:to-orange-900/40',
  zinc:   'from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900',
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 13.5s-6-3.5-6-7.5a3.5 3.5 0 0 1 6-2.45A3.5 3.5 0 0 1 14 6c0 4-6 7.5-6 7.5z"
        fill={active ? '#f43f5e' : 'none'}
        stroke={active ? '#f43f5e' : 'currentColor'}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-[fill,stroke] duration-200 ease-out"
      />
    </svg>
  )
}

export function ProductCard({
  images      = [],
  previewIcon,
  name,
  tag,
  description,
  price,
  currency    = '$',
  colors      = [],
  sizes       = [],
  selectedSize,
  stats,
  showWishlist = false,
  ctaLabel    = 'Add to Cart',
  onAddToCart,
  onWishlist,
  className,
}: ProductCardProps) {
  const reduce = useReducedMotion()
  const [activeImage, setActiveImage] = useState(0)
  const [wishlisted, setWishlisted]   = useState(false)
  const [activeSize, setActiveSize]   = useState(selectedSize ?? sizes[0])
  const [activeColor, setActiveColor] = useState(colors[0])
  const [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <div className={cn('relative w-[345px]', className)}>
    <Surface
      radius={24}
      className="w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950"
    >
      {/* ── Image area ── */}
      <div className="relative h-[250px] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {images.length > 0 && (
          <img
            src={images[activeImage] ?? images[0]}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {images.length === 0 && (
          <div className={cn(
            'absolute inset-0 flex items-center justify-center bg-gradient-to-br',
            previewGradient[tag?.color ?? 'zinc'],
          )}>
            {previewIcon ?? (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-black/15 dark:text-white/15">
                <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="17" cy="21" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 34l9-9 7 7 5-5 15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        )}

        {/* Wishlist — subtle press/hover feedback (was a jarring 110%→90%
            scale swing with an instant, untransitioned fill color pop) */}
        {showWishlist && (
          <button
            onClick={() => { setWishlisted(w => !w); onWishlist?.() }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
              'absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full',
              'bg-zinc-50/90 text-zinc-500 dark:bg-zinc-900/90 dark:text-zinc-400 shadow-sm backdrop-blur-sm',
              'transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'hover:scale-105 active:scale-95 active:duration-100',
              'motion-reduce:hover:scale-100 motion-reduce:active:scale-100',
            )}
          >
            <HeartIcon active={wishlisted} />
          </button>
        )}

        {/* Image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                aria-label={`Image ${i + 1}`}
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-[width,background-color] duration-200',
                  i === activeImage ? 'bg-white w-3' : 'bg-white/50'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col gap-4 p-3 pb-3">
        {/* Name + tag row */}
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-[-0.03em] text-zinc-700 dark:text-zinc-200">
            {name}
          </span>
          {tag && (
            <span className={cn('flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[-0.01em]', tagStyles[tag.color])}>
              {tag.label}
            </span>
          )}
        </div>

        {/* Description — hidden behind an explicit toggle instead of always
            shown, so the card stays scannable; underlined to read as
            clickable, expands with a subtle fade instead of popping in. */}
        {description && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setDetailsOpen(o => !o)}
              aria-expanded={detailsOpen}
              className="self-start text-[11px] font-medium text-zinc-500 underline decoration-zinc-300 underline-offset-2 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:decoration-zinc-600 dark:hover:text-zinc-200"
            >
              View Details
            </button>
            <AnimatePresence initial={false}>
              {detailsOpen && (
                <motion.p
                  key="description"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: reduce ? 0.1 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden text-[12px] leading-relaxed tracking-[-0.01em] text-zinc-400 dark:text-zinc-500"
                >
                  {description}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Stats row — same structure/typography as Profile Card's own
            stats row (dividers, sizes, responsive gap), indigo instead of
            sky to match this card's own accent. */}
        {stats && stats.length > 0 && (
          <div className="flex min-w-0 items-center justify-center gap-3 sm:gap-5">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex min-w-0 items-center gap-3 sm:gap-5">
                {i > 0 && <div className="h-4 w-[2px] shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800" />}
                <div className="flex min-w-0 flex-col items-center">
                  <span className="text-[14px] font-semibold tabular-nums text-indigo-500 tracking-[-0.02em]">
                    {stat.value}
                  </span>
                  <span className="text-center text-[12.5px] text-zinc-600/80 dark:text-zinc-300/80 tracking-[-0.01em]">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Color swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Color</span>
            <ColorSwatch
              colors={colors}
              value={activeColor}
              onChange={setActiveColor}
              size={20}
            />
          </div>
        )}

        {/* Size pills */}
        {sizes.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Size</span>
            <div className="flex items-center gap-1.5">
              {sizes.map(sz => (
                <button
                  key={sz}
                  onClick={() => setActiveSize(sz)}
                  className={cn(
                    'flex h-6 min-w-[24px] items-center justify-center rounded-full px-1.5 text-[11px] font-medium transition-colors duration-150',
                    activeSize === sz
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                  )}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price + CTA row */}
        {(price !== undefined || ctaLabel) && (
          <div className="flex items-center gap-3">
            {price !== undefined && (
              <div className="flex flex-col items-start shrink-0">
                <span className="text-[10px] font-medium text-zinc-400 tracking-[-0.01em]">Price</span>
                <span className="text-[16px] font-semibold tracking-[-0.03em] text-zinc-700 dark:text-zinc-200 tabular-nums">
                  <span className="text-green-500 font-semibold">{currency}</span>{price}
                </span>
              </div>
            )}
            <div className="flex-1">
              <Button
                onClick={onAddToCart}
                fullWidth
                slideIcon
                iconPosition="right"
                icon={<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2.5} color="currentColor" />}
              >
                {ctaLabel}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Surface>
    {/* border overlay — outside the squircle clip so it never gets shaved */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ borderRadius: 24, borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--ui-border-subtle)' }}
    />
    </div>
  )
}
