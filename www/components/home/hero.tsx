'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { MeshGradient } from '@paper-design/shaders-react'
import { Surface } from '@/components/stepwise/primitives/surface'
import { Button } from '@/components/stepwise/button'
import { ThemeToggle } from '@/components/stepwise/theme-toggle'
import { useTheme } from '@/lib/theme'

const LIGHT_AURA = ['#ffffff', '#7dd3fc', '#bae6fd', '#e0f2fe', '#ddd6fe']
const DARK_AURA  = ['#09090b', '#0369a1', '#075985', '#155e75', '#1e1b4b']

// ── time-aware greeting (client-only to dodge hydration mismatch) ────────────
function greeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12)  return 'Good morning, builder'
  if (h >= 12 && h < 17) return 'Good afternoon, builder'
  if (h >= 17 && h < 22) return 'Good evening, builder'
  return `Good ${h === 0 ? 12 : h > 12 ? h - 12 : h}${h >= 22 ? 'pm' : 'am'}, night owl`
}

// ── petal burst — fires when the logo is clicked 5× fast ─────────────────────
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

  const [greet, setGreet] = useState('')
  const [copied, setCopied] = useState(false)
  const [burst, setBurst] = useState(0)
  const clicks = useRef<number[]>([])

  useEffect(() => { setGreet(greeting()) }, [])

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
      <nav className="relative z-10 mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">
        <button onClick={onLogoClick} className="relative flex cursor-pointer select-none items-center gap-2.5">
          <Surface radius={7} className="h-6 w-6 bg-zinc-900 dark:bg-white" />
          <span className="text-[17px] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white">
            Stepwise UI
          </span>
          <PetalBurst burst={burst} />
        </button>
        <div className="flex items-center gap-1.5">
          <Link
            href="/docs/typography"
            className="hidden h-9 items-center rounded-full px-4 text-[14px] font-medium text-zinc-600 transition-colors hover:bg-zinc-900/5 hover:text-zinc-900 sm:flex dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Docs
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* ── hero ── */}
      <section className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 pb-24 pt-20 text-center md:pb-32 md:pt-28">
        {/* time-aware eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: greet ? 1 : 0, y: greet ? 0 : 10 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/60 px-3.5 py-1.5 text-[13px] font-medium tracking-[-0.01em] text-zinc-600 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-500" />
          </span>
          {greet || ' '}
        </motion.p>

        {/* hook — words rise in one after another */}
        <h1 className="max-w-[15ch] text-[42px] font-semibold leading-[1.05] tracking-[-0.04em] text-zinc-900 [text-wrap:balance] md:text-[68px] dark:text-white">
          {'Every great product starts with great UI.'.split(' ').map((w, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.55, delay: 0.08 + i * 0.055, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}&nbsp;
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-[52ch] text-[16px] leading-relaxed text-zinc-600 [text-wrap:pretty] md:text-[18px] dark:text-zinc-400"
        >
          Spend less time building components and more time building products with a
          modern UI library designed for today&apos;s development workflow.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link href="/docs/button">
            <Button size="lg" className="h-[52px] px-[22px] text-[17px]/[1] font-semibold">Browse components</Button>
          </Link>

          {/* copyable install command */}
          <button
            onClick={copy}
            className="group flex h-[52px] items-center gap-3 rounded-full border border-zinc-900/10 bg-white/70 py-3 pl-5 pr-4 font-mono text-[14px] text-zinc-700 backdrop-blur-md transition-colors hover:border-zinc-900/25 active:scale-[0.98] dark:border-white/15 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-white/30"
          >
            <span className="select-none text-zinc-400 dark:text-zinc-500">$</span>
            npx stepwise-ui init
            <span className="relative h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
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
                    <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
                    <rect x="5.5" y="5.5" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M10.5 5.5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2h1.5" stroke="currentColor" strokeWidth="1.3" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </span>
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-10 text-[12px] tracking-[-0.01em] text-zinc-400 dark:text-zinc-500"
        >
          Everything below is real — poke it.
        </motion.p>
      </section>
    </div>
  )
}
