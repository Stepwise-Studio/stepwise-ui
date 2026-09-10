import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MedusaError } from '@medusajs/framework/utils'

import { PRESCRIPTION_MODULE } from '../../../../modules/prescription'
import { toPrescriptionDTO } from '../../../utils/prescription'

/** GET /store/prescriptions/:id — poll review status. */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const service: any = req.scope.resolve(PRESCRIPTION_MODULE)

  const [prescription] = await service.listPrescriptions({ id: req.params.id })
  if (!prescription) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Prescription ${req.params.id} not found.`
    )
  }

  res.json({ prescription: toPrescriptionDTO(prescription) })
}
