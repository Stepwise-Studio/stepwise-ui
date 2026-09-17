import { defineWidgetConfig } from '@medusajs/admin-sdk'
import { HugeiconsIcon } from '@hugeicons/react'
import { PrescriptionIcon } from '@hugeicons/core-free-icons'
import { Text } from '@medusajs/ui'

/**
 * The wordmark above the login form.
 *
 * Still branding rather than a reskin: Medusa's dashboard ships its own
 * stylesheet and overriding it wholesale means redoing the work on every
 * release. What we own - our injected widgets and our own route - is designed
 * properly; Medusa's own screens stay Medusa's.
 */
const LoginBranding = () => (
  <div className="mb-5 flex flex-col items-center gap-y-2">
    <div className="flex items-center gap-x-2">
      <span className="bg-ui-bg-base border-ui-border-base shadow-elevation-card-rest flex h-8 w-8 items-center justify-center rounded-lg border">
        <HugeiconsIcon
          icon={PrescriptionIcon}
          size={17}
          strokeWidth={1.8}
          color="currentColor"
          className="text-ui-fg-base"
        />
      </span>
      <span className="txt-large-plus text-ui-fg-base tracking-tight">MedixGo</span>
    </div>
    <Text size="small" className="text-ui-fg-subtle">
      Pharmacy operations
    </Text>
  </div>
)

export const config = defineWidgetConfig({ zone: 'login.before' })

export default LoginBranding
