'use client'

import { useState } from 'react'
import { Button } from '@/components/stepwise/button'
import { Modal } from '@/components/stepwise/modal'

export function ModalDefaultPreview() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Save changes?"
        description="You have unsaved changes. Saving will update your published content immediately."
        confirmLabel="Save changes"
        onConfirm={() => setOpen(false)}
      />
    </>
  )
}

export function ModalLeftAlignPreview() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Invite teammates"
        description="They'll get an email with a link to join this workspace. You can revoke access anytime."
        confirmLabel="Send invites"
        align="left"
        onConfirm={() => setOpen(false)}
      />
    </>
  )
}

export function ModalDestructivePreview() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setOpen(false) }, 1800)
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete account
      </Button>
      <Modal
        open={open}
        onClose={() => !loading && setOpen(false)}
        title="Delete your account?"
        description="This will permanently delete your account and remove all your data. This action cannot be undone."
        confirmLabel="Yes, delete account"
        variant="destructive"
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  )
}
