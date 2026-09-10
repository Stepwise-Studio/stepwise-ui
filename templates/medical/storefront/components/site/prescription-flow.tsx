'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Alert02Icon, CheckmarkCircle02Icon, Timer02Icon,
} from '@hugeicons/core-free-icons'
import { Button } from '@/components/stepwise/button'
import { FileUploader, type FileEntry } from '@/components/stepwise/file-uploader'
import { Input } from '@/components/stepwise/input'
import { Surface } from '@/components/stepwise/primitives/surface'
import {
  RX_ACCEPT, RX_MAX_MB, getPrescription, readableError, uploadPrescription,
} from '@/lib/medusa/client'
import { useCart } from '@/lib/use-cart'
import { cn } from '@/lib/utils/cn'
import type { Prescription } from '@/lib/medusa/types'

/**
 * The prescription upload flow.
 *
 * Four states, one at a time, in the same place on the page:
 *
 *   pick → review → sent (pending) → decided (approved | rejected)
 *
 * The upload is attached to the cart the moment it is created, not once it is
 * approved. That is deliberate: it lets the cart show "waiting on a
 * pharmacist" instead of "you have not uploaded anything", which is the more
 * accurate of the two things it could say.
 *
 * ── The gate ────────────────────────────────────────────────────────────────
 * Everything here is UI. The rule that a cart containing a prescription-only
 * medicine cannot complete without an approved prescription is enforced
 * server-side in the cart-completion workflow (CONTRACT.md, "The one rule that
 * isn't stock commerce"). This screen mirrors it; it does not implement it.
 */

const POLL_MS = 2000

export function PrescriptionFlow() {
  const { attachRx, needsPrescription } = useCart()
  const reduce = useReducedMotion()

  const [files, setFiles] = useState<FileEntry[]>([])
  const [patient, setPatient] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rx, setRx] = useState<Prescription | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
  }, [])

  useEffect(() => stopPolling, [stopPolling])

  // Poll only while a decision is genuinely outstanding, and stop the moment it
  // lands - an interval that keeps running after the answer is in is the
  // easiest way to leak a timer across a route change.
  useEffect(() => {
    if (!rx || rx.status !== 'pending') { stopPolling(); return }
    pollRef.current = setInterval(() => {
      void getPrescription(rx.id).then(next => { if (next) setRx(next) })
    }, POLL_MS)
    return stopPolling
  }, [rx, stopPolling])

  const handleFiles = useCallback((accepted: File[]) => {
    setError(null)
    const file = accepted[0]
    if (!file) return
    setFiles([{ id: `${file.name}-${file.lastModified}`, file }])
  }, [])

  async function send() {
    const file = files[0]?.file
    if (!file) return
    setSending(true)
    setError(null)
    try {
      const created = await uploadPrescription(file, patient)
      setRx(created)
      await attachRx(created.id)
    } catch (err) {
      // `POST /store/prescriptions` rejects by code — invalid type, over 5 MB.
      // `readableError` turns those into sentences; a code is never shown.
      setError(readableError(err))
    } finally {
      setSending(false)
    }
  }

  function reset() {
    stopPolling()
    setRx(null)
    setFiles([])
    setPatient('')
    setError(null)
  }

  /* ── Decided / pending ── */
  if (rx) return <StatusPanel rx={rx} reduce={reduce} onReset={reset} needsPrescription={needsPrescription} />

  /* ── Pick and review ── */
  return (
    <div className="flex flex-col gap-6">
      <FileUploader
        variant="dropzone"
        multiple={false}
        maxMB={RX_MAX_MB}
        accept={RX_ACCEPT}
        files={files}
        onFiles={handleFiles}
        onRemove={id => setFiles(f => f.filter(x => x.id !== id))}
        /* The folder body picks up the coral ink rather than the library's
           default amber, so the one skeuomorphic object on the site still
           belongs to this palette. */
        color="var(--color-amber-400)"
      />

      <Input
        variant="name"
        label="Patient name (optional)"
        placeholder="Name as written on the prescription"
        value={patient}
        onChange={e => setPatient(e.target.value)}
      />

      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          fullWidth
          loading={sending}
          disabled={files.length === 0}
          onClick={() => void send()}
        >
          {sending ? 'Sending' : 'Send to the pharmacist'}
        </Button>
        <p className="text-pretty text-[12.5px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          JPG, PNG, WEBP, HEIC or PDF, up to 5 MB. Make sure the doctor’s name,
          registration number and the date are all readable.
        </p>
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            role="alert"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce    ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-[13.5px] text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Status ───────────────────────────────────────────────────────────────── */

const STATUS = {
  pending: {
    icon : Timer02Icon,
    tint : 'text-sky-600 dark:text-sky-400',
    edge : 'oklch(0.520 0.180 262 / 0.35)',
    fill : 'bg-sky-50 dark:bg-sky-500/10',
    title: 'With the pharmacist',
    body : 'Someone is reading it now. This usually takes a few minutes during opening hours, and we will email you either way.',
  },
  approved: {
    icon : CheckmarkCircle02Icon,
    tint : 'text-green-600 dark:text-green-500',
    edge : 'oklch(0.455 0.092 156 / 0.35)',
    fill : 'bg-green-50 dark:bg-green-500/10',
    title: 'Approved',
    body : 'Your prescription is attached to your cart. You can check out whenever you are ready.',
  },
  rejected: {
    icon : Alert02Icon,
    tint : 'text-red-600 dark:text-red-400',
    edge : 'oklch(0.577 0.203 27 / 0.35)',
    fill : 'bg-red-50 dark:bg-red-500/10',
    title: 'We could not accept this one',
    body : 'The pharmacist has left a note below. Upload a clearer photo, or a current prescription, and we will look again.',
  },
} as const

function StatusPanel({
  rx, reduce, onReset, needsPrescription,
}: {
  rx: Prescription
  reduce: boolean | null
  onReset: () => void
  needsPrescription: boolean
}) {
  const s = STATUS[rx.status]

  return (
    <Surface
      radius={24}
      className={cn('flex flex-col gap-5 p-7', s.fill)}
      lisse={{ middleBorder: { width: 1, opacity: 1, color: s.edge } }}
    >
      <div className="flex items-start gap-4">
        {/* The icon swaps as the status changes rather than the panel being
            replaced wholesale, so the transition reads as one thing resolving. */}
        <span className={cn('relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center', s.tint)}>
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={rx.status}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1,    filter: 'blur(0px)' }}
              exit={reduce    ? { opacity: 0 } : { opacity: 0, scale: 0.25, filter: 'blur(4px)' }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <HugeiconsIcon icon={s.icon} size={22} strokeWidth={1.8} color="currentColor" />
            </motion.span>
          </AnimatePresence>
        </span>

        <div role="status" aria-live="polite">
          <h2 className={cn('text-[17px] font-semibold tracking-[-0.03em]', s.tint)}>
            {s.title}
          </h2>
          <p className="mt-1.5 max-w-[34rem] text-pretty text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">
            {s.body}
          </p>
          {rx.note && (
            <p className="mt-3 border-l-2 border-current/25 pl-3 text-pretty text-[13.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              {rx.note}
            </p>
          )}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-y-2 border-t border-[var(--ui-border-subtle)] pt-4 text-[13px] sm:grid-cols-3">
        <div>
          <dt className="text-zinc-400 dark:text-zinc-500">Reference</dt>
          <dd className="mt-0.5 font-medium tabular-nums text-zinc-700 dark:text-zinc-200">{rx.id}</dd>
        </div>
        <div>
          <dt className="text-zinc-400 dark:text-zinc-500">Patient</dt>
          <dd className="mt-0.5 font-medium text-zinc-700 dark:text-zinc-200">{rx.patient_name ?? 'Not given'}</dd>
        </div>
        <div>
          <dt className="text-zinc-400 dark:text-zinc-500">Uploaded</dt>
          <dd className="mt-0.5 font-medium tabular-nums text-zinc-700 dark:text-zinc-200">
            {new Date(rx.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center gap-3">
        {rx.status === 'approved' && (
          <Button href="/cart" size="lg">
            {needsPrescription ? 'Continue to your cart' : 'Start your order'}
          </Button>
        )}
        <Button variant={rx.status === 'approved' ? 'outline' : 'solid'} size="lg" onClick={onReset}>
          Upload another
        </Button>
      </div>
    </Surface>
  )
}
