import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MedusaError } from '@medusajs/framework/utils'
import { uploadFilesWorkflow } from '@medusajs/medusa/core-flows'
import path from 'path'

import { PRESCRIPTION_MODULE } from '../../../modules/prescription'
import { ALLOWED_MIME_TYPES, toPrescriptionDTO } from '../../utils/prescription'
import { MAX_PRESCRIPTION_BYTES } from '../../middlewares'

/**
 * POST /store/prescriptions — multipart upload of a prescription scan.
 *
 * Trust boundary: this accepts an unauthenticated file from the public
 * internet. Size is capped by multer; type is checked here against a
 * whitelist (never a blacklist), and the stored filename is generated,
 * never taken from the client.
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const file = (req as any).file as Express.Multer.File | undefined

  if (!file) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      'A prescription file is required (multipart field "file").',
      'prescription_file_required'
    )
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Unsupported file type "${file.mimetype}". Allowed: ${ALLOWED_MIME_TYPES.join(', ')}.`,
      'prescription_invalid_file_type'
    )
  }

  // multer already rejects oversize files, but the cap is part of the contract
  // so it is asserted here too rather than trusting one layer.
  if (file.size > MAX_PRESCRIPTION_BYTES) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `File exceeds the ${MAX_PRESCRIPTION_BYTES / 1024 / 1024} MB limit.`,
      'prescription_file_too_large'
    )
  }

  const body = (req.body ?? {}) as Record<string, unknown>
  const patientName =
    typeof body.patient_name === 'string' && body.patient_name.trim()
      ? body.patient_name.trim().slice(0, 255)
      : null
  const cartId = typeof body.cart_id === 'string' && body.cart_id ? body.cart_id : null

  // Customer identity comes from the session, never from the request body.
  const customerId = (req as any).auth_context?.actor_id ?? null

  const ext = path.extname(file.originalname || '').toLowerCase().slice(0, 10)
  const { result: files } = await uploadFilesWorkflow(req.scope).run({
    input: {
      files: [
        {
          filename: `prescription-${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`,
          mimeType: file.mimetype,
          content: file.buffer.toString('binary'),
          access: 'private',
        },
      ],
    },
  })

  const uploaded = files[0]
  const service: any = req.scope.resolve(PRESCRIPTION_MODULE)

  const prescription = await service.createPrescriptions({
    status: 'pending',
    file_id: uploaded.id,
    file_url: uploaded.url,
    customer_id: customerId,
    cart_id: cartId,
    patient_name: patientName,
  })

  res.status(201).json({ prescription: toPrescriptionDTO(prescription) })
}
