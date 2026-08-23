'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { SmoothCorners } from '@lisse/react'
import { cn } from '@/lib/utils/cn'

export interface TestButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const h = 44
const px = 24
const r = 22

/**
 * Fully rounded pill with a static rainbow inner glow along the bottom edge.
 * Fill follows the page theme — light surface in light mode, dark in dark mode.
 */
export const TestButton = forwardRef<HTMLButtonElement, TestButtonProps>(({
  className,
  children,
  style,
  disabled,
  ...props
}, ref) => {
  return (
    <div
      className="relative inline-flex origin-center transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97] motion-reduce:active:scale-100"
      style={{ borderRadius: r }}
    >
      <SmoothCorners corners={{ radius: r, smoothing: 0.6 }} autoEffects={false}>
        <button
          ref={ref}
          disabled={disabled}
          className={cn(
            'relative isolate overflow-hidden flex items-center justify-center whitespace-nowrap',
            'font-medium tracking-[-0.02em] text-[14px]',
            'bg-gradient-to-b from-white to-zinc-100 text-zinc-900',
            'dark:from-zinc-900 dark:to-black dark:text-white',
            'cursor-pointer select-none disabled:opacity-45 disabled:pointer-events-none',
            'transition-[filter] duration-150 hover:brightness-95 dark:hover:brightness-110',
            'focus-visible:outline-none',
            className,
          )}
          style={{ height: h, padding: `0 ${px}px`, borderRadius: r, ...style }}
          {...props}
        >
          {!disabled && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
              {/* Curved caps — rainbow climbs the left/right borders */}
              <span
                className="stepwise-test-rainbow-corner stepwise-test-rainbow-corner-left mix-blend-normal opacity-[0.62] dark:mix-blend-plus-lighter dark:opacity-[0.88]"
                style={{ filter: `blur(${h * 0.14}px) saturate(1.45)` }}
              />
              <span
                className="stepwise-test-rainbow-corner stepwise-test-rainbow-corner-right mix-blend-normal opacity-[0.62] dark:mix-blend-plus-lighter dark:opacity-[0.88]"
                style={{ filter: `blur(${h * 0.14}px) saturate(1.45)` }}
              />
              {/* Center wash — original blurred seam glow */}
              <span
                className="stepwise-test-rainbow-wash mix-blend-normal opacity-[0.72] dark:mix-blend-plus-lighter dark:opacity-[0.95]"
                style={{
                  left: 0,
                  right: 0,
                  bottom: -2,
                  height: h * 0.24 + 2,
                  filter: `blur(${h * 0.12}px) saturate(1.5)`,
                }}
              />
            </span>
          )}

          <span className="relative z-[1]">{children}</span>
        </button>
      </SmoothCorners>
    </div>
  )
})

TestButton.displayName = 'TestButton'
