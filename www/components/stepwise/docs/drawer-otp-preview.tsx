'use client'

import { useState } from 'react'
import { Drawer } from '@/components/stepwise/drawer'
import { OtpInput } from '@/components/stepwise/otp-input'
import { Button } from '@/components/stepwise/button'

export function DrawerRightPreview() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open right drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} side="right" title="Settings">
        <div className="flex flex-col gap-4">
          <p className="text-[14px] text-zinc-500 dark:text-zinc-400">Drawer content goes here. You can put any component inside.</p>
          <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
          <p className="text-[13px] text-zinc-400">More content…</p>
        </div>
      </Drawer>
    </>
  )
}

export function DrawerBottomPreview() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open bottom drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} side="bottom" title="Action sheet">
        <div className="flex flex-col gap-4">
          <p className="text-[14px] text-zinc-500 dark:text-zinc-400">Drawer content goes here. You can put any component inside.</p>
          <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
          <p className="text-[13px] text-zinc-400">More content…</p>
        </div>
      </Drawer>
    </>
  )
}

export function OtpStandalonePreview() {
  const [otp, setOtp] = useState('')
  const [done, setDone] = useState(false)
  return (
    <div className="flex flex-col items-center gap-4">
      <OtpInput
        length={6}
        value={otp}
        onChange={v => { setOtp(v); setDone(false) }}
        onComplete={() => setDone(true)}
        onResend={() => { setOtp(''); setDone(false) }}
        resendAfter={15}
      />
      <p className={done ? 'text-[12px] font-medium text-green-600 dark:text-green-400' : 'text-[12px] tabular-nums text-zinc-400 dark:text-zinc-500'}>
        {done ? '✓ Code complete - verifying…' : `${otp.length}/6 digits entered`}
      </p>
    </div>
  )
}

export function OtpErrorPreview() {
  return (
    <div className="flex flex-col items-center gap-3">
      <OtpInput length={6} value="123" error />
      <p role="alert" className="text-[12px] text-rose-500">Invalid code. Please try again.</p>
    </div>
  )
}

export function OtpSecurityPreview() {
  const [code, setCode] = useState('')
  return (
    <div className="flex flex-col items-center gap-4">
      <OtpInput type="alphanumeric" length={6} value={code} onChange={setCode} />
      <p className="text-[12px] tabular-nums text-zinc-400 dark:text-zinc-500">
        {code ? `Code: ${code}` : 'Letters + digits · e.g. 7F3K9Q'}
      </p>
    </div>
  )
}

export function OtpLengthsPreview() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">4 digits</span>
        <OtpInput length={4} />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">8 characters</span>
        <OtpInput type="alphanumeric" length={8} />
      </div>
    </div>
  )
}
