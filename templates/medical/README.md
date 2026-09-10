# MedixGo — online pharmacy template

A complete, working online-medicine store: an editorial storefront, a real commerce
backend, an admin panel your staff can operate, and a prescription review workflow.

This is not a static landing page. Products, stock, carts, orders and prescriptions
are real records in your own database.

---

## What you get

| Piece | What it is | Who uses it |
|---|---|---|
| **Storefront** | Next.js site — browse, search, cart, prescription upload, checkout | Your customers |
| **Backend** | Medusa v2 — products, inventory, orders, payments, prescriptions | Nobody directly; it's the engine |
| **Admin panel** | Medusa Admin, included — products, stock, orders, prescription queue | You and your pharmacists |

You run two processes and one database. That's the whole system.

```
 customer ──▶ Storefront (:3000) ──▶ Backend (:9000) ──▶ PostgreSQL
                                          │
 pharmacist ─────────────────────────▶ Admin (:9000/app)
```

---

## Before you start

- **Node.js** `^20.19.0` or `>=22.12.0`
- **PostgreSQL** — you do *not* install or manage this yourself in production; your
  host provisions it and gives you a connection string (see [Deploying](#deploying))
- A **Stripe** and/or **Razorpay** account when you're ready to take real money

---

## Local setup

Roughly ten minutes, most of it `npm install`.

### 1. Database

Locally, one command creates what you need:

```bash
sudo -u postgres psql -c "CREATE USER medusa WITH PASSWORD 'medusa' CREATEDB;" && sudo -u postgres psql -c "CREATE DATABASE medixgo OWNER medusa;"
```

### 2. Backend

```bash
cd backend && cp .env.example .env && npm install
```

Open `.env` and set `DATABASE_URL` to your database. Then set `JWT_SECRET`,
`COOKIE_SECRET` and `AUTH_MFA_ENCRYPTION_KEY` to random values — anything long and
unguessable. Leave the payment keys blank for now; the store runs fine without them.

Create the tables, load the sample catalogue, and create your login:

```bash
npx medusa db:migrate && npm run seed && npx medusa user -e you@yourpharmacy.com -p "a-strong-password"
```

The seed prints a **publishable API key** — copy it, the storefront needs it. Run the
seed twice if you like; it won't duplicate anything.

```bash
npm run dev
```

Admin panel is now at **http://localhost:9000/app**.

### 3. Storefront

```bash
cd ../storefront && cp .env.local.example .env.local && npm install
```

Put the publishable key from step 2 into `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, then:

```bash
npm run dev
```

Your store is at **http://localhost:3000**.

---

## Making it yours

### Products
Delete the four ACME samples in the admin and add your own. Everything the storefront
shows comes from here — nothing is hardcoded in the site.

Two fields are specific to this template, set per product under **Metadata**:

| Key | Value | Effect |
|---|---|---|
| `requires_prescription` | `true` / `false` | `true` puts the product behind the prescription gate |
| `composition` | e.g. `Paracetamol 650 mg` | Shown under the product name |

And on each variant:

| Key | Value | Effect |
|---|---|---|
| `mrp` | price in **paise** (₹40 → `4000`) | The struck-through price; the discount % is calculated from it |
| `dosage` | e.g. `650 mg` | Shown on the product card |

> **Careful:** `mrp` is in paise, but the variant's actual price is entered in rupees
> in the admin. They are deliberately different units — this is the one place it's
> easy to be off by 100×. Check a product card after adding your first item.

### Categories
The six categories are fixed in the storefront's illustrations (`pain-fever`,
`cold-cough`, `vitamins-supplements`, `diabetes-care`, `skin-care`, `baby-care`).
Renaming a category's *display name* in the admin is safe. Changing its **handle**
means also updating the storefront, so prefer renaming.

### Look and copy
- Images: see [`storefront/ASSETS.md`](storefront/ASSETS.md) for every image slot with
  its exact filename and dimensions.
- Colours and fonts: `storefront/app/globals.css`.
- Text: each homepage section is one file in `storefront/components/sections/`.

---

## The prescription workflow

This is the part that makes it a pharmacy rather than a shop.

1. Customer adds a prescription-only medicine — checkout locks and says why.
2. They upload a prescription (image or PDF, max 5 MB).
3. It appears in **Prescriptions** in your admin.
4. A pharmacist opens it, reads it, and approves or rejects. Rejecting requires a
   written reason, which the customer sees.
5. Once approved, checkout unlocks.

**The gate is enforced on the server**, inside the order-creation workflow. A customer
cannot bypass it by manipulating the site — a prescription-only order will not become
an order without an approved prescription.

---

## Payments

Both providers boot fine with no keys, so you can build your catalogue before you
have a payment account.

**Stripe** — best outside India. Put `STRIPE_API_KEY` in `.env`. Only registers when
the key is present.

**Razorpay** — best in India; covers UPI, netbanking, wallets and cards. Set
`RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. This provider is written specifically
for this template rather than pulled from a plugin, because every published Medusa
Razorpay plugin is currently either a beta or pinned to an older Medusa.

Start in **test mode**, place a real test order end to end, and only then switch to
live keys.

---

## Before you take real orders

Do not skip this section.

### 🔴 Prescription files are patient health data

In local development, uploads are written to `backend/static/` by Medusa's local file
provider, which **serves them publicly to anyone who guesses the URL**. That is fine
on your laptop and completely unacceptable in production — these are medical records.

Before going live, switch to S3 (or any provider with signed, expiring URLs):

```bash
npm install @medusajs/file-s3
```

then replace the file provider in `backend/medusa-config.ts` with the S3 provider and
its bucket credentials. Nothing else in the template changes.

### 🟠 Two things that are not finished yet

**Stock is displayed optimistically.** Every product currently reads as in stock,
because the store API isn't returning inventory quantities for the seeded catalogue —
the sales channel needs to be linked to a stock location. Until that's done, the site
will happily take an order for something you've run out of. Fix this before you take
real orders.

**Offer codes are display-only.** The coupon codes on the offers section (`FIRST15`,
`REFILL10`) are copy, not promotions. Entering one at checkout will not discount
anything until you create a matching promotion in the admin under **Promotions**.
Either wire them up or remove the codes from `storefront/lib/offers.ts`.

### The rest of the list

- [ ] Stock display fixed, and offer codes either wired or removed (above)
- [ ] File storage moved off local disk (above)
- [ ] `JWT_SECRET`, `COOKIE_SECRET`, `AUTH_MFA_ENCRYPTION_KEY` set to fresh random values — never the example ones
- [ ] `STORE_CORS` / `ADMIN_CORS` / `AUTH_CORS` set to your real domains, not `localhost`
- [ ] Redis configured — without it, sessions and background jobs live in one process's memory and won't survive a restart or scale past one instance
- [ ] Payments tested end to end in test mode, then switched to live keys
- [ ] Database backups turned on with your host
- [ ] A real admin account created, and the seeded demo account removed

### ⚖️ Legal — read this

Selling medicine online is regulated, and the rules differ by country and often by
state. Depending on where you operate you may need a pharmacy licence, a registered
pharmacist reviewing orders, specific record-keeping, and restrictions on which drugs
can be sold online at all.

**This template gives you the software, not compliance.** The prescription workflow is
a tool to help a licensed pharmacy operate — it is not a substitute for being one. Get
advice from someone who knows your jurisdiction before you take a single order.

---

## Deploying

The storefront and backend deploy separately.

**Storefront** → Vercel, Netlify, Cloudflare Pages. Set the two `NEXT_PUBLIC_*` env
vars. Nothing else.

**Backend + database** → needs a persistent Node process (not serverless):

| Host | Database | Notes |
|---|---|---|
| Railway | Add Postgres in one click | Simplest; copy the `DATABASE_URL` it gives you |
| Render | Managed Postgres addon | Similar, good free tier to start |
| Medusa Cloud | Included | Managed by Medusa themselves; least work |
| Your own VPS | You install it | Most control, most maintenance |

In every case your database work is: **click "add Postgres", copy the connection
string, paste it into `DATABASE_URL`.** You never install or patch Postgres yourself.

After the first deploy, run the migration once against the production database:

```bash
npx medusa db:migrate
```

Then point `STORE_CORS` at your storefront domain and redeploy the backend.

---

## Troubleshooting

**Storefront shows products but the cart does nothing** — `STORE_CORS` in the backend
`.env` doesn't include the storefront's exact origin (including port). Fix it and
restart the backend; env changes are read at boot.

**"Publishable key required"** — `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` is missing or
stale. Re-run `npm run seed` in the backend; it reprints the key.

**Prices are 100× wrong** — a `mrp` entered in rupees instead of paise. ₹40 is `4000`.

**Admin won't load** — the backend didn't boot. Check its terminal; a bad
`DATABASE_URL` is the usual cause.

**Changed `.env` and nothing happened** — restart the backend.
