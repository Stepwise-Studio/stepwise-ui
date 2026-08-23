import { HugeiconsIcon } from '@hugeicons/react'
import { ChevronDownIcon } from '@hugeicons/core-free-icons'

// Shared down-caret — rotate 180° for the "up" state.
export function Chevron({ size = 16, open = false, className }: { size?: number; open?: boolean; className?: string }) {
  return (
    <HugeiconsIcon
      icon={ChevronDownIcon}
      size={size}
      strokeWidth={3}
      color="currentColor"
      className={className}
      style={{ transform: open ? 'rotate(180deg)' : undefined }}
    />
  )
}
