import type { CategorySlug } from '@/lib/medusa/types'
import { Plate } from './plate'
import {
  Arch, BabyBottle, Bottle, Capsule, CitrusHalf, Cloud, Cross, Droplet, Flower,
  GlucoseMeter, Halftone, Hills, Leaf, Offset, Parcel, Pedestal, RxSheet,
  Shield, Sprig, Tablet, Tube,
} from './shapes'

/**
 * Every illustration on the site, in one file.
 *
 * Each is a fixed composition built from `shapes.tsx`, following the visual
 * concept recorded per category in the source document (and reproduced in
 * `ASSETS.md`). They are **placeholders in the right key** - the correct
 * subject, palette, texture and composition - standing in until the owner's
 * finished riso plates land.
 *
 * Composition rules, applied to all of them:
 *   · one hero object, centred, on a pedestal
 *   · arches or hills behind it, never both at full weight
 *   · botanical elements entering from the lower corners
 *   · a halo or halftone disc behind the object to separate it from the ground
 *   · generous empty paper at the top - it is where the card's own text sits
 */

/* ═══════════════════════════════════════════════════════════════════════════
   Category plates
   ═══════════════════════════════════════════════════════════════════════════ */

/** 01 — Pain & Fever. Cream scored tablet, orange/white capsule, stone
 *  pedestal, botanical leaves, white flower, blue hills, geometric arches. */
function PainFever({ className }: { className?: string }) {
  return (
    <Plate className={className}>
      <Arch x={86} y={34} w={228} h={252} fill="var(--plate-cobalt)" opacity={0.14} />
      <Cloud x={18} y={52} s={0.8} fill="var(--plate-cobalt)" />
      <Halftone cx={200} cy={188} r={104} ink="cobalt" opacity={0.4} />
      <Hills y={264} fill="var(--plate-cobalt)" opacity={0.9} />

      <Pedestal cx={200} y={278} w={196} />
      {/* The capsule sits behind and to the right, the tablet in front - two
          objects, one clearly foreground, rather than a row of equals. */}
      <Offset by={{ x: 1, y: -1 }}>
        <Capsule cx={252} cy={206} w={54} h={124} rot={16} top="var(--plate-coral)" bottom="var(--plate-cream)" />
      </Offset>
      <Tablet cx={162} cy={224} r={54} rot={-14} />

      <Leaf x={12} y={286} rot={-32} s={0.72} fill="var(--plate-green)" />
      <Sprig x={286} y={300} rot={-14} s={0.68} fill="var(--plate-green)" />
      <Flower cx={330} cy={236} r={26} center="var(--plate-coral)" />
      <circle cx="72" cy="150" r="13" fill="var(--plate-coral)" />
    </Plate>
  )
}

/** 02 — Cold & Cough. Blue-and-white capsule, white flower, deep green leaves,
 *  blue clouds and arches, stone pedestal, small geometric accents. */
function ColdCough({ className }: { className?: string }) {
  return (
    <Plate className={className}>
      <Arch x={112} y={26} w={176} h={238} fill="var(--plate-teal)" opacity={0.24} />
      <Cloud x={256} y={46} s={0.9} fill="var(--plate-cobalt)" />
      <Cloud x={24} y={94} s={0.62} fill="var(--plate-cobalt)" />
      <Halftone cx={200} cy={196} r={92} ink="cobalt" opacity={0.36} />

      <Pedestal cx={200} y={282} w={178} />
      <Offset by={{ x: -1.5, y: 1 }}>
        <Capsule cx={200} cy={200} w={64} h={152} rot={-10} top="var(--plate-cobalt)" bottom="var(--plate-cream)" />
      </Offset>

      <Leaf x={266} y={296} rot={-46} s={0.78} fill="var(--plate-green)" />
      <Leaf x={30} y={306} rot={-16} s={0.6} fill="var(--plate-green)" />
      <Flower cx={92} cy={228} r={30} center="var(--plate-coral)" />
      <rect x="308" y="152" width="22" height="22" rx="5" fill="var(--plate-coral)" opacity="0.9" />
    </Plate>
  )
}

/** 03 — Vitamins & Supplements. Amber capsule, scored tablet, orange slice,
 *  deep green leaves, warm orange halo, stone pedestal, clouds and arches. */
function Vitamins({ className }: { className?: string }) {
  return (
    <Plate className={className}>
      <circle cx="200" cy="184" r="122" fill="var(--plate-coral)" opacity="0.2" />
      <Arch x={46} y={60} w={120} h={196} fill="var(--plate-coral)" opacity={0.16} />
      <Arch x={236} y={82} w={116} h={174} fill="var(--plate-green)" opacity={0.16} />
      <Halftone cx={200} cy={184} r={96} ink="coral" opacity={0.42} />
      <Cloud x={278} y={40} s={0.7} fill="var(--plate-cobalt)" />

      <Pedestal cx={200} y={280} w={210} />
      <CitrusHalf cx={296} cy={216} r={46} />
      <Offset by={{ x: 1.5, y: -1 }}>
        <Capsule cx={132} cy={200} w={52} h={128} rot={-18} top="var(--plate-coral)" bottom="var(--plate-cream)" />
      </Offset>
      <Tablet cx={206} cy={238} r={44} rot={22} />

      <Sprig x={16} y={302} rot={-8} s={0.72} fill="var(--plate-green)" />
      <Leaf x={330} y={300} rot={-58} s={0.56} fill="var(--plate-green)" />
    </Plate>
  )
}

/** 04 — Diabetes Care. Ivory/graphite glucose meter with a dark display and a
 *  blue test strip, scored tablets, leaves, white flowers, blue halo, pedestal. */
function DiabetesCare({ className }: { className?: string }) {
  return (
    <Plate className={className}>
      <circle cx="200" cy="176" r="118" fill="var(--plate-cobalt)" opacity="0.18" />
      <Hills y={252} fill="var(--plate-cobalt)" opacity={0.85} />
      <Halftone cx={200} cy={176} r={94} ink="cobalt" opacity={0.34} />

      <Pedestal cx={200} y={286} w={188} />
      <Offset by={{ x: -1, y: -1.5 }}>
        <GlucoseMeter cx={196} baseY={268} w={112} h={170} />
      </Offset>
      <Tablet cx={306} cy={252} r={30} rot={-18} />
      <Tablet cx={82} cy={268} r={24} rot={12} />

      <Leaf x={276} y={312} rot={-38} s={0.66} fill="var(--plate-green)" />
      <Leaf x={16} y={318} rot={-8} s={0.56} fill="var(--plate-green)" />
      <Flower cx={330} cy={166} r={24} center="var(--plate-coral)" />
      <Flower cx={64} cy={196} r={18} center="var(--plate-coral)" />
    </Plate>
  )
}

/** 05 — Skin Care. Tall matte cream tube with a ribbed neck on a stone base,
 *  deep teal leaves, white flower with a gold centre, pale buds, a translucent
 *  serum droplet, and the lavender geometric accents that are specific to this
 *  plate and appear on no other. */
function SkinCare({ className }: { className?: string }) {
  return (
    <Plate className={className}>
      <Arch x={118} y={18} w={164} h={262} fill="var(--plate-lavender)" opacity={0.24} />
      {/* A solid teal disc behind the tube. Without it the cream tube sits
          cream-on-cream and vanishes - the one plate where the hero object and
          the paper are the same value. */}
      <circle cx="200" cy="196" r="104" fill="var(--plate-teal)" opacity="0.55" />
      <Halftone cx={200} cy={196} r={104} ink="cobalt" opacity={0.3} />
      <circle cx="308" cy="112" r="42" fill="var(--plate-lavender)" opacity="0.4" />
      <rect x="42" y="96" width="34" height="34" rx="8" fill="var(--plate-lavender)" opacity="0.55" transform="rotate(-14 59 113)" />

      <Pedestal cx={200} y={288} w={172} />
      <Offset by={{ x: 1, y: -1 }}>
        <Tube cx={200} baseY={288} w={84} h={206} body="var(--plate-cream)" cap="var(--plate-teal)" />
      </Offset>
      <Droplet cx={296} cy={244} s={0.8} fill="var(--plate-teal)" />

      <Leaf x={252} y={302} rot={-42} s={0.72} fill="var(--plate-teal)" />
      <Leaf x={22} y={296} rot={-18} s={0.66} fill="var(--plate-teal)" />
      <Flower cx={96} cy={216} r={30} center="var(--plate-coral)" />
      <circle cx="132" cy="272" r="9" fill="var(--plate-cream)" />
      <circle cx="284" cy="298" r="7" fill="var(--plate-cream)" />
    </Plate>
  )
}

/** 06 — Baby Care. Pastel bottle with a pale blue cap, cream milk and
 *  measurement markings, stone pedestals, blue and peach arches and clouds,
 *  deep green leaves, white flower. */
function BabyCare({ className }: { className?: string }) {
  return (
    <Plate className={className}>
      <Arch x={60} y={46} w={136} h={220} fill="var(--plate-coral)" opacity={0.18} />
      <Arch x={212} y={30} w={146} h={236} fill="var(--plate-cobalt)" opacity={0.18} />
      <Cloud x={30} y={36} s={0.66} fill="var(--plate-cobalt)" />
      <Halftone cx={200} cy={196} r={90} ink="coral" opacity={0.3} />

      <Pedestal cx={200} y={292} w={184} />
      <Offset by={{ x: -1, y: 1.5 }}>
        <BabyBottle cx={200} baseY={292} w={92} h={190} body="var(--plate-cream)" cap="var(--plate-cobalt)" milk="var(--plate-coral)" />
      </Offset>

      <Leaf x={272} y={310} rot={-40} s={0.7} fill="var(--plate-green)" />
      <Leaf x={20} y={314} rot={-10} s={0.58} fill="var(--plate-green)" />
      <Flower cx={318} cy={224} r={26} center="var(--plate-coral)" />
      <circle cx="76" cy="212" r="12" fill="var(--plate-lavender)" opacity="0.8" />
    </Plate>
  )
}

const CATEGORY_PLATES: Record<CategorySlug, (p: { className?: string }) => React.ReactElement> = {
  'pain-fever'          : PainFever,
  'cold-cough'          : ColdCough,
  'vitamins-supplements': Vitamins,
  'diabetes-care'       : DiabetesCare,
  'skin-care'           : SkinCare,
  'baby-care'           : BabyCare,
}

/**
 * A category plate, sized by its container.
 *
 * The default is `absolute inset-0` because a bento cell decides its own
 * height: the plate is the cell's ground, and the label sits on top of it in
 * normal flow. A `Plate` left in the flow has no intrinsic height at all - its
 * only child is an absolutely-positioned SVG - so it would collapse to zero and
 * the card would render as bare paper.
 */
export function CategoryPlate({
  slug,
  className = 'absolute inset-0',
}: {
  slug: CategorySlug
  className?: string
}) {
  const Art = CATEGORY_PLATES[slug]
  return <Art className={className} />
}

/* ═══════════════════════════════════════════════════════════════════════════
   Section plates
   ═══════════════════════════════════════════════════════════════════════════ */

/** Hero. The widest composition on the site and the only one that carries all
 *  five inks: a shelf of pharmacy objects behind an arch, botanicals below. */
export function HeroPlate() {
  return (
    <Plate viewBox="0 0 520 460" className="h-full w-full">
      <Arch x={128} y={18} w={286} h={330} fill="var(--plate-cobalt)" opacity={0.16} />
      <circle cx="118" cy="122" r="58" fill="var(--plate-coral)" opacity="0.24" />
      <Cloud x={330} y={44} s={0.9} fill="var(--plate-cobalt)" />
      <Halftone cx={272} cy={214} r={132} ink="cobalt" opacity={0.34} />
      <Hills y={318} fill="var(--plate-cobalt)" opacity={0.9} />

      {/* Shelf */}
      <rect x="58" y="330" width="404" height="15" rx="5" fill="var(--plate-stone)" />
      <rect x="80" y="345" width="360" height="11" rx="4" fill="var(--plate-ink)" opacity="0.2" />

      <Offset by={{ x: 1.5, y: -1 }}>
        <RxSheet x={62} y={168} w={126} h={162} rot={-7} />
      </Offset>
      <Bottle cx={252} baseY={330} w={104} h={168} body="var(--plate-cream)" cap="var(--plate-coral)" label="var(--plate-coral)" />
      <Capsule cx={368} cy={262} w={50} h={128} rot={14} top="var(--plate-teal)" bottom="var(--plate-cream)" />
      <Tablet cx={430} cy={296} r={34} rot={18} />
      <Cross cx={196} cy={122} s={40} fill="var(--plate-coral)" />

      <Sprig x={24} y={392} rot={-10} s={0.8} fill="var(--plate-green)" />
      <Leaf x={430} y={402} rot={-52} s={0.7} fill="var(--plate-green)" />
      <Flower cx={462} cy={186} r={30} center="var(--plate-coral)" />
      <circle cx="46" cy="252" r="14" fill="var(--plate-lavender)" opacity="0.75" />
    </Plate>
  )
}

/** Prescription upload. An Rx sheet, a capsule and a droplet under an arch -
 *  the quietest of the section plates, because the section beside it is busy. */
export function PrescriptionPlate() {
  return (
    <Plate viewBox="0 0 420 380" className="h-full w-full">
      <Arch x={112} y={20} w={200} h={256} fill="var(--plate-teal)" opacity={0.2} />
      <Halftone cx={212} cy={184} r={106} ink="green" opacity={0.28} />
      <Cloud x={286} y={42} s={0.66} fill="var(--plate-cobalt)" />

      <Pedestal cx={212} y={288} w={210} />
      <Offset by={{ x: -1.5, y: 1 }}>
        <RxSheet x={148} y={124} w={132} h={164} rot={5} />
      </Offset>
      <Capsule cx={110} cy={228} w={44} h={106} rot={-24} top="var(--plate-coral)" bottom="var(--plate-cream)" />
      <Droplet cx={324} cy={230} s={0.72} fill="var(--plate-cobalt)" />

      <Sprig x={16} y={318} rot={-6} s={0.7} fill="var(--plate-green)" />
      <Leaf x={350} y={318} rot={-48} s={0.6} fill="var(--plate-green)" />
      <Flower cx={64} cy={128} r={26} center="var(--plate-coral)" />
    </Plate>
  )
}

/** Trust / assurance. Shield, cross, botanicals - the privacy motif. */
export function TrustPlate() {
  return (
    <Plate viewBox="0 0 400 340" className="h-full w-full">
      <circle cx="200" cy="156" r="112" fill="var(--plate-green)" opacity="0.16" />
      <Halftone cx={200} cy={156} r={92} ink="green" opacity={0.32} />
      <Arch x={46} y={52} w={92} h={152} fill="var(--plate-cobalt)" opacity={0.14} />
      <Arch x={262} y={66} w={92} h={138} fill="var(--plate-coral)" opacity={0.14} />

      <Offset by={{ x: 1, y: -1 }}>
        <Shield cx={200} cy={162} s={1.06} fill="var(--plate-cream)" />
      </Offset>
      <Cross cx={200} cy={152} s={48} fill="var(--plate-green)" />

      <Pedestal cx={200} y={244} w={196} />
      <Sprig x={22} y={286} rot={-8} s={0.66} fill="var(--plate-green)" />
      <Leaf x={330} y={288} rot={-52} s={0.58} fill="var(--plate-green)" />
      <Flower cx={334} cy={132} r={22} center="var(--plate-coral)" />
    </Plate>
  )
}

/** Final CTA. A parcel arriving, framed by two arches. */
export function DeliveryPlate() {
  return (
    <Plate viewBox="0 0 400 320" className="h-full w-full">
      <Arch x={52} y={14} w={130} h={188} fill="var(--plate-coral)" opacity={0.18} />
      <Arch x={212} y={30} w={140} h={172} fill="var(--plate-cobalt)" opacity={0.18} />
      <Halftone cx={200} cy={158} r={102} ink="coral" opacity={0.3} />
      <Cloud x={290} y={22} s={0.6} fill="var(--plate-cobalt)" />

      <Hills y={198} fill="var(--plate-cobalt)" opacity={0.85} />
      <Offset by={{ x: -1, y: 1.5 }}>
        <Parcel cx={200} baseY={170} s={0.94} />
      </Offset>

      <Sprig x={18} y={276} rot={-6} s={0.62} fill="var(--plate-green)" />
      <Leaf x={340} y={278} rot={-54} s={0.54} fill="var(--plate-green)" />
    </Plate>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Spot marks

   Small, single-object plates for the "How it works" steps. Deliberately
   sparser than the section plates: four of them sit in a row, and four busy
   compositions side by side would fight each other.
   ═══════════════════════════════════════════════════════════════════════════ */

export type SpotName = 'search' | 'prescription' | 'pharmacist' | 'delivery'

export function SpotPlate({ name }: { name: SpotName }) {
  return (
    <Plate viewBox="0 0 200 200" className="h-full w-full">
      <circle cx="100" cy="96" r="72" fill="var(--plate-cobalt)" opacity="0.14" />
      <Halftone cx={100} cy={96} r={58} ink="cobalt" opacity={0.26} />

      {name === 'search' && (
        <>
          <Tablet cx={86} cy={94} r={34} />
          <Capsule cx={128} cy={100} w={30} h={72} rot={20} top="var(--plate-coral)" bottom="var(--plate-cream)" />
        </>
      )}
      {name === 'prescription' && <RxSheet x={62} y={30} w={82} h={106} rot={-6} />}
      {name === 'pharmacist' && (
        <>
          <Shield cx={100} cy={92} s={0.72} fill="var(--plate-cream)" />
          <Cross cx={100} cy={86} s={34} fill="var(--plate-green)" />
        </>
      )}
      {name === 'delivery' && <Parcel cx={100} baseY={82} s={0.56} />}

      <Pedestal cx={100} y={150} w={116} />
      <Leaf x={6} y={176} rot={-12} s={0.38} fill="var(--plate-green)" />
      <Leaf x={170} y={178} rot={-56} s={0.34} fill="var(--plate-green)" />
    </Plate>
  )
}
