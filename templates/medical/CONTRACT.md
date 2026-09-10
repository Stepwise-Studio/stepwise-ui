# MedixGo — storefront ↔ backend contract

Both halves of this template are built against this file. **Storefront and backend
agents must not invent shapes that aren't here.** If something is genuinely missing,
add it here first, then implement it.

Source of truth for content/layout: Notion "Template-1 : Medical".

---

## Stack

| Layer | Choice |
|---|---|
| Storefront | Next.js 16, React 19, Tailwind v4, `motion`, `@lisse/react`, Hugeicons |
| Backend | Medusa v2 (Node/TS) |
| Database | PostgreSQL (`medixgo`, user `medusa`) |
| Admin | Medusa Admin + a custom "Prescriptions" UI route |
| Payments | Stripe (official plugin) + Razorpay (**our own provider — see below**) |
| Default region | India / INR. Secondary: US / USD |

Storefront talks to the backend **only** through `@medusajs/js-sdk` plus the custom
routes listed below. No direct DB access from the storefront, ever.

---

## Domain model

A *medicine* is a Medusa **Product**; a *pack* is a Medusa **ProductVariant**.

### Product
| Field | Where it lives |
|---|---|
| name | `product.title` |
| handle | `product.handle` |
| description | `product.description` |
| image | `product.thumbnail` / `product.images` |
| category | `product.categories[0].handle` |
| brand | `product.metadata.brand` — `"ACME"` for template data |
| requires_prescription | `product.metadata.requires_prescription` (boolean) |
| composition | `product.metadata.composition` — e.g. `"Paracetamol 650 mg"` |

### Variant
| Field | Where it lives |
|---|---|
| dosage | `variant.metadata.dosage` — e.g. `"650 mg"` |
| pack_size | `variant.title` — e.g. `"Strip of 15 tablets"` |
| price | native Medusa variant price (INR, minor units) |
| mrp | `variant.metadata.mrp` (minor units) — see note |
| stock | native Medusa inventory |

> **MRP note — RESOLVED (backend, 2026-09-10).** Medusa **2.20.1** has **no
> native `compare_at_amount` on prices**. The Pricing module's `Price` model
> carries a single `amount` (`@medusajs/pricing/dist/models/price.d.ts`);
> `compare_at_unit_price` exists only on *cart* and *order* line items, not on
> variant prices. So `variant.metadata.mrp` **stays**. Discount % remains
> derived, never stored.

> **Units — read this before touching money (backend, 2026-09-10).**
> The two price fields above are in *different* units, because Medusa's are not
> what the original note assumed:
>
> - **`variant.metadata.mrp` is in minor units (paise).** ₹40.00 is stored as
>   `4000`. Unchanged from this contract's original wording.
> - **Medusa's native variant price is a decimal in MAJOR units.** The Store API
>   returns `calculated_price.calculated_amount` as e.g. `32` or `85.5`, meaning
>   ₹32.00 / ₹85.50 — *not* paise. Medusa stores prices as decimals throughout
>   (`BigNumber`), which is also why `@medusajs/payment-stripe` multiplies by 100
>   before calling Stripe.
>
> Therefore, to produce `Medicine.price` in the minor units the storefront types
> declare, the storefront must scale:
> `price = Math.round(calculated_amount * 100)`, while `mrp` is used as-is.
> `Medicine`, `LineItem` and `Cart` amounts all stay minor-unit as written.

### Categories
Exactly these six, as Medusa product categories:

| Handle | Name |
|---|---|
| `pain-fever` | Pain & Fever |
| `cold-cough` | Cold & Cough |
| `vitamins-supplements` | Vitamins & Supplements |
| `diabetes-care` | Diabetes Care |
| `skin-care` | Skin Care |
| `baby-care` | Baby Care |

### Template seed data — pinned

`backend/src/scripts/seed.ts` is the **single source of truth** for product data.
The storefront's `lib/medusa/mock-data.ts` is a mirror of it and must stay in sync:
once the storefront talks to the real backend, every field below comes from the
seed and the mock is only an offline fallback. A mismatch silently changes what
the page shows the moment the SDK is wired in.

| Handle | Rx? | Price | MRP | Pack |
|---|---|---|---|---|
| `acme-pain-relief` | **yes** | ₹32 | ₹40 | Strip of 15 tablets |
| `acme-vitamin-c` | no | ₹299 | ₹399 | Bottle of 60 tablets |
| `acme-antacid` | no | ₹85.50 | ₹110 | Bottle of 170 ml |
| `acme-ors` | no | ₹18 | ₹22 | Pack of 5 sachets |

**`acme-pain-relief` is the one Rx-gated product.** This was originally left as
"at least one product" and the two halves picked different ones — the storefront
flagged the antacid, the backend flagged pain relief. Naming it here is what stops
that recurring. If you change it, change both files and this table together.

### Prescription (custom module)
```ts
type PrescriptionStatus = 'pending' | 'approved' | 'rejected'

type Prescription = {
  id:           string
  status:       PrescriptionStatus
  file_id:      string        // Medusa file module id
  file_url:     string
  customer_id:  string | null // null = guest upload
  cart_id:      string | null
  order_id:     string | null
  patient_name: string | null
  note:         string | null // pharmacist's note on approve/reject
  created_at:   string
  reviewed_at:  string | null
}
```

---

## Storefront-facing types

Storefront normalises Medusa responses into these. Lives at
`storefront/lib/medusa/types.ts`. The backend agent does not import this; it is
the storefront's view of the contract above.

```ts
export type CategorySlug =
  | 'pain-fever' | 'cold-cough' | 'vitamins-supplements'
  | 'diabetes-care' | 'skin-care' | 'baby-care'

export type Medicine = {
  id:                   string
  handle:               string
  name:                 string
  brand:                string
  category:             CategorySlug
  description:          string
  composition:          string
  dosage:               string
  packSize:             string
  price:                number   // minor units, INR
  mrp:                  number   // minor units, INR
  discountPct:          number   // derived: round((mrp - price) / mrp * 100)
  image:                string
  inStock:              boolean
  requiresPrescription: boolean
}
```

### Cart, as the storefront sees it

Medusa owns the real cart. These are the **normalised** shapes the storefront
renders, derived from `StoreCart` / `StoreCartLineItem`. Amounts are minor units,
INR, exactly like `Medicine.price`. Nothing here is a new backend concept — the
backend agent implements no route for it — but it is written down so both halves
agree on what a cart *means* before the SDK swap.

```ts
export type LineItem = {
  id:                   string   // Medusa line-item id
  medicineId:           string
  handle:               string
  name:                 string
  packSize:             string
  image:                string
  unitPrice:            number   // minor units, INR
  mrp:                  number   // minor units, INR
  quantity:             number
  requiresPrescription: boolean
}

export type Cart = {
  id:           string
  items:        LineItem[]
  subtotal:     number   // Σ unitPrice × quantity
  mrpTotal:     number   // Σ mrp × quantity
  savings:      number   // mrpTotal − subtotal, derived
  shipping:     number
  total:        number   // subtotal + shipping
  currencyCode: string   // 'inr'

  // The prescription gate, mirrored from the attached prescription. The server
  // is still the authority (see "The one rule that isn't stock commerce").
  prescriptionId:     string | null
  prescriptionStatus: PrescriptionStatus | null
}
```

`requiresPrescription` on any line item is what makes the gate apply. The
storefront computes `needsPrescription = items.some(i => i.requiresPrescription)`
and disables checkout unless `prescriptionStatus === 'approved'`.

---

## API surface

### Standard Medusa store API (via `@medusajs/js-sdk`)
Products, categories, cart lifecycle, and checkout use stock Medusa endpoints.
Do not wrap these in custom routes.

### Custom routes

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/store/prescriptions` | Upload a prescription (multipart). Returns `Prescription`. |
| `GET` | `/store/prescriptions/:id` | Poll status. |
| `POST` | `/store/carts/:id/prescription` | Attach an existing prescription to a cart. |
| `GET` | `/admin/prescriptions` | Review queue. Supports `?status=pending`. |
| `POST` | `/admin/prescriptions/:id/approve` | Body `{ note?: string }`. |
| `POST` | `/admin/prescriptions/:id/reject` | Body `{ note: string }` — note required. |

**Response envelopes (backend, 2026-09-10).** All five single-record routes
return `{ "prescription": Prescription }`; the queue returns
`{ "prescriptions": Prescription[], "count", "limit", "offset" }`. The upload
returns **201**, the rest **200**. Errors follow Medusa's standard shape,
`{ code, type, message }`.

**Upload rules** for `POST /store/prescriptions` (multipart, field name `file`):
accepted MIME types are `image/jpeg`, `image/png`, `image/webp`, `image/heic`,
`application/pdf`; max size **5 MB**. Optional text fields: `patient_name`,
`cart_id`. `customer_id` is taken from the session, never the body — an
unauthenticated upload is a guest upload (`customer_id: null`). Rejections:
`prescription_file_required`, `prescription_invalid_file_type`,
`prescription_file_too_large` (all HTTP 400).

`GET /admin/prescriptions` also accepts `limit` (default 50, max 100) and
`offset`, and 400s on an unknown `status`.

---

## The one rule that isn't stock commerce

**Prescription gate.** If a cart contains any line item whose product has
`requires_prescription === true`, the cart cannot complete unless it has an
attached prescription with `status === 'approved'`.

- Enforced **server-side** in the cart-completion workflow. A rejected or pending
  prescription blocks the order. This is not a UI-only check.
- The storefront mirrors this in the UI (disabled checkout + explanation), but the
  server is the authority.
- Error shape on block: HTTP 400, `{ code: 'prescription_required', message }`.

---

## Payments — why we write the Razorpay provider ourselves

Checked on 2026-09-10 against Medusa **2.20.1**:

- `@devx-commerce/razorpay` — `latest` tag points at `6.0.0-beta.0`. Every release
  from 4.x up is a beta, and its peerDeps are pinned to exactly `2.14.2`.
- `medusa-plugin-razorpay-v2` — `0.1.4`, untouched since Dec 2025.
- `@tsc_tech/medusa-plugin-razorpay-payment` — targets `>= 2.4.0`, low activity.

A template merchants deploy to production must not depend on a beta plugin pinned
to an older Medusa. So: **Stripe uses the official `@medusajs/payment-stripe`
plugin; Razorpay is our own provider module** implementing Medusa's stable
`AbstractPaymentProvider` interface. Bounded work, no version skew, and we own it.

Provider id: `razorpay`. Lives at `backend/src/modules/razorpay/`.
Must implement: `initiatePayment`, `authorizePayment`, `capturePayment`,
`refundPayment`, `cancelPayment`, `deletePayment`, `retrievePayment`,
`updatePayment`, `getPaymentStatus`, and webhook handling (`getWebhookActionAndData`).
Razorpay amounts are in **paise** (minor units).

> **Correction (backend, 2026-09-10):** this is *not* the same convention as
> Medusa, so a conversion **is** required. Medusa hands a payment provider a
> **decimal, major-unit** amount (₹149.50 arrives as `149.5`), exactly as it does
> to `@medusajs/payment-stripe`, which converts with its own `getSmallestUnit`.
> Our provider converts in `src/modules/razorpay/lib.ts` (`toMinorUnit` /
> `fromMinorUnit`), rounds after collapsing IEEE-754 representation error so a
> half-paisa amount can't silently lose a paisa, and handles zero-decimal
> currencies. Asserted in `src/modules/razorpay/__tests__/razorpay.unit.spec.ts`
> (`npm run test:unit`).

## Environment variables

### `backend/.env`
```
DATABASE_URL=postgres://medusa:medusa@localhost:5432/medixgo
STORE_CORS=http://localhost:3000,http://localhost:3200
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:3000,http://localhost:3200,http://localhost:9000
JWT_SECRET=...
COOKIE_SECRET=...
STRIPE_API_KEY=          # optional in dev
RAZORPAY_KEY_ID=         # optional in dev
RAZORPAY_KEY_SECRET=
```

### `storefront/.env.local`
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_DEFAULT_REGION=in
```

> **Live dev values (backend, 2026-09-10).** The seeded key is
> `pk_47a4db5c6fa5ad9041ecd7b2542c6d72e574c8328f350fcb65b28c7d6e30a17d`
> (title "MedixGo Storefront Key", linked to the "MedixGo Storefront" sales
> channel). Regions: **India / inr** (default) and **United States / usd**.
> Admin: `http://localhost:9000/app`, `admin@medixgo.test` / `MedixGo123!`.
> Re-running `npm run seed` in `backend/` reprints the key.
>
> Seeded handles: `acme-pain-relief` (**requires_prescription: true** — the gate
> demo), `acme-vitamin-c`, `acme-antacid`, `acme-ors`.

Ports: storefront `3200` in this repo's `.claude/launch.json` (3000 is already taken
by the docs site), Medusa backend + admin `9000`. `STORE_CORS` must list the
storefront's **exact** origin including port, or every browser call is blocked —
Medusa reads CORS at boot, so restart after changing it.

---

## Resolved after wiring (2026-09-10)

Gaps found when the storefront actually met the live API. Recorded so the next
person does not rediscover them.

### Shipping — pinned
The contract defined `Cart.shipping` but never a rule, so the two halves invented
different ones (storefront: free over ₹499; backend: one flat option at ₹40).

**The rule is: whatever the backend's shipping options say.** The seed ships one
option, "Standard Delivery" at ₹40, with no free threshold. The storefront must not
hardcode a price or a free-shipping tier — it shows *"Delivery — added at checkout"*
until the server attaches a method, then shows the real total. A merchant changes
delivery pricing in the admin, and the storefront follows with no code change.

### Payment provider ids
The live INR region exposes `pp_razorpay_razorpay` and `pp_system_default`.
**`pp_stripe_stripe` does not exist unless `STRIPE_API_KEY` is set** — the Stripe
plugin is registered conditionally, because Stripe's SDK throws on an empty key. So
the storefront must read the provider list from `GET /store/payment-providers` and
never hardcode a provider id. Without keys, `pp_system_default` is the only path that
completes; Razorpay returns `razorpay_not_configured`.

### `Cart.prescriptionId` / `prescriptionStatus` have no server source
`GET /store/carts/:id` carries no prescription field and there is no store route to
list prescriptions by cart. The storefront therefore holds the id in a
`medixgo_rx_id` cookie and polls `GET /store/prescriptions/:id`. This works, but it
is client-held state standing in for a server fact. **The clean fix is a `cart_id`
filter on a store prescriptions route, or echoing the id on the cart** — worth doing
before this template ships widely.

### `inStock` is optimistic
`variant.inventory_quantity` is not returned by the store product API for these
products even when requested, so `inStock` is derived defensively (absent ≠ zero) and
everything reads as in stock. Real stock display needs the sales channel linked to a
stock location. **A pharmacy selling something it does not have is a real failure
mode** — fix before launch, not after.

### `Medicine.id`
Now the **variant** id, because the cart needs it. Contract only requires `string`,
so this is compliant, but it differs from the mock's `med_*` ids.

---

## Non-negotiable design rules (storefront)

These come from the project's standing rules — violating them means a rewrite.

1. **Squircles.** Every element with a corner radius uses `@lisse/react` at
   `smoothing: 0.6` — via `Surface` for containers, `SmoothCorners asChild` for
   interactive elements. Plain `rounded-*` alone is never acceptable.
2. **Borders.** Never CSS `border` on a squircle-clipped element — it gets clipped
   away. Use `lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border)' } }}`.
3. **Icons.** Hugeicons only. Never lucide.
4. **No AI-slop tells.** No ALL-CAPS section labels, no emoji as UI icons, no
   generic purple/blue gradients, no `text-transform: uppercase` tracking-widest
   eyebrow text. Editorial, warm, restrained.
5. **Theme-aware.** Every colour needs a `dark:` variant.
6. **Motion.** Use the `transitions-dev` motion tokens. Respect
   `prefers-reduced-motion`.
