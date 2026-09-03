import type { Metadata } from 'next'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { Accordion } from '@/components/stepwise/accordion'
import { Section, Body, Code, Strong, A, PageHeader } from '@/components/stepwise/docs/prose'

export const metadata: Metadata = {
  title: 'Quick Start',
  description:
    'Set up Tailwind v4, the dark variant and the @/ path alias, then add your first Stepwise UI component and render it.',
  alternates: { canonical: '/docs/quick-start' },
}

const newProjectCode = `npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app`

const cssCode = `@import "tailwindcss";

/* Stepwise uses a class-based dark variant. Tailwind v4 defaults to
   prefers-color-scheme, so without this line every dark: class in the
   components does nothing. */
@custom-variant dark (&:where(.dark, .dark *));`

const aliasCode = `{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}`

const usageCode = `import { Button } from '@/components/stepwise/button'

export default function Page() {
  return <Button variant="solid">Ship it</Button>
}`

const borderTokenCode = `:root {
  --ui-border: #d4d4d8;        /* zinc-300 */
  --ui-border-subtle: #e4e4e7; /* zinc-200 */
}

html.dark {
  --ui-border: #3f3f46;        /* zinc-700 */
  --ui-border-subtle: #27272a; /* zinc-800 */
}`

const providerCode = `import { ThemeProvider } from '@/lib/theme'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}`

const initCode = `$ npx stepwise-ui init

\u250c  Stepwise UI
\u2502
\u25c6  Pick components to add
\u2502  toast
\u2502  \u25fb toast        Global notification toasts in four types.
\u2502  \u25fb theme-toggle A button that switches between light and dark mode.
\u2502
\u2502  \u2191/\u2193 to navigate \u2022 Tab: select \u2022 Enter: confirm \u2022 Type: to search
\u2514

  \u2713 components/stepwise/toast.tsx

  Installing: clsx, motion, tailwind-merge

\u2713 1 component, 1 file written.`

const toc = [
  { id: 'requirements', label: 'Requirements', child: false },
  { id: 'new-project', label: '1. Start a project', child: false },
  { id: 'add', label: '2. Run init', child: false },
  { id: 'use', label: '3. Use it', child: false },
  { id: 'manual-setup', label: 'What init sets up', child: false },
  { id: 'theme-provider', label: 'Theme provider', child: false },
  { id: 'border-colour', label: 'Border colour', child: false },
  { id: 'troubleshooting', label: 'Troubleshooting', child: false },
]

export default function QuickStartPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <PageHeader title="Quick Start">
          Three steps from an empty project to a Stepwise component on screen. The
          middle one does the configuring for you.
        </PageHeader>

        <Section id="requirements" title="Requirements">
          <Body>
            <A href="https://react.dev">React 19</A>,{' '}
            <A href="https://tailwindcss.com/docs/installation">Tailwind CSS v4</A>,{' '}
            <A href="https://www.typescriptlang.org/download">TypeScript</A>, and{' '}
            <A href="https://nodejs.org">Node 18</A> or newer for the CLI.
          </Body>
          <Body>
            Any React setup works. The steps below use{' '}
            <A href="https://nextjs.org/docs/app/getting-started/installation">Next.js</A>{' '}
            because it is the common case.
          </Body>
        </Section>

        <Section id="new-project" title="1. Start a project">
          <Body>
            Skip this if you already have one.
          </Body>
          <CodeBlock code={newProjectCode} lang="bash" />
        </Section>

        <Section id="add" title="2. Run init">
          <Body>
            One command does the rest: it configures the project if it needs it, then
            lets you pick components and installs them.
          </Body>
          <InlineInstall command="npx stepwise-ui init" />
          <Body>
            Type to filter, <Code>Tab</Code> to select, <Code>Enter</Code> to confirm.
            Whatever you pick is written into the project and its npm packages
            installed. Run it again any time you want more.
          </Body>
          <CodeBlock code={initCode} lang="bash" copyable={false} />
          <Body>
            Before installing, it checks the two things components need: the dark-mode
            variant in your stylesheet and the <Code>@/</Code> alias in{' '}
            <Code>tsconfig.json</Code>. If either is missing it offers to add it and
            asks first. Say no and it prints what to add yourself.
          </Body>
          <Body>
            Adding the alias rewrites <Code>tsconfig.json</Code> as standard JSON, which
            drops any comments in it and reformats the rest. If yours is hand-tuned,
            decline and add the alias from{' '}
            <A href="#alias">the path alias</A> below instead.
          </Body>
          <Body>
            Already know the name? Skip the picker:
          </Body>
          <InlineInstall command="npx stepwise-ui add button" />
          <Body>
            <Code>add</Code> installs components but never edits your config, because it
            runs unattended in scripts and agent sessions. See <A href="/docs/cli">CLI</A>{' '}
            for the rest of the commands.
          </Body>
        </Section>

        <Section id="use" title="3. Use it">
          <CodeBlock code={usageCode} lang="tsx" />
          <Body>
            That is the whole setup. Every other component works the same way.
          </Body>
        </Section>

        <Section id="manual-setup" title="What init sets up">
          <Body>
            For reference, or if you would rather do it by hand. These are the two
            changes <Code>init</Code> offers to make.
          </Body>
        </Section>

        <Section id="dark-variant" title="The dark variant">
          <Body>
            Open your global stylesheet (<Code>app/globals.css</Code> in a fresh Next.js
            app) and add the <Code>@custom-variant</Code> line:
          </Body>
          <CodeBlock code={cssCode} lang="css" />
          <Body>
            Components render fine without it, but every dark-mode style is silently
            inert, which is confusing to debug later.
          </Body>
        </Section>

        <Section id="alias" title="The path alias">
          <Body>
            Components are written to <Code>components/stepwise/</Code> and{' '}
            <Code>lib/</Code>, and import each other through the <Code>@/</Code> alias.{' '}
            <Code>create-next-app</Code> sets this up already:
          </Body>
          <CodeBlock code={aliasCode} lang="json" />
        </Section>

        <Section id="theme-provider" title="Theme provider">
          <Body>
            Optional. Components render correctly without it. You need{' '}
            <Code>ThemeProvider</Code> only for a working light/dark toggle - it manages
            the <Code>dark</Code> class on <Code>&lt;html&gt;</Code> and remembers the
            choice. It is written to <Code>lib/theme.tsx</Code> with your first
            component.
          </Body>
          <CodeBlock code={providerCode} lang="tsx" />
        </Section>

        <Section id="border-colour" title="Border colour">
          <Body>
            Every squircle border in the library reads one variable, so you can retint
            all of them at once. Components carry a neutral grey as the built-in value -
            define <Code>--ui-border</Code> anywhere in your CSS and yours wins instead.
          </Body>
          <CodeBlock code={borderTokenCode} lang="css" />
          <Body>
            <Code>--ui-border-subtle</Code> is the quieter one, used for dividers and
            the inner edges of cards. Neither needs to be defined for components to
            render - this is an override, not a requirement.
          </Body>
        </Section>

        <Section id="troubleshooting" title="Troubleshooting">
          <Accordion
            items={[
              {
                id: 'dark',
                title: 'Dark mode does nothing',
                content: (
                  <Body>
                    The <Code>@custom-variant</Code> line is missing from your CSS.
                    Re-run <Code>npx stepwise-ui init</Code> and let it add the line for
                    you.
                  </Body>
                ),
              },
              {
                id: 'module',
                title: "Cannot find module '@/components/...'",
                content: (
                  <Body>
                    The <Code>@/</Code> alias is not configured. Re-run{' '}
                    <Code>npx stepwise-ui init</Code> and let it add the alias.
                  </Body>
                ),
              },
              {
                id: 'corners',
                title: 'Corners look square',
                content: (
                  <Body>
                    <Code>@lisse/react</Code> did not install. Re-run the add command, or
                    install it directly.
                  </Body>
                ),
              },
              {
                id: 'react',
                title: 'Peer dependency warning about React',
                content: (
                  <Body>
                    The CLI warns instead of installing React for you, since the version
                    is your call. Install it and re-run.
                  </Body>
                ),
              },
              {
                id: 'else',
                title: 'Something else',
                content: (
                  <Body>
                    Open an issue on{' '}
                    <A href="https://github.com/Stepwise-Studio/stepwise-ui/issues">GitHub</A>.
                  </Body>
                ),
              },
            ]}
          />
        </Section>

      </div>
      {/* Same wrapper the component pages use. Without it this renders at
          every width, so on a phone the table of contents sat in the page
          body instead of being suppressed. */}
      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={toc} />
      </aside>
    </div>
  )
}
