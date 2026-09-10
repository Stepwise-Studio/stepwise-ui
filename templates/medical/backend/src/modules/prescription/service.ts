import { MedusaService } from '@medusajs/framework/utils'
import { Prescription } from './models/prescription'

export default class PrescriptionModuleService extends MedusaService({
  Prescription,
}) {}
