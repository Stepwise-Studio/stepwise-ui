'use client'

import { StatCard } from '@/components/stepwise/stat-card'

function RevenueIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v16M14 5.5c0-1.4-1.8-2.5-4-2.5s-4 1.1-4 2.5S7.8 8 10 8s4 1.1 4 2.5-1.8 2.5-4 2.5-4-1.1-4-2.5"/>
    </svg>
  )
}
function UsersIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="7" r="3"/><path d="M2.5 17c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><path d="M14 8a2.5 2.5 0 1 0 0-5"/><path d="M17.5 17c0-2.5-1.7-4.3-4-4.9"/>
    </svg>
  )
}
function ChurnIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10a7 7 0 1 1 2.5 5.4"/><path d="M3 15v-4h4"/>
    </svg>
  )
}
function LatencyIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7.5"/><path d="M10 5.5V10l3 2"/>
    </svg>
  )
}

export function StatCardGridPreview() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        label="Revenue"
        value="$48.2K"
        icon={<RevenueIcon />}
        accent="emerald"
        change={{ value: '+12.4%', direction: 'up' }}
        sparkline={[4, 6, 5, 8, 7, 9, 12]}
      />
      <StatCard
        label="Active users"
        value="3,214"
        icon={<UsersIcon />}
        accent="sky"
        change={{ value: '+4.1%', direction: 'up' }}
        sparkline={[10, 9, 11, 10, 13, 12, 14]}
      />
      <StatCard
        label="Churn rate"
        value="2.4%"
        icon={<ChurnIcon />}
        accent="rose"
        change={{ value: '-0.6%', direction: 'down' }}
        sparkline={[5, 6, 5.5, 4, 3.6, 3, 2.4]}
      />
      <StatCard
        label="Avg. latency"
        value="184ms"
        icon={<LatencyIcon />}
        accent="violet"
        change={{ value: '0.0%', direction: 'neutral' }}
      />
    </div>
  )
}
