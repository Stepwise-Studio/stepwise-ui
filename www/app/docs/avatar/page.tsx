import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { AvatarSizesPreview, AvatarDefaultPreview, AvatarAccentPreview, AvatarLettersPreview, AvatarImagePreview, AvatarBadgePreview, AvatarGroupPreview } from '@/components/stepwise/docs/avatar-preview'

const basicCode = `import { Avatar } from '@/components/stepwise/avatar'

<Avatar name="Asta" />                    // default
<Avatar name="Asta" src="/photo.jpg" />   // image`

const defaultCode = `<Avatar name="Asta" />`

const accentCode = `<Avatar name="Asta" textClassName="text-sky-600 dark:text-sky-400" />`

const lettersCode = `<Avatar name="Asta" />                 // 1 letter (default)
<Avatar name="Asta" letters={2} />     // 2 letters`

const imageCode = `// Your own photo - fills the circle edge to edge, cropped. This is
// the default: any URL works, nothing extra to configure.
<Avatar name="Asta" src="/your-photo.jpg" />

// This site's own 5 illustrated characters (shown above), copied into
// /public/avatars - object-position "top" keeps the crop on the face
// instead of centering on the chest below it.
<Avatar name="Snoofy" src="/avatars/avatar5.svg" imagePosition="top" />

// Falls back to the letter variant automatically if the photo 404s`

const badgeCode = `<Avatar name="Mira" src="/avatars/avatar1.svg" badge="online" />
<Avatar name="Mira" src="/avatars/avatar1.svg" badge="away" />
<Avatar name="Mira" src="/avatars/avatar1.svg" badge="busy" />
<Avatar name="Mira" src="/avatars/avatar1.svg" badge="offline" />`

const groupCode = `import { AvatarGroup } from '@/components/stepwise/avatar'

<AvatarGroup
  avatars={team}
  max={5}
  onAdd={() => {/* your invite flow */}}  // renders the + button
/>`

const toc = [
  { id: 'default', label: 'Default',      child: false },
  { id: 'accent',  label: 'Accent',       child: false },
  { id: 'letters', label: 'Letters',      child: false },
  { id: 'image',   label: 'Image',        child: false },
  { id: 'badge',   label: 'Badge',        child: false },
  { id: 'group',   label: 'Avatar Group', child: false },
  { id: 'sizes',   label: 'Sizes',        child: false },
  { id: 'props',   label: 'Props',        child: false },
]

export default function AvatarPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Avatar</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Circular user representation in two variants - a neutral-fill initial, or a photo.
            Stack them in an overlapping group with a + button wired to your invite flow.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add avatar" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A neutral fill with a zinc initial.
          </Text>
          <PreviewCode
            minHeight={160}
            preview={<AvatarDefaultPreview />}
            code={<CodeBlock code={defaultCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="accent" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Accent</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Pass{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">textClassName</code>{' '}
            for a different accent color.
          </Text>
          <PreviewCode
            minHeight={160}
            preview={<AvatarAccentPreview />}
            code={<CodeBlock code={accentCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="letters" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Letters</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Pass{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">letters={'{2}'}</code>{' '}
            for two initials instead of one.
          </Text>
          <PreviewCode
            minHeight={220}
            preview={<AvatarLettersPreview />}
            code={<CodeBlock code={lettersCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="image" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Image</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Pass any URL as <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">src</code>{' '}
            to use your own picture - it fills the circle by default, no extra setup. The 5
            characters shown here are this docs site's own illustrations, not part of the
            installed component; copy the SVGs from{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">public/avatars</code>{' '}
            if you want them, or point <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">src</code>{' '}
            at anything else - a real photo needs nothing more than that. They're cropped with{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">imagePosition="top"</code>{' '}
            so the crop favors the face over the chest below it.
          </Text>
          <PreviewCode
            minHeight={200}
            preview={<AvatarImagePreview />}
            code={<CodeBlock code={imageCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="badge" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Badge</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A small status dot on the bottom-right edge. Pass{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">badge</code>{' '}
            with one of the four presence states below.
          </Text>
          <PreviewCode
            minHeight={200}
            preview={<AvatarBadgePreview />}
            code={<CodeBlock code={badgeCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="group" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Avatar Group</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Hover any avatar to see their name. Hover the{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">+N</code>{' '}
            overflow pill to see everyone it's hiding. Pass{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">onAdd</code>{' '}
            to get the dashed + button - wire it up to whatever your invite flow needs.
          </Text>
          <PreviewCode
            minHeight={260}
            preview={<AvatarGroupPreview />}
            code={<CodeBlock code={groupCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="sizes" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Sizes</Text>
          <PreviewCode
            minHeight={200}
            preview={<AvatarSizesPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props - Avatar</Text>
          <PropsTable rows={[
            { name: 'src',       type: 'string',                    desc: 'Image URL. Falls back to the default variant if absent or broken.' },
            { name: 'name',      type: 'string',                    desc: 'Drives the initial(s).' },
            { name: 'variant',   type: '"letter" | "image"',        desc: 'Defaults to "image" when src is set, else "letter".' },
            { name: 'size',      type: '"xs" | "sm" | "default" | "lg"', desc: 'Default "default" (2.5rem / 40px).' },
            { name: 'letters',   type: '1 | 2',                     desc: 'How many initials to show. Default 1.' },
            { name: 'imageFit',  type: '"cover" | "contain"',       desc: '"cover" fills edge to edge, cropped (default). "contain" insets art with its own margin.' },
            { name: 'imagePosition', type: 'string',                desc: 'object-position for the "cover" fit, e.g. "top". Default "center".' },
            { name: 'imageScale', type: 'number',                   desc: 'Scales the photo within its "cover" fit. Under 1 zooms out a touch. Default 1.' },
            { name: 'badge',     type: '"online" | "away" | "busy" | "offline"', desc: 'Small status dot on the bottom-right edge. Omit for none.' },
            { name: 'bordered',  type: 'boolean',                   desc: 'The tinted border stroke. Default true - AvatarGroup turns it off itself.' },
            { name: 'showTooltip', type: 'boolean',                 desc: 'Names the avatar on hover, via Tooltip. Default true.' },
            { name: 'textClassName', type: 'string',                desc: 'Overrides the initial\'s color. Default "text-zinc-800 dark:text-zinc-200".' },
          ]} />

          <Text variant="h3" className="text-zinc-900 dark:text-white mt-6">Props - AvatarGroup</Text>
          <PropsTable rows={[
            { name: 'avatars',   type: 'AvatarProps[]', desc: 'Array of avatar objects.' },
            { name: 'max',       type: 'number',        desc: 'Maximum avatars shown. Default 5.' },
            { name: 'size',      type: 'AvatarSize',    desc: 'Size applied to all avatars. Default "default".' },
            { name: 'onAdd',     type: '() => void',    desc: 'Shows the + button; called on click.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
