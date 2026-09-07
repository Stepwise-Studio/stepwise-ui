'use client'

import { Fragment, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { MeshGradient } from '@paper-design/shaders-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { GithubIcon, ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { GlowButton } from '@/components/stepwise/glow-button'
import { ThemeToggle } from '@/components/stepwise/theme-toggle'
import { useTheme } from '@/lib/theme'

const WORDS = 'The interface is part of the product. Make it count.'.split(' ')

/* An even curve, because these are pure opacity fades with no travel.
 * The previous [0.22, 1, 0.36, 1] was picked for the slide-up: it front-loads
 * hard, covering most of its progress in the first third. That reads as a
 * flash rather than a fade once there is no movement to carry it. */
const EASE = [0.33, 0, 0.4, 1] as const

/* ── hero entrance timeline ──────────────────────────────────────────────────
 * The order is nav → headline → subtext → CTA → showcase, but the steps
 * OVERLAP rather than queue. Each one starts while the previous is still
 * settling, so the hero reads as a single cascade falling down the page
 * instead of a series of discrete blocks switching on one after another -
 * which is what makes a staged entrance feel like a loading screen.
 *
 * `HANDOFF` is the whole rule, and the only number worth tuning. Everything
 * else is derived from the step before it, so the sequence cannot drift out
 * of order the way it did when each delay was hand-picked (the subtext used
 * to start at 0.55s and finish at 1.05s while the headline was still writing
 * itself until 1.13s - the supporting copy visibly overtook the headline).
 *
 * `HERO_DONE` is exported because the showcase's first band chains off it -
 * see AFTER_HERO in canvas.tsx. */

/**
 * How far through its own reveal a step is when the next one begins.
 * `1` would be strictly sequential - every element waiting for the one
 * before it to fully land, which reads as a mechanical loading queue.
 * `0.8` keeps the motion continuous: the next element is already moving
 * while the previous settles, and because it still starts *after* the
 * previous did, nothing can overtake what came before it.
 */
const HANDOFF = 0.8

/**
 * The nav hands off much sooner than the content steps do. It is page chrome,
 * not part of the reading cascade - the headline is the first thing anyone is
 * actually here to read, so making it wait 80% of the nav's fade left a gap
 * that read as a stall before the page had said anything.
 */
const NAV_HANDOFF = 0.3

/** Start of the step following one that begins at `start` and runs `span`. */
const after = (start: number, span: number, handoff = HANDOFF) => start + span * handoff

const REVEAL_DUR  = 0.4
const NAV_STAGGER = 0.06   // logo, then the icon cluster beside it

const NAV_IN          = 0
const NAV_SPAN        = NAV_STAGGER + REVEAL_DUR
/* The headline fades in as one block. It used to stagger word by word, which
 * at this size read as a typewriter spelling the sentence out rather than a
 * headline arriving - so there is no per-word delay any more, and the whole
 * h1 carries a single fade. */
const HEADLINE_IN     = after(NAV_IN, NAV_SPAN, NAV_HANDOFF)
const SUBTEXT_IN      = after(HEADLINE_IN, REVEAL_DUR)
const CTA_IN          = after(SUBTEXT_IN, REVEAL_DUR)
export const HERO_DONE = after(CTA_IN, REVEAL_DUR)

const LIGHT_AURA = ['#ffffff', '#7dd3fc', '#bae6fd', '#e0f2fe', '#ddd6fe']
const DARK_AURA  = ['#09090b', '#0369a1', '#075985', '#155e75', '#1e1b4b']
const REPO_URL = 'https://github.com/Stepwise-Studio/stepwise-ui'

// ── petal burst - fires when the logo is clicked 5× fast ─────────────────────
function PetalBurst({ burst }: { burst: number }) {
  if (!burst) return null
  return (
    <span className="pointer-events-none absolute left-1/2 top-1/2 z-50">
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const dist = 46 + (i % 3) * 22
        return (
          <motion.span
            key={`${burst}-${i}`}
            className="absolute"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: [0, 1.1, 0.9],
              opacity: [1, 1, 0],
              rotate: i % 2 ? 200 : -160,
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg width="12" height="12" viewBox="0 0 100 100">
              <path
                d="M50 90 C40 60 40 35 50 20 C60 35 60 60 50 90 Z"
                fill={['#fb7185', '#a78bfa', '#38bdf8', '#fbbf24'][i % 4]}
              />
            </svg>
          </motion.span>
        )
      })}
    </span>
  )
}

export function HomeHero() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [copied, setCopied] = useState(false)
  const [burst, setBurst] = useState(0)
  const clicks = useRef<number[]>([])

  // logo ×5 within 2s → petal bloom
  const onLogoClick = () => {
    const now = Date.now()
    clicks.current = [...clicks.current.filter(t => now - t < 2000), now]
    if (clicks.current.length >= 5) {
      clicks.current = []
      setBurst(b => b + 1)
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText('npx stepwise-ui init')
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard blocked */ }
  }

  return (
    <div className="relative overflow-hidden">
      {/* ── shader aura ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          maskImage: 'linear-gradient(to bottom, #000 55%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent)',
        }}
      >
        <MeshGradient
          key={theme}
          colors={dark ? DARK_AURA : LIGHT_AURA}
          distortion={0.9}
          swirl={0.6}
          speed={0.45}
          grainOverlay={0.06}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      {/* soften the shader so type stays legible */}
      <div aria-hidden className="absolute inset-0 bg-white/35 dark:bg-zinc-950/45" />

      {/* ── nav ── */}
      <nav className="relative z-10 flex h-16 w-full items-center justify-between px-6 sm:px-10 md:px-16">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: REVEAL_DUR, delay: NAV_IN, ease: EASE }}
          onClick={onLogoClick}
          className="relative flex cursor-pointer select-none items-center gap-2.5"
        >
          <Image
            src={dark ? '/brand/logo-mark-dark.svg' : '/brand/logo-mark.svg'}
            alt=""
            width={41}
            height={16}
            className="h-4 w-auto"
            priority
          />
          <span className="text-[19px] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white">
            Stepwise UI
          </span>
          <PetalBurst burst={burst} />
        </motion.button>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: REVEAL_DUR, delay: NAV_IN + NAV_STAGGER, ease: EASE }}
          className="flex items-center gap-1"
        >
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors duration-150 hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <HugeiconsIcon icon={GithubIcon} size={18} strokeWidth={1.8} color="currentColor" />
          </a>
          <ThemeToggle className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white" />
        </motion.div>
      </nav>

      {/* ── hero ── */}
      {/* No z-index needed: positioned elements paint in DOM order and this
          comes after the shader, so it sits on top regardless. (This used to
          carry a note about deliberately avoiding `z-10` so the headline's
          mix-blend-mode could reach the shader as a backdrop — that blend is
          gone, so a stacking context here would now be harmless.) */}
      <section className="relative mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 pb-24 pt-24 text-center md:pb-32 md:pt-36">
        {/* hook - words rise in one after another */}
        {/* The letters are a gradient clipped to the glyphs (see `.hero-title`
            in globals.css). The gradient falls to a mid tone so the type gains
            depth down the second line instead of reading as flat white.
            `pb` because background-clip:text slices descenders. */}
        {/* One fade on the whole headline, not per word. The words each used to
            carry their own staggered reveal, which at this size read as a
            typewriter spelling the sentence out rather than a headline
            arriving. Animating the h1 itself also means nothing is layered
            over the glyphs: a `filter` on a child rasterises it into its own
            buffer that `background-clip: text` cannot reach into, and the
            headline silently renders as nothing - the bug that used to blank
            it on a theme toggle. Opacity on the parent has no such problem. */}
        <motion.h1
          className="hero-title max-w-[22ch] text-[42px] font-semibold leading-[1.05] tracking-[-0.04em] pb-[0.1em] md:max-w-none md:text-[68px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: REVEAL_DUR, delay: HEADLINE_IN, ease: EASE }}
        >
          {/* A hard break after "the" (not `text-wrap:balance`) - balance
              recomputes its split against the block's own resolved width,
              which is bigger on a bigger monitor and can land on a
              different, worse-looking break. A fixed break reads the same
              everywhere; each half still wraps normally on narrow screens
              where even that half doesn't fit on one line. */}
          {WORDS.map((w, i) => (
            <Fragment key={i}>
              {w}
              {i === 5 ? <br /> : '\u00a0'}
            </Fragment>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: REVEAL_DUR, delay: SUBTEXT_IN, ease: EASE }}
          className="mt-6 max-w-[52ch] text-[16px] leading-relaxed text-zinc-600 text-pretty md:text-[18px] dark:text-zinc-400"
        >
          A growing collection of UI components for building modern products without
          starting from a blank screen - flexible by default, and easy to make your own.
        </motion.p>

        {/* CTA + install line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: REVEAL_DUR, delay: CTA_IN, ease: EASE }}
          className="mt-9 flex flex-col items-center gap-4"
        >
          <Link href="/docs/introduction">
            <GlowButton
              size="lg"
              radius={100}
              slideIcon
              iconPosition="right"
              icon={<HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2.25} color="currentColor" />}
              /* Frosted, not opaque. GlowButton's own fill is a solid
                 zinc gradient, which sat on the mesh shader like a sticker.
                 These override its `from-`/`to-` stops through the same
                 tailwind-merge `cn` the component already runs, so the fill
                 becomes a translucent wash and `backdrop-blur` pulls the
                 shader's colour up through it. The rainbow glow is unaffected:
                 it paints as a negative-z child *above* the button's own
                 background, not behind it. */
              className="font-semibold backdrop-blur-xl from-white/75 to-white/50 dark:from-white/[0.14] dark:to-white/[0.05]"
              style={{ height: 54, padding: '0 28px', fontSize: 17, lineHeight: 1 }}
            >
              Browse components
            </GlowButton>
          </Link>

          {/* The install command used to be a second pill beside the CTA. Two
              solid pills of the same height and near-identical width read as a
              segmented control rather than a primary and a secondary, and in
              dark mode the light one was the brightest thing on the screen -
              louder than the headline and than the action it sat next to. As a
              quiet mono line it still gets copied by the people who came for
              it, without taking the first look away from the CTA.

              The two-row hover roll went with it: its only job was revealing
              the copy icon, and at this scale the icon can just stay visible. */}
          <button
            onClick={copy}
            aria-label="Copy install command"
            className="group flex cursor-pointer items-center gap-2 font-mono text-[14px] text-zinc-600 transition-colors duration-150 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            npx stepwise-ui init
            <span className="relative h-3.5 w-3.5 shrink-0 opacity-70 transition-opacity duration-150 group-hover:opacity-100">
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.svg
                    key="tick"
                    viewBox="0 0 16 16" fill="none"
                    className="absolute inset-0 text-green-500"
                    initial={{ scale: 0.25, opacity: 0, filter: 'blur(4px)' }}
                    animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ scale: 0.25, opacity: 0, filter: 'blur(4px)' }}
                    transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                  >
                    {/* Raised 1.25 from the obvious "M3 8.5 6.5 12 13 4.5". Centring a
                        tick on its viewBox reads low: the shape's weight is its bottom
                        vertex, which then lands on the text baseline while the letters
                        beside it sit in the x-height band above. Raising it puts the
                        vertex ~2px above the baseline and the glyph's mass inside that
                        band, which is where the eye expects it. */}
                    <path d="M3 7.25 6.5 10.75 13 3.25" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="copy"
                    viewBox="0 0 16 16" fill="none"
                    className="absolute inset-0"
                    initial={{ scale: 0.25, opacity: 0, filter: 'blur(4px)' }}
                    animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ scale: 0.25, opacity: 0, filter: 'blur(4px)' }}
                    transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                  >
                    <rect x="5.5" y="5.5" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M10.5 5.5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2h1.5" stroke="currentColor" strokeWidth="1.8" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </span>
          </button>
        </motion.div>
      </section>
    </div>
  )
}
