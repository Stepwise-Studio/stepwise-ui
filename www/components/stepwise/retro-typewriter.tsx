'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

export interface RetroTypewriterProps {
  /** Text already on the page when it mounts. */
  initialText?: string
  /** Characters per line before the carriage wraps. Default 34. */
  columns?    : number
  /** Start muted. Default false. */
  muted?      : boolean
  className?  : string
}

/* ── synthesized sound (Web Audio) ──────────────────────────────────────────
   No audio files — the clack is a filtered noise burst + low thunk, the bell
   two decaying sines, the return a short noise sweep. Context is created lazily
   on the first keystroke so it satisfies the autoplay gesture requirement.    */
let _ctx: AudioContext | null = null
function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!_ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    _ctx = new AC()
  }
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

function clack() {
  const c = audio(); if (!c) return
  const t = c.currentTime
  const len = Math.floor(c.sampleRate * 0.05)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2)
  const src = c.createBufferSource(); src.buffer = buf
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2100 + Math.random() * 400; bp.Q.value = 0.7
  const ng = c.createGain(); ng.gain.value = 0.32
  src.connect(bp).connect(ng).connect(c.destination)
  src.start(t)
  const o = c.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(150, t)
  const og = c.createGain(); og.gain.setValueAtTime(0.13, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.07)
  o.connect(og).connect(c.destination); o.start(t); o.stop(t + 0.08)
}

function bell() {
  const c = audio(); if (!c) return
  const t = c.currentTime
  ;[1380, 2080].forEach((f, i) => {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(i ? 0.05 : 0.11, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9)
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.95)
  })
}

function ret() {
  const c = audio(); if (!c) return
  const t = c.currentTime
  const len = Math.floor(c.sampleRate * 0.18)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const src = c.createBufferSource(); src.buffer = buf
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2
  bp.frequency.setValueAtTime(900, t); bp.frequency.linearRampToValueAtTime(2600, t + 0.16)
  const g = c.createGain(); g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
  src.connect(bp).connect(g).connect(c.destination); src.start(t)
}

/* ── keyboard layout ────────────────────────────────────────────────────── */

const ROWS: { id: string; label: string; char?: string; wide?: number }[][] = [
  '1234567890'.split('').map(ch => ({ id: ch, label: ch, char: ch })),
  'QWERTYUIOP'.split('').map(ch => ({ id: ch, label: ch, char: ch.toLowerCase() })),
  'ASDFGHJKL'.split('').map(ch => ({ id: ch, label: ch, char: ch.toLowerCase() })),
  'ZXCVBNM'.split('').map(ch => ({ id: ch, label: ch, char: ch.toLowerCase() })),
]

/* ── component ──────────────────────────────────────────────────────────── */

export function RetroTypewriter({
  initialText = 'the quick brown fox\n',
  columns = 34,
  muted = false,
  className,
}: RetroTypewriterProps) {
  const [text, setText] = useState(initialText)
  const [focused, setFocused] = useState(false)
  const [isMuted, setMuted] = useState(muted)

  const rootRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)
  const typebarRef = useRef<HTMLDivElement>(null)
  const keyRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const colRef = useRef(0)
  const rang = useRef(false)
  const mutedRef = useRef(isMuted)
  mutedRef.current = isMuted

  // recompute current column from the text tail (keeps bell/wrap correct after edits)
  useEffect(() => {
    const lastNl = text.lastIndexOf('\n')
    colRef.current = text.length - lastNl - 1
    if (colRef.current < columns - 6) rang.current = false
  }, [text, columns])

  // keep paper scrolled to the newest line
  useEffect(() => {
    if (paperRef.current) paperRef.current.scrollTop = paperRef.current.scrollHeight
  }, [text])

  const reduce = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const flashKey = useCallback((id: string) => {
    if (reduce) return
    const el = keyRefs.current[id]
    if (!el) return
    el.classList.add('rt-key-down')
    window.setTimeout(() => el.classList.remove('rt-key-down'), 110)
  }, [reduce])

  const strike = useCallback(() => {
    if (reduce) return
    const el = typebarRef.current
    if (!el) return
    el.classList.remove('rt-strike')
    // force reflow so the animation replays on rapid keys
    void el.offsetWidth
    el.classList.add('rt-strike')
  }, [reduce])

  const newline = useCallback(() => {
    setText(v => v + '\n')
    colRef.current = 0
    rang.current = false
    if (!mutedRef.current) ret()
    flashKey('Return')
  }, [flashKey])

  const typeChar = useCallback((ch: string) => {
    setText(v => v + ch)
    strike()
    if (!mutedRef.current) clack()
    colRef.current += 1
    // ring the margin bell a few columns from the edge, once per line
    if (colRef.current >= columns - 6 && !rang.current) {
      rang.current = true
      if (!mutedRef.current) bell()
    }
    // carriage wraps at the margin like a real machine's return
    if (colRef.current >= columns) {
      setText(v => v + '\n')
      colRef.current = 0
      rang.current = false
    }
  }, [strike, columns])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const k = e.key
    if (k === 'Tab') return
    if (k === 'Backspace') {
      e.preventDefault()
      setText(v => v.slice(0, -1))
      flashKey('Backspace')
      if (!mutedRef.current) clack()
      return
    }
    if (k === 'Enter') { e.preventDefault(); newline(); return }
    if (k.length === 1) {
      e.preventDefault()
      typeChar(k)
      flashKey(k.toUpperCase())
    }
  }

  // clicking a key types it too (touch / mouse), keeping focus on the root
  const clickKey = (char: string, id: string) => {
    typeChar(char)
    flashKey(id)
    rootRef.current?.focus()
  }

  const lines = text.split('\n')

  return (
    <div className={cn('rt-scope select-none', className)} style={{ fontFamily: 'var(--font-typewriter), ui-monospace, monospace' }}>
      <div
        ref={rootRef}
        tabIndex={0}
        role="textbox"
        aria-label="Retro typewriter — focus and type"
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="relative outline-none w-[min(560px,100%)] mx-auto"
      >
        {/* ── paper + carriage ─────────────────────────────────────────── */}
        <div className="relative flex justify-center">
          {/* carriage rail */}
          <div className="absolute top-[calc(100%-30px)] left-1/2 -translate-x-1/2 w-[104%] h-[26px] rounded-full"
               style={{ background: 'linear-gradient(#3a3a40,#17171b)', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }} />
          {/* left/right platen knobs */}
          {['left-[2%]', 'right-[2%]'].map((pos, i) => (
            <div key={i} className={cn('absolute top-[calc(100%-40px)] w-[42px] h-[42px] rounded-full z-20', pos)}
                 style={{ background: 'radial-gradient(circle at 35% 30%, #6a6a72, #2a2a2e 70%)', boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.25), 0 3px 6px rgba(0,0,0,0.45)' }} />
          ))}

          {/* the sheet of paper */}
          <div
            ref={paperRef}
            className="relative z-10 w-[64%] max-w-[340px] h-[168px] overflow-hidden px-6 pt-5 pb-9 rounded-t-[3px]"
            style={{
              background: 'linear-gradient(#fdfaf2, #f6f1e4)',
              boxShadow: '0 -1px 0 rgba(0,0,0,0.05), 0 10px 24px -8px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.04)',
            }}
          >
            <div className="text-[15px] leading-[26px] text-[#2b2723] tracking-tight">
              {lines.map((ln, i) => {
                const last = i === lines.length - 1
                return (
                  <div key={i} className="whitespace-pre min-h-[26px]">
                    {ln}
                    {last && (
                      <span
                        aria-hidden
                        className="inline-block w-[9px] h-[17px] -mb-[2px] ml-[1px] bg-[#2b2723] align-baseline motion-safe:animate-[tw-caret_1.05s_steps(1)_infinite]"
                      />
                    )}
                  </div>
                )
              })}
            </div>
            {/* platen shadow across the paper's foot */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
                 style={{ background: 'linear-gradient(rgba(0,0,0,0) , rgba(0,0,0,0.08))' }} />
          </div>
        </div>

        {/* ── type bar that flicks up on each strike ───────────────────── */}
        <div className="relative flex justify-center h-3">
          <div ref={typebarRef} className="rt-typebar absolute -top-1 w-[3px] h-6 rounded-full origin-bottom"
               style={{ background: 'linear-gradient(#c9ccce,#6b6e70)' }} />
        </div>

        {/* ── machine body ─────────────────────────────────────────────── */}
        <div
          className="relative -mt-1 rounded-[26px] px-6 pt-7 pb-6"
          style={{
            background: 'linear-gradient(165deg, #2c6e68 0%, #1f524d 55%, #163b37 100%)',
            boxShadow: '0 20px 40px -12px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -3px 8px rgba(0,0,0,0.35)',
          }}
        >
          {/* brand plate */}
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1 rounded-[6px] text-[11px] tracking-[0.35em] uppercase text-[#f3ecd9]"
                  style={{ background: 'linear-gradient(#12332f,#0c2622)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.4)' }}>
              Stepwise
            </span>
          </div>

          {/* keyboard */}
          <div className="flex flex-col items-center gap-[7px]">
            {ROWS.map((row, ri) => (
              <div key={ri} className="flex gap-[7px]" style={{ paddingLeft: ri * 14 }}>
                {row.map(k => (
                  <button
                    key={k.id}
                    ref={el => { keyRefs.current[k.id] = el }}
                    type="button"
                    tabIndex={-1}
                    onMouseDown={e => { e.preventDefault(); clickKey(k.char ?? k.label.toLowerCase(), k.id) }}
                    className="rt-key relative w-[34px] h-[34px] rounded-full text-[13px] text-[#2c2823] grid place-items-center"
                    aria-label={k.label}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            ))}
            {/* space bar */}
            <button
              ref={el => { keyRefs.current['Space'] = el }}
              type="button"
              tabIndex={-1}
              onMouseDown={e => { e.preventDefault(); clickKey(' ', 'Space') }}
              className="rt-key rt-spacebar mt-1 h-[26px] w-[62%] rounded-[16px]"
              aria-label="Space"
            />
          </div>
        </div>

        {/* ── click-to-type hint ───────────────────────────────────────── */}
        {!focused && (
          <button
            type="button"
            onClick={() => rootRef.current?.focus()}
            className="absolute inset-0 z-30 flex items-start justify-center pt-14 rounded-[26px] bg-black/0 hover:bg-black/[0.02] transition-colors"
          >
            <span className="mt-2 px-3 py-1.5 rounded-full text-[12px] font-medium bg-zinc-900/80 text-white shadow-lg backdrop-blur-sm"
                  style={{ fontFamily: 'var(--font-inter-display)' }}>
              Click, then start typing ⌨
            </span>
          </button>
        )}

        {/* ── sound toggle ─────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setMuted(m => !m)}
          className="absolute -top-2 -right-2 z-40 w-9 h-9 grid place-items-center rounded-full bg-zinc-900/85 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform"
          aria-label={isMuted ? 'Unmute typing sounds' : 'Mute typing sounds'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor"/><path d="m17 9 4 6M21 9l-4 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8 8 0 0 1 0 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          )}
        </button>
      </div>
    </div>
  )
}
