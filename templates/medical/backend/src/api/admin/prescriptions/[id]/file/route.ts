import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MedusaError, Modules } from '@medusajs/framework/utils'

import { PRESCRIPTION_MODULE } from '../../../../../modules/prescription'

/**
 * GET /admin/prescriptions/:id/file — the scan itself, for a logged-in pharmacist.
 *
 * This route exists because a prescription is a medical record. The file module's
 * local provider writes every upload into the same directory it serves publicly,
 * so the URL it hands back is readable by anyone who has it — no session, no
 * cookie, nothing. Marking the upload `private` only prefixes the filename; it
 * does not stop the static handler. So the public path is sealed off in
 * `middlewares.ts` and the bytes come through here instead, behind admin auth,
 * which Medusa applies to every `/admin/*` route.
 *
 * `getAsBuffer` goes through whichever file provider stored the file, so this
 * keeps working unchanged when a merchant swaps local for S3.
 */

const MIME: Record<string, string> = {
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.heic': 'image/heic',
  '.pdf' : 'application/pdf',
}

/** The stored name is the only record of the type, so the extension decides it.
 *  Anything unrecognised is sent as a download rather than rendered inline. */
const contentTypeFor = (name: string) => {
  const dot = name.toLowerCase().lastIndexOf('.')
  return (dot === -1 ? undefined : MIME[name.toLowerCase().slice(dot)]) ?? 'application/octet-stream'
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  const prescriptions: any = req.scope.resolve(PRESCRIPTION_MODULE)
  const record = await prescriptions.retrievePrescription(id).catch(() => null)

  if (!record) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Prescription ${id} not found.`,
      'prescription_not_found'
    )
  }

  const files: any = req.scope.resolve(Modules.FILE)
  const buffer = await files.getAsBuffer(record.file_id)

  // A medical record must never sit in a shared cache, and `private` alone is
  // not enough - an intermediary that ignores it still has the bytes.
  res.setHeader('Content-Type', contentTypeFor(record.file_url ?? record.file_id))
  res.setHeader('Cache-Control', 'private, no-store, max-age=0')
  res.setHeader('Content-Disposition', 'inline')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.send(buffer)
}
