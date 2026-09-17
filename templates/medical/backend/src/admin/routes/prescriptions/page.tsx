import { defineRouteConfig } from '@medusajs/admin-sdk'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  ExternalLinkIcon,
  Image02Icon,
  InboxIcon,
  PrescriptionIcon,
  ShoppingCart01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import {
  Button,
  Container,
  Drawer,
  Heading,
  Text,
  Textarea,
  Toaster,
  toast,
} from '@medusajs/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

/**
 * The pharmacist's review queue.
 *
 * This page lives inside Medusa Admin, next to Products and Orders, so it is
 * built from Medusa's own design tokens rather than the storefront's palette.
 * A page styled like the shopfront would read as a broken embed here, not as
 * good design. What it does not borrow is the default "dump the rows into a
 * table" shape - reviewing a prescription is looking at a scan and deciding,
 * so the scan leads every row and the decision is never more than one click
 * from the image.
 *
 * Icons are Hugeicons throughout, matching the rest of the project.
 */

type Status = 'pending' | 'approved' | 'rejected'

type Prescription = {
  id: string
  status: Status
  file_id: string
  /** Relative URL of the authenticated admin file route. The dashboard sends
   *  its session cookie with same-origin requests, so <img>/<iframe> resolve
   *  it without any extra work. */
  file_url?: string
  customer_id: string | null
  cart_id: string | null
  order_id: string | null
  patient_name: string | null
  note: string | null
  created_at: string
  reviewed_at: string | null
}

const cx = (...v: (string | false | null | undefined)[]) => v.filter(Boolean).join(' ')

const STATUS: Record<Status, { label: string; icon: typeof Clock01Icon; pill: string }> = {
  pending:  { label: 'Pending',  icon: Clock01Icon,           pill: 'bg-ui-tag-orange-bg text-ui-tag-orange-text border-ui-tag-orange-border' },
  approved: { label: 'Approved', icon: CheckmarkCircle02Icon, pill: 'bg-ui-tag-green-bg text-ui-tag-green-text border-ui-tag-green-border' },
  rejected: { label: 'Rejected', icon: CancelCircleIcon,      pill: 'bg-ui-tag-red-bg text-ui-tag-red-text border-ui-tag-red-border' },
}

const TABS: (Status | 'all')[] = ['pending', 'approved', 'rejected', 'all']

const api = async (path: string, init?: RequestInit) => {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body?.message ?? `Request failed (${res.status})`)
  return body
}

const isPdf = (url?: string) => !!url && url.toLowerCase().split('?')[0].endsWith('.pdf')

/** "just now" / "12m" / "3h" / "2d". A queue is triaged by age, so age is what
 *  the row shows; the exact timestamp rides along in `title`. */
function ago(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

/** A prescription-only order cannot ship until someone looks at this, so a
 *  queue item that has been waiting a while is the one piece of urgency the
 *  page is allowed to express. Two hours is a placeholder for whatever a real
 *  pharmacy's service promise turns out to be. */
const STALE_AFTER_MS = 2 * 60 * 60 * 1000
const isStale = (p: Prescription) =>
  p.status === 'pending' && Date.now() - new Date(p.created_at).getTime() > STALE_AFTER_MS

/* ── Small parts ─────────────────────────────────────────────────────────── */

const StatusPill = ({ status }: { status: Status }) => {
  const s = STATUS[status]
  return (
    <span className={cx('inline-flex items-center gap-x-1 rounded-full border px-2 py-0.5', s.pill)}>
      <HugeiconsIcon icon={s.icon} size={12} strokeWidth={2} color="currentColor" />
      <span className="txt-compact-xsmall-plus">{s.label}</span>
    </span>
  )
}

/** The scan itself, at row size. PDFs have no inline raster, so they get an
 *  icon tile rather than a broken image. */
const Thumb = ({ p, size = 44 }: { p: Prescription; size?: number }) => (
  <div
    className="bg-ui-bg-subtle border-ui-border-base flex shrink-0 items-center justify-center overflow-hidden rounded-lg border"
    style={{ width: size, height: size }}
  >
    {isPdf(p.file_url) ? (
      <HugeiconsIcon icon={Image02Icon} size={18} strokeWidth={1.6} className="text-ui-fg-muted" color="currentColor" />
    ) : (
      <img src={p.file_url} alt="" className="h-full w-full object-cover" loading="lazy" />
    )}
  </div>
)

const Field = ({ icon, label, value }: { icon: typeof UserIcon; label: string; value: string }) => (
  <div className="flex items-start gap-x-2.5">
    <HugeiconsIcon icon={icon} size={15} strokeWidth={1.7} color="currentColor" className="text-ui-fg-muted mt-0.5 shrink-0" />
    <div className="min-w-0">
      <Text size="xsmall" className="text-ui-fg-muted">{label}</Text>
      <Text size="small" className="text-ui-fg-base truncate">{value}</Text>
    </div>
  </div>
)

/* ── Page ────────────────────────────────────────────────────────────────── */

const PrescriptionsPage = () => {
  const [tab, setTab] = useState<Status | 'all'>('pending')
  const [open, setOpen] = useState<Prescription | null>(null)
  const [note, setNote] = useState('')
  const queryClient = useQueryClient()

  // One fetch of the whole queue, filtered and counted on the client. That is
  // what makes the tab counts live and switching instant, and a review queue is
  // small by nature - it is the work not yet done, not an order history.
  // ponytail: unpaginated; add ?limit/offset + per-status count queries if a
  // pharmacy ever carries hundreds of open prescriptions at once.
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => api('/admin/prescriptions') as Promise<{ prescriptions: Prescription[] }>,
    refetchInterval: 30_000,
  })

  const all = data?.prescriptions ?? []
  const counts = useMemo(() => ({
    pending:  all.filter(p => p.status === 'pending').length,
    approved: all.filter(p => p.status === 'approved').length,
    rejected: all.filter(p => p.status === 'rejected').length,
    all:      all.length,
  }), [all])

  const rows = useMemo(
    () => (tab === 'all' ? all : all.filter(p => p.status === tab)),
    [all, tab]
  )

  const review = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) =>
      api(`/admin/prescriptions/${id}/${action}`, {
        method: 'POST',
        body: JSON.stringify({ note: note.trim() || undefined }),
      }),
    onSuccess: (_r, vars) => {
      toast.success(vars.action === 'approve' ? 'Prescription approved' : 'Prescription rejected')
      setOpen(null)
      setNote('')
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const startReview = (p: Prescription) => { setOpen(p); setNote(p.note ?? '') }

  return (
    <Container className="divide-y p-0">
      <Toaster />

      <div className="flex flex-col gap-y-1 px-6 py-5">
        <div className="flex items-center gap-x-2">
          <HugeiconsIcon icon={PrescriptionIcon} size={18} strokeWidth={1.8} color="currentColor" className="text-ui-fg-subtle" />
          <Heading level="h2">Prescriptions</Heading>
        </div>
        <Text size="small" className="text-ui-fg-subtle">
          A prescription-only order cannot be placed until someone here approves the scan.
        </Text>
      </div>

      {/* Counts live in the filter, because "how much is waiting" is the first
          thing the person opening this page wants to know. */}
      <div className="flex items-center gap-x-1 px-6 py-3">
        {TABS.map(t => {
          const active = t === tab
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cx(
                'txt-compact-small-plus flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 transition-colors',
                active
                  ? 'bg-ui-bg-base text-ui-fg-base shadow-elevation-card-rest'
                  : 'text-ui-fg-subtle hover:bg-ui-bg-subtle-hover hover:text-ui-fg-base'
              )}
            >
              {t === 'all' ? 'All' : STATUS[t].label}
              <span className={cx('txt-compact-xsmall tabular-nums', active ? 'text-ui-fg-muted' : 'text-ui-fg-disabled')}>
                {counts[t]}
              </span>
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="flex flex-col divide-y">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center gap-x-4 px-6 py-4">
              <div className="bg-ui-bg-subtle h-11 w-11 shrink-0 animate-pulse rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="bg-ui-bg-subtle h-3 w-40 animate-pulse rounded" />
                <div className="bg-ui-bg-subtle h-2.5 w-24 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="px-6 py-14 text-center">
          <Text className="text-ui-fg-subtle">Could not load the queue.</Text>
          <Text size="small" className="text-ui-fg-muted">{(error as Error)?.message}</Text>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-y-2 px-6 py-16 text-center">
          <div className="bg-ui-bg-subtle mb-1 flex h-11 w-11 items-center justify-center rounded-full">
            <HugeiconsIcon icon={InboxIcon} size={20} strokeWidth={1.6} color="currentColor" className="text-ui-fg-muted" />
          </div>
          <Text className="text-ui-fg-base">
            {tab === 'pending' ? 'The queue is clear' : `No ${tab === 'all' ? '' : tab + ' '}prescriptions`}
          </Text>
          <Text size="small" className="text-ui-fg-subtle max-w-sm">
            {tab === 'pending'
              ? 'Nothing is waiting on a pharmacist. Uploads appear here the moment a customer sends one.'
              : 'Nothing to show with this filter.'}
          </Text>
        </div>
      ) : (
        <div className="flex flex-col divide-y">
          {rows.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => startReview(p)}
              className="hover:bg-ui-bg-base-hover group flex w-full items-center gap-x-4 px-6 py-3.5 text-left transition-colors"
            >
              <Thumb p={p} />

              <div className="min-w-0 flex-1">
                <Text size="small" weight="plus" className="text-ui-fg-base truncate">
                  {p.patient_name ?? 'No patient name given'}
                </Text>
                <Text size="xsmall" className="text-ui-fg-subtle truncate">
                  {p.customer_id ? `Customer ${p.customer_id.slice(-8)}` : 'Guest upload'}
                  {p.cart_id ? ' · attached to a cart' : ''}
                </Text>
              </div>

              <div className="hidden shrink-0 sm:block"><StatusPill status={p.status} /></div>

              <div className="w-24 shrink-0 text-right">
                <Text
                  size="xsmall"
                  className={cx('tabular-nums', isStale(p) ? 'text-ui-tag-orange-text' : 'text-ui-fg-muted')}
                  title={new Date(p.created_at).toLocaleString()}
                >
                  {ago(p.created_at)}
                </Text>
              </div>

              {/* Styled as a button but rendered as a span: the whole row is
                  already the button, and nesting one inside another is invalid
                  markup that screen readers and keyboard nav both trip over. */}
              <span className="border-ui-border-base bg-ui-bg-base text-ui-fg-base txt-compact-small-plus group-hover:bg-ui-bg-base-hover shadow-elevation-card-rest shrink-0 rounded-md border px-2.5 py-1.5 transition-colors">
                {p.status === 'pending' ? 'Review' : 'View'}
              </span>
            </button>
          ))}
        </div>
      )}

      <Drawer open={!!open} onOpenChange={v => !v && setOpen(null)}>
        <Drawer.Content>
          <Drawer.Header>
            <div className="flex items-center gap-x-3">
              <Drawer.Title>{open?.patient_name ?? 'Prescription'}</Drawer.Title>
              {open && <StatusPill status={open.status} />}
            </div>
          </Drawer.Header>

          <Drawer.Body className="flex flex-col gap-y-5 overflow-y-auto">
            {open && (
              <>
                {/* The scan is the job, so it gets the room. */}
                <div className="bg-ui-bg-subtle border-ui-border-base overflow-hidden rounded-lg border">
                  {isPdf(open.file_url) ? (
                    <iframe src={open.file_url} title="Prescription" className="h-[440px] w-full" />
                  ) : (
                    <img src={open.file_url} alt="Prescription scan" className="max-h-[440px] w-full object-contain" />
                  )}
                </div>

                <a
                  href={open.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover txt-small inline-flex items-center gap-x-1.5 self-start"
                >
                  <HugeiconsIcon icon={ExternalLinkIcon} size={14} strokeWidth={1.8} color="currentColor" />
                  Open full size in a new tab
                </a>

                <div className="border-ui-border-base grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <Field icon={UserIcon} label="Customer" value={open.customer_id ?? 'Guest upload'} />
                  <Field icon={ShoppingCart01Icon} label="Cart" value={open.cart_id ?? 'Not attached'} />
                  <Field icon={Clock01Icon} label="Uploaded" value={new Date(open.created_at).toLocaleString()} />
                  <Field
                    icon={CheckmarkCircle02Icon}
                    label="Reviewed"
                    value={open.reviewed_at ? new Date(open.reviewed_at).toLocaleString() : 'Not yet'}
                  />
                </div>

                <div className="flex flex-col gap-y-1.5">
                  <Text size="small" weight="plus" className="text-ui-fg-base">Pharmacist note</Text>
                  <Text size="xsmall" className="text-ui-fg-subtle">
                    The customer reads this. Required when rejecting, optional when approving.
                  </Text>
                  <Textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="e.g. The date on this one is over a year old."
                    rows={3}
                  />
                </div>
              </>
            )}
          </Drawer.Body>

          <Drawer.Footer>
            {/* Reject stays disabled until there is a reason to send, because the
                server requires one and a customer told "rejected" with no cause
                has nothing to act on. */}
            <div className="flex w-full items-center justify-between gap-x-3">
              <Text size="xsmall" className="text-ui-fg-muted">
                {note.trim() ? '' : 'A note is required to reject'}
              </Text>
              <div className="flex items-center gap-x-2">
                <Button
                  variant="danger"
                  isLoading={review.isPending}
                  disabled={!note.trim()}
                  onClick={() => open && review.mutate({ id: open.id, action: 'reject' })}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  isLoading={review.isPending}
                  onClick={() => open && review.mutate({ id: open.id, action: 'approve' })}
                >
                  Approve
                </Button>
              </div>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </Container>
  )
}

/** The sidebar entry. `defineRouteConfig` wants a component, and Hugeicons are
 *  driven by a prop, so the icon is wrapped rather than passed directly. */
const NavIcon = () => (
  <HugeiconsIcon icon={PrescriptionIcon} size={20} strokeWidth={1.8} color="currentColor" />
)

export const config = defineRouteConfig({
  label: 'Prescriptions',
  icon: NavIcon,
})

export default PrescriptionsPage
