import { model } from '@medusajs/framework/utils'

export const Prescription = model.define('prescription', {
  id: model.id({ prefix: 'presc' }).primaryKey(),
  status: model.enum(['pending', 'approved', 'rejected']).default('pending'),
  file_id: model.text(),
  file_url: model.text(),
  customer_id: model.text().nullable(),
  cart_id: model.text().nullable(),
  order_id: model.text().nullable(),
  patient_name: model.text().nullable(),
  note: model.text().nullable(),
  reviewed_at: model.dateTime().nullable(),
})
