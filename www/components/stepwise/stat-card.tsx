'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils/cn'
import { Surface } from '@/components/stepwise/primitives/surface'

export interface StatCardProps {
  label     : string
  value     : string | number
  /** e.g. { value: '+12.4%', direction: 'up' } */
  change?   : { value: string; direction: 'up' | 'down' | 'neutral' }
  icon?     : React.ReactNode
  accent?   : 'sky' | 'emerald' | 'rose' | 'amber' | 'violet'
  /** Trend line rendered as a full-width area chart along the card's bottom edge. */
  sparkline?: number[]
  className?: string
}

type Accent = NonNullable<StatCardProps['accent']>

const accentStyles: Record<Accent, string> = {
  sky:     'bg-sky-50 text-sky-500 dark:bg-sky-500/20 dark:text-sky-300',
  emerald: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-300',
  rose:    'bg-rose-50 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300',
  amber:   'bg-amber-50 text-amber-500 dark:bg-amber-500/20 dark:text-amber-300',
  violet:  'bg-violet-50 text-violet-500 dark:bg-violet-500/20 dark:text-violet-300',
}

const sparkColor: Record<Accent, string> = {
  sky: '#0ea5e9', emerald: '#10b981', rose: '#f43f5e', amber: '#f59e0b', violet: '#8b5cf6',
}

const changePillStyles: Record<'up' | 'down' | 'neutral', string> = {
  up:      'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  down:    'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
  neutral: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
}

function ChangeArrow({ direction }: { direction: 'up' | 'down' | 'neutral' }) {
  if (direction === 'neutral') {
    return <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M1.5 5h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  }
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" className={direction === 'down' ? 'rotate-180' : undefined}>
      <path d="M5 8.5V1.5M5 1.5 1.5 5M5 1.5 8.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/** Full-bleed area chart — fills the card's bottom edge instead of floating as a disconnected corner squiggle. */
function TrendArea({ data, accent, gradientId }: { data: number[]; accent: Accent; gradientId: string }) {
  const w = 220, h = 52
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const stepX = w / (data.length - 1)
  const pts = data.map((d, i) => [i * stepX, 6 + (h - 12) - ((d - min) / range) * (h - 12)] as const)
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  const color = sparkColor[accent]

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="block" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function StatCard({
  label,
  value,
  change,
  icon,
  accent = 'sky',
  sparkline,
  className,
}: StatCardProps) {
  const gradientId = `stat-spark-${useId()}`
  const hasChart = !!sparkline && sparkline.length > 1

  return (
    <Surface
      radius={20}
      lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}
      className={cn('relative w-[220px] overflow-hidden bg-white dark:bg-zinc-900', className)}
    >
      <div className="flex flex-col gap-3 p-5 pb-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12.5px] font-medium tracking-[-0.01em] text-zinc-500 dark:text-zinc-400">
            {label}
          </span>
          {icon && (
            <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', accentStyles[accent])}>
              {icon}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[28px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-zinc-900 dark:text-white">
            {value}
          </span>
          {change && (
            <span className={cn('flex items-center gap-0.5 rounded-full px-1.5 py-[3px] text-[11px] font-semibold tabular-nums', changePillStyles[change.direction])}>
              <ChangeArrow direction={change.direction} />
              {change.value}
            </span>
          )}
        </div>
      </div>

      {/* Always reserves the chart's full height, with or without data, so
          cards in the same row stay the same height whether or not every
          one of them has a sparkline. */}
      <div className="mt-3" style={{ height: 52 }}>
        {hasChart && <TrendArea data={sparkline!} accent={accent} gradientId={gradientId} />}
      </div>
    </Surface>
  )
}
