'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { Surface } from '@/components/stepwise/primitives/surface'
import { cn } from '@/lib/utils/cn'

export interface FrameProps extends HTMLAttributes<HTMLDivElement> {
  radius?: number
  /** Border stroke width in px. Default 1. */
  borderWidth?: number
  /** Border color. Default the theme-aware `--ui-border` token. */
  borderColor?: string
  /** Border opacity, 0–1. Default 0.7. */
  borderOpacity?: number
}

/**
 * The base content surface, and the building block every other card is made
 * from. Composes with Frame.Header, Title, Description, Content and Footer.
 * Squircle corners via Surface, border via middleBorder, and a quiet
 * theme-aware resting shadow.
 */
export const Frame = forwardRef<HTMLDivElement, FrameProps>(({
  radius = 20,
  borderWidth = 1,
  borderColor = 'var(--ui-border, rgb(138 138 141 / 0.23))',
  borderOpacity = 0.7,
  className,
  children,
  ...props
}, ref) => (
  <Surface
    ref={ref}
    radius={radius}
    lisse={{ middleBorder: { width: borderWidth, opacity: borderOpacity, color: borderColor } }}
    className={cn(
      'relative bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100',
      'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.03)]',
      'dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_1px_rgba(0,0,0,0.2)]',
      className,
    )}
    {...props}
  >
    {children}
  </Surface>
))
Frame.displayName = 'Frame'

export const FrameHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 px-5 pt-5', className)} {...props} />
  ),
)
FrameHeader.displayName = 'FrameHeader'

export const FrameTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-[16px] font-semibold leading-snug tracking-[-0.02em] [text-wrap:balance]', className)}
      {...props}
    />
  ),
)
FrameTitle.displayName = 'FrameTitle'

export const FrameDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-[13.5px] leading-relaxed text-zinc-500 dark:text-zinc-400 text-pretty', className)}
      {...props}
    />
  ),
)
FrameDescription.displayName = 'FrameDescription'

export const FrameContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-5 py-4 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300', className)} {...props} />
  ),
)
FrameContent.displayName = 'FrameContent'

export const FrameFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3 px-5 pb-5 pt-1', className)} {...props} />
  ),
)
FrameFooter.displayName = 'FrameFooter'
