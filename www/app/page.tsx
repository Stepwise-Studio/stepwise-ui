import { HomeHero } from '@/components/home/hero'
import { HomeCanvas } from '@/components/home/canvas'

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <HomeHero />
      <HomeCanvas />

      {/* footer strip — the flower photo as the actual page-bottom band, the
          credit text sitting directly over it. Two theme-matched photos
          (a navy-dark crop and a cream-light crop of the same shot, each
          generated already matted to the exact page background) swap via
          `dark:`.

          The footer's own height is locked to the image's aspect ratio
          (`aspectRatio` below, matching the 1672×500 crop exactly) rather
          than a fixed px value, and `bg-cover` (no scale-down) is what
          makes it span edge-to-edge — a box whose shape already matches
          the image's own shape needs no cropping and no zoom.

          The light photo's flat top is a couple of RGB units off the page's
          exact `#fafafa` — invisible pixel-to-pixel, but a flat near-white
          band reads any hard 1-line step as a seam. A blend mode can't fix
          that (multiply/screen just shift the mismatch, they don't zero
          it); a soft mask fade dissolves the edge instead of correcting
          its color, so the tiny gap has room to disappear gradually rather
          than snapping at one pixel. The dark photo doesn't need it — its
          own top matched cleanly already. */}
      <footer className="relative w-full min-h-[260px] overflow-hidden bg-zinc-50 dark:bg-zinc-950" style={{ aspectRatio: '1672 / 500' }}>
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-bottom dark:hidden"
          style={{
            backgroundImage: "url('/footer/flowers-light.webp')",
            maskImage: 'linear-gradient(to bottom, transparent, black 12%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 12%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-cover bg-bottom dark:block"
          style={{ backgroundImage: "url('/footer/flowers-dark.webp')" }}
        />
        <div className="relative mx-auto flex h-full w-full max-w-[1200px] items-start justify-center px-5 pt-16 text-[14px] text-zinc-500 md:px-8 md:pt-40 dark:text-zinc-300">
          {/* Only the handle reacts on hover, and only while the pointer is
              actually over it — `hover:` directly on this span, not `group`
              on the whole link, so mousing over "Crafted by" does nothing. */}
          <a href="https://x.com/akhil_4109" target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline gap-1">
            <span>Crafted by</span>
            <span className="text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-300 dark:hover:text-white">
              @akhil_4109
            </span>
          </a>
        </div>
      </footer>
    </main>
  )
}
