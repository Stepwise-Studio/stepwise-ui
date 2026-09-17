/** The exact `Prescription` shape CONTRACT.md promises the storefront. */
export type PrescriptionStatus = 'pending' | 'approved' | 'rejected'

export type PrescriptionDTO = {
  id: string
  status: PrescriptionStatus
  /** Admin responses only. With the local provider this value IS the stored
   *  filename, so handing it to a shopper hands them the storage path. */
  file_id?: string
  /** Admin responses only. A URL to the authenticated route, never the raw
   *  storage path. Absent from every store response - see `toPrescriptionDTO`. */
  file_url?: string
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

/**
 * Shape a prescription for the wire.
 *
 * The scan is a medical record, so **store responses carry no link to it at all**.
 * The customer uploaded the file; they do not need it served back, and the
 * storefront never renders one. Handing out a URL that nothing uses is pure
 * exposure - the stored path is publicly readable (see `middlewares.ts`), so the
 * safest version of that field is its absence.
 *
 * Admin responses get `file_url` pointing at `GET /admin/prescriptions/:id/file`,
 * which is behind admin auth. Never the provider's own URL.
 */
export const toPrescriptionDTO = (
  p: any,
  audience: 'store' | 'admin' = 'store'
): PrescriptionDTO => ({
  id: p.id,
  status: p.status,
  ...(audience === 'admin'
    ? { file_id: p.file_id, file_url: `/admin/prescriptions/${p.id}/file` }
    : {}),
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
