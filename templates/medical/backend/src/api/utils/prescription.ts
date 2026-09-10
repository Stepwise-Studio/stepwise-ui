/** The exact `Prescription` shape CONTRACT.md promises the storefront. */
export type PrescriptionStatus = 'pending' | 'approved' | 'rejected'

export type PrescriptionDTO = {
  id: string
  status: PrescriptionStatus
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

const iso = (v: unknown): string | null =>
  v ? new Date(v as string).toISOString() : null

export const toPrescriptionDTO = (p: any): PrescriptionDTO => ({
  id: p.id,
  status: p.status,
  file_id: p.file_id,
  file_url: p.file_url,
  customer_id: p.customer_id ?? null,
  cart_id: p.cart_id ?? null,
  order_id: p.order_id ?? null,
  patient_name: p.patient_name ?? null,
  note: p.note ?? null,
  created_at: iso(p.created_at)!,
  reviewed_at: iso(p.reviewed_at),
})

/** Only these get accepted as a prescription scan. */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/pdf',
]
