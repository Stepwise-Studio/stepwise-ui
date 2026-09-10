import { defineRouteConfig } from '@medusajs/admin-sdk'
import { DocumentText } from '@medusajs/icons'
import {
  Badge,
  Button,
  Container,
  Drawer,
  Heading,
  Select,
  Table,
  Text,
  Textarea,
  Toaster,
  toast,
} from '@medusajs/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

type Prescription = {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  file_id: string
  file_url: string
  customer_id: string | null
  cart_id: string | null
  order_id: string | null
  patient_name: string | null
  note: string | null
  created_at: string
  reviewed_at: string | null
}

const STATUS_COLOR = {
  pending: 'orange',
  approved: 'green',
  rejected: 'red',
} as const

const api = async (path: string, init?: RequestInit) => {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body?.message ?? `Request failed (${res.status})`)
  }
  return body
}

const isPdf = (url: string) => url.toLowerCase().split('?')[0].endsWith('.pdf')

const PrescriptionsPage = () => {
  const [status, setStatus] = useState<string>('pending')
  const [open, setOpen] = useState<Prescription | null>(null)
  const [note, setNote] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['prescriptions', status],
    queryFn: () =>
      api(
        `/admin/prescriptions${status === 'all' ? '' : `?status=${status}`}`
      ) as Promise<{ prescriptions: Prescription[]; count: number }>,
  })

  const review = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) =>
      api(`/admin/prescriptions/${id}/${action}`, {
        method: 'POST',
        body: JSON.stringify({ note: note.trim() || undefined }),
      }),
    onSuccess: (_res, vars) => {
      toast.success(
        vars.action === 'approve' ? 'Prescription approved' : 'Prescription rejected'
      )
      setOpen(null)
      setNote('')
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const rows = data?.prescriptions ?? []

  return (
    <Container className="divide-y p-0">
      <Toaster />

      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h2">Prescriptions</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Review uploaded prescriptions before their orders can be placed.
          </Text>
        </div>
        <Select value={status} onValueChange={setStatus}>
          <Select.Trigger className="w-44">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="pending">Pending</Select.Item>
            <Select.Item value="approved">Approved</Select.Item>
            <Select.Item value="rejected">Rejected</Select.Item>
            <Select.Item value="all">All</Select.Item>
          </Select.Content>
        </Select>
      </div>

      {isLoading ? (
        <div className="px-6 py-8">
          <Text className="text-ui-fg-subtle">Loading…</Text>
        </div>
      ) : rows.length === 0 ? (
        <div className="px-6 py-8">
          <Text className="text-ui-fg-subtle">
            Nothing here. {status === 'pending' ? 'The queue is clear.' : ''}
          </Text>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Patient</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Cart</Table.HeaderCell>
              <Table.HeaderCell>Uploaded</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((p) => (
              <Table.Row key={p.id}>
                <Table.Cell>
                  <Text weight="plus">{p.patient_name ?? 'Not given'}</Text>
                  <Text size="xsmall" className="text-ui-fg-subtle">
                    {p.customer_id ?? 'Guest upload'}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={STATUS_COLOR[p.status]} size="2xsmall">
                    {p.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small" className="text-ui-fg-subtle">
                    {p.cart_id ?? '—'}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text size="small" className="text-ui-fg-subtle">
                    {new Date(p.created_at).toLocaleString()}
                  </Text>
                </Table.Cell>
                <Table.Cell className="text-right">
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => {
                      setOpen(p)
                      setNote(p.note ?? '')
                    }}
                  >
                    Review
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Drawer open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{open?.patient_name ?? 'Prescription'}</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="flex flex-col gap-y-4 overflow-y-auto">
            {open && (
              <>
                <div className="bg-ui-bg-subtle overflow-hidden rounded-lg border">
                  {isPdf(open.file_url) ? (
                    <iframe
                      src={open.file_url}
                      title="Prescription"
                      className="h-[420px] w-full"
                    />
                  ) : (
                    <img
                      src={open.file_url}
                      alt="Prescription"
                      className="max-h-[420px] w-full object-contain"
                    />
                  )}
                </div>

                <a
                  href={open.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ui-fg-interactive txt-small"
                >
                  Open file in a new tab
                </a>

                <div>
                  <Text size="small" weight="plus">
                    Pharmacist note
                  </Text>
                  <Text size="xsmall" className="text-ui-fg-subtle mb-2">
                    Required when rejecting — the customer sees it.
                  </Text>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Prescription is older than 6 months."
                  />
                </div>
              </>
            )}
          </Drawer.Body>
          <Drawer.Footer>
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
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: 'Prescriptions',
  icon: DocumentText,
})

export default PrescriptionsPage
