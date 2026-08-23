'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

// Reverse pop-out duration. Closes read best quick and quiet — shorter than
// the 300ms typing-in spring — so backspacing feels brisk, not laggy.
const EXIT_MS = 160

export interface TypewriterProps {
  /** One string types on and stays; multiple cycle (type → hold → delete → next). */
  words         : string | string[]
  /** ms per character while typing. Default 65. */
  typeSpeed?    : number
  /** ms per character while deleting. Default 35. */
  deleteSpeed?  : number
  /** ms to hold a completed word before deleting. Default 1400. */
  holdTime?     : number
  /** Loop the sequence. Default true when multiple words. */
  loop?         : boolean
  className?    : string
  caretClassName?: string
}

/**
 * Typewriter — types a string on character by character with a blinking caret.
 * Pass an array to cycle words (type, hold, backspace, next). A single string
 * types once and holds. Reduced motion renders the first/only word statically.
 */
export function Typewriter({
  words,
  typeSpeed = 65,
  deleteSpeed = 35,
  holdTime = 1400,
  loop,
  className,
  caretClassName,
}: TypewriterProps) {
  const list = Array.isArray(words) ? words : [words]
  const shouldLoop = loop ?? list.length > 1
  const reduce = useReducedMotion()

  const [text, setText] = useState('')
  // Screen readers: announce the current word once typing finishes — not per
  // character. Stable sr-only region stays mounted so polite updates are reliable.
  const [liveText, setLiveText] = useState('')
  // The caret blinks only while idle (the `holding` pause between words) —
  // solid and steady while actively typing or deleting, so it never flickers
  // out of sync with a character that's mid-keystroke.
  const [holding, setHolding] = useState(false)
  const wordIdx = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Bumped every time a new word starts typing. Character keys are
  // `${gen}-${i}` — without this, index-only keys collide across a word
  // transition: the outgoing word's char 0 is still mid exit-animation
  // exactly when the incoming word's char 0 mounts, and AnimatePresence
  // blends the two into one glyph instead of sequencing them, because
  // reused positional keys are treated as the same element.
  const gen = useRef(0)

  useEffect(() => {
    if (reduce) {
      const word = list[0] ?? ''
      setText(word)
      setLiveText(word)
      return
    }

    let phase: 'typing' | 'holding' | 'deleting' = 'typing'
    let i = 0

    const step = () => {
      const current = list[wordIdx.current]

      if (phase === 'typing') {
        i++
        setText(current.slice(0, i))
        if (i >= current.length) {
          phase = 'holding'
          setHolding(true)
          setLiveText(current)
          timer.current = setTimeout(step, holdTime)
        } else {
          timer.current = setTimeout(step, typeSpeed)
        }
        return
      }

      if (phase === 'holding') {
        // Last word and not looping → stop with full text shown.
        const isLast = wordIdx.current === list.length - 1
        if (list.length === 1 || (isLast && !shouldLoop)) return
        phase = 'deleting'
        setHolding(false)
        timer.current = setTimeout(step, deleteSpeed)
        return
      }

      // deleting
      i--
      setText(current.slice(0, i))
      if (i <= 0) {
        phase = 'typing'
        wordIdx.current = (wordIdx.current + 1) % list.length
        gen.current++
        // The last character's reverse pop-out is still finishing (EXIT_MS) —
        // wait for it before the next word's first character mounts in the
        // same flex slot, or the two would render side by side for a beat.
        timer.current = setTimeout(step, Math.max(typeSpeed, EXIT_MS))
      } else {
        timer.current = setTimeout(step, deleteSpeed)
      }
    }

    timer.current = setTimeout(step, typeSpeed)
    return () => { if (timer.current) clearTimeout(timer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, typeSpeed, deleteSpeed, holdTime, shouldLoop, JSON.stringify(list)])

  return (
    // inline-grid + every candidate word stacked in the same cell: the grid track
    // auto-sizes to the widest word, so the box holds a constant width and sibling
    // text never reflows as the visible word types or deletes. Pure CSS, no
    // ResizeObserver or width measurement needed — stays correct across fonts,
    // tracking, and font-size changes.
    <span className={cn('relative inline-grid whitespace-pre align-baseline', className)}>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{liveText}</span>
      {list.map((w, i) => (
        <span key={i} aria-hidden className="invisible pointer-events-none col-start-1 row-start-1">
          {w}
        </span>
      ))}
      <span className="col-start-1 row-start-1 inline-flex items-baseline">
        {/* each character pops in with the same blurred spring as the OTP digit
            reveal, and pops back out in reverse on delete — keyed by position
            so only the newest/last char (dis)mounts; already-typed characters
            keep their identity and never re-animate. The exit is quicker than
            the enter (closes read best quick and quiet), and the state machine
            waits EXIT_MS before starting the next word so the last exiting
            character finishes before the new one mounts in the same flex slot
            — otherwise they'd render side by side for a beat. */}
        <span aria-hidden className="relative inline-flex">
          {reduce ? (
            // Reduced motion: the effect above sets the full word once and
            // never runs the char-by-char loop again, but AnimatePresence's
            // `initial={false}` only suppresses items present at ITS OWN first
            // render — since text starts empty, the word arriving a tick later
            // still counts as a fresh mount and would play the full spring
            // burst. Skip the animated path entirely and render plain text.
            <span style={{ whiteSpace: 'pre' }}>{text}</span>
          ) : (
            // popLayout: the moment a character starts exiting it's pulled out
            // of flex flow (position: absolute) so the caret and remaining
            // characters snap to their new position immediately — otherwise
            // the still-fading "ghost" characters keep their layout footprint
            // for the full exit duration and shove the caret away from the
            // real cursor position, which is exactly what looked like "the
            // caret doesn't come back" while deleting.
            <AnimatePresence initial={false} mode="popLayout">
              {text.split('').map((ch, i) => (
                <motion.span
                  key={`${gen.current}-${i}`}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.4, filter: 'blur(4px)', y: 6 }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                  exit={{
                    opacity: 0, scale: 0.4, filter: 'blur(4px)', y: 6, position: 'absolute',
                    transition: { type: 'spring', duration: EXIT_MS / 1000, bounce: 0 },
                  }}
                  transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                  style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                  {ch}
                </motion.span>
              ))}
            </AnimatePresence>
          )}
        </span>
        {/* solid while typing/deleting so it never flickers mid-keystroke;
            blinks only once idle, restarting from solid at the top of the
            keyframe (0% = opaque) exactly when the hold begins */}
        <span
          aria-hidden
          className={cn(
            'inline-block w-[3px] rounded-full self-stretch bg-current translate-y-[0.1em]',
            holding && 'motion-safe:animate-[tw-caret_1.1s_steps(1)_infinite]',
            caretClassName,
          )}
        />
      </span>
    </span>
  )
}
