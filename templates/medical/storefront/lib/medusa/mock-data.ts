/**
 * Template seed data.
 *
 * This file exists so the storefront can be built, reviewed and demoed while
 * the Medusa backend is built in parallel. It is the ONLY place in the
 * storefront that invents domain data - every page reads through
 * `lib/medusa/client.ts`, which today serves these arrays and tomorrow serves
 * `@medusajs/js-sdk` responses of the same shape.
 *
 * When the backend lands: delete this file, delete its imports in `client.ts`.
 * Nothing else should need to change.
 *
 * ACME is a fictional template brand, not a real medicine brand.
 */

import type { Category, Medicine } from './types'

export const CATEGORIES: Category[] = [
  { handle: 'pain-fever',           name: 'Pain & Fever' },
  { handle: 'cold-cough',           name: 'Cold & Cough' },
  { handle: 'vitamins-supplements', name: 'Vitamins & Supplements' },
  { handle: 'diabetes-care',        name: 'Diabetes Care' },
  { handle: 'skin-care',            name: 'Skin Care' },
  { handle: 'baby-care',            name: 'Baby Care' },
]

/** `discountPct` is derived, never authored - the contract is explicit that it
 *  is computed from price and mrp so the two can never disagree. */
const discountPct = (price: number, mrp: number) =>
  mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0

type MedicineSeed = Omit<Medicine, 'discountPct'>

const SEED: MedicineSeed[] = [
  {
    id                  : 'med_acme_pain_relief',
    handle              : 'acme-pain-relief',
    name                : 'ACME Pain Relief',
    brand               : 'ACME',
    category            : 'pain-fever',
    description         :
      'Paracetamol for everyday aches and fever. One tablet works for headache, ' +
      'body ache and the sort of low fever that keeps you home for a day. Take ' +
      'after food, and no more than four tablets in twenty-four hours. Sold ' +
      'against a valid prescription.',
    composition         : 'Paracetamol 650 mg',
    dosage              : '650 mg',
    packSize            : 'Strip of 15 tablets',
    price               : 3200,   // ₹32
    mrp                 : 4000,   // ₹40
    image               : '/products/acme-pain-relief.jpg',
    inStock             : true,
    // The gate has to be demonstrable, so exactly one template product needs a
    // prescription. Add this line item to a cart and checkout locks.
    //
    // Which product this is MUST match `backend/src/scripts/seed.ts` - once the
    // storefront talks to the real backend every field here is replaced by seed
    // data, so a mismatch would silently move the Rx badge to another card.
    requiresPrescription: true,
  },
  {
    id                  : 'med_acme_vitamin_c',
    handle              : 'acme-vitamin-c',
    name                : 'ACME Vitamin C',
    brand               : 'ACME',
    category            : 'vitamins-supplements',
    description         :
      'A daily 1000 mg vitamin C tablet in an amber bottle that keeps the light ' +
      'out. Chewable, orange, and not unpleasant about it. One a day with ' +
      'breakfast is the whole routine.',
    composition         : 'Ascorbic Acid 1000 mg',
    dosage              : '1000 mg',
    packSize            : 'Bottle of 60 tablets',
    price               : 29900,  // ₹299
    mrp                 : 39900,  // ₹399
    image               : '/products/acme-vitamin-c.jpg',
    inStock             : true,
    requiresPrescription: false,
  },
  {
    id                  : 'med_acme_antacid',
    handle              : 'acme-antacid',
    name                : 'ACME Antacid',
    brand               : 'ACME',
    category            : 'pain-fever',
    description         :
      'A mint suspension for heartburn and acidity after a heavy meal. Shake ' +
      'well, two teaspoons, and give it twenty minutes. Sugar free.',
    composition         : 'Magaldrate 400 mg + Simethicone 20 mg',
    dosage              : '400 mg / 5 ml',
    packSize            : 'Bottle of 170 ml',
    price               : 8550,   // ₹85.50
    mrp                 : 11000,  // ₹110
    image               : '/products/acme-antacid.jpg',
    inStock             : true,
    requiresPrescription: false,
  },
  {
    id                  : 'med_acme_ors',
    handle              : 'acme-ors',
    name                : 'ACME ORS',
    brand               : 'ACME',
    category            : 'baby-care',
    description         :
      'Oral rehydration salts, WHO formula, in single-dose orange sachets. ' +
      'One sachet in one litre of clean water, finished within twenty-four ' +
      'hours. For the days that follow a stomach upset, at any age.',
    composition         : 'Sodium Chloride, Potassium Chloride, Sodium Citrate, Dextrose',
    dosage              : '21.8 g / sachet',
    packSize            : 'Pack of 5 sachets',
    price               : 1800,   // ₹18
    mrp                 : 2200,   // ₹22
    image               : '/products/acme-ors.jpg',
    inStock             : true,
    requiresPrescription: false,
  },
]

export const MEDICINES: Medicine[] = SEED.map(m => ({
  ...m,
  discountPct: discountPct(m.price, m.mrp),
}))
