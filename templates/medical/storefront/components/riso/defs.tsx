/**
 * Shared SVG definitions for every Riso plate on the page.
 *
 * Rendered once, in the root layout. Each plate then references `url(#riso-…)`
 * across SVG documents, which every current engine resolves inside the same
 * HTML document - so a page with fourteen illustrations carries one copy of the
 * halftone lattice instead of fourteen.
 *
 * The wrapper carries `riso-plate` so the pattern fills resolve against the
 * plate ink tokens (and follow the theme) rather than against the page's
 * interface colours. `aria-hidden` and zero size keep it out of the layout and
 * out of the accessibility tree.
 */
export function RisoDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="riso-plate absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        {/* Halftone lattices - one per ink. A screen-print halftone is a
            regular grid of solid dots, not a blur, so these are hard-edged
            circles on a 6px pitch with no anti-aliasing tricks. */}
        <pattern id="riso-dots-ink" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.15" fill="var(--plate-ink)" />
        </pattern>
        <pattern id="riso-dots-cobalt" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.15" fill="var(--plate-cobalt)" />
        </pattern>
        <pattern id="riso-dots-coral" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.15" fill="var(--plate-coral)" />
        </pattern>
        <pattern id="riso-dots-green" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.15" fill="var(--plate-green)" />
        </pattern>

        {/* Ink grain. Fractal noise pushed through a low-alpha matrix and
            composited inside the shape it is applied to, which is what gives a
            flat fill the mottled, slightly starved look of an ink drum that is
            running low. Applied to whole layers, never to a single small
            object - the cost scales with painted area. */}
        <filter id="riso-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="a">
            <feFuncA type="linear" slope="0.16" intercept="0" />
          </feComponentTransfer>
          <feComposite in="a" in2="SourceGraphic" operator="in" result="grain" />
          <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
        </filter>
      </defs>
    </svg>
  )
}
