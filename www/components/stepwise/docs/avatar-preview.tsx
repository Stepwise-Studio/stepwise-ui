'use client'

import { Avatar, AvatarGroup } from '@/components/stepwise/avatar'

const TEAM = [
  { name: 'Asta' },
  { name: 'Noelle Silva' },
  { name: 'Yami Sukehiro' },
  { name: 'Magna Swing' },
  { name: 'Luck Voltia' },
  { name: 'Vanessa Enoshima' },
  { name: 'Finral Roulacase' },
]

const SKY = 'text-sky-600 dark:text-sky-400'

// The 5 illustrated avatars this docs site ships in /public/avatars - used
// here as the "bring your own picture" example. They're a docs asset, not
// part of the installed component, so copy the SVGs into your own project
// (or just point `src` at any image of yours - see the Image section).
const CHARACTERS = [
  { name: 'Mira',    src: '/avatars/avatar1.svg' },
  { name: 'Kai',     src: '/avatars/avatar2.svg' },
  { name: 'Yuna',    src: '/avatars/avatar3.svg' },
  { name: 'Theo',    src: '/avatars/avatar4.svg' },
  { name: 'Snoofy',  src: '/avatars/avatar5.svg' },
]

export function AvatarSizesPreview() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-6">
      {(['xs', 'sm', 'default', 'lg'] as const).map(s => (
        <div key={s} className="flex flex-col items-center gap-2">
          <Avatar name="Asta" size={s} />
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{s}</span>
        </div>
      ))}
    </div>
  )
}

export function AvatarDefaultPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {TEAM.slice(0, 4).map(t => <Avatar key={t.name} name={t.name} />)}
    </div>
  )
}

export function AvatarAccentPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {TEAM.slice(0, 4).map(t => (
        <Avatar key={t.name} name={t.name} textClassName={SKY} />
      ))}
    </div>
  )
}

export function AvatarLettersPreview() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {TEAM.slice(0, 4).map((t, i) => (
            <Avatar key={t.name} name={t.name} letters={1} textClassName={i % 2 ? SKY : undefined} />
          ))}
        </div>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">1 letter (default)</span>
      </div>
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {TEAM.slice(0, 4).map((t, i) => (
            <Avatar key={t.name} name={t.name} letters={2} textClassName={i % 2 ? SKY : undefined} />
          ))}
        </div>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">2 letters</span>
      </div>
    </div>
  )
}

export function AvatarImagePreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {CHARACTERS.map(c => (
        <Avatar key={c.name} name={c.name} src={c.src} imageFit="cover" imagePosition="top" imageScale={0.88} size="lg" />
      ))}
    </div>
  )
}

export function AvatarBadgePreview() {
  const badges = ['online', 'away', 'busy', 'offline'] as const
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {badges.map(b => (
        <div key={b} className="flex flex-col items-center gap-2">
          <Avatar name="Mira" src="/avatars/avatar1.svg" imageFit="cover" imagePosition="top" imageScale={0.88} size="lg" badge={b} />
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{b}</span>
        </div>
      ))}
    </div>
  )
}

export function AvatarGroupPreview() {
  const twoLetterAlternating = TEAM.map((t, i) => ({
    ...t,
    letters: 2 as const,
    textClassName: i % 2 ? SKY : undefined,
  }))

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2.5">
        <AvatarGroup avatars={TEAM} max={5} onAdd={() => {}} />
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">1 letter, default color</span>
      </div>
      <div className="flex flex-col items-center gap-2.5">
        <AvatarGroup avatars={twoLetterAlternating} max={5} />
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">2 letters, alternating accent</span>
      </div>
    </div>
  )
}
