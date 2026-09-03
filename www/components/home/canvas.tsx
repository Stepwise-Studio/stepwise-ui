'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Rocket01Icon, UserGroupIcon, Settings02Icon, CreditCardIcon,
  Copy01Icon, PencilEdit02Icon, Delete02Icon,
  SparklesIcon, InformationCircleIcon, Share08Icon, Archive02Icon, ArrowRight02Icon,
} from '@hugeicons/core-free-icons'
import { Refresh, Ghost } from 'iconsax-react'
import { DotGridLoader } from '@/components/stepwise/dot-grid-loader'
import { Combobox } from '@/components/stepwise/combobox'
import { DropdownMenuList, DROPDOWN_PANEL_CLASS, type DropdownEntry } from '@/components/stepwise/dropdown-menu'
import { cn } from '@/lib/utils/cn'

import { Button } from '@/components/stepwise/button'
import { GlowButton } from '@/components/stepwise/glow-button'
import { Toggle } from '@/components/stepwise/toggle'
import { Chip } from '@/components/stepwise/chip'
import { Segment } from '@/components/stepwise/segment'
import { Slider } from '@/components/stepwise/slider'
import { AvatarGroup } from '@/components/stepwise/avatar'
import { ColorPicker } from '@/components/stepwise/color-picker'
import { OtpInput } from '@/components/stepwise/otp-input'
import { QtyInput } from '@/components/stepwise/qty-input'
import { Multiselect } from '@/components/stepwise/multiselect'
import { ConversationTimeline, type TimelineCheckpoint } from '@/components/stepwise/conversation-timeline'
import { SelectionFrame } from '@/components/stepwise/selection-frame'
import { Accordion } from '@/components/stepwise/accordion'
import { SocialButton } from '@/components/stepwise/social-button'
import { Input } from '@/components/stepwise/input'
import { Kbd } from '@/components/stepwise/kbd'
import { ShimmerText } from '@/components/stepwise/shimmer-text'
import { SquigglyUnderline } from '@/components/stepwise/squiggly-underline'
import { ScrambleText } from '@/components/stepwise/scramble-text'
import { Typewriter } from '@/components/stepwise/typewriter'
import { Folder } from '@/components/stepwise/folder'
import { Calendar } from '@/components/stepwise/calendar'
import { Surface } from '@/components/stepwise/primitives/surface'

import { LensCarousel } from '@/components/stepwise/lens-carousel'
import { ArcCarousel } from '@/components/stepwise/arc-carousel'
import { ProfileCard } from '@/components/stepwise/profile-card'
import { Toaster, toast } from '@/components/stepwise/toast'

/**
 * AI-generated background stills, grouped by what they actually look like.
 * Both carousels tile their array cyclically (card `i` renders `items[i % n]`),
 * so two visually similar stills sitting next to each other repeat as a matched
 * pair at every wrap of the loop.
 */
const BY_THEME = {
  white:  ['freebie-025', 'freebie-057', 'freebie-065'], // bright classical interiors
  dark:   ['freebie-009', 'freebie-041'],                // near-black night scenes
  blue:   ['freebie-033', 'freebie-049', 'freebie-089'], // cool misty landscapes
  warm:   ['freebie-001', 'freebie-017', 'freebie-073'], // cream stone, sunset light
  pastel: ['freebie-081', 'freebie-097'],                // pink and violet clouds
}

type Theme = keyof typeof BY_THEME

/**
 * Deal one still from each theme in turn, round-robin, until the themes run
 * out. Nothing lands next to a sibling of its own theme, wrap seam included,
 * and changing the theme order (or dealing each theme back to front) yields a
 * different scatter of the same 13 images - which is how the two carousels and
 * the folder fan avoid showing the same sequence in three places.
 */
function deal(order: Theme[], reverse = false): string[] {
  const decks = order.map(k => (reverse ? [...BY_THEME[k]].reverse() : [...BY_THEME[k]]))
  const out: string[] = []
  while (decks.some(d => d.length)) {
    for (const d of decks) {
      const file = d.shift()
      if (file) out.push(`/backgrounds/${file}.webp`)
    }
  }
  return out
}

const BG_LENS = deal(['white', 'dark', 'blue', 'warm', 'pastel'])
const BG_ARC = deal(['blue', 'pastel', 'white', 'dark', 'warm'], true)
const BG_FOLDER = deal(['dark', 'white', 'warm', 'blue', 'pastel'], true)

function RadiolessDemo() {
  const [val, setVal] = useState<string[]>(['fire'])
  return (
    <Multiselect
      defaultOpen
      placeholder="Pick your breathing style"
      options={[
        { value: 'fire', label: 'Flame' },
        { value: 'water', label: 'Water' },
        { value: 'wind', label: 'Wind' },
        { value: 'thunder', label: 'Thunder' },
      ]}
      value={val}
      onChange={setVal}
    />
  )
}

/** Remounts its child on an interval so scroll-triggered reveal effects (built
 *  to replay `onView`, not on a timer) loop for as long as the showcase is up. */
function Loop({ ms = 4200, children }: { ms?: number; children: ReactNode }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), ms)
    return () => clearInterval(id)
  }, [ms])
  return <span key={tick}>{children}</span>
}

/** A day - long enough that the showcase toasts never time out on their own. */
const HELD = 86_400_000

/**
 * Gives a portaled overlay a box of its own to live in.
 *
 * The real Toaster places itself with `position: fixed`, which normally
 * resolves against the viewport - open it on a landing page and it covers
 * the page. A `transform` makes this element the containing block for fixed
 * descendants instead, so pointing the Toaster's `container` prop here lands
 * the deck inside this box at its true size.
 */
function Stage({ h, className, children }: { h: number; className?: string; children: (el: HTMLElement) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [el, setEl] = useState<HTMLElement | null>(null)
  useEffect(() => { setEl(ref.current) }, [])
  return (
    <div ref={ref} className={`relative w-full [transform:translateZ(0)] ${className ?? ''}`} style={{ height: h }}>
      {el && children(el)}
    </div>
  )
}

/** Plays a component's own hover animation once, when it scrolls into view,
 *  then lets it go - for showcase tiles nobody will actually hover over.
 *  Focuses a descendant (rather than dispatching a synthetic mouseover)
 *  because these components expand on focus too, and a real DOM focus
 *  reliably bubbles a `focusin` React can hear - a dispatched mouseover
 *  does not reach React's delegated listener the same way. */
function HoverOnView({ selector, holdMs = 1800, children }: { selector: string; holdMs?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    let played = false
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || played) return
      const target = root.querySelector<HTMLElement>(selector)
      if (!target) return
      played = true
      // These components expand on real pointer hover, but also expand on
      // focus for keyboard users - focusing a descendant bubbles a
      // `focusin` up to the container's onFocus and triggers the same
      // expand animation. Blur reverts it. `preventScroll` is required:
      // without it the browser's default "scroll the focused element into
      // view" kicks in on every trigger, which is what was hijacking the
      // page's scroll position on load and again near the bottom.
      target.focus({ preventScroll: true })
      setTimeout(() => target.blur(), holdMs)
    }, { threshold: 0.6 })
    io.observe(root)
    return () => io.disconnect()
  }, [selector, holdMs])
  return <div ref={ref} className="w-full">{children}</div>
}

/** The real stacked deck - peek-behind cards, hover to fan out, exactly as
 *  it behaves in the docs - just held open with `duration: HELD` so it
 *  doesn't clear itself while the page sits idle. */
function ToastDeck({ container }: { container: HTMLElement }) {
  useEffect(() => {
    // Oldest-to-newest tells a small story, since the newest call ends up
    // frontmost/most-visible in the deck: a warning, then a break, then a
    // fix, then the resolution - so the deck's most prominent card is
    // always the good news, not a dangling failure.
    const ids = [
      toast.warning('Cursed energy at 80%', { duration: HELD }),
      toast.error('The wall has been breached', { description: 'Check the scout report for details', duration: HELD }),
      toast.info('3 quirks got a buff', { duration: HELD }),
      toast.success('Guild rank up: S-Class approved', { description: 'stepwise-ui@1.4.0 · sealed in 12s', duration: HELD }),
    ]
    return () => { ids.forEach(id => toast.dismiss(id)) }
  }, [])
  return <Toaster container={container} />
}

/**
 * Static look-alikes of the command palette and the delete-confirm modal.
 *
 * The real components own a viewport-covering `fixed` backdrop - correct in
 * a real app, but boxed into a showcase tile it reads as an unwanted parent
 * frame around the component. These copy the exact panel visuals with no
 * portal, no backdrop, and no interaction wiring, so they sit directly in
 * the page flow instead.
 */
function CommandPaletteLook() {
  const rows = [
    { id: 'deploy', label: 'Unlock domain expansion', shortcut: ['⌘', 'D'], icon: <HugeiconsIcon icon={Rocket01Icon} size={16} /> },
    { id: 'invite', label: 'Recruit new demon slayers', shortcut: ['⌘', 'I'], icon: <HugeiconsIcon icon={UserGroupIcon} size={16} /> },
  ]
  const goto = [
    { id: 'billing', label: 'Guild treasury', icon: <HugeiconsIcon icon={CreditCardIcon} size={16} /> },
    { id: 'settings', label: 'Quirk settings', icon: <HugeiconsIcon icon={Settings02Icon} size={16} /> },
  ]
  return (
    // `w-full max-w-*` goes on this plain wrapper, not the Surface itself -
    // SmoothCorners measures its own content's natural width to build the
    // clip-path, and normal-flow content (this palette's rows, unlike the
    // absolutely-positioned buttons other Surfaces here wrap) has a real
    // shrink-to-fit width. Putting `w-full` on the Surface directly asks it
    // to be 100% of a box it is itself in the middle of sizing - it settles
    // on that shrink-to-fit width instead of stretching to the real parent.
    <div className="w-full max-w-[560px]">
      <Surface
        radius={20}
        lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' } }}
        className="overflow-hidden bg-white shadow-[0_20px_60px_-12px_rgba(0,0,0,0.28)] dark:bg-zinc-900 dark:shadow-[0_24px_70px_-12px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center gap-3 border-b border-zinc-100 px-4 dark:border-zinc-800">
          <svg aria-hidden width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="shrink-0 text-zinc-400">
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 3 3" />
          </svg>
          <span className="w-full py-4 text-[15px] tracking-[-0.02em] text-zinc-400 dark:text-zinc-500">Type a command or search…</span>
          <Kbd className="shrink-0">Esc</Kbd>
        </div>
        <div className="p-1.5">
          <div className="px-2.5 pb-1.5 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">Actions</div>
          {rows.map((item, idx) => (
            <div
              key={item.id}
              className={`flex w-full items-center gap-3 rounded-[11px] px-2.5 py-2.5 ${idx === 0 ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
            >
              <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center ${idx === 0 ? 'text-zinc-700 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500'}`}>{item.icon}</span>
              <span className="flex-1 truncate text-[13.5px] font-medium tracking-[-0.01em] text-zinc-700 dark:text-zinc-200">{item.label}</span>
              <Kbd keys={item.shortcut} />
            </div>
          ))}
          <div className="px-2.5 pb-1.5 pt-3 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">Go to</div>
          {goto.map(item => (
            <div key={item.id} className="flex w-full items-center gap-3 rounded-[11px] px-2.5 py-2.5">
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-zinc-400 dark:text-zinc-500">{item.icon}</span>
              <span className="flex-1 truncate text-[13.5px] font-medium tracking-[-0.01em] text-zinc-700 dark:text-zinc-200">{item.label}</span>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  )
}

/** Static look-alike of the default Modal, in its "center" and "left" align
 *  variants, either destructive or not. */
function ModalLook({
  align = 'center', destructive = false, title, description, confirmLabel = 'Confirm',
}: { align?: 'center' | 'left'; destructive?: boolean; title: string; description: string; confirmLabel?: string }) {
  const left = align === 'left'
  return (
    // See CommandPaletteLook for why `w-full max-w-*` lives on this wrapper
    // instead of the Surface - same SmoothCorners shrink-to-fit measurement.
    <div className="relative w-full max-w-[400px]">
      <Surface
        radius={26}
        smoothing={0.6}
        lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' } }}
        className="overflow-hidden bg-white shadow-[0_0_48px_-8px_rgba(0,0,0,0.24)] dark:bg-zinc-900 dark:shadow-[0_0_48px_-8px_rgba(0,0,0,0.6)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: destructive ? 'radial-gradient(closest-side, rgba(244,63,94,0.14), transparent)' : 'radial-gradient(closest-side, rgba(14,165,233,0.12), transparent)' }}
        />
        <div className="relative flex flex-col px-6 pb-6 pt-7">
          <div className={cn('flex items-center gap-3', left ? 'justify-start' : 'justify-center')}>
            <Surface radius={14} className={cn('flex h-10 w-10 shrink-0 items-center justify-center bg-gradient-to-b', destructive ? 'from-rose-50 to-rose-100/80 dark:from-rose-950/50 dark:to-rose-900/30' : 'from-sky-50 to-sky-100/80 dark:from-sky-950/50 dark:to-sky-900/30')}>
              <HugeiconsIcon icon={InformationCircleIcon} size={18} className={destructive ? 'text-rose-500' : 'text-sky-500'} />
            </Surface>
            <h2 className={cn('text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 [text-wrap:balance] dark:text-zinc-50', left && 'text-left')}>{title}</h2>
          </div>
          <p className={cn('mt-3 text-[14px] leading-relaxed text-zinc-500 text-pretty dark:text-zinc-400', left ? 'text-left' : 'text-center')}>
            {description}
          </p>
          <div className={cn('mt-7 flex w-full gap-2.5', left && 'justify-end')}>
            {left ? (
              <>
                <Button variant="soft">Cancel</Button>
                <Button variant={destructive ? 'destructive' : 'solid'}>{confirmLabel}</Button>
              </>
            ) : (
              <>
                <div className="min-w-0 flex-auto"><Button variant="soft" fullWidth>Cancel</Button></div>
                <div className="min-w-0 flex-auto"><Button variant={destructive ? 'destructive' : 'solid'} fullWidth>{confirmLabel}</Button></div>
              </>
            )}
          </div>
        </div>
      </Surface>
    </div>
  )
}

/** Static look-alike of an always-open DropdownMenu - the real component
 *  closes on any outside click, which would fight a showcase that wants it
 *  permanently open. Reuses the real item-row renderer, no state or listeners. */
function DropdownMenuLook({ trigger, items, rootId }: { trigger: string; items: DropdownEntry[]; rootId: string }) {
  const dummyRef = useRef<HTMLDivElement>(null)
  return (
    <div className="inline-flex flex-col items-start gap-2">
      <Button size="sm" variant="outline">{trigger}</Button>
      <Surface radius={20} lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' } }} className={DROPDOWN_PANEL_CLASS}>
        <DropdownMenuList menuRef={dummyRef} menuRootId={rootId} onRequestCloseAll={() => {}} items={items} />
      </Surface>
    </div>
  )
}
/* ── layout primitives ────────────────────────────────────────────────────
 *
 * Every band below is a row of fixed-width COLUMNS, and each column is a
 * tight vertical stack.
 *
 * This is deliberate, and it is the fix for the dead space that kept coming
 * back. Laying the components out as one big `flex-wrap` of items sizes
 * every wrapped row to its TALLEST member - so a 400px Calendar sitting
 * beside a 26px Toggle strands ~370px of empty space under that toggle, and
 * flex has no way to backfill it (that is masonry behaviour, which flexbox
 * does not do). Stacking inside a column removes the problem by
 * construction: an item's neighbour is always directly below it, exactly one
 * gap away. Column widths are chosen to fit their widest member, and members
 * are distributed so every column bottoms out at roughly the same height.
 */
function Col({ w, gap = 32, children }: { w: number; gap?: number; children: ReactNode }) {
  return (
    // `width` is the desktop composition's fixed track, but several of these are
    // wider than a phone (560 for the command palette, 480 for the toast deck),
    // and `shrink-0` meant they pushed the page wider than the viewport rather
    // than fitting inside it. maxWidth caps them at the screen; on anything
    // roomier than the widest column it never applies.
    <div className="flex shrink-0 flex-col items-center" style={{ width: w, maxWidth: '100%', gap }}>
      {children}
    </div>
  )
}

/**
 * Reserves the room an open, absolutely-positioned panel actually occupies.
 * Combobox / Multiselect / ColorPicker render their open panel with
 * `position: absolute`, so it contributes zero height to the column - without
 * this the next item down would be painted underneath it.
 */
function Slot({ h, children }: { h: number; children: ReactNode }) {
  return <div className="w-full" style={{ minHeight: h }}>{children}</div>
}

function OtpCard() {
  return (
    <div className="flex w-full flex-col items-center gap-3 text-center">
      <div>
        <p className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100">Enter your passcode</p>
        <p className="mt-1 text-[13px] text-zinc-400 dark:text-zinc-500">We sent 6 digits to you@blackbulls.dev</p>
      </div>
      <OtpInput defaultValue="238" onResend={() => {}} />
    </div>
  )
}

const TIMELINE: TimelineCheckpoint[] = [
  { id: '1', role: 'system', label: 'System prompt: grimoire loaded' },
  { id: '2', role: 'user', label: 'Can you help me unlock my quirk?' },
  { id: '3', role: 'assistant', label: 'Of course - let’s awaken it together' },
  { id: '4', role: 'user', label: 'What if my cursed energy runs low?' },
  { id: '5', role: 'assistant', label: 'Great question. The key is your breathing technique' },
  { id: '6', role: 'user', label: 'I see, but what if the walls come down?' },
]

/**
 * Controls, inputs and text effects - five columns, Calendar anchoring the
 * left edge as it does in the Figma arrangement.
 *
 * Members are distributed so every column ends within ~140px of the others.
 * That balance is the point: a column that finishes 300px early leaves
 * exactly that much dead space beside its neighbours.
 */
function ControlsBand() {
  return (
    <div className="mx-auto flex w-full max-w-[840px] flex-wrap items-start justify-center gap-x-4 gap-y-14 min-[1390px]:max-w-none 2xl:gap-x-10">
      {/* 350 - wide enough for the Calendar AND the 6-box OTP row (304px). */}
      <Col w={350}>
        <Calendar defaultSelected={new Date(2006, 6, 26)} />
        <OtpCard />
        <div className="flex flex-col gap-2"><SocialButton provider="google" /><SocialButton provider="github" /></div>
      </Col>

      <Col w={220}>
        <DropdownMenuLook
          trigger="Guild"
          rootId="showcase-workspace"
          items={[
            { heading: 'Guild' },
            { label: 'Copy grimoire', shortcut: '⌘D', icon: <HugeiconsIcon icon={Copy01Icon} size={16} /> },
            { label: 'Rename squad', shortcut: '⌘R', icon: <HugeiconsIcon icon={PencilEdit02Icon} size={16} /> },
            { label: 'Share rank card', shortcut: '⌘S', icon: <HugeiconsIcon icon={Share08Icon} size={16} /> },
            { label: 'Seal away', icon: <HugeiconsIcon icon={Archive02Icon} size={16} /> },
            { separator: true },
            { label: 'Disband', destructive: true, icon: <HugeiconsIcon icon={Delete02Icon} size={16} /> },
          ]}
        />
        <Slot h={220}>
          <Combobox
            defaultOpen
            defaultQuery="a"
            placeholder="Search characters…"
            options={[
              { value: 'a', label: 'Asta' },
              { value: 'b', label: 'Katsuki Bakugo' },
              { value: 'c', label: 'Tanjiro Kamado' },
              { value: 'd', label: 'Nezuko Kamado' },
            ]}
          />
        </Slot>
        <DotGridLoader />
        <Button slideIcon iconPosition="right" icon={<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} color="currentColor" />}>
          Get started
        </Button>
      </Col>

      <Col w={225}>
        <DropdownMenuLook
          trigger="Formation"
          rootId="showcase-view"
          items={[
            { heading: 'Formation' },
            { label: 'Sort by rank' },
            { label: 'Sort by enlistment date' },
            { separator: true },
            { label: 'Compact' },
            { label: 'Comfortable' },
            { separator: true },
            { label: 'Reset formation' },
          ]}
        />
        <GlowButton size="lg">Enlist in the Scouts</GlowButton>
        <Button variant="soft" slideIcon iconPosition="right" icon={<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} color="currentColor" />}>
          Beyond the walls
        </Button>
        <Toggle defaultChecked ariaLabel="Demo toggle" />
        <Loop><ScrambleText className="text-[20px] font-semibold text-zinc-800 dark:text-zinc-100">Stepwise UI</ScrambleText></Loop>
        <Typewriter
          words={['Full Counter, activated.', 'Plus Ultra, shipped.']}
          className="text-[17px] font-medium text-zinc-700 dark:text-zinc-300"
          caretClassName="text-sky-500 dark:text-sky-400"
        />
      </Col>

      {/* Swapped with the Color Picker: the chips / shimmer / scramble /
          slide-icon cluster now lives here. */}
      <Col w={225}>
        <ChipDotShowcase />
        <Input variant="email" label="Email" placeholder="you@blackbulls.dev" className="w-[210px]" />
        <ChipIconShowcase />
        <Slider defaultValue={64} label="Volume" className="w-[200px]" />
        <QtyInput defaultValue={18} min={0} max={99} />
        <AvatarGroup max={4} avatars={[{ name: 'Izuku Midoriya' }, { name: 'Tanjiro Kamado' }, { name: 'Eren Yeager' }, { name: 'Yuji Itadori' }, { name: 'Noelle Silva' }]} />
        <Segment size="sm" defaultValue="grid" options={[{ value: 'list', label: 'Roster' }, { value: 'grid', label: 'Formation' }, { value: 'row', label: 'Line' }]} />
        <ShimmerText className="text-[20px] font-semibold">Mist Breathing…</ShimmerText>
        <Loop><SquigglyUnderline className="text-sky-500 dark:text-sky-400"><span className="text-[20px] font-semibold text-zinc-800 dark:text-zinc-100">plus ultra</span></SquigglyUnderline></Loop>
      </Col>

      {/* 250 - the Color Picker's open panel is 248px wide. */}
      <Col w={250}>
        <Slot h={220}>
          <RadiolessDemo />
        </Slot>
        <Slot h={452}>
          {/* ColorPicker's root is `inline-block`, so on its own it sits at the
              slot's left edge while its open panel centres on the 56px trigger
              - putting 96px of that 248px panel outside this column, on top of
              the neighbour. Centring the trigger centres the panel with it. */}
          <div className="flex justify-center">
            <ColorPicker value="#8b5cf6" showPresets defaultOpen />
          </div>
        </Slot>
      </Col>
    </div>
  )
}

/** Row A - palette on the left, the hook line and the folder grouped together
 *  in the middle, profile card on the right. `items-center` keeps the three
 *  balanced against each other rather than top-ragged. */
function OverlaysRowA() {
  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-wrap items-center justify-center gap-x-4 gap-y-14 min-[1428px]:max-w-none 2xl:gap-x-10">
      <Col w={560} gap={40}>
        <CommandPaletteLook />
      </Col>

      {/* 420, not the folder's own 260 - the fan opens to roughly ±185px and
          the paging chevrons sit a little past that again, so the column has
          to reserve that width itself or the hover fan and chevrons overlap
          the command palette / profile card next door. */}
      <Col w={420} gap={40}>
        <Folder
          label="Forbidden grimoires"
          count="13 files"
          color="#2563eb"
          icon={SparklesIcon}
          files={BG_FOLDER.map(src => ({ thumb: src }))}
        />
      </Col>

      <Col w={360} gap={40}>
        <ProfileCard
          variant="default"
          bannerSrc="/banners/cloud-tunnel.webp"
          avatarSrc="/avatars/avatar5.svg"
          avatarImagePosition="top"
          avatarImageScale={0.88}
          name="Snoofy Ackerman"
          verified
          role="Scouting Legion, Marketing Division"
          bio="A digital assistant that drafts your posts, schedules them everywhere, and tracks how they land beyond the walls."
          stats={[
            { label: 'Missions Cleared', value: '5' },
            { label: 'Scrolls Drafted', value: '100' },
            { label: 'Active Quests', value: '20' },
          ]}
        />
      </Col>
    </div>
  )
}

/** Row B - the dialogs the palette displaced, plus the toast deck and the
 *  conversation rail. */
function OverlaysRowB() {
  return (
    <div className="mx-auto flex w-full max-w-[800px] flex-wrap items-center justify-center gap-x-4 gap-y-14 min-[1208px]:max-w-none 2xl:gap-x-10">
      <Col w={390} gap={40}>
        <ModalLook
          destructive
          title="Abandon your guild?"
          description="This erases every grimoire and mission log for good - no rewind, no second chances, no last-minute power-up."
          confirmLabel="Abandon guild"
        />
      </Col>

      <Col w={480} gap={40}>
        <HoverOnView selector="[role='status']">
          <Stage h={220} className="relative z-30 [&_button[aria-label='Dismiss']]:hidden">
            {el => <ToastDeck container={el} />}
          </Stage>
        </HoverOnView>
      </Col>

      <Col w={250} gap={40}>
        <HoverOnView selector="button">
          <ConversationTimeline checkpoints={TIMELINE} activeId="3" labelWidth={170} />
        </HoverOnView>
      </Col>
    </div>
  )
}

/** The exact "2 letters, alternating accent" AvatarGroup from the docs page
 *  (AvatarGroupPreview) - default neutral fill, 2-letter initials, every
 *  other avatar's text tinted sky instead of a custom background. */
function AccentAvatarCluster() {
  const team = [
    { name: 'Asta' },
    { name: 'Noelle Silva' },
    { name: 'Yami Sukehiro' },
    { name: 'Magna Swing' },
    { name: 'Luck Voltia' },
  ].map((t, i) => ({
    ...t,
    letters: 2 as const,
    textClassName: i % 2 ? 'text-sky-600 dark:text-sky-400' : undefined,
  }))
  return <AvatarGroup avatars={team} max={5} />
}

/** A status feed for the `dot` chip variant. */
function ChipDotShowcase() {
  return (
    <div className="flex flex-col gap-2.5 whitespace-nowrap text-[13px]">
      <div className="flex items-center justify-between gap-5">
        <span className="text-zinc-500 dark:text-zinc-400">Guild morale</span>
        <Chip dot color="success" variant="soft">Sky high</Chip>
      </div>
      <div className="flex items-center justify-between gap-5">
        <span className="text-zinc-500 dark:text-zinc-400">Stamina</span>
        <Chip dot color="warning" variant="soft">Running low</Chip>
      </div>
    </div>
  )
}

/** A verdict row for the `soft` + icon chip variant. */
function ChipIconShowcase() {
  return (
    <div className="flex flex-col gap-2.5 whitespace-nowrap text-[13px]">
      <div className="flex items-center justify-between gap-5">
        <span className="text-zinc-500 dark:text-zinc-400">Rank exam</span>
        <Chip icon={<Refresh variant="TwoTone" size={14} color="#0284c7" className="[&_path]:stroke-2" />} color="info" variant="soft">In progress</Chip>
      </div>
      <div className="flex items-center justify-between gap-5">
        <span className="text-zinc-500 dark:text-zinc-400">That titan</span>
        <Chip icon={<Ghost variant="TwoTone" size={14} color="#4f46e5" className="[&_path]:stroke-2" />} color="magical" variant="soft">Still out there</Chip>
      </div>
    </div>
  )
}

const FAQ_ITEMS = [
  { id: 'a', title: 'What is Stepwise?', content: 'A squircle-first grimoire of components.' },
  { id: 'b', title: 'Do I need a guild license?', content: 'Nope. Copy, paste, unleash.' },
  { id: 'c', title: 'Got a dark mode arc?', content: 'Always on. Toggle above.' },
]


export function HomeCanvas() {
  return (
    <section className="flex w-full flex-col items-center gap-12 px-4 py-12 md:px-6">
      <div className="w-full">
        <LensCarousel items={BG_LENS.map(src => ({ src, alt: '' }))} itemWidth={116} />
      </div>

      <ControlsBand />

      {/* One full-width line - wide enough that "Draw attention to what
          matters" never wraps. Left-aligned and inset to start under the
          "Get started" button (ControlsBand's 2nd column, right after the
          350px Calendar column + its gap) instead of sitting dead-center.
          The avatar cluster sits in that same left slot; the text is pushed
          right by the flex row's own gap to make room for it. The negative
          bottom margin trims the gap down to the Command Palette row below
          it without touching the section's shared gap. */}
      <div className="-mb-8 flex w-full justify-center">
        {/* The 366px inset lines this up under the "Get started" button on
            desktop. On a phone there is no such column to line up with, and
            nowrap made the line itself wider than the screen - so below lg it
            centres and wraps like ordinary text. */}
        <div className="flex w-full max-w-[1334px] flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-6 lg:pl-[366px] 2xl:max-w-[1430px] 2xl:pl-[390px]">
          <AccentAvatarCluster />
          <span className="text-center text-[22px] font-semibold leading-tight tracking-tight text-balance text-zinc-900 sm:text-[28px] lg:whitespace-nowrap lg:text-left dark:text-white">
            Zoom in on the{' '}
            <SelectionFrame animated line="dashed" padding={4} handles="circle">main character</SelectionFrame>
            {' '}moment
          </span>
        </div>
      </div>

      <OverlaysRowA />
      <OverlaysRowB />

      <div className="w-full">
        <ArcCarousel items={BG_ARC.map(src => ({ src, alt: '' }))} itemWidth={120} />
      </div>

      {/* The arc bows upward, so its box already carries a band of empty space
          along the bottom. Pulling the accordion up reclaims that instead of
          stacking the section gap on top of it - without overlapping the
          cards, which sit well above this line. */}
      <div className="-mt-7 w-full max-w-md">
        <Accordion items={FAQ_ITEMS} />
      </div>
    </section>
  )
}
