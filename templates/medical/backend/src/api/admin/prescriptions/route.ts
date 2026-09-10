import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MedusaError } from '@medusajs/framework/utils'

import { PRESCRIPTION_MODULE } from '../../../modules/prescription'
import { toPrescriptionDTO } from '../../utils/prescription'

const STATUSES = ['pending', 'approved', 'rejected'] as const

/** GET /admin/prescriptions?status=pending&limit=&offset= — the review queue. */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { status, limit, offset } = req.query as Record<string, string | undefined>

  if (status && !STATUSES.includes(status as any)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Unknown status "${status}". Expected one of: ${STATUSES.join(', ')}.`
    )
  }

  const take = Math.min(Math.max(parseInt(limit ?? '50', 10) || 50, 1), 100)
  const skip = Math.max(parseInt(offset ?? '0', 10) || 0, 0)

  const service: any = req.scope.resolve(PRESCRIPTION_MODULE)
  const [prescriptions, count] = await service.listAndCountPrescriptions(
    status ? { status } : {},
    { take, skip, order: { created_at: 'DESC' } }
  )

  res.json({
    prescriptions: prescriptions.map(toPrescriptionDTO),
    count,
    limit: take,
    offset: skip,
  })
}
