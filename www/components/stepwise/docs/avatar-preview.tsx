'use client'

import { useState } from 'react'
import { Avatar, AvatarGroup } from '@/components/stepwise/avatar'
import { Modal } from '@/components/stepwise/modal'
import { Input } from '@/components/stepwise/input'

const TEAM = [
  { name: 'Akhil Reji' },
  { name: 'Sarah Chen' },
  { name: 'Marcus Wright' },
  { name: 'Priya Nair' },
  { name: 'Luka Moran' },
  { name: 'Ines Duarte' },
  { name: 'Tom Okafor' },
]

export function AvatarSizesPreview() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-6">
      {(['xs', 'sm', 'default', 'lg', 'xl'] as const).map(s => (
        <div key={s} className="flex flex-col items-center gap-2">
          <Avatar name="Akhil Reji" size={s} />
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{s}</span>
        </div>
      ))}
    </div>
  )
}

export function AvatarVariantsPreview() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-x-10 gap-y-6">
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-3">
          {TEAM.slice(0, 4).map(t => <Avatar key={t.name} name={t.name} size="lg" />)}
        </div>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">gradient — white top, colour blooms up</span>
      </div>
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-3">
          {TEAM.slice(0, 4).map(t => <Avatar key={t.name} name={t.name} variant="letter" size="lg" />)}
        </div>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">letter</span>
      </div>
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-3">
          <Avatar name="Snoofy" src="https://www.figma.com/api/mcp/asset/d492b2f6-a091-459e-ae8a-52bae27db114" size="lg" />
          <Avatar name="Broken URL" src="/definitely-missing.jpg" size="lg" />
        </div>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">image (falls back to gradient)</span>
      </div>
    </div>
  )
}

export function AvatarGroupPreview() {
  const [inviteOpen, setInviteOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [members, setMembers] = useState(TEAM)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const invite = () => {
    setSending(true)
    setTimeout(() => {
      if (name.trim()) setMembers(m => [...m, { name: name.trim() }])
      setSending(false)
      setInviteOpen(false)
      setName('')
      setEmail('')
    }, 900)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <AvatarGroup avatars={members} max={5} size="lg" onAdd={() => setInviteOpen(true)} />
      <p className="text-[12px] text-zinc-400 dark:text-zinc-500">
        Hover the pile — each avatar lifts out and settles back with a bounce. Hit + to invite.
      </p>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite to your team"
        description="They'll get an email with a link to join your workspace."
        confirmLabel="Send invite"
        onConfirm={invite}
        loading={sending}
        icon={
          <svg className="h-6 w-6 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        }
      >
        <div className="flex flex-col gap-3">
          <Input variant="name" label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="Ada Lovelace" />
          <Input variant="email" label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
      </Modal>
    </div>
  )
}
