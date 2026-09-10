import { completeCartWorkflow } from '@medusajs/medusa/core-flows'
import { ContainerRegistrationKeys, MedusaError } from '@medusajs/framework/utils'

import { PRESCRIPTION_MODULE } from '../../modules/prescription'

/** JSONB round-trips can hand back `"true"` as readily as `true`. */
const isTruthy = (v: unknown) => v === true || v === 'true'

/**
 * The prescription gate.
 *
 * Hooked into `completeCartWorkflow.validate`, which runs before the order is
 * created and before payment is authorized. Living here rather than in a route
 * handler is the whole point: every path to an order — store API, admin draft
 * order, a webhook-driven completion — goes through this workflow.
 *
 * Blocks with HTTP 400 `{ code: 'prescription_required', message }` (see
 * CONTRACT.md). `MedusaError.Types.INVALID_DATA` is what maps to 400 in
 * Medusa's error handler; the third argument is the `code`.
 */
completeCartWorkflow.hooks.validate(async ({ cart }, { container }) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [fullCart],
  } = await query.graph({
    entity: 'cart',
    fields: ['id', 'items.id', 'items.title', 'items.product.metadata'],
    filters: { id: cart.id },
  })

  const rxItems = (fullCart?.items ?? []).filter((item: any) =>
    isTruthy(item?.product?.metadata?.requires_prescription)
  )

  if (!rxItems.length) {
    return
  }

  const service: any = container.resolve(PRESCRIPTION_MODULE)
  const prescriptions = await service.listPrescriptions(
    { cart_id: cart.id },
    { order: { created_at: 'DESC' } }
  )

  // An approved prescription anywhere on this cart clears it. Order of the
  // list matters only for the message we produce when nothing is approved.
  const approved = prescriptions.find((p: any) => p.status === 'approved')
  if (approved) {
    return
  }

  const names = rxItems.map((i: any) => i.title).join(', ')
  const latest = prescriptions[0]

  const message = !latest
    ? `This order contains prescription-only medicine (${names}). Upload a prescription and wait for it to be approved before checking out.`
    : latest.status === 'pending'
      ? `Your prescription is still awaiting pharmacist review. ${names} cannot be dispatched until it is approved.`
      : `Your prescription was rejected${
          latest.note ? `: ${latest.note.replace(/\.$/, '')}` : ''
        }. Upload a valid prescription to order ${names}.`

  throw new MedusaError(
    MedusaError.Types.INVALID_DATA,
    message,
    'prescription_required'
  )
})
