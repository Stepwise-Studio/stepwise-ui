'use client'

import { useEffect, useRef, useState, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export interface OtpInputProps {
  length?     : number
  /** 'numeric' → digits only (default). 'alphanumeric' → letters + digits (security code). */
  type?       : 'numeric' | 'alphanumeric'
  value?      : string
  onChange?   : (value: string) => void
  /** Fires once when every box is filled. */
  onComplete? : (code: string) => void
  /** Shows the resend line; called when the user taps "Resend code". */
  onResend?   : () => void
  /** Seconds before resend unlocks. Default 30. */
  resendAfter?: number
  error?      : boolean
  disabled?   : boolean
  className?  : string
}

export function OtpInput({
  length      = 6,
  type        = 'numeric',
  value,
  onChange,
  onComplete,
  onResend,
  resendAfter = 30,
  error       = false,
  disabled    = false,
  className,
}: OtpInputProps) {
  const isAlpha = type === 'alphanumeric'
  // keep only allowed characters; security codes are upper-cased for legibility
  const sanitize = (s: string) =>
    isAlpha ? s.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : s.replace(/\D/g, '')
  const [internal, setInternal] = useState('')
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null)
  const [countdown, setCountdown] = useState(resendAfter)
  const val     = value ?? internal
  const digits  = val.split('').slice(0, length)
  const refs    = useRef<(HTMLInputElement | null)[]>([])
  const doneFor = useRef<string | null>(null)

  // resend countdown — only runs when a resend handler exists
  useEffect(() => {
    if (!onResend || countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [onResend, countdown])

  // fire onComplete exactly once per full code
  useEffect(() => {
    if (val.length === length && doneFor.current !== val) {
      doneFor.current = val
      onComplete?.(val)
    }
    if (val.length < length) doneFor.current = null
  }, [val, length, onComplete])

  const update = (next: string) => {
    if (value === undefined) setInternal(next)
    onChange?.(next)
  }

  const handleChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const raw = sanitize(e.target.value)
    if (!raw) return
    const char = raw[raw.length - 1]
    const arr  = digits.slice()
    arr[i] = char
    for (let j = i + 1; j < length; j++) arr[j] = arr[j] ?? ''
    update(arr.join('').slice(0, length))
    if (i < length - 1) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (digits[i]) {
        const arr = digits.slice()
        arr[i] = ''
        update(arr.join(''))
      } else if (i > 0) {
        const arr = digits.slice()
        arr[i - 1] = ''
        update(arr.join(''))
        refs.current[i - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      refs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      refs.current[i + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = sanitize(e.clipboardData.getData('text')).slice(0, length)
    update(pasted)
    refs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  const resend = () => {
    setCountdown(resendAfter)
    update('')
    refs.current[0]?.focus()
    onResend?.()
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* the row shakes as one when error flips on */}
      <motion.div
        role="group"
        aria-label={`${length}-digit verification code`}
        className="flex gap-2"
        animate={error ? { x: [0, -7, 6, -4, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {Array.from({ length }, (_, i) => {
          const isFilled  = !!digits[i]
          const isFocused = focusedIdx === i

          return (
            <motion.div
              key={i}
              className="relative"
              animate={{ y: isFocused ? -2 : 0, scale: isFilled && !isFocused ? 1 : isFocused ? 1.04 : 1 }}
              transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
            >
              <input
                ref={el => { refs.current[i] = el }}
                type="text"
                inputMode={isAlpha ? 'text' : 'numeric'}
                pattern={isAlpha ? '[a-zA-Z0-9]*' : '[0-9]*'}
                autoCapitalize={isAlpha ? 'characters' : 'off'}
                autoComplete="one-time-code"
                spellCheck={false}
                maxLength={1}
                value={digits[i] ?? ''}
                disabled={disabled}
                onChange={e => handleChange(i, e)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
                onFocus={e => { setFocusedIdx(i); e.target.select() }}
                onBlur={() => setFocusedIdx(null)}
                aria-label={`Digit ${i + 1}`}
                aria-invalid={error || undefined}
                className={cn(
                  'h-14 w-11 rounded-[12px] text-center outline-none',
                  'text-[22px] font-semibold tracking-[-0.01em]',
                  'bg-zinc-50 dark:bg-zinc-900',
                  'text-transparent caret-transparent', // real glyph is the animated span below
                  'transition-[box-shadow,background-color] duration-150',
                  error
                    ? 'ring-2 ring-rose-400 dark:ring-rose-500'
                    : isFocused
                      ? 'ring-2 ring-sky-400 bg-white dark:bg-zinc-800'
                      : isFilled
                        ? 'ring-1 ring-zinc-300 dark:ring-zinc-600'
                        : 'ring-1 ring-zinc-200 dark:ring-zinc-700',
                  disabled && 'cursor-not-allowed opacity-40',
                )}
              />
              {/* digit pops in with a blurred spring; input text is transparent */}
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="popLayout" initial={false}>
                  {isFilled && (
                    <motion.span
                      key={digits[i] + i}
                      initial={{ opacity: 0, scale: 0.4, filter: 'blur(4px)', y: 6 }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                      exit={{ opacity: 0, scale: 0.4, filter: 'blur(4px)' }}
                      transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                      className={cn(
                        'text-[22px] font-semibold tracking-[-0.01em]',
                        error ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-100',
                      )}
                    >
                      {digits[i]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.div>
          )
        })}
      </motion.div>

      {/* resend line — countdown, then a live link */}
      {onResend && (
        <div className="flex items-center gap-1 text-[13px] text-zinc-400 dark:text-zinc-500">
          <span>Didn&apos;t get the code?</span>
          {countdown > 0 ? (
            <span className="tabular-nums">
              Resend in 0:{String(countdown).padStart(2, '0')}
            </span>
          ) : (
            <button
              type="button"
              onClick={resend}
              className="font-medium text-sky-500 transition-colors hover:text-sky-600 dark:hover:text-sky-400"
            >
              Resend code
            </button>
          )}
        </div>
      )}
    </div>
  )
}
