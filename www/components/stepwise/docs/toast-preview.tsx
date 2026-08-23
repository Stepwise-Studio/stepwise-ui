'use client'

import { toast } from '@/components/stepwise/toast'
import { Button } from '@/components/stepwise/button'

export function ToastTypesPreview() {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Button variant="outline" size="default" onClick={() => toast.success('Changes saved', { description: 'Your profile has been updated.' })}>
        Success
      </Button>
      <Button variant="outline" size="default" onClick={() => toast.warning('Storage almost full', { description: 'You have used 90% of your storage.' })}>
        Warning
      </Button>
      <Button variant="outline" size="default" onClick={() => toast.error('Upload failed', { description: 'The file could not be uploaded. Try again.' })}>
        Error
      </Button>
      <Button variant="outline" size="default" onClick={() => toast.info('New update available', { description: 'Version 2.4.0 is ready to install.' })}>
        Info
      </Button>
    </div>
  )
}

export function ToastWithActionPreview() {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Button
        variant="outline"
        onClick={() => toast.show({
          type: 'success',
          title: 'Message sent',
          description: 'Your message was delivered.',
          action: { label: 'Undo', onClick: () => {} },
        })}
      >
        With action button
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.show({
          type: 'error',
          title: 'Connection lost',
          description: 'Check your network and try again.',
          action: { label: 'Retry', onClick: () => toast.info('Retrying…') },
        })}
      >
        With retry action
      </Button>
    </div>
  )
}

export function ToastSoundPreview() {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Button
        variant="outline"
        onClick={() => toast.success('Toast is ready!', {
          description: 'Pops up with a toaster ding.',
          sound: true,
        })}
      >
        With sound 🔊
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info('Silent notification', {
          description: 'No sound on this one.',
        })}
      >
        Without sound
      </Button>
    </div>
  )
}

export function ToastDismissPreview() {
  return (
    <Button
      variant="outline"
      onClick={() => toast.show({
        type: 'info',
        title: 'Notification',
        description: 'Click × to dismiss this toast.',
      })}
    >
      Show dismissible toast
    </Button>
  )
}
