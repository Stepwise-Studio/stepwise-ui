import { defineWidgetConfig } from '@medusajs/admin-sdk'
import { Text } from '@medusajs/ui'

/**
 * Light branding only — a wordmark above the login form.
 *
 * Deliberately not a reskin: overriding the dashboard's own styles means
 * re-doing it on every Medusa release. The store name ("MedixGo", set by the
 * seed) is what the dashboard already shows everywhere else.
 */
const LoginBranding = () => (
  <div className="mb-4 flex flex-col items-center gap-y-1">
    <div className="flex items-center gap-x-2">
      <span
        aria-hidden
        className="bg-ui-fg-interactive inline-block h-5 w-5 rounded-md"
      />
      <span className="txt-large-plus text-ui-fg-base tracking-tight">MedixGo</span>
    </div>
    <Text size="small" className="text-ui-fg-subtle">
      Pharmacy operations
    </Text>
  </div>
)

export const config = defineWidgetConfig({ zone: 'login.before' })

export default LoginBranding
