'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  addToCart as apiAdd,
  attachPrescriptionToCart as apiAttach,
  getCart,
  removeLineItem as apiRemove,
  updateLineItem as apiUpdate,
} from '@/lib/medusa/client'
import type { Cart, Medicine } from '@/lib/medusa/types'

/**
 * Cart state for client components.
 *
 * Deliberately not a React context. Every consumer holds its own copy and
 * re-reads on a broadcast, which means the header badge, the cart page and a
 * product page's Add button stay in step without a provider having to wrap the
 * tree - and without any of them caring whether the cart came from
 * `localStorage` (today) or from a Medusa cart id in a cookie (later).
 *
 * `medixgo:cart` is dispatched by `lib/medusa/client.ts` on every write; the
 * native `storage` event covers other tabs, which `medixgo:cart` cannot reach.
 */
export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)

  const refresh = useCallback(() => { void getCart().then(setCart) }, [])

  useEffect(() => {
    refresh()
    window.addEventListener('medixgo:cart', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('medixgo:cart', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [refresh])

  // Each mutation returns the new cart, so state lands from the call itself
  // rather than from a second read - one round trip once this is a real API.
  const add        = useCallback((m: Medicine, qty = 1) => apiAdd(m, qty).then(setCart), [])
  const setQty     = useCallback((id: string, qty: number) => apiUpdate(id, qty).then(setCart), [])
  const remove     = useCallback((id: string) => apiRemove(id).then(setCart), [])
  const attachRx   = useCallback((rxId: string) => apiAttach(rxId).then(setCart), [])

  const count = cart?.items.reduce((n, i) => n + i.quantity, 0) ?? 0

  /** The prescription gate, mirrored from the server rule in CONTRACT.md. The
   *  server is the authority; this only decides what the UI lets you press. */
  const needsPrescription = Boolean(cart?.items.some(i => i.requiresPrescription))
  const gateCleared       = !needsPrescription || cart?.prescriptionStatus === 'approved'

  return { cart, count, add, setQty, remove, attachRx, refresh, needsPrescription, gateCleared }
}
