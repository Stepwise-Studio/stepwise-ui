# Assets

**The template ships complete — it needs no image files to run.**

Every illustration is drawn programmatically as SVG in `components/riso/`, in the
Riso Pharma Editorial style: flat layered inks, halftone, paper grain, botanicals.
They are theme-aware, resolution-independent, and add nothing to page weight.

So this document covers two separate things:

1. **[Product photography](#1-product-photography)** — the one genuine gap. Four files.
2. **[Replacing the drawn illustrations](#2-optional-replacing-the-drawn-illustrations)** — optional, only if you'd rather ship your own artwork.

---

## 1. Product photography

The art direction carves out one deliberate exception: **product cards use realistic
premium studio photography, not the illustration style.** That's the only place a
real photograph is required, and it's currently stood in for by `ProductShot`, which
draws a plain ACME carton.

| File | Product | Size | Aspect |
|---|---|---|---|
| `public/products/acme-pain-relief.jpg` | ACME Pain Relief — box + blister strip | 1200 × 900 | 4:3 |
| `public/products/acme-vitamin-c.jpg` | ACME Vitamin C — amber bottle + box | 1200 × 900 | 4:3 |
| `public/products/acme-antacid.jpg` | ACME Antacid — white bottle + box | 1200 × 900 | 4:3 |
| `public/products/acme-ors.jpg` | ACME ORS — box + sachet | 1200 × 900 | 4:3 |

**Shooting notes** — the pack system from the source document: every ACME carton is
cream with exactly one accent, and only two accents exist across the range (coral for
pain relief / vitamin C / ORS, teal for antacid). Warm seamless sweep background, soft
contact shadow, product centred with generous margin. No props, no hands, no text
overlays — the page supplies all typography.

### Wiring them up

`Medicine.image` already carries these paths, so the data layer needs no change.
In `components/site/medicine-card.tsx`, swap the `<ProductShot>` for an `<img>`
(or `next/image`) reading `medicine.image`. The container is already `aspect-[4/3]`.

Once you have your own catalogue, product images come from the **admin panel**
instead — this only applies to the four bundled samples.

---

## 2. Optional: replacing the drawn illustrations

Only do this if you have artwork you prefer. The drawn plates are complete and
production-ready as they are.

Each plate is a component in `components/riso/illustrations.tsx`. To use an image
instead, replace the component's body with an `<img>` — `components/riso/plate.tsx`
documents the swap. Match the aspect ratio or the composition will crop.

### Section plates

| Component | Suggested file | Size | Aspect | Subject |
|---|---|---|---|---|
| `HeroPlate` | `public/art/hero.png` | 1560 × 1380 | 520:460 | Shelf of pharmacy objects behind an arch, botanicals below. The widest composition; the only one carrying all five inks. |
| `PrescriptionPlate` | `public/art/prescription.png` | 1260 × 1140 | 420:380 | Prescription sheet, Rx symbol, pharmacist's hand or counter |
| `TrustPlate` | `public/art/trust.png` | 1200 × 1020 | 400:340 | Shield / seal, sealed pack, verification mark |
| `DeliveryPlate` | `public/art/delivery.png` | 1200 × 960 | 400:320 | Delivery package, route or door, botanical accent |
| `SpotPlate` | `public/art/spot-<name>.png` | 600 × 600 | 1:1 | Small single-object spots used inline |

### Category plates — 400 × 400 each (1:1)

`public/art/category-<handle>.png`. **Illustration only** — no titles, no card UI, no
buttons, no website typography baked in. The page supplies all text.

| Handle | Visual concept |
|---|---|
| `pain-fever` | Cream scored tablet, orange/white capsule, stone pedestal, botanical leaves, white flower, blue hills and clouds, geometric arches |
| `cold-cough` | Blue-and-white capsule, white flower, deep green leaves, blue clouds and arches, stone pedestal, small geometric accents |
| `vitamins-supplements` | Amber capsule, scored tablet, orange slice, deep green leaves, warm orange halo, stone pedestal, clouds and arches |
| `diabetes-care` | Sleek ivory/graphite glucose meter with dark display, blue trim and test strip, scored tablets, leaves, white flowers, blue halo and hills, stone pedestal |
| `skin-care` | Tall matte cream skincare tube with ribbed neck, stone-toned base, deep teal leaves, white flower with gold centre, pale buds, translucent serum droplet, **lavender/violet geometric accents** |
| `baby-care` | Pastel baby bottle, pale blue cap, cream milk, measurement markings, stone pedestals, blue and peach arches and clouds, deep green leaves, white flower |

### Palette

Cream / warm ivory · deep navy · cobalt blue · muted teal · deep botanical green ·
warm coral / orange · charcoal.

### Strictly avoid

Stock photography · photorealistic illustration · 3D CGI · glossy product renders in
editorial sections · generic AI gradients · random decorative text · logos or
watermarks inside illustrations · overly complex compositions.

---

## Other files

**Favicon / OG image** — not yet present. Add `app/icon.png` (512 × 512) and
`app/opengraph-image.jpg` (1200 × 630); Next.js picks both up by filename.

**Fonts** — Inter Display, already bundled in `public/fonts/`. Nothing to do.
