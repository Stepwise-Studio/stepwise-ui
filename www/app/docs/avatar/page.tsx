import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { AvatarSizesPreview, AvatarVariantsPreview, AvatarGroupPreview } from '@/components/stepwise/docs/avatar-preview'

const basicCode = `import { Avatar } from '@/components/stepwise/avatar'

<Avatar name="Sarah Chen" size="lg" />          // gradient (default)
<Avatar name="Sarah Chen" variant="letter" />   // just the first letter
<Avatar name="Sarah Chen" src="/photo.jpg" />   // image`

const variantsCode = `// gradient — white top, colour blooming up from below
<Avatar name="Akhil Reji" />

// letter — first letter on a tint
<Avatar name="Akhil Reji" variant="letter" />

// image — falls back to gradient if the photo fails
<Avatar name="Akhil Reji" src="/akhil.jpg" />`

const groupCode = `import { AvatarGroup } from '@/components/stepwise/avatar'

<AvatarGroup
  avatars={team}
  max={5}
  onAdd={() => setInviteOpen(true)}  // renders the + button
/>

// pair it with <Modal> + <Input> for the invite flow`

const toc = [
  { id: 'sizes',    label: 'Sizes',        child: false },
  { id: 'variants', label: 'Variants',     child: false },
  { id: 'group',    label: 'Avatar Group', child: false },
  { id: 'props',    label: 'Props',        child: false },
]

export default function AvatarPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Avatar</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Circular user representation in three variants — a soft white-topped gradient with
            initials, a single-letter tint, and a photo. Stack them in a playful overlapping
            group where each avatar lifts out on hover, with a + button wired to your invite flow.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add avatar" />
        </section>

        <section id="sizes" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Sizes</Text>
          <PreviewCode
            minHeight={200}
            preview={<AvatarSizesPreview />}
            code={<CodeBlock code={basicCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="variants" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Variants</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            The hue is derived from the characters in the name, so the same person always gets
            the same colour — across every variant.
          </Text>
          <PreviewCode
            minHeight={260}
            preview={<AvatarVariantsPreview />}
            code={<CodeBlock code={variantsCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="group" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Avatar Group</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            Overlapping stack with a{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">+N</code>{' '}
            overflow pill. Pass{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">onAdd</code>{' '}
            to get the dashed + button — here it opens an invite modal built from our Modal and
            Input components.
          </Text>
          <PreviewCode
            minHeight={260}
            preview={<AvatarGroupPreview />}
            code={<CodeBlock code={groupCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props — Avatar</Text>
          <PropsTable rows={[
            { name: 'src',       type: 'string',                            desc: 'Image URL. Falls back to gradient if absent or broken.' },
            { name: 'name',      type: 'string',                            desc: 'Drives initials, the letter, and the colour.' },
            { name: 'variant',   type: '"gradient" | "letter" | "image"',   desc: 'Defaults to "image" when src is set, else "gradient".' },
            { name: 'size',      type: '"xs" | "sm" | "default" | "lg" | "xl"', desc: 'Default "default" (40px).' },
          ]} />

          <Text variant="h3" className="text-zinc-900 dark:text-white mt-6">Props — AvatarGroup</Text>
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
