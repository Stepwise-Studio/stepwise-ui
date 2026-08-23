'use client'

import { Button } from '@/components/stepwise/button'
import { SocialButton } from '@/components/stepwise/social-button'
// iconsax-react is kept only for the library-comparison pairs further down.
import { Add, Sms, Setting2, ImportSquare } from 'iconsax-react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Settings02Icon, Mail01Icon, PlusSignIcon, Download04Icon,
  PencilEdit02Icon, Search01Icon, Delete02Icon, ArrowRight02Icon, ArrowLeft02Icon, StarIcon,
} from '@hugeicons/core-free-icons'

// ─── Variants ────────────────────────────────────────────────────────────────
export function ButtonVariantsPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button variant="solid">solid</Button>
      <Button variant="outline">outline</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="soft">soft</Button>
      <Button variant="destructive">destructive</Button>
    </div>
  )
}

// ─── With icons ───────────────────────────────────────────────────────────────
export function ButtonIconsPreview() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button icon={<HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} color="currentColor" />} iconPosition="left">
          New item
        </Button>
        <Button variant="outline" icon={<HugeiconsIcon icon={PencilEdit02Icon} size={16} strokeWidth={2} color="currentColor" />} iconPosition="left">
          Edit
        </Button>
        <Button variant="soft" icon={<HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={2} color="currentColor" />} iconPosition="left">
          Search
        </Button>
        <Button variant="destructive" icon={<HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} color="currentColor" />} iconPosition="left">
          Delete
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button variant="outline" icon={<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} color="currentColor" />} iconPosition="right">
          Continue
        </Button>
        <Button variant="ghost" icon={<HugeiconsIcon icon={StarIcon} size={16} strokeWidth={2} color="currentColor" />} iconPosition="right">
          Favorite
        </Button>
      </div>
    </div>
  )
}

// ─── Slide icon ───────────────────────────────────────────────────────────────
export function ButtonSlidePreview() {
  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-[12px] text-zinc-400 dark:text-zinc-500">hover to reveal icon</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          slideIcon
          iconPosition="right"
          icon={<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} color="currentColor" />}
        >
          Get started
        </Button>
        <Button
          variant="outline"
          slideIcon
          iconPosition="right"
          icon={<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} color="currentColor" />}
        >
          Learn more
        </Button>
        <Button
          variant="soft"
          slideIcon
          iconPosition="left"
          icon={<HugeiconsIcon icon={ArrowLeft02Icon} size={16} strokeWidth={2} color="currentColor" />}
        >
          Back
        </Button>
      </div>
    </div>
  )
}

// ─── Icon only ───────────────────────────────────────────────────────────────
// Same concept pairs so the visual difference between libraries is immediately obvious.
// Plus ↔ Plus · Mail ↔ Mail · Settings ↔ Settings
export function ButtonIconOnlyPreview() {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* iconsax-react — all outline so the icon style difference is the only variable */}
      <div className="flex flex-col items-center gap-2.5">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 tracking-[0.02em]">iconsax-react</span>
        <div className="flex items-center gap-2">
          <Button iconOnly variant="outline" icon={<Add           size={16} variant="Linear" color="currentColor" />} aria-label="Add" />
          <Button iconOnly variant="outline" icon={<Sms           size={16} variant="Linear" color="currentColor" />} aria-label="Message" />
          <Button iconOnly variant="outline" icon={<Setting2      size={16} variant="Linear" color="currentColor" />} aria-label="Settings" />
          <Button iconOnly variant="outline" icon={<ImportSquare  size={16} variant="Linear" color="currentColor" />} aria-label="Download" />
        </div>
      </div>

      {/* @hugeicons/react — same concepts, same variant */}
      <div className="flex flex-col items-center gap-2.5">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 tracking-[0.02em]">@hugeicons/react</span>
        <div className="flex items-center gap-2">
          <Button iconOnly variant="outline" aria-label="Add"
            icon={<HugeiconsIcon icon={PlusSignIcon}   size={16} strokeWidth={2} color="currentColor" />}
          />
          <Button iconOnly variant="outline" aria-label="Message"
            icon={<HugeiconsIcon icon={Mail01Icon}     size={16} strokeWidth={2} color="currentColor" />}
          />
          <Button iconOnly variant="outline" aria-label="Settings"
            icon={<HugeiconsIcon icon={Settings02Icon} size={16} strokeWidth={2} color="currentColor" />}
          />
          <Button iconOnly variant="outline" aria-label="Download"
            icon={<HugeiconsIcon icon={Download04Icon} size={16} strokeWidth={2} color="currentColor" />}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Full width ───────────────────────────────────────────────────────────────
export function ButtonFullWidthPreview() {
  return (
    <div className="flex items-center justify-center py-2">
      {/* Phone frame */}
      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-[44px] p-[6px] shadow-xl border border-zinc-200 dark:border-zinc-700" style={{ width: 360 }}>
        <div className="bg-white dark:bg-zinc-950 rounded-[38px] overflow-hidden flex flex-col" style={{ height: 260 }}>
          {/* Buttons — flex-1 + justify-center = true vertical center */}
          <div className="flex-1 flex flex-col justify-center px-5 gap-3">
            <Button fullWidth variant="solid">
              Create account
            </Button>
            <Button fullWidth variant="outline" icon={<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} color="currentColor" />} iconPosition="right">
              Continue
            </Button>
            <Button fullWidth variant="ghost">
              Sign in instead
            </Button>
          </div>
          {/* Home indicator */}
          <div className="h-6 flex items-center justify-center shrink-0">
            <div className="w-24 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Disabled ─────────────────────────────────────────────────────────────────
export function ButtonDisabledPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button disabled variant="solid">solid</Button>
      <Button disabled variant="outline">outline</Button>
      <Button disabled variant="ghost">ghost</Button>
      <Button disabled variant="soft">soft</Button>
      <Button disabled variant="destructive">destructive</Button>
      <Button disabled iconOnly icon={<HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} color="currentColor" />} aria-label="Add" />
    </div>
  )
}

// ─── Loading ──────────────────────────────────────────────────────────────────
export function ButtonLoadingPreview() {
  return (
    <div className="flex flex-col gap-3">
      {/* with an icon, the spinner takes the icon's slot so the label never moves */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button loading variant="solid" icon={<HugeiconsIcon icon={Download04Icon} size={16} strokeWidth={2} color="currentColor" />}>
          Saving
        </Button>
        <Button loading variant="outline" icon={<HugeiconsIcon icon={Mail01Icon} size={16} strokeWidth={2} color="currentColor" />}>
          Sending
        </Button>
        <Button loading variant="destructive" icon={<HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} color="currentColor" />}>
          Deleting
        </Button>
      </div>
      {/* without one, the spinner centres over a faded label — width stays put */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button loading variant="solid">Submit</Button>
        <Button loading variant="soft">Refresh</Button>
        <Button loading iconOnly icon={<HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={2} color="currentColor" />} aria-label="Adding" />
      </div>
    </div>
  )
}

// ─── Social login ─────────────────────────────────────────────────────────────
export function ButtonSocialPreview() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-3">
      <SocialButton provider="google" />
      <SocialButton provider="github" label="Sign in with GitHub" />
      <SocialButton provider="apple"  label="Sign up with Apple" />
    </div>
  )
}

// ─── Custom fill ──────────────────────────────────────────────────────────────
export function ButtonCustomFillPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Button className="bg-sky-500 text-white">flat sky</Button>
      <Button className="from-sky-400 to-sky-700 text-white">sky gradient</Button>
      <Button variant="outline" className="text-sky-700 dark:text-sky-300">
        text only
      </Button>
      <Button className="bg-sky-400 border border-sky-200 text-white">custom border</Button>
    </div>
  )
}

// ─── Sizes ───────────────────────────────────────────────────────────────────
export function ButtonSizesPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">small</Button>
      <Button size="default">default</Button>
      <Button size="lg">large</Button>
    </div>
  )
}
