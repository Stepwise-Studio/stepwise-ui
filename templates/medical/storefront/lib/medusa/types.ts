/**
 * The storefront's view of the MedixGo domain.
 *
 * Every shape here is transcribed from `templates/medical/CONTRACT.md`. The
 * backend agent does not import this file - it implements the Medusa side of
 * the same contract, and `client.ts` is what normalises one into the other.
 *
 * Money is always **minor units, INR** (paise). 24900 renders as "₹249". Never
 * store a formatted string; `formatINR` in `lib/format.ts` is the only place
 * that turns a number into currency.
 */

export type CategorySlug =
  | 'pain-fever' | 'cold-cough' | 'vitamins-supplements'
  | 'diabetes-care' | 'skin-care' | 'baby-care'

export type Medicine = {
  id                  : string
  handle              : string
  name                : string
  brand               : string
  category            : CategorySlug
  description         : string
  composition         : string
  dosage              : string
  packSize            : string
  price               : number   // minor units, INR
  mrp                 : number   // minor units, INR
  discountPct         : number   // derived: round((mrp - price) / mrp * 100)
  image               : string
  inStock             : boolean
  requiresPrescription: boolean
}

/** One of the six fixed Medusa product categories. */
export type Category = {
  handle: CategorySlug
  name  : string
}

export type LineItem = {
  id                  : string   // Medusa line-item id
  medicineId          : string
  handle              : string
  name                : string
  packSize            : string
  image               : string
  unitPrice           : number
  mrp                 : number
  quantity            : number
  requiresPrescription: boolean
}

export type Cart = {
  id          : string
  items       : LineItem[]
  subtotal    : number   // Σ unitPrice × quantity
  mrpTotal    : number   // Σ mrp × quantity
  savings     : number   // mrpTotal − subtotal, derived
  shipping    : number
  total       : number   // subtotal + shipping
  currencyCode: string   // 'inr'

  /** Mirrors the attached prescription. The server is still the authority. */
  prescriptionId    : string | null
  prescriptionStatus: PrescriptionStatus | null
}

export type PrescriptionStatus = 'pending' | 'approved' | 'rejected'

export type Prescription = {
  id          : string
  status      : PrescriptionStatus
  file_id     : string        // Medusa file module id
  file_url    : string
  customer_id : string | null // null = guest upload
  cart_id     : string | null
  order_id    : string | null
  patient_name: string | null
  note        : string | null // pharmacist's note on approve/reject
  created_at  : string
  reviewed_at : string | null
}

/** Query options for `getMedicines`. Mirrors the stock Medusa product filters
 *  the client will forward once the SDK is wired in. */
export type MedicineQuery = {
  category?: CategorySlug
  /** Free-text match against name, brand and composition. */
  search?  : string
  limit?   : number
}

/**
 * The one error the storefront has to recognise by shape rather than by status.
 * Emitted by the cart-completion workflow when the prescription gate blocks an
 * order: HTTP 400, `{ code: 'prescription_required', message }`.
 */
export type PrescriptionRequiredError = {
  code   : 'prescription_required'
  message: string
}
