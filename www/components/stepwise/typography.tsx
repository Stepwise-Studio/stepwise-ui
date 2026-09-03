import { cva, type VariantProps } from 'class-variance-authority'
import type { ElementType } from 'react'
import { cn } from '@/lib/utils/cn'

const textVariants = cva('', {
  variants: {
    variant: {
      // Display - 3-step: mobile / md:tablet / lg:desktop
      hero:           'text-[36px] md:text-[48px] lg:text-[64px] font-semibold tracking-[-0.03em] leading-tight   text-balance',
      headline:       'text-[28px] md:text-[38px] lg:text-[48px] font-semibold tracking-[-0.03em] leading-tight   text-balance',
      // Headings - 3-step: mobile / md:tablet / lg:desktop
      h1:             'text-[26px] md:text-[30px] lg:text-[36px] font-semibold tracking-[-0.03em] leading-tight   text-balance',
      'h1-soft':      'text-[26px] md:text-[30px] lg:text-[36px] font-medium   tracking-[-0.03em] leading-tight   text-balance',
      h2:             'text-[22px] md:text-[26px] lg:text-[30px] font-semibold tracking-[-0.03em] leading-tight   text-balance',
      'h2-soft':      'text-[22px] md:text-[26px] lg:text-[30px] font-medium   tracking-[-0.03em] leading-tight   text-balance',
      h3:             'text-[20px] md:text-[22px] lg:text-[24px] font-semibold tracking-[-0.03em] leading-snug    text-balance',
      'h3-soft':      'text-[20px] md:text-[22px] lg:text-[24px] font-medium   tracking-[-0.03em] leading-snug    text-balance',
      // Sub-headings - 2-step: mobile / md:desktop (delta small enough)
      h4:             'text-[18px] md:text-[20px] font-semibold tracking-[-0.03em] leading-snug    text-balance',
      'h4-soft':      'text-[18px] md:text-[20px] font-medium   tracking-[-0.03em] leading-snug    text-balance',
      h5:             'text-[16px] md:text-[18px] font-semibold tracking-[-0.03em] leading-snug    text-balance',
      'h5-soft':      'text-[16px] md:text-[18px] font-medium   tracking-[-0.03em] leading-snug    text-balance',
      h6:             'text-[15px] md:text-[16px] font-semibold tracking-[-0.03em] leading-normal  text-balance',
      'h6-soft':      'text-[15px] md:text-[16px] font-medium   tracking-[-0.03em] leading-normal  text-balance',
      // Body & below - fixed (already readable at all sizes)
      body:           'text-[16px] font-semibold tracking-[-0.02em] leading-relaxed text-pretty',
      'body-soft':    'text-[16px] font-normal   tracking-[-0.02em] leading-relaxed text-pretty',
      detail:         'text-[14px] font-normal   tracking-normal leading-relaxed text-pretty',
      caption:        'text-[13px] font-medium   tracking-normal leading-normal  text-pretty',
      'caption-soft': 'text-[13px] font-normal   tracking-normal leading-normal  text-pretty',
      mono:           'text-[14px] font-normal   tracking-[-0.03em] leading-relaxed [font-family:var(--font-geist-mono,monospace)]',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})

const defaultElements: Record<string, ElementType> = {
  hero:           'h1',
  headline:       'h1',
  h1:             'h1',
  'h1-soft':      'h1',
  h2:             'h2',
  'h2-soft':      'h2',
  h3:             'h3',
  'h3-soft':      'h3',
  h4:             'h4',
  'h4-soft':      'h4',
  h5:             'h5',
  'h5-soft':      'h5',
  h6:             'h6',
  'h6-soft':      'h6',
  body:           'p',
  'body-soft':    'p',
  detail:         'p',
  caption:        'span',
  'caption-soft': 'span',
  mono:           'code',
}

interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: ElementType
}

export function Text({ variant = 'body', as, className, children, ...rest }: TextProps) {
  const Tag = as ?? defaultElements[variant ?? 'body'] ?? 'p'
  return (
    <Tag className={cn(textVariants({ variant }), className)} {...rest}>
      {children}
    </Tag>
  )
}
