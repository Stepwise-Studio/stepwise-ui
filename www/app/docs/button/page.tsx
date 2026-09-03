import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  ButtonVariantsPreview,
  ButtonIconsPreview,
  ButtonSlidePreview,
  ButtonIconOnlyPreview,
  ButtonFullWidthPreview,
  ButtonSocialPreview,
  ButtonSizesPreview,
  ButtonDisabledPreview,
  ButtonLoadingPreview,
  ButtonCustomFillPreview,
} from '@/components/stepwise/docs/button-preview'

// ─── code snippets ────────────────────────────────────────────────────────────
const variantsCode = `import { Button } from '@/components/stepwise/button'

<Button variant="solid">solid</Button>
<Button variant="outline">outline</Button>
<Button variant="ghost">ghost</Button>
<Button variant="soft">soft</Button>
<Button variant="destructive">destructive</Button>`

const iconsCode = `import { Add, ArrowRight, Trash } from 'iconsax-react'

// icon on the left (default)
<Button icon={<Add size={16} variant="Linear" color="currentColor" />}>
  New item
</Button>

// icon on the right
<Button
  variant="outline"
  icon={<ArrowRight size={16} variant="Linear" color="currentColor" />}
  iconPosition="right"
>
  Continue
</Button>

// destructive with icon
<Button
  variant="destructive"
  icon={<Trash size={16} variant="Linear" color="currentColor" />}
>
  Delete
</Button>`

const slideCode = `import { ArrowRight } from 'iconsax-react'

// icon hides on desktop until hover - always visible on touch
<Button
  icon={<ArrowRight size={16} variant="Linear" color="currentColor" />}
  iconPosition="right"
  slideIcon
>
  Get started
</Button>`

const iconOnlyCode = `import { Add } from 'iconsax-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'

// iconsax-react - always add aria-label
<Button
  iconOnly
  icon={<Add size={16} variant="Linear" color="currentColor" />}
  aria-label="Add"
/>

// @hugeicons/react - same slot, different import
<Button
  iconOnly
  icon={<HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.5} color="currentColor" />}
  aria-label="Add"
/>`

const fullWidthCode = `// stretches to 100% of the parent container
<Button fullWidth variant="solid">
  Create account
</Button>

<Button
  fullWidth
  variant="outline"
  icon={<ArrowRight size={16} variant="Linear" color="currentColor" />}
  iconPosition="right"
>
  Continue
</Button>

<Button fullWidth variant="ghost">
  Sign in instead
</Button>`

const disabledCode = `// disabled prop applies 45% opacity and blocks all interaction
<Button disabled variant="solid">solid</Button>
<Button disabled variant="outline">outline</Button>
<Button disabled variant="ghost">ghost</Button>
<Button disabled variant="soft">soft</Button>
<Button disabled variant="destructive">destructive</Button>

// works on icon-only too
<Button disabled iconOnly icon={<Add size={16} variant="Linear" color="currentColor" />} aria-label="Add" />`

const loadingCode = `// with an icon - the spinner takes the icon's slot, label never moves
<Button loading icon={<ImportSquare />}>Saving</Button>

// without one - the spinner centres over a faded label, width stays put
<Button loading>Submit</Button>
<Button loading iconOnly icon={<Add />} aria-label="Adding" />`

const socialCode = `import { SocialButton } from '@/components/stepwise/social-button'

<SocialButton provider="google" />
<SocialButton provider="github" label="Sign in with GitHub" />
<SocialButton provider="apple"  label="Sign up with Apple" />`

const customFillCode = `// one colour → both gradient stops (flat fill)
<Button className="bg-sky-500 text-white">flat sky</Button>

// two stops → keep the top→bottom fade
<Button className="from-sky-400 to-sky-700 text-white">sky gradient</Button>

// no fill class → only the text token is replaced
<Button variant="outline" className="text-sky-700">text only</Button>`

const sizesCode = `<Button size="sm">small</Button>
<Button size="default">default</Button>
<Button size="lg">large</Button>`

// ─── TOC ──────────────────────────────────────────────────────────────────────
const tocItems = [
  { id: 'variants',   label: 'Variants',     child: false },
  { id: 'icons',      label: 'With icons',   child: false },
  { id: 'slide',      label: 'Slide icon',   child: false },
  { id: 'icon-only',  label: 'Icon only',    child: false },
  { id: 'full-width', label: 'Full width',   child: false },
  { id: 'social',     label: 'Social login', child: false },
  { id: 'disabled',   label: 'Disabled',     child: false },
  { id: 'loading',    label: 'Loading',      child: false },
  { id: 'custom-fill', label: 'Custom fill', child: false },
  { id: 'sizes',      label: 'Sizes',        child: false },
  { id: 'props',      label: 'Props',        child: false },
]

export default async function ButtonPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Button</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Squircle button in three sizes and five variants. Supports left and right icons,
            a slide-in hover animation for right-side icons, icon-only mode, full-width layout,
            social login presets, and a loading state. Works with both{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">iconsax-react</code>{' '}and{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">@hugeicons/react</code>.
          </Text>
        </div>

        {/* Installation */}
        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add button" />
        </section>

        {/* Variants */}
        <section id="variants" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Variants</Text>
          <PreviewCode
            minHeight={160}
            preview={<ButtonVariantsPreview />}
            code={<CodeBlock code={variantsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* With icons */}
        <section id="icons" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">With icons</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Pass any icon element to <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">icon</code> and
            control placement with <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">iconPosition</code>.
          </Text>
          <PreviewCode
            minHeight={200}
            preview={<ButtonIconsPreview />}
            code={<CodeBlock code={iconsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* Slide icon */}
        <section id="slide" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Slide icon</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">slideIcon</code>{' '}
            hides the icon on desktop until hover, sliding in from whichever side{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">iconPosition</code>{' '}
            names. On touch (
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">pointer: coarse</code>
            ) the icon is always visible.
          </Text>
          <PreviewCode
            minHeight={200}
            preview={<ButtonSlidePreview />}
            code={<CodeBlock code={slideCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* Icon only */}
        <section id="icon-only" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Icon only</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">iconOnly</code> renders
            a square button (width = height). Always add{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">aria-label</code>.
            The same four concepts (add, mail, settings, download) are shown side-by-side from
            both libraries so you can compare the icon styles at a glance.
          </Text>
          <PreviewCode
            minHeight={260}
            preview={<ButtonIconOnlyPreview />}
            code={<CodeBlock code={iconOnlyCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* Full width */}
        <section id="full-width" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Full width</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">fullWidth</code> stretches
            the button to 100% of its parent container. Useful for forms, cards, and mobile layouts.
          </Text>
          <PreviewCode
            minHeight={340}
            preview={<ButtonFullWidthPreview />}
            code={<CodeBlock code={fullWidthCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* Social login */}
        <section id="social" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Social login</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">SocialButton</code> wraps{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Button</code> with the brand logo and
            a sensible default label. Override <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">label</code> to
            change "Continue with" to "Sign in with" or "Sign up with".
          </Text>
          <PreviewCode
            minHeight={220}
            preview={<ButtonSocialPreview />}
            code={<CodeBlock code={socialCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* Disabled */}
        <section id="disabled" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Disabled</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            The <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">disabled</code> prop
            applies 45% opacity, flattens the elevation, and blocks all pointer events.
            Works across every variant and size.
          </Text>
          <PreviewCode
            minHeight={160}
            preview={<ButtonDisabledPreview />}
            code={<CodeBlock code={disabledCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="loading" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Loading</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            The label always stays put. With an icon the spinner takes the icon&apos;s slot;
            without one it centres over a faded label, so the button never changes width
            mid-request and its accessible name survives. Sets{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">aria-busy</code>.
          </Text>
          <PreviewCode
            minHeight={180}
            preview={<ButtonLoadingPreview />}
            code={<CodeBlock code={loadingCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="custom-fill" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Custom fill</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Defaults stay on the design tokens. Pass Tailwind on{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">className</code>{' '}
            to restyle one instance.{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">bg-sky-500</code>{' '}
            is promoted to both gradient stops so a single colour still covers the fill.{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">from-*</code>
            {' '}/{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">to-*</code>{' '}
            replace the fade. Pair a fill change with{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">text-*</code>{' '}
            so the label contrast holds.
          </Text>
          <PreviewCode
            minHeight={160}
            preview={<ButtonCustomFillPreview />}
            code={<CodeBlock code={customFillCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* Sizes - at the end, no duplicate props table */}
        <section id="sizes" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Sizes</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Three sizes with fully-rounded corners (radius = height ÷ 2) and squircle smoothing at 0.6.
          </Text>
          <PreviewCode
            minHeight={160}
            preview={<ButtonSizesPreview />}
            code={<CodeBlock code={sizesCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        {/* Props */}
        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'variant',      type: '"solid" | "outline" | "ghost" | "soft" | "destructive"', desc: 'Visual style. Default: "solid".' },
            { name: 'size',         type: '"sm" | "default" | "lg"',                                desc: '28 / 36 / 40 px. Default: "default" (36 px).' },
            { name: 'icon',         type: 'React.ReactNode',                                         desc: 'Icon element - iconsax-react or @hugeicons/react.' },
            { name: 'iconPosition', type: '"left" | "right"',                                        desc: 'Side the icon renders on. Default: "left".' },
            { name: 'iconOnly',     type: 'boolean',                                                 desc: 'Square icon-only button. Requires aria-label.' },
            { name: 'slideIcon',    type: 'boolean',                                                 desc: 'Icon hides until hover, from either side. Always visible on touch.' },
            { name: 'fullWidth',    type: 'boolean',                                                 desc: 'Stretches button to 100% of the parent container.' },
            { name: 'loading',      type: 'boolean',                                                 desc: 'Spinner + aria-busy, disables the button. Label and width stay put.' },
            { name: 'disabled',     type: 'boolean',                                                 desc: '45% opacity, flattens elevation, blocks interaction.' },
            { name: 'noRipple',     type: 'boolean',                                                 desc: 'Disables the press ripple. Skipped automatically under prefers-reduced-motion.' },
            { name: 'className',    type: 'string',                                                  desc: 'Merged last via cn(). bg-* becomes both gradient stops; from-* / to-* replace the fade; text-* / h-* / px-* override the matching defaults.' },
          ]} />

          <Text variant="h4" className="text-zinc-900 dark:text-white mt-4">SocialButton props</Text>
          <PropsTable rows={[
            { name: 'provider',   type: '"google" | "github" | "apple"', desc: 'Brand to render - sets the logo and default label.' },
            { name: 'label',      type: 'string',                        desc: 'Override the default "Continue with …" label.' },
            { name: 'size',       type: 'ButtonSize',                    desc: 'Inherits Button sizes. Default: "default".' },
            { name: 'fullWidth',  type: 'boolean',                       desc: 'Defaults to true - typical for auth forms.' },
          ]} />
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
