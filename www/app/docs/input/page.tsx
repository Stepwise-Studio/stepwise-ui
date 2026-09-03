import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { InputVariantPreview } from '@/components/stepwise/docs/input-preview'
import { PropsTable } from '@/components/stepwise/docs/props-table'

/* ─── component source shown in the Code tab ─────────────────────────────── */
/* ─── usage examples ─────────────────────────────────────────────────────── */
const usageCode = `import { Input } from '@/components/stepwise/input'

// Basic - each variant ships with a sensible default label and placeholder
<Input variant="name" />
<Input variant="email" />
<Input variant="username" />
<Input variant="password" />
<Input variant="text" label="Bio" placeholder="Tell us about yourself" />

// Custom label
<Input variant="email" label="Work Email" />

// Custom placeholder
<Input variant="name" placeholder="First name only" />

// Icon control - suppress or move the icon
<Input variant="name" showIcon={false} />
<Input variant="email" iconSide="right" />

// External error (server / form library)
<Input variant="email" error="That email is already taken." />

// Hint text
<Input variant="username" hint="Letters, numbers, and underscores only." />

// Disabled
<Input variant="name" defaultValue="Ada Lovelace" disabled />`

/* ─── TOC ────────────────────────────────────────────────────────────────── */
const tocItems = [
  { id: 'preview', label: 'Preview', child: false },
  { id: 'usage',   label: 'Usage',   child: false },
  { id: 'props',   label: 'Props',   child: false },
]

/* ─── page ──────────────────────────────────────────────────────────────── */
export default async function InputPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Input</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A text field with five built-in variants - name, email, username, password,
            and plain text. Each ships with its own icon, placeholder, blur validation,
            and an error-shake animation.
          </Text>
        </div>

        {/* Installation */}
        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add input" />
        </section>

        {/* Preview + Code */}
        <section id="preview" className="scroll-mt-20">
          <PreviewCode
            minHeight={440}
            preview={<InputVariantPreview />}
            code={<CodeBlock code={usageCode} className="rounded-none" flat />}
          />
        </section>

        {/* Usage - distinct from the Preview's code tab, which shows the
            component's own source rather than practical call sites */}
        <section id="usage" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Usage</Text>
          <CodeBlock code={usageCode} lang="tsx" />
        </section>

        {/* Props */}
        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <Text variant="body-soft" className="text-zinc-500 dark:text-zinc-400">
            Extends all native{' '}
            <code className="text-[13px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">{'<input>'}</code>{' '}
            props except{' '}
            <code className="text-[13px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">id</code>{' '}
            and{' '}
            <code className="text-[13px] font-mono bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">type</code>{' '}
            (managed internally). Works as both controlled and uncontrolled.
          </Text>

          <PropsTable rows={[
            { name: 'variant',     type: '"text" | "name" | "email" | "username" | "password"', desc: 'Controls input type, default label, default placeholder, built-in icon, and blur validation. Default: "text".' },
            { name: 'label',       type: 'string',           desc: 'Label shown above the field. Omit to use the variant default (e.g. "Full Name"). Pass an empty string to hide the label entirely.' },
            { name: 'placeholder', type: 'string',           desc: 'Placeholder text inside the field. Omit to use the variant default (e.g. "name@example.com" for email).' },
            { name: 'showIcon',    type: 'boolean',          desc: 'Show or hide the variant\'s built-in icon. Default: true for all named variants. Always false for "text".' },
            { name: 'iconSide',    type: '"left" | "right"', desc: 'Which side to place the icon. Default: "left". The password eye-toggle is always on the right regardless.' },
            { name: 'icon',        type: 'ReactNode',        desc: 'Custom icon node - replaces the variant default while respecting showIcon and iconSide.' },
            { name: 'error',       type: 'string',           desc: 'External error message (from a server or form library). Overrides built-in validation and triggers the shake animation.' },
            { name: 'hint',        type: 'string',           desc: 'Helper text shown below the field. Hidden when an error is active.' },
            { name: 'disabled',    type: 'boolean',          desc: 'Dims the field and blocks all interaction.' },
            { name: 'className',   type: 'string',           desc: 'Applied to the outer flex wrapper - useful for controlling width or margin.' },
          ]} />
        </section>

      </div>

      {/* On this page */}
      <aside className="hidden w-44 shrink-0 xl:block">
        <OnThisPage items={tocItems} />
      </aside>
    </div>
  )
}
