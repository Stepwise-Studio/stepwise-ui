/**
 * The single seam between the storefront and the backend.
 *
 * Every function here is `async` and returns a contract shape from `./types`.
 * **No page or component may reach past this file** - normalisation from
 * Medusa's shapes into the contract's happens here and nowhere else.
 *
 * ── Units ───────────────────────────────────────────────────────────────────
 * Medusa returns money as a DECIMAL IN MAJOR UNITS (`calculated_amount: 32`
 * means ₹32.00, `85.5` means ₹85.50). Every contract type - `Medicine.price`,
 * `LineItem`, `Cart` - is minor units (paise). So at this boundary, and only
 * here, `paise = Math.round(major * 100)`. `variant.metadata.mrp` is the
 * exception: the seed already stores it in paise, so it is used as-is.
 * See CONTRACT.md, "Units — read this before touching money".
 *
 * ── Offline ─────────────────────────────────────────────────────────────────
 * A merchant cloning this repo will run the storefront before the backend
 * exists. When the backend is unreachable the catalogue falls back to
 * `./mock-data` and the cart falls back to `localStorage`, with one loud
 * console warning. It must never white-screen.
 */

import Medusa from '@medusajs/js-sdk'
import type { HttpTypes } from '@medusajs/types'

import { CATEGORIES, MEDICINES } from './mock-data'
import type {
  Cart, CategorySlug, Category, LineItem, Medicine, MedicineQuery, Prescription,
} from './types'

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? 'http://localhost:9000'
const KEY     = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ''
const REGION  = (process.env.NEXT_PUBLIC_DEFAULT_REGION ?? 'in').toLowerCase()

export const sdk = new Medusa({ baseUrl: BACKEND, publishableKey: KEY })

/* ═══════════════════════════════════════════════════════════════════════════
   Errors
   ═══════════════════════════════════════════════════════════════════════════ */

/** A Medusa error response, `{ code, type, message }`, with the `code` kept.
 *  The SDK's own `FetchError` drops it, and the prescription gate is
 *  identified by `code: 'prescription_required'`. */
export class ApiError extends Error {
  constructor(readonly code: string | null, message: string, readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

/** The custom prescription routes and cart completion go through this rather
 *  than `sdk.client.fetch`, because both are read by `code`, not by message. */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BACKEND}${path}`, {
    ...init,
    headers: { 'x-publishable-api-key': KEY, ...(init.headers ?? {}) },
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiError(
      typeof body?.code === 'string' ? body.code : null,
      typeof body?.message === 'string' ? body.message : res.statusText,
      res.status,
    )
  }
  return body as T
}

/** True when the backend could not be reached at all, as opposed to answering
 *  with an error. Only the former is a reason to fall back to mock data. */
function unreachable(err: unknown): boolean {
  if (err instanceof ApiError) return false
  const status = (err as { status?: number } | null)?.status
  return status === undefined
}

let warned = false
function fellBack(err: unknown) {
  if (warned) return
  warned = true
  console.warn(
    `[medixgo] Medusa backend at ${BACKEND} is unreachable — serving lib/medusa/mock-data.ts ` +
    'and a localStorage cart. Start the backend and reload for live data.',
    err,
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Catalogue
   ═══════════════════════════════════════════════════════════════════════════ */

const PRODUCT_FIELDS =
  '*variants.calculated_price,*categories,+metadata,+variants.metadata,+variants.inventory_quantity'

const truthy = (v: unknown) => v === true || v === 'true'

/** One cached region lookup. `NEXT_PUBLIC_DEFAULT_REGION` is a country code. */
let regionPromise: Promise<string> | null = null
function regionId(): Promise<string> {
  regionPromise ??= sdk.store.region
    .list({ fields: 'id,*countries' })
    .then(({ regions }) => {
      const match = regions.find(r => r.countries?.some(c => c.iso_2 === REGION))
      const region = match ?? regions[0]
      if (!region) throw new Error('No Medusa region is configured.')
      return region.id
    })
    .catch(err => { regionPromise = null; throw err })
  return regionPromise
}

let categoryPromise: Promise<Category[]> | null = null
const categoryIds = new Map<string, string>()

/**
 * The six fixed categories.
 * `sdk.store.category.list({ fields: 'handle,name' })`, cached — the ids are
 * needed to turn a `CategorySlug` into the `category_id` filter below.
 */
export async function getCategories(): Promise<Category[]> {
  categoryPromise ??= sdk.store.category
    .list({ fields: 'id,handle,name', limit: 50 })
    .then(({ product_categories }) => {
      categoryIds.clear()
      for (const c of product_categories) categoryIds.set(c.handle, c.id)
      // The contract fixes both the set and the order; the API sorts by
      // creation. Present them in the order the design was built against.
      const byHandle = new Map(product_categories.map(c => [c.handle, c.name]))
      return CATEGORIES.filter(c => byHandle.has(c.handle))
        .map(c => ({ handle: c.handle, name: byHandle.get(c.handle)! }))
    })
    .catch(err => { categoryPromise = null; throw err })

  try {
    return await categoryPromise
  } catch (err) {
    if (!unreachable(err)) throw err
    fellBack(err)
    return CATEGORIES
  }
}

/** title→name, metadata→brand/composition, variants[0]→pack, and the unit
 *  scaling described at the top of this file. */
function toMedicine(p: HttpTypes.StoreProduct): Medicine {
  const v = p.variants?.[0]
  const price = Math.round(Number(v?.calculated_price?.calculated_amount ?? 0) * 100)
  const mrp   = Number(v?.metadata?.mrp ?? 0) || price   // already paise

  return {
    // The variant is what a cart line refers to, so it is the id the
    // storefront carries around. One pack per medicine in this template.
    id                  : v?.id ?? p.id,
    handle              : p.handle ?? p.id,
    name                : p.title,
    brand               : String(p.metadata?.brand ?? ''),
    category            : (p.categories?.[0]?.handle ?? 'pain-fever') as CategorySlug,
    description         : p.description ?? '',
    composition         : String(p.metadata?.composition ?? ''),
    dosage              : String(v?.metadata?.dosage ?? ''),
    packSize            : v?.title ?? '',
    price,
    mrp,
    discountPct         : mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0,
    image               : p.thumbnail ?? '',
    // `inventory_quantity` is only present when the sales channel has a stock
    // location; absent is not the same as zero, so absent means sellable.
    inStock             : !v?.manage_inventory || v.allow_backorder || (v.inventory_quantity ?? 1) > 0,
    requiresPrescription: truthy(p.metadata?.requires_prescription),
  }
}

/** Product listing, optionally filtered by category and free-text search. */
export async function getMedicines(opts: MedicineQuery = {}): Promise<Medicine[]> {
  try {
    let categoryId: string | undefined
    if (opts.category) {
      await getCategories()                       // populates `categoryIds`
      categoryId = categoryIds.get(opts.category)
      if (!categoryId) return []
    }

    const { products } = await sdk.store.product.list({
      region_id  : await regionId(),
      fields     : PRODUCT_FIELDS,
      limit      : opts.limit ?? 100,
      ...(categoryId ? { category_id: [categoryId] } : {}),
      ...(opts.search?.trim() ? { q: opts.search.trim() } : {}),
    })
    return products.map(toMedicine)
  } catch (err) {
    if (!unreachable(err)) throw err
    fellBack(err)
    return mockMedicines(opts)
  }
}

/** One product by handle. `null` when it does not exist, so a route can call
 *  `notFound()` rather than having to catch. */
export async function getMedicine(handle: string): Promise<Medicine | null> {
  try {
    const { products } = await sdk.store.product.list({
      handle, limit: 1, region_id: await regionId(), fields: PRODUCT_FIELDS,
    })
    return products[0] ? toMedicine(products[0]) : null
  } catch (err) {
    if (!unreachable(err)) throw err
    fellBack(err)
    return MEDICINES.find(m => m.handle === handle) ?? null
  }
}

function mockMedicines(opts: MedicineQuery): Medicine[] {
  const q = opts.search?.trim().toLowerCase()
  let out = MEDICINES
  if (opts.category) out = out.filter(m => m.category === opts.category)
  if (q) {
    out = out.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.brand.toLowerCase().includes(q) ||
      m.composition.toLowerCase().includes(q))
  }
  return opts.limit ? out.slice(0, opts.limit) : out
}

/* ═══════════════════════════════════════════════════════════════════════════
   Cart

   The cart is a real Medusa cart. Its id lives in a cookie rather than in
   `localStorage` so it is sent with every request and can be read server-side
   via `next/headers` if a route ever needs to. The attached prescription id
   rides in a second cookie: the store cart API carries no prescription field,
   and there is no store route that lists prescriptions by cart.
   ═══════════════════════════════════════════════════════════════════════════ */

const CART_COOKIE = 'medixgo_cart_id'
const RX_COOKIE   = 'medixgo_rx_id'
const COOKIE_DAYS = 30

const CART_FIELDS =
  '*items,*items.variant,*items.product,+items.variant.metadata,+items.product.metadata,*payment_collection,*shipping_methods'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const hit = document.cookie.split('; ').find(c => c.startsWith(`${name}=`))
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null
}

function setCookie(name: string, value: string | null) {
  if (typeof document === 'undefined') return
  document.cookie = value === null
    ? `${name}=; path=/; max-age=0; samesite=lax`
    : `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_DAYS * 86400}; samesite=lax`
}

/** Server-render fallback. A cart is per-visitor state and the server has no
 *  visitor, so SSR always sees an empty cart and the client fills it in. */
const EMPTY_CART: Cart = {
  id: '', items: [], subtotal: 0, mrpTotal: 0, savings: 0,
  shipping: 0, total: 0, currencyCode: 'inr',
  prescriptionId: null, prescriptionStatus: null,
}

/** Same-tab listeners: `storage` only fires in OTHER tabs, so the header badge
 *  would never update in the tab that did the adding. `use-cart.ts` listens. */
function broadcast() {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('medixgo:cart'))
}

function toLineItem(i: HttpTypes.StoreCartLineItem): LineItem {
  const unitPrice = Math.round(Number(i.unit_price ?? 0) * 100)
  return {
    id                  : i.id,
    medicineId          : i.variant_id ?? '',
    handle              : i.product_handle ?? i.product?.handle ?? '',
    name                : i.product_title ?? i.title,
    packSize            : i.variant_title ?? '',
    image               : i.thumbnail ?? '',
    unitPrice,
    mrp                 : Number(i.variant?.metadata?.mrp ?? 0) || unitPrice,
    quantity            : i.quantity,
    requiresPrescription: truthy(i.product?.metadata?.requires_prescription),
  }
}

/** Totals are derived from the line items, never read back from a stored
 *  field, so a stale total cannot outlive the items it was computed from.
 *  Shipping is the server's - it is the one number the storefront does not
 *  get to decide. */
function toCart(c: HttpTypes.StoreCart, rx: Prescription | null): Cart {
  const items    = (c.items ?? []).map(toLineItem)
  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.quantity, 0)
  const mrpTotal = items.reduce((n, i) => n + i.mrp * i.quantity, 0)
  const shipping = Math.round(Number(c.shipping_total ?? 0) * 100)
  return {
    id          : c.id,
    items,
    subtotal,
    mrpTotal,
    savings     : mrpTotal - subtotal,
    shipping,
    total       : subtotal + shipping,
    currencyCode: c.currency_code ?? 'inr',
    prescriptionId    : rx?.id ?? null,
    prescriptionStatus: rx?.status ?? null,
  }
}

/** The raw cart, kept for `placeOrder` (which needs `payment_collection`). */
async function retrieveCart(id: string): Promise<HttpTypes.StoreCart | null> {
  try {
    const { cart } = await sdk.store.cart.retrieve(id, { fields: CART_FIELDS })
    return cart
  } catch (err) {
    if (unreachable(err)) throw err
    // 404 / already completed: the cookie points at something that is gone.
    setCookie(CART_COOKIE, null)
    setCookie(RX_COOKIE, null)
    return null
  }
}

async function currentPrescription(): Promise<Prescription | null> {
  const id = getCookie(RX_COOKIE)
  return id ? getPrescription(id) : null
}

export async function getCart(): Promise<Cart> {
  const id = getCookie(CART_COOKIE)
  // No cookie and no offline cart is simply an empty cart - not worth a round
  // trip. An offline cart exists only when a previous add fell back.
  if (!id) return readStore().items.length ? mockGetCart() : EMPTY_CART
  try {
    const cart = await retrieveCart(id)
    if (!cart) return EMPTY_CART
    return toCart(cart, await currentPrescription())
  } catch (err) {
    if (!unreachable(err)) throw err
    fellBack(err)
    return mockGetCart()
  }
}

/** Created lazily, on the first add - an empty cart per visit is litter. */
async function ensureCartId(): Promise<string> {
  const existing = getCookie(CART_COOKIE)
  if (existing && (await retrieveCart(existing))) return existing
  const { cart } = await sdk.store.cart.create({ region_id: await regionId() })
  setCookie(CART_COOKIE, cart.id)
  return cart.id
}

async function afterMutation(cart: HttpTypes.StoreCart): Promise<Cart> {
  broadcast()
  return toCart(cart, await currentPrescription())
}

export async function addToCart(medicine: Medicine, quantity = 1): Promise<Cart> {
  try {
    const cartId = await ensureCartId()
    const { cart } = await sdk.store.cart.createLineItem(
      cartId, { variant_id: medicine.id, quantity }, { fields: CART_FIELDS },
    )
    return await afterMutation(cart)
  } catch (err) {
    if (!unreachable(err)) throw err
    fellBack(err)
    return mockAdd(medicine, quantity)
  }
}

export async function updateLineItem(lineItemId: string, quantity: number): Promise<Cart> {
  if (quantity <= 0) return removeLineItem(lineItemId)
  const cartId = getCookie(CART_COOKIE)
  if (!cartId) return mockUpdate(lineItemId, quantity)
  try {
    const { cart } = await sdk.store.cart.updateLineItem(
      cartId, lineItemId, { quantity }, { fields: CART_FIELDS },
    )
    return await afterMutation(cart)
  } catch (err) {
    if (!unreachable(err)) throw err
    fellBack(err)
    return mockUpdate(lineItemId, quantity)
  }
}

export async function removeLineItem(lineItemId: string): Promise<Cart> {
  const cartId = getCookie(CART_COOKIE)
  if (!cartId) return mockRemove(lineItemId)
  try {
    await sdk.store.cart.deleteLineItem(cartId, lineItemId)
    const cart = await retrieveCart(cartId)
    return cart ? await afterMutation(cart) : EMPTY_CART
  } catch (err) {
    if (!unreachable(err)) throw err
    fellBack(err)
    return mockRemove(lineItemId)
  }
}

/**
 * Attach an already-uploaded prescription to the cart.
 * `POST /store/carts/:id/prescription`, body `{ prescription_id }`.
 */
export async function attachPrescriptionToCart(prescriptionId: string): Promise<Cart> {
  try {
    const cartId = await ensureCartId()
    await request(`/store/carts/${cartId}/prescription`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ prescription_id: prescriptionId }),
    })
    setCookie(RX_COOKIE, prescriptionId)
    broadcast()
    return getCart()
  } catch (err) {
    if (!unreachable(err)) throw err
    fellBack(err)
    return mockAttach(prescriptionId)
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Prescriptions - the custom module
   ═══════════════════════════════════════════════════════════════════════════ */

/** The backend's validation, mirrored so the picker rejects the obvious cases
 *  before a 5 MB upload goes over the wire. The server is still the authority. */
export const RX_ACCEPT   = 'image/jpeg,image/png,image/webp,image/heic,application/pdf'
export const RX_MAX_MB   = 5

/** Backend rejection codes as sentences. Never show a merchant a code. */
const RX_MESSAGES: Record<string, string> = {
  prescription_file_required    : 'Pick a photo or PDF of the prescription first.',
  prescription_invalid_file_type: 'That file type is not accepted. Send a JPG, PNG, WEBP, HEIC or PDF.',
  prescription_file_too_large   : `That file is over ${RX_MAX_MB} MB. Send a smaller photo or a compressed PDF.`,
}

/** The human sentence for any error out of this file. */
export function readableError(err: unknown): string {
  if (err instanceof ApiError) {
    return (err.code && RX_MESSAGES[err.code]) || err.message
  }
  // The SDK's own `FetchError` keeps the server's sentence but drops the code.
  // A message that came back with a status is still the server talking.
  if (err instanceof Error && typeof (err as { status?: number }).status === 'number') {
    return err.message
  }
  if (unreachable(err)) {
    return 'We could not reach the store. Check your connection and try again.'
  }
  return 'Something went wrong on our side. Try again in a moment.'
}

/**
 * Upload a prescription image or PDF.
 * Multipart `POST /store/prescriptions`, field name `file`.
 */
export async function uploadPrescription(
  file: File,
  patientName?: string,
): Promise<Prescription> {
  const body = new FormData()
  body.append('file', file)
  if (patientName?.trim()) body.append('patient_name', patientName.trim())

  const cartId = getCookie(CART_COOKIE)
  if (cartId) body.append('cart_id', cartId)

  try {
    const { prescription } = await request<{ prescription: Prescription }>(
      '/store/prescriptions', { method: 'POST', body },
    )
    return prescription
  } catch (err) {
    if (!unreachable(err)) throw err
    fellBack(err)
    return mockUpload(file, patientName)
  }
}

/** Poll one prescription's status. `null` if it is gone or unreachable. */
export async function getPrescription(id: string): Promise<Prescription | null> {
  try {
    const { prescription } = await request<{ prescription: Prescription }>(
      `/store/prescriptions/${id}`,
    )
    return prescription
  } catch (err) {
    if (unreachable(err)) { fellBack(err); return mockPrescription(id) }
    return null
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Checkout
   ═══════════════════════════════════════════════════════════════════════════ */

export type PaymentProvider = { id: string; label: string; detail: string }

const PROVIDER_COPY: Record<string, { label: string; detail: string }> = {
  pp_razorpay_razorpay: { label: 'UPI, cards and netbanking', detail: 'Razorpay · India' },
  pp_stripe_stripe    : { label: 'International card',        detail: 'Stripe · everywhere' },
  pp_system_default   : { label: 'Pay on delivery',           detail: 'Settle when it arrives' },
}

/** Whatever the region actually has enabled - a hard-coded list goes stale the
 *  first time a merchant turns a provider off. */
export async function getPaymentProviders(): Promise<PaymentProvider[]> {
  const { payment_providers } = await sdk.store.payment.listPaymentProviders({
    region_id: await regionId(),
  })
  return payment_providers.map(p => ({
    id: p.id,
    ...(PROVIDER_COPY[p.id] ?? { label: p.id.replace(/^pp_/, '').replace(/_/g, ' '), detail: '' }),
  }))
}

export type CheckoutDetails = {
  name: string; email: string; phone: string
  address: string; city: string; pin: string
  providerId: string
}

/**
 * Address → shipping method → payment session → complete.
 *
 * Step 4 is where the prescription gate fires, server-side, with HTTP 400
 * `{ code: 'prescription_required' }`. The disabled button on the checkout
 * screen is a courtesy; this is the enforcement.
 */
export async function placeOrder(d: CheckoutDetails): Promise<{ orderId: string }> {
  const cartId = getCookie(CART_COOKIE)
  if (!cartId) throw new ApiError(null, 'Your cart has expired. Add your items again.', 400)

  await sdk.store.cart.update(cartId, {
    email           : d.email,
    shipping_address: {
      first_name  : d.name,
      address_1   : d.address,
      city        : d.city,
      postal_code : d.pin,
      country_code: REGION,
      phone       : d.phone,
    },
  })

  let cart = await retrieveCart(cartId)
  if (!cart) throw new ApiError(null, 'Your cart has expired. Add your items again.', 400)

  if (!cart.shipping_methods?.length) {
    const { shipping_options } = await sdk.store.fulfillment.listCartOptions({ cart_id: cartId })
    const option = shipping_options[0]
    if (!option) throw new ApiError(null, 'We do not deliver to that PIN code yet.', 400)
    const updated = await sdk.store.cart.addShippingMethod(
      cartId, { option_id: option.id }, { fields: CART_FIELDS },
    )
    cart = updated.cart
  }

  await sdk.store.payment.initiatePaymentSession(cart, { provider_id: d.providerId })

  // Deliberately raw: the SDK's FetchError keeps only the message, and the
  // gate is identified by `code`. `request` keeps both.
  const res = await request<{ type: string; order?: { id: string } }>(
    `/store/carts/${cartId}/complete`, { method: 'POST' },
  )
  if (res.type !== 'order' || !res.order) {
    throw new ApiError(null, 'The order could not be placed. Nothing has been charged.', 400)
  }

  setCookie(CART_COOKIE, null)
  setCookie(RX_COOKIE, null)
  broadcast()
  return { orderId: res.order.id }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Offline fallback

   Everything below runs only when the backend cannot be reached. It is the
   pre-backend behaviour of this template, kept so a fresh clone renders a
   working shop before `backend/` is up. Delete it and `mock-data.ts` together
   if you never ship without a backend.
   ═══════════════════════════════════════════════════════════════════════════ */

const MOCK_KEY = 'medixgo.mock.cart'
const SHIPPING_FREE_ABOVE = 49900   // ₹499
const SHIPPING_FLAT       = 4900    // ₹49

type StoredCart = { items: LineItem[]; prescriptionId: string | null }

function readStore(): StoredCart {
  if (typeof window === 'undefined') return { items: [], prescriptionId: null }
  try {
    const raw = window.localStorage.getItem(MOCK_KEY)
    return raw ? (JSON.parse(raw) as StoredCart) : { items: [], prescriptionId: null }
  } catch {
    // Private mode, blocked site data, a corrupt value someone hand-edited -
    // an unusable cart store is not a reason to blank the page.
    return { items: [], prescriptionId: null }
  }
}

function writeStore(next: StoredCart) {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(MOCK_KEY, JSON.stringify(next)) } catch { /* convenience only */ }
  broadcast()
}

function mockTotals(items: LineItem[], prescriptionId: string | null): Cart {
  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.quantity, 0)
  const mrpTotal = items.reduce((n, i) => n + i.mrp * i.quantity, 0)
  const shipping = items.length === 0 || subtotal >= SHIPPING_FREE_ABOVE ? 0 : SHIPPING_FLAT
  return {
    ...EMPTY_CART,
    id      : 'cart_offline',
    items,
    subtotal,
    mrpTotal,
    savings : mrpTotal - subtotal,
    shipping,
    total   : subtotal + shipping,
    prescriptionId,
    prescriptionStatus: prescriptionId ? (mockPrescription(prescriptionId)?.status ?? null) : null,
  }
}

function mockGetCart(): Cart {
  const { items, prescriptionId } = readStore()
  return mockTotals(items, prescriptionId)
}

function mockAdd(medicine: Medicine, quantity: number): Cart {
  const store = readStore()
  const existing = store.items.find(i => i.medicineId === medicine.id)
  const items = existing
    ? store.items.map(i => (i.medicineId === medicine.id ? { ...i, quantity: i.quantity + quantity } : i))
    : [...store.items, {
        id: `li_${medicine.id}`, medicineId: medicine.id, handle: medicine.handle,
        name: medicine.name, packSize: medicine.packSize, image: medicine.image,
        unitPrice: medicine.price, mrp: medicine.mrp, quantity,
        requiresPrescription: medicine.requiresPrescription,
      } satisfies LineItem]
  writeStore({ ...store, items })
  return mockTotals(items, store.prescriptionId)
}

function mockUpdate(lineItemId: string, quantity: number): Cart {
  const store = readStore()
  const items = store.items.map(i => (i.id === lineItemId ? { ...i, quantity } : i))
  writeStore({ ...store, items })
  return mockTotals(items, store.prescriptionId)
}

function mockRemove(lineItemId: string): Cart {
  const store = readStore()
  const items = store.items.filter(i => i.id !== lineItemId)
  writeStore({ ...store, items })
  return mockTotals(items, store.prescriptionId)
}

function mockAttach(prescriptionId: string): Cart {
  const store = readStore()
  writeStore({ ...store, prescriptionId })
  return mockTotals(store.items, prescriptionId)
}

/** Offline prescriptions live only in memory: there is no pharmacist to ask,
 *  so the flow shows "with the pharmacist" and stays there. */
const mockRx = new Map<string, Prescription>()

function mockPrescription(id: string): Prescription | null {
  return mockRx.get(id) ?? null
}

function mockUpload(file: File, patientName?: string): Prescription {
  const id = `rx_offline_${Date.now().toString(36)}`
  const rx: Prescription = {
    id,
    status      : 'pending',
    file_id     : `file_${id}`,
    // Never a data URI: a multi-megabyte one would blow the storage quota.
    // An object URL is valid for the life of the document and no longer.
    file_url    : typeof URL === 'undefined' ? '' : URL.createObjectURL(file),
    customer_id : null,
    cart_id     : null,
    order_id    : null,
    patient_name: patientName?.trim() || null,
    note        : null,
    created_at  : new Date().toISOString(),
    reviewed_at : null,
  }
  mockRx.set(id, rx)
  return rx
}
