'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils/cn'

export interface MascotLoaderProps {
  /** Real progress, 0–100. Every part of the choreography reads from this. */
  progress  : number
  /** Track width in px. Default 260. */
  width?    : number
  /** Show the % readout. Default true. */
  showValue?: boolean
  /** What the mascot is busy with. */
  label?    : string
  className?: string
}

const BODY = 34

/**
 * A mascot that actually does the work. It walks the track at your real
 * `progress`, leaning into it and straining as it goes — then plants, hops, and
 * grins when the number lands on 100. Nothing here is on a timer: the position,
 * the effort, and the celebration are all read from `progress`, so it can never
 * lie about how far along you are.
 */
export function MascotLoader({
  progress,
  width = 260,
  showValue = true,
  label,
  className,
}: MascotLoaderProps) {
  const reduce = useReducedMotion()
  const p = Math.min(100, Math.max(0, progress))
  const done = p >= 100
  const moving = p > 0 && !done

  // effort ramps up as it climbs — leans further, works harder
  const effort = p / 100
  const lean = moving ? 4 + effort * 5 : 0

  return (
    <div className={cn('inline-flex flex-col gap-2', className)} style={{ width }}
         role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p)}
         aria-label={label ?? 'Loading'}>

      {/* mascot rides above the track, parked at the fill's leading edge */}
      <div className="relative" style={{ height: BODY + 16 }}>
        <motion.div
          className="absolute bottom-0"
          style={{ left: `${p}%`, x: '-50%' }}
          animate={{ left: `${p}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          {/* hop on completion; trudge while working */}
          <motion.div
            animate={
              reduce ? {}
              : done   ? { y: [0, -14, 0, -6, 0] }
              : moving ? { y: [0, -2.5, 0] }
              : {}
            }
            transition={
              done
                ? { duration: 0.7, times: [0, 0.3, 0.55, 0.78, 1], ease: 'easeOut' }
                : { duration: 0.42, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <motion.svg
              width={BODY} height={BODY} viewBox="0 0 34 34" className="overflow-visible"
              animate={reduce ? {} : { rotate: done ? 0 : lean }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              style={{ originX: 0.5, originY: 1 }}
            >
              {/* squash under load, pop on the win */}
              <motion.g
                animate={
                  reduce ? {}
                  : done   ? { scaleX: [1, 1.15, 0.95, 1], scaleY: [1, 0.85, 1.08, 1] }
                  : moving ? { scaleY: [1, 0.94, 1], scaleX: [1, 1.05, 1] }
                  : {}
                }
                transition={done ? { duration: 0.7 } : { duration: 0.42, repeat: Infinity, ease: 'easeInOut' }}
                style={{ originX: 0.5, originY: 1 }}
              >
                <rect x="3" y="6" width="28" height="24" rx="11" className="fill-zinc-900 dark:fill-white" />

                {/* eyes: open while working, happy arcs when done */}
                {done ? (
                  <>
                    <path d="M10 17 q3 -3.4 6 0" fill="none" strokeWidth="1.8" strokeLinecap="round" className="stroke-white dark:stroke-zinc-900" />
                    <path d="M19 17 q3 -3.4 6 0" fill="none" strokeWidth="1.8" strokeLinecap="round" className="stroke-white dark:stroke-zinc-900" />
                  </>
                ) : (
                  <>
                    <circle cx="13" cy="17" r="2.4" className="fill-white dark:fill-zinc-900" />
                    <circle cx="22" cy="17" r="2.4" className="fill-white dark:fill-zinc-900" />
                    {/* pupils drift forward — it's watching where it's going */}
                    <circle cx={13.9} cy="17.6" r="1" className="fill-zinc-900 dark:fill-white" />
                    <circle cx={22.9} cy="17.6" r="1" className="fill-zinc-900 dark:fill-white" />
                  </>
                )}

                {/* mouth: strained line while pushing, grin at the end */}
                {done
                  ? <path d="M13 23 q4 4 8 0" fill="none" strokeWidth="1.6" strokeLinecap="round" className="stroke-white dark:stroke-zinc-900" />
                  : <path d="M14 23.5 h6" fill="none" strokeWidth="1.6" strokeLinecap="round" className="stroke-white dark:stroke-zinc-900" />}
              </motion.g>

              {/* feet trudge in alternation */}
              {[11, 20].map((x, i) => (
                <motion.rect
                  key={x} x={x} y="29" width="4" height="3" rx="1.5"
                  className="fill-zinc-900 dark:fill-white"
                  animate={reduce || !moving ? {} : { y: [29, 27.5, 29] }}
                  transition={{ duration: 0.42, repeat: Infinity, ease: 'easeInOut', delay: i * 0.21 }}
                />
              ))}
            </motion.svg>
          </motion.div>

          {/* the win: a little burst */}
          {done && !reduce && (
            <>
              {[-1, 0, 1].map(d => (
                <motion.span
                  key={d}
                  className="absolute left-1/2 top-0 h-1 w-1 rounded-full bg-amber-400"
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], x: d * 16, y: -18, scale: [0, 1, 0.4] }}
                  transition={{ duration: 0.6, delay: 0.12, ease: 'easeOut' }}
                />
              ))}
            </>
          )}
        </motion.div>
      </div>

      {/* the track it's actually pushing */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <motion.div
          className={cn('h-full rounded-full', done ? 'bg-green-500' : 'bg-zinc-900 dark:bg-white')}
          animate={{ width: `${p}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      {(showValue || label) && (
        <div className="flex items-baseline justify-between">
          <span className="text-[12px] text-zinc-500 dark:text-zinc-400">
            {label ?? (done ? 'All done' : 'Working…')}
          </span>
          {showValue && (
            <span className="text-[12px] font-medium tabular-nums text-zinc-700 dark:text-zinc-200">
              {Math.round(p)}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}
