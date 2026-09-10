import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { ContainerRegistrationKeys, MedusaError } from '@medusajs/framework/utils'

import { PRESCRIPTION_MODULE } from '../../../../../modules/prescription'
import { toPrescriptionDTO } from '../../../../utils/prescription'

/**
 * POST /store/carts/:id/prescription
 * Body: { prescription_id: string }
 *
 * Attaches an already-uploaded prescription to a cart. Attaching does not
 * approve anything — the gate still reads `status`.
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const cartId = req.params.id
  const { prescription_id: prescriptionId } = (req.body ?? {}) as {
    prescription_id?: unknown
  }

  if (typeof prescriptionId !== 'string' || !prescriptionId.trim()) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      '`prescription_id` is required.',
      'prescription_id_required'
    )
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: carts } = await query.graph({
    entity: 'cart',
    fields: ['id', 'completed_at'],
    filters: { id: cartId },
  })

  if (!carts.length) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, `Cart ${cartId} not found.`)
  }
  if (carts[0].completed_at) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      'Cart is already completed.',
      'cart_completed'
    )
  }

  const service: any = req.scope.resolve(PRESCRIPTION_MODULE)
  const [existing] = await service.listPrescriptions({ id: prescriptionId })
  if (!existing) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Prescription ${prescriptionId} not found.`
    )
  }

  const updated = await service.updatePrescriptions({
    id: prescriptionId,
    cart_id: cartId,
  })

  res.json({
    prescription: toPrescriptionDTO(Array.isArray(updated) ? updated[0] : updated),
  })
}
