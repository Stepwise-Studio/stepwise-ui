/**
 * The Riso mark-making kit.
 *
 * Every illustration on the site is assembled from these. They are plain
 * functions returning SVG fragments - no state, no ids, no hooks - so they
 * render on the server and cost nothing on the client.
 *
 * Two rules hold the language together:
 *
 *   1. **Flat ink only.** No gradients, no strokes-as-outlines, no shadows.
 *      Depth comes from stacking opaque shapes and from the two darker tones
 *      (`--plate-stone`, `--plate-ink`) standing in for a shadow side.
 *   2. **Misregistration is deliberate.** A real riso runs each colour through
 *      the drum separately, so layers land a fraction out of true. `Offset`
 *      reproduces that; used once or twice per plate, never on every shape,
 *      because a print where *everything* is out of register just looks blurry.
 *
 * All colours are `var(--plate-*)`, defined in `app/globals.css` under
 * `.riso-plate`. Nothing here hard-codes a hex value.
 */

type XY = { x: number; y: number }

/* ── Structure ────────────────────────────────────────────────────────────── */

/** The half-round arch that recurs across every plate - the print-shop motif
 *  that ties six unrelated subjects into one series. */
export function Arch({
  x, y, w, h, fill, opacity = 1,
}: { x: number; y: number; w: number; h: number; fill: string; opacity?: number }) {
  const r = w / 2
  return (
    <path
      d={`M${x},${y + h} V${y + r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h} Z`}
      fill={fill}
      opacity={opacity}
    />
  )
}

/** Rolling hills across the lower third. Two overlapping ellipses read as
 *  distance without any perspective drawing. */
export function Hills({ y, fill, opacity = 1 }: { y: number; fill: string; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <ellipse cx="120" cy={y + 60} rx="170" ry="72" fill={fill} />
      <ellipse cx="310" cy={y + 74} rx="140" ry="60" fill={fill} />
    </g>
  )
}

/** A cloud: three circles and a bar, the way a screen-printer would cut it. */
export function Cloud({ x, y, s = 1, fill }: { x: number; y: number; s?: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <circle cx="20" cy="18" r="18" />
      <circle cx="46" cy="12" r="24" />
      <circle cx="74" cy="20" r="16" />
      <rect x="18" y="20" width="58" height="18" rx="9" />
    </g>
  )
}

/** The stone pedestal every object stands on. Two slabs, the lower one inset
 *  and darker, which is the whole of the lighting model on these plates. */
export function Pedestal({ cx, y, w = 170 }: { cx: number; y: number; w?: number }) {
  return (
    <g>
      <rect x={cx - w / 2} y={y} width={w} height="17" rx="4" fill="var(--plate-stone)" />
      <rect x={cx - w / 2 + 18} y={y + 17} width={w - 36} height="13" rx="4" fill="var(--plate-ink)" opacity="0.22" />
    </g>
  )
}

/* ── Pharmaceutical objects ───────────────────────────────────────────────── */

/** A two-tone capsule. Drawn as two half-capsule paths rather than a clipped
 *  rectangle, so it needs no `clipPath` and therefore no unique id - which is
 *  what lets these render on the server. */
export function Capsule({
  cx, cy, w = 52, h = 116, rot = 0, top, bottom,
}: {
  cx: number; cy: number; w?: number; h?: number; rot?: number; top: string; bottom: string
}) {
  const r  = w / 2
  const t  = cy - h / 2 + r
  const b  = cy + h / 2 - r
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <path d={`M${cx - r},${cy} V${t} A${r},${r} 0 0 1 ${cx + r},${t} V${cy} Z`} fill={top} />
      <path d={`M${cx - r},${cy} V${b} A${r},${r} 0 0 0 ${cx + r},${b} V${cy} Z`} fill={bottom} />
      {/* The seam where the two halves meet - a hairline of the darker tone. */}
      <rect x={cx - r} y={cy - 2} width={w} height="4" fill="var(--plate-ink)" opacity="0.14" />
    </g>
  )
}

/** A scored tablet: disc plus the pressed dividing line. */
export function Tablet({
  cx, cy, r = 40, fill = 'var(--plate-cream)', rot = 0,
}: { cx: number; cy: number; r?: number; fill?: string; rot?: number }) {
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <rect x={cx - 2} y={cy - r + 6} width="4" height={r * 2 - 12} rx="2" fill="var(--plate-ink)" opacity="0.2" />
    </g>
  )
}

/** A bottle: body, shoulder, neck, cap. `label` paints a band across the body,
 *  which is where the halftone usually goes. */
export function Bottle({
  cx, baseY, w = 96, h = 150, body, cap, label,
}: {
  cx: number; baseY: number; w?: number; h?: number
  body: string; cap: string; label?: string
}) {
  const x = cx - w / 2
  const y = baseY - h
  return (
    <g>
      <rect x={x} y={y + 30} width={w} height={h - 30} rx="16" fill={body} />
      <rect x={cx - w * 0.22} y={y + 12} width={w * 0.44} height="26" rx="5" fill={body} />
      <rect x={cx - w * 0.27} y={y} width={w * 0.54} height="18" rx="6" fill={cap} />
      {label && (
        <rect x={x + 9} y={y + h * 0.46} width={w - 18} height={h * 0.3} rx="6" fill={label} />
      )}
    </g>
  )
}

/** A cosmetic tube - flat crimp at the top, tapering body, ribbed collar. */
export function Tube({
  cx, baseY, w = 78, h = 190, body, cap,
}: { cx: number; baseY: number; w?: number; h?: number; body: string; cap: string }) {
  const x = cx - w / 2
  const y = baseY - h
  return (
    <g>
      <path
        d={`M${x + 8},${y + 44} L${x + w - 8},${y + 44} L${x + w},${baseY - 14}
            Q${x + w},${baseY} ${x + w - 16},${baseY} L${x + 16},${baseY}
            Q${x},${baseY} ${x},${baseY - 14} Z`}
        fill={body}
      />
      {/* Ribbed collar - three bars, the shorthand every packaging illustration
          uses for a screw thread. */}
      {[0, 1, 2].map(i => (
        <rect key={i} x={cx - w * 0.2} y={y + 20 + i * 8} width={w * 0.4} height="5" rx="2.5" fill={cap} opacity={0.55 + i * 0.15} />
      ))}
      <rect x={cx - w * 0.24} y={y} width={w * 0.48} height="20" rx="6" fill={cap} />
    </g>
  )
}

/** A baby bottle: teat, collar, body, and measurement ticks down one side. */
export function BabyBottle({
  cx, baseY, w = 88, h = 176, body, cap, milk,
}: { cx: number; baseY: number; w?: number; h?: number; body: string; cap: string; milk: string }) {
  const x = cx - w / 2
  const y = baseY - h
  return (
    <g>
      <rect x={x} y={y + 56} width={w} height={h - 56} rx="18" fill={body} />
      <rect x={x + 6} y={y + 96} width={w - 12} height={h - 108} rx="12" fill={milk} />
      <rect x={cx - w * 0.32} y={y + 40} width={w * 0.64} height="22" rx="7" fill={cap} />
      <path d={`M${cx - 15},${y + 42} Q${cx - 11},${y + 4} ${cx},${y + 4} Q${cx + 11},${y + 4} ${cx + 15},${y + 42} Z`} fill={cap} />
      {[0, 1, 2].map(i => (
        <rect key={i} x={x + 14} y={y + 112 + i * 20} width={i === 1 ? 24 : 15} height="4" rx="2" fill="var(--plate-ink)" opacity="0.22" />
      ))}
    </g>
  )
}

/** A glucose meter: slab body, dark display, one blue test strip entering the
 *  port at the bottom. */
export function GlucoseMeter({
  cx, baseY, w = 106, h = 160,
}: { cx: number; baseY: number; w?: number; h?: number }) {
  const x = cx - w / 2
  const y = baseY - h
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="20" fill="var(--plate-cream)" />
      <rect x={x + 12} y={y + 16} width={w - 24} height={h * 0.36} rx="8" fill="var(--plate-ink)" />
      {/* The reading. Two bars, not a number - a number would be decorative
          text baked into an illustration, which the art direction rules out. */}
      <rect x={x + 22} y={y + 16 + h * 0.12} width={w * 0.34} height="9" rx="4.5" fill="var(--plate-cobalt)" />
      <rect x={x + 22} y={y + 16 + h * 0.12 + 15} width={w * 0.2} height="6" rx="3" fill="var(--plate-cream)" opacity="0.55" />
      <circle cx={cx} cy={y + h * 0.68} r="13" fill="var(--plate-stone)" />
      <rect x={cx - 9} y={baseY - 4} width="18" height="34" rx="4" fill="var(--plate-cobalt)" />
    </g>
  )
}

/** A prescription sheet with an Rx mark and three ruled lines. */
export function RxSheet({
  x, y, w = 128, h = 164, rot = 0,
}: { x: number; y: number; w?: number; h?: number; rot?: number }) {
  return (
    <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
      <rect x={x} y={y} width={w} height={h} rx="10" fill="var(--plate-cream)" />
      <path
        d={`M${x + 20},${y + 34} v42 M${x + 20},${y + 34} h20 a13,13 0 0 1 0,26 h-20
            M${x + 34},${y + 60} l20,24`}
        stroke="var(--plate-cobalt)" strokeWidth="6" strokeLinecap="round" fill="none"
      />
      {[0, 1, 2].map(i => (
        <rect
          key={i}
          x={x + 20} y={y + 96 + i * 20}
          width={w - 40 - (i === 2 ? 28 : 0)} height="6" rx="3"
          fill="var(--plate-ink)" opacity="0.18"
        />
      ))}
    </g>
  )
}

/** A delivery carton, drawn as a flat isometric box. */
export function Parcel({ cx, baseY, s = 1 }: { cx: number; baseY: number; s?: number }) {
  return (
    <g transform={`translate(${cx} ${baseY}) scale(${s})`}>
      <path d="M-64,-8 L0,-40 L64,-8 L0,24 Z" fill="var(--plate-stone)" />
      <path d="M-64,-8 L0,24 L0,88 L-64,56 Z" fill="var(--plate-cream)" />
      <path d="M64,-8 L0,24 L0,88 L64,56 Z" fill="var(--plate-ink)" opacity="0.16" />
      <path d="M-30,-24 L34,8 L34,34 L-30,2 Z" fill="var(--plate-coral)" opacity="0.9" />
    </g>
  )
}

/* ── Botanical ────────────────────────────────────────────────────────────── */

/** A single leaf with a centre vein. */
export function Leaf({
  x, y, rot = 0, s = 1, fill,
}: { x: number; y: number; rot?: number; s?: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0,0 C26,-38 74,-44 96,-12 C70,26 24,30 0,0 Z" fill={fill} />
      <path d="M2,-1 C34,-6 66,-12 92,-13" stroke="var(--plate-ink)" strokeOpacity="0.2" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  )
}

/** A sprig - three leaves off one stem. */
export function Sprig({ x, y, rot = 0, s = 1, fill }: { x: number; y: number; rot?: number; s?: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0,0 C24,-18 52,-34 84,-44" stroke={fill} strokeWidth="6" fill="none" strokeLinecap="round" />
      <Leaf x={10} y={-6} rot={-24} s={0.42} fill={fill} />
      <Leaf x={40} y={-24} rot={-34} s={0.5} fill={fill} />
      <Leaf x={22} y={4} rot={22} s={0.38} fill={fill} />
    </g>
  )
}

/** Five-petal flower. `center` is usually cream or, on the skin-care plate,
 *  the one warm accent on an otherwise cool composition. */
export function Flower({
  cx, cy, r = 22, petal = 'var(--plate-cream)', center = 'var(--plate-coral)',
}: { cx: number; cy: number; r?: number; petal?: string; center?: string }) {
  return (
    <g>
      {[0, 1, 2, 3, 4].map(i => (
        <ellipse
          key={i}
          cx={cx} cy={cy - r * 0.62}
          rx={r * 0.36} ry={r * 0.66}
          fill={petal}
          transform={`rotate(${i * 72} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.3} fill={center} />
    </g>
  )
}

/** A droplet - serum, syrup, a dose. */
export function Droplet({ cx, cy, s = 1, fill }: { cx: number; cy: number; s?: number; fill: string }) {
  return (
    <path
      transform={`translate(${cx} ${cy}) scale(${s})`}
      d="M0,-30 C16,-10 26,2 26,14 A26,26 0 0 1 -26,14 C-26,2 -16,-10 0,-30 Z"
      fill={fill}
    />
  )
}

/** An orange half - the vitamin-C plate's one piece of fruit. */
export function CitrusHalf({ cx, cy, r = 40 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="var(--plate-coral)" />
      <circle cx={cx} cy={cy} r={r * 0.82} fill="var(--plate-cream)" opacity="0.32" />
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d={`M${cx},${cy} L${cx - r * 0.3},${cy - r * 0.74} A${r * 0.78},${r * 0.78} 0 0 1 ${cx + r * 0.3},${cy - r * 0.74} Z`}
          fill="var(--plate-coral)"
          transform={`rotate(${i * 45} ${cx} ${cy})`}
          opacity="0.85"
        />
      ))}
    </g>
  )
}

/** A medical cross. Used sparingly - it is the most literal mark in the kit. */
export function Cross({ cx, cy, s = 26, fill }: { cx: number; cy: number; s?: number; fill: string }) {
  const t = s * 0.38
  return (
    <g fill={fill}>
      <rect x={cx - t / 2} y={cy - s / 2} width={t} height={s} rx={t * 0.3} />
      <rect x={cx - s / 2} y={cy - t / 2} width={s} height={t} rx={t * 0.3} />
    </g>
  )
}

/** A shield - the trust and privacy motif. */
export function Shield({ cx, cy, s = 1, fill }: { cx: number; cy: number; s?: number; fill: string }) {
  return (
    <path
      transform={`translate(${cx} ${cy}) scale(${s})`}
      d="M0,-52 L44,-34 C44,4 26,38 0,52 C-26,38 -44,4 -44,-34 Z"
      fill={fill}
    />
  )
}

/* ── Texture and registration ─────────────────────────────────────────────── */

/** A halftone wash confined to a shape you supply as `d`, or to a circle.
 *  Screen-printers use halftone where a solid would be too heavy; so does this
 *  kit, which is why it is always a separate layer over a flat fill and never
 *  the fill itself. */
export function Halftone({
  d, cx, cy, r, ink = 'ink', opacity = 0.45,
}: {
  d?: string; cx?: number; cy?: number; r?: number
  ink?: 'ink' | 'cobalt' | 'coral' | 'green'; opacity?: number
}) {
  const fill = `url(#riso-dots-${ink})`
  if (d) return <path d={d} fill={fill} opacity={opacity} />
  return <circle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity} />
}

/** Nudges a layer out of register. Sub-pixel at render scale, which is the
 *  point: you read it as print, not as a mistake. */
export function Offset({ by, children }: { by: XY; children: React.ReactNode }) {
  return <g transform={`translate(${by.x} ${by.y})`}>{children}</g>
}
