import { cn } from '@/lib/utils/cn'

/**
 * Product image placeholder — **not** a Riso plate.
 *
 * The art direction carves out one exception: product cards use realistic
 * premium studio product photography, not the editorial illustration style. So
 * this stands in for a photograph rather than for an illustration: a warm
 * seamless sweep, a soft contact shadow, and the ACME pack rendered as a plain
 * carton. No halftone, no grain, no botanicals.
 *
 * Replace it with the real photograph by dropping the file at the path in
 * `ASSETS.md` and swapping this component for an `<img>` in
 * `components/site/medicine-card.tsx`. `Medicine.image` already carries the
 * path the photograph will live at, so nothing in the data layer changes.
 */

type PackTone = 'coral' | 'teal'

/** The pack system from the source document: every ACME carton is cream with
 *  one accent, and only two accents exist across the range. */
const PACKS: Record<string, { tone: PackTone; secondary: 'blister' | 'bottle' | 'sachet' }> = {
  'acme-pain-relief': { tone: 'coral', secondary: 'blister' },
  'acme-vitamin-c'  : { tone: 'coral', secondary: 'bottle' },
  'acme-antacid'    : { tone: 'teal',  secondary: 'bottle' },
  'acme-ors'        : { tone: 'coral', secondary: 'sachet' },
}

const TONE: Record<PackTone, { ink: string; wash: string }> = {
  coral: { ink: 'oklch(0.680 0.166 45)',  wash: 'oklch(0.860 0.070 52)' },
  teal:  { ink: 'oklch(0.545 0.078 197)', wash: 'oklch(0.840 0.040 197)' },
}

export function ProductShot({
  handle,
  className,
}: {
  handle: string
  className?: string
}) {
  const pack = PACKS[handle] ?? { tone: 'coral' as PackTone, secondary: 'bottle' as const }
  const t = TONE[pack.tone]

  return (
    <div
      aria-hidden="true"
      className={cn('relative isolate overflow-hidden bg-zinc-100 dark:bg-zinc-900', className)}
    >
      <svg viewBox="0 0 320 320" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="presentation">
        <defs>
          {/* A seamless studio sweep. This is the one place on the site a
              gradient is allowed - it is standing in for a lit backdrop, not
              decorating a UI surface. */}
          <radialGradient id={`sweep-${handle}`} cx="50%" cy="34%" r="76%">
            <stop offset="0%"   stopColor="oklch(0.985 0.006 86)" />
            <stop offset="62%"  stopColor="oklch(0.945 0.010 84)" />
            <stop offset="100%" stopColor="oklch(0.880 0.014 80)" />
          </radialGradient>
        </defs>

        <rect width="320" height="320" fill={`url(#sweep-${handle})`} />

        {/* Contact shadow. Two ellipses: a tight dark core under the pack and a
            wide soft one, which is what a softbox actually leaves behind. */}
        <ellipse cx="160" cy="252" rx="104" ry="20" fill="oklch(0.30 0.02 70)" opacity="0.08" />
        <ellipse cx="160" cy="250" rx="66"  ry="11" fill="oklch(0.30 0.02 70)" opacity="0.13" />

        {/* Carton - front face, lit side face, accent band. */}
        <path d="M96,250 L96,110 L196,88 L196,228 Z" fill="oklch(0.965 0.008 86)" />
        <path d="M196,228 L196,88 L232,104 L232,238 Z" fill="oklch(0.905 0.010 84)" />
        <path d="M96,110 L196,88 L232,104 L130,126 Z" fill="oklch(0.985 0.005 86)" />
        <path d="M96,182 L196,160 L196,190 L96,212 Z" fill={t.ink} />
        <path d="M196,160 L232,176 L232,206 L196,190 Z" fill={t.ink} opacity="0.72" />
        {/* Brand block, kept abstract - no baked-in wordmark. */}
        <rect x="110" y="126" width="52" height="9" rx="4.5" fill="oklch(0.30 0.02 70)" opacity="0.5" />
        <rect x="110" y="142" width="34" height="7" rx="3.5" fill="oklch(0.30 0.02 70)" opacity="0.26" />

        {pack.secondary === 'bottle' && (
          <g>
            <rect x="212" y="150" width="62" height="100" rx="12" fill={t.wash} />
            <rect x="220" y="176" width="46" height="50" rx="6" fill="oklch(0.975 0.008 86)" opacity="0.9" />
            <rect x="228" y="134" width="30" height="20" rx="5" fill="oklch(0.30 0.02 70)" opacity="0.5" />
          </g>
        )}
        {pack.secondary === 'blister' && (
          <g>
            <rect x="196" y="196" width="106" height="54" rx="9" fill="oklch(0.905 0.008 84)" transform="rotate(-8 249 223)" />
            {[0, 1, 2, 3].map(i => (
              <circle key={i} cx={214 + i * 24} cy={220 - i * 3.4} r="9" fill={t.ink} opacity="0.85" />
            ))}
          </g>
        )}
        {pack.secondary === 'sachet' && (
          <g transform="rotate(-10 250 214)">
            <rect x="206" y="164" width="88" height="86" rx="6" fill={t.wash} />
            <rect x="206" y="164" width="88" height="12" rx="3" fill="oklch(0.30 0.02 70)" opacity="0.18" />
            <rect x="220" y="198" width="46" height="8" rx="4" fill="oklch(0.985 0.005 86)" opacity="0.9" />
          </g>
        )}
      </svg>
    </div>
  )
}
