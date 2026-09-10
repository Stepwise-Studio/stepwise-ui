import type { CategorySlug } from '@/lib/medusa/types'

/**
 * Category presentation metadata.
 *
 * The six handles are fixed by the contract and will never be fetched at
 * runtime just to render a nav menu, so display name and display order live
 * here as static data. `getCategories()` in `lib/medusa/client.ts` remains the
 * source of truth for *which* categories exist - this file only decides how
 * they are labelled and in what order they appear.
 *
 * A seventh category would need adding to `CategorySlug` in the contract first,
 * which is exactly the friction that should exist.
 */

export const CATEGORY_ORDER: CategorySlug[] = [
  'pain-fever',
  'cold-cough',
  'vitamins-supplements',
  'diabetes-care',
  'skin-care',
  'baby-care',
]

export const CATEGORY_NAMES: Record<CategorySlug, string> = {
  'pain-fever'          : 'Pain & Fever',
  'cold-cough'          : 'Cold & Cough',
  'vitamins-supplements': 'Vitamins & Supplements',
  'diabetes-care'       : 'Diabetes Care',
  'skin-care'           : 'Skin Care',
  'baby-care'           : 'Baby Care',
}

export function isCategorySlug(value: string | undefined | null): value is CategorySlug {
  return !!value && (CATEGORY_ORDER as string[]).includes(value)
}
