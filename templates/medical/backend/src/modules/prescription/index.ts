import { Module } from '@medusajs/framework/utils'
import PrescriptionModuleService from './service'

export const PRESCRIPTION_MODULE = 'prescription'

export default Module(PRESCRIPTION_MODULE, {
  service: PrescriptionModuleService,
})
