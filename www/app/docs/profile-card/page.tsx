import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import { ProfileCardDefaultPreview, ProfileCardCompactPreview } from '@/components/stepwise/docs/profile-card-preview'

const defaultCode = `import { ProfileCard } from '@/components/stepwise/profile-card'

<ProfileCard
  variant="default"
  bannerSrc="/banner.jpg"
  avatarSrc="/your-photo.jpg"
  name="Snoofy Ackerman"
  verified
  role="Marketing Agent"
  bio="Snoofy is a digital assistant…"
  stats={[
    { label: 'Client Works',  value: '5'   },
    { label: 'Posts Drafted', value: '100' },
    { label: 'Ongoing Tasks', value: '20'  },
  ]}
  ctaLabel="Get in touch"
/>`

const compactCode = `<ProfileCard
  variant="compact"
  avatarSrc="/your-photo.jpg"
  name="Snoofy Ackerman"
  verified
  role="Marketing Agent"
  bio="…"
  stats={stats}
/>`

const toc = [
  { id: 'default', label: 'Default',  child: false },
  { id: 'compact', label: 'Compact',  child: false },
  { id: 'props',   label: 'Props',    child: false },
]

export default function ProfileCardPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Profile Card</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400">
            An agent or user profile card. The default variant includes a scenic banner header;
            the compact variant keeps only the avatar row — useful in sidebars or lists.
            Both show work-experience stats and a full-width CTA button.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add profile-card" />
        </section>

        <section id="default" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Default (with banner)</Text>
          <PreviewCode
            minHeight={500}
            preview={<ProfileCardDefaultPreview />}
            code={<CodeBlock code={defaultCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="compact" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Compact</Text>
          <PreviewCode
            minHeight={380}
            preview={<ProfileCardCompactPreview />}
            code={<CodeBlock code={compactCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'variant',   type: '"default" | "compact"',   desc: 'Layout. Default "default" includes a banner image.' },
            { name: 'bannerSrc', type: 'string',                  desc: 'Banner image URL (default variant only).' },
            { name: 'avatarSrc', type: 'string',                  desc: 'Avatar image URL. Falls back to initials.' },
            { name: 'avatarImagePosition', type: 'string',        desc: 'object-position for the avatar photo, e.g. "top". Default "center".' },
            { name: 'avatarImageScale', type: 'number',           desc: 'Scales the avatar photo within its cover fit. Under 1 zooms out a touch. Default 1.' },
            { name: 'name',      type: 'string',                  desc: 'Display name.' },
            { name: 'verified',  type: 'boolean',                 desc: 'Shows a blue verified badge.' },
            { name: 'role',      type: 'string',                  desc: 'Role or title below the name.' },
            { name: 'bio',       type: 'string',                  desc: 'Short biography.' },
            { name: 'stats',     type: 'ProfileStat[]',           desc: 'Work stats displayed in a row.' },
            { name: 'ctaLabel',  type: 'string',                  desc: 'CTA button label. Default "Get in touch".' },
            { name: 'onCta',     type: '() => void',              desc: 'CTA click handler.' },
          ]} />
        </section>

      </div>
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
