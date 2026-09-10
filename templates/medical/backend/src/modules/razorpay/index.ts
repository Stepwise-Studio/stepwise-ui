import { ModuleProvider, Modules } from '@medusajs/framework/utils'
import RazorpayProviderService from './service'

export default ModuleProvider(Modules.PAYMENT, {
  services: [RazorpayProviderService],
})
