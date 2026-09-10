import { defineMiddlewares } from '@medusajs/framework/http'
import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { MedusaError } from '@medusajs/framework/utils'
import multer from 'multer'

export const MAX_PRESCRIPTION_BYTES = 5 * 1024 * 1024 // 5 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PRESCRIPTION_BYTES, files: 1 },
}).single('file')

/**
 * multer throws `MulterError`, which Medusa's error handler doesn't recognise
 * and turns into a 500 "unknown error". An oversize upload is a client mistake,
 * so translate it into a real 400 with a usable code.
 */
const uploadPrescription = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) =>
  upload(req as any, res as any, (err: any) => {
    if (!err) {
      return next()
    }
    if (err instanceof multer.MulterError) {
      const code =
        err.code === 'LIMIT_FILE_SIZE'
          ? 'prescription_file_too_large'
          : 'prescription_invalid_upload'
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? `File exceeds the ${MAX_PRESCRIPTION_BYTES / 1024 / 1024} MB limit.`
          : `Invalid upload: ${err.message}`
      return next(new MedusaError(MedusaError.Types.INVALID_DATA, message, code))
    }
    return next(err)
  })

export default defineMiddlewares({
  routes: [
    {
      matcher: '/store/prescriptions',
      method: 'POST',
      middlewares: [uploadPrescription],
    },
  ],
})
