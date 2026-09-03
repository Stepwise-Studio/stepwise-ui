import type { Metadata } from 'next'
import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { PreviewCode } from '@/components/stepwise/docs/preview-code'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { PropsTable } from '@/components/stepwise/docs/props-table'
import {
  SocialButtonProvidersPreview,
  SocialButtonCustomPreview,
} from '@/components/stepwise/docs/social-button-preview'

export const metadata: Metadata = {
  title: 'Social Button',
  description:
    'A sign-in button with the provider logo and a sensible default label. Google, GitHub and Apple built in, and any other provider by passing your own icon.',
  alternates: { canonical: '/docs/social-button' },
}

const providersCode = `import { SocialButton } from '@/components/stepwise/social-button'

<SocialButton provider="google" />
<SocialButton provider="github" label="Sign in with GitHub" />
<SocialButton provider="apple"  label="Sign up with Apple" />`

const customCode = `// Any other provider: pass both \`icon\` and \`label\`, since there is no
// built-in name to phrase the button with.
<SocialButton
  provider="figma"
  label="Continue with Figma"
  icon={<FigmaLogo />}
/>

<SocialButton
  provider="slack"
  label="Continue with Slack"
  icon={<SlackLogo />}
/>`

const toc = [
  { id: 'providers', label: 'Providers', child: false },
  { id: 'custom', label: 'Custom provider', child: false },
  { id: 'props', label: 'Props', child: false },
]

export default function SocialButtonPage() {
  return (
    <div className="flex gap-12">
      <div className="flex-1 min-w-0 flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <Text variant="headline" className="text-zinc-900 dark:text-white">Social Button</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            A sign-in button carrying the provider logo and a sensible default label.
            Google, GitHub and Apple are built in; any other provider works by passing your
            own icon. It wraps{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Button</code>,
            so every Button prop - size, fullWidth, disabled, loading - passes straight through.
          </Text>
        </div>

        <section className="flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Installation</Text>
          <InlineInstall command="npx stepwise-ui add social-button" />
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Installs{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">button</code>{' '}
            alongside it, since this is built on top of it.
          </Text>
        </section>

        <section id="providers" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Providers</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            The label defaults to &ldquo;Continue with {'{'}Provider{'}'}&rdquo;. Override{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">label</code>{' '}
            to say &ldquo;Sign in with&rdquo; or &ldquo;Sign up with&rdquo; instead - the wording
            should match what the button actually does.
          </Text>
          <PreviewCode
            minHeight={220}
            preview={<SocialButtonProvidersPreview />}
            code={<CodeBlock code={providersCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="custom" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Custom provider</Text>
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Pass any string as{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">provider</code>{' '}
            along with your own{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">icon</code> and{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">label</code>.
            Both are required for an unknown provider, because there is no built-in name to
            build the sentence from.
          </Text>
          <PreviewCode
            minHeight={220}
            preview={<SocialButtonCustomPreview />}
            code={<CodeBlock code={customCode} lang="tsx" className="rounded-none" flat />}
          />
        </section>

        <section id="props" className="scroll-mt-20 flex flex-col gap-4">
          <Text variant="h3" className="text-zinc-900 dark:text-white">Props</Text>
          <PropsTable rows={[
            { name: 'provider',  type: "'google' | 'github' | 'apple' | string", desc: 'Built-in provider, or any other string for a custom one.' },
            { name: 'icon',      type: 'ReactNode', desc: 'The logo. Required when provider is not built in.' },
            { name: 'label',     type: 'string',    desc: 'Button text. Defaults to "Continue with {Provider}". Required for a custom provider.' },
            { name: 'size',      type: "'sm' | 'default' | 'lg'", desc: "Button's size scale. Default 'default'." },
            { name: 'fullWidth', type: 'boolean',   desc: 'Stretches to the width of its container.' },
            { name: 'href',      type: 'string',    desc: 'Renders an <a> instead of a <button> - handy for an OAuth authorize URL.' },
          ]} />
          <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
            Every other{' '}
            <code className="text-[13px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">button</code>{' '}
            attribute - onClick, disabled, type, aria-* - is forwarded.
          </Text>
        </section>

      </div>

      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
