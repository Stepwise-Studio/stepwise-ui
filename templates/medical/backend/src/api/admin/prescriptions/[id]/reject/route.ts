import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'

import { reviewPrescription } from '../../../../utils/review'

/** POST /admin/prescriptions/:id/reject — body `{ note: string }`, note required. */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { note } = (req.body ?? {}) as { note?: unknown }
  res.json({
    prescription: await reviewPrescription(req, 'rejected', note, true),
  })
}
