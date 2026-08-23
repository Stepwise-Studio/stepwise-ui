'use client'

import { forwardRef } from 'react'
import { SmoothCorners, type SmoothCornersOwnProps, type SmoothCornerOptions } from '@lisse/react'
import { cn } from '@/lib/utils/cn'

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: number
  smoothing?: number
  /** Override for per-corner config — takes precedence over radius/smoothing. */
  corners?: SmoothCornerOptions
  // `className` isn't part of SmoothCornersOwnProps — it comes from the
  // polymorphic element props (ComponentPropsWithoutRef<E>) instead — but
  // it's a legitimate, commonly-needed passthrough (e.g. forcing `h-full`
  // through the SmoothCorners wrapper), so it's added back explicitly here.
  lisse?: Omit<SmoothCornersOwnProps, 'corners'> & { className?: string }
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(({
  radius = 12,
  smoothing = 0.6,
  corners,
  className,
  children,
  lisse,
  ...rest
}, ref) => {
  return (
    <SmoothCorners corners={corners ?? { radius, smoothing }} {...lisse}>
      <div ref={ref} className={cn(className)} {...rest}>
        {children}
      </div>
    </SmoothCorners>
  )
})

Surface.displayName = 'Surface'
