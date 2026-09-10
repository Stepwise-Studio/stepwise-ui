import { cn } from '@/lib/utils/cn'

/**
 * The sheet an illustration is printed on.
 *
 * Owns three things so no individual illustration has to: the paper ground,
 * the grain overlay, and the fill behaviour. `slice` rather than `meet` means a
 * plate fills whatever cell the layout gives it - a 2×2 bento tile and a 1×1
 * one show the same artwork cropped differently instead of one of them
 * letterboxing with dead paper down the sides.
 *
 * Illustrations are decorative: the page always supplies the words. So the
 * whole thing is `aria-hidden`, and the surrounding card carries the label and
 * the link. This is also the asset rule from the brief - no titles, no card UI
 * and no website typography baked into the artwork.
 *
 * ── Placeholder status ───────────────────────────────────────────────────────
 * These are drawn placeholders, not the final assets. The owner is producing
 * the real riso illustrations separately; each one's filename, size and subject
 * is specified in `ASSETS.md`. To drop a real asset in, replace the `children`
 * of the matching entry in `illustrations.tsx` with an `<img>` - the aspect
 * ratio and the grain treatment stay exactly as they are here.
 */
export function Plate({
  viewBox = '0 0 400 400',
  className,
  children,
}: {
  viewBox?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('riso-plate paper-grain relative isolate overflow-hidden', className)}
      style={{ background: 'var(--plate-bg)' }}
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="presentation"
      >
        {children}
      </svg>
    </div>
  )
}
