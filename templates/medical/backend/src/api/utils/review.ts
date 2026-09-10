import type { MedusaRequest } from '@medusajs/framework/http'
import { MedusaError } from '@medusajs/framework/utils'

import { PRESCRIPTION_MODULE } from '../../modules/prescription'
import { toPrescriptionDTO, type PrescriptionDTO } from './prescription'

/** Shared body of approve/reject — the only difference is whether a note is mandatory. */
export async function reviewPrescription(
  req: MedusaRequest,
  status: 'approved' | 'rejected',
  note: unknown,
  noteRequired: boolean
): Promise<PrescriptionDTO> {
  if (note !== undefined && note !== null && typeof note !== 'string') {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, '`note` must be a string.')
  }

  const trimmed = typeof note === 'string' ? note.trim() : ''

  if (noteRequired && !trimmed) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      'A note is required when rejecting a prescription.',
      'note_required'
    )
  }

  const service: any = req.scope.resolve(PRESCRIPTION_MODULE)
  const [existing] = await service.listPrescriptions({ id: req.params.id })
  if (!existing) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Prescription ${req.params.id} not found.`
    )
  }

  const updated = await service.updatePrescriptions({
    id: req.params.id,
    status,
    note: trimmed || null,
    reviewed_at: new Date(),
  })

  return toPrescriptionDTO(Array.isArray(updated) ? updated[0] : updated)
}
