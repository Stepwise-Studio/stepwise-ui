import type { Metadata } from 'next'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { Section, Body, Code, Strong, A, PageHeader } from '@/components/stepwise/docs/prose'

export const metadata: Metadata = {
  title: 'CLI',
  description:
    'Reference for the stepwise-ui CLI: the add and list commands, dependency resolution, overwrite behaviour, package manager detection, and configuration.',
  alternates: { canonical: '/docs/cli' },
}

const outputCode = `$ npx stepwise-ui add date-picker

  Also required: calendar
  ✓ components/stepwise/date-picker.tsx
  ✓ components/stepwise/primitives/surface.tsx
  ✓ lib/theme.tsx
  ✓ lib/utils/cn.ts
  ✓ components/stepwise/calendar.tsx

  Installing: @hugeicons/core-free-icons, @hugeicons/react, @lisse/react, clsx, motion, tailwind-merge

✓ 2 components, 5 files written.`

const skipCode = `  ~ components/stepwise/button.tsx (differs - use --yes to overwrite)`

const envCode = `STEPWISE_REGISTRY_URL=http://localhost:3000/r npx stepwise-ui add button`

const initOutput = `$ npx stepwise-ui init

\u250c  Stepwise UI
\u2502
\u25c6  Pick components to add
\u2502  car
\u2502  \u25fb arc-carousel   A continuously drifting strip of photographs.
\u2502  \u25fb lens-carousel  Photographs pinched by a lens across the row.
\u2502  \u25fb product-card   An e-commerce product card.
\u2502
\u2502  \u2191/\u2193 to navigate \u2022 Tab: select \u2022 Enter: confirm \u2022 Type: to search
\u2514`

const commands: Array<[string, string]> = [
  ['init', 'Browse every component in a searchable picker and install what you select.'],
  ['add <components...>', 'Add one or more components by name, with their dependencies.'],
  ['add <components...> --yes', 'Overwrite files that differ, without prompting. Alias: -y'],
  ['list', "List the Stepwise components already in this project. Alias: ls"],
  ['list --all', 'List every component in the registry instead. Alias: -a'],
  ['--version', 'Print the installed CLI version.'],
  ['--help', 'Usage and examples. Works on subcommands too.'],
]

const toc = [
  { id: 'running', label: 'Running it', child: false },
  { id: 'init', label: 'init', child: false },
  { id: 'add', label: 'add', child: false },
  { id: 'list', label: 'list', child: false },
  { id: 'resolution', label: 'How resolution works', child: false },
  { id: 'existing-files', label: 'Existing files', child: false },
  { id: 'dependencies', label: 'Dependencies', child: false },
  { id: 'where-files-go', label: 'Where files go', child: false },
  { id: 'config', label: 'Configuration', child: false },
  { id: 'reference', label: 'Command reference', child: false },
]

export default function CliPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <PageHeader title="CLI">
          <Code>stepwise-ui</Code> fetches component source from the registry and writes
          it into your project. It is the only piece of Stepwise that is an npm package.
        </PageHeader>

        <Section id="running" title="Running it">
          <Body>
            Use it through <Code>npx</Code>. There is nothing to install globally.
          </Body>
          <InlineInstall command="npx stepwise-ui init" />
          <Body>
            The CLI finds your project by walking up from the current directory until it
            hits a <Code>package.json</Code>, so it works from a subdirectory. If there
            is no <Code>package.json</Code> anywhere above you, it stops with an error
            rather than guessing.
          </Body>
        </Section>

        <Section id="init" title="init">
          <Body>
            The starting point. Opens a searchable list of every component: type to
            filter, <Code>Tab</Code> to select, <Code>Enter</Code> to confirm. Anything
            you already have is marked, and what you pick is installed straight away.
          </Body>
          <CodeBlock code={initOutput} lang="bash" copyable={false} />
          <Body>
            It also handles the project setup. If your stylesheet is missing the
            dark-mode variant, or <Code>tsconfig.json</Code> is missing the{' '}
            <Code>@/</Code> alias, it offers to add them and asks first. Say no and it
            prints what to add yourself.
          </Body>
          <Body>
            <Strong>On the tsconfig edit:</Strong> adding the alias means rewriting the
            file, and it comes back as standard 2-space JSON. Any comments in it are
            lost, since JSON has no comments, and the formatting is normalised, so the
            diff can be larger than the one line you expected. A file too broken to
            parse is left untouched with a message instead. On a fresh{' '}
            <Code>create-next-app</Code> none of this is noticeable; on a hand-tuned
            config, decline the prompt and paste the alias in yourself.
          </Body>
          <Body>
            <Strong>Needs a terminal.</Strong> There is nothing for a picker to read in
            CI or an agent session, so <Code>init</Code> exits with a pointer to{' '}
            <Code>add</Code> and <Code>list --all</Code> rather than hanging on a prompt
            nobody can answer. <Code>add</Code> never edits your config for the same
            reason: it runs unattended.
          </Body>
        </Section>

        <Section id="add" title="add">
          <Body>
            The non-interactive path, for when you already know the name or are
            scripting. Names match the URL of each docs page.
          </Body>
          <InlineInstall command="npx stepwise-ui add button input toast" />
          <Body>A run looks like this:</Body>
          <CodeBlock code={outputCode} lang="bash" copyable={false} />
        </Section>

        <Section id="list" title="list">
          <Body>
            What this project already has, matched by filename against the registry:
          </Body>
          <InlineInstall command="npx stepwise-ui list" />
          <Body>
            Pass <Code>--all</Code> for the whole registry instead. That is the
            non-interactive counterpart to <Code>init</Code>, so scripts and agents can
            discover components without a picker:
          </Body>
          <InlineInstall command="npx stepwise-ui list --all" />
        </Section>

        <Section id="resolution" title="How resolution works">
          <Body>
            Components can build on each other. <Code>date-picker</Code> uses{' '}
            <Code>calendar</Code>, so asking for the first brings the second. The CLI
            walks that graph before writing anything and reports what it pulled in under{' '}
            <Code>Also required:</Code>.
          </Body>
          <Body>
            Shared files like <Code>lib/utils/cn.ts</Code> ship with every component that
            imports them, so the same path can arrive many times in one run. It is
            written once. Cycles and diamonds are handled by resolving to a set, so a
            component that appears twice is still fetched once.
          </Body>
          <Body>
            If one name in a multi-component run is wrong, the others still install. The
            bad name is reported and the exit code is non-zero.
          </Body>
        </Section>

        <Section id="existing-files" title="Existing files">
          <Body>
            The CLI compares content before touching anything.
          </Body>
          <Body>
            Identical file: skipped silently. Nothing to say.
          </Body>
          <Body>
            Different file: left alone and reported, so a local edit is never
            overwritten by accident.
          </Body>
          <CodeBlock code={skipCode} lang="bash" copyable={false} />
          <Body>
            Pass <Code>--yes</Code> (or <Code>-y</Code>) to overwrite. Commit your work
            first - the CLI does not keep a backup.
          </Body>
        </Section>

        <Section id="dependencies" title="Dependencies">
          <Body>
            npm packages a component imports - <Code>motion</Code>,{' '}
            <Code>@lisse/react</Code>, <Code>clsx</Code> - are installed automatically,
            in a single install at the end of the run rather than once per component.
            Packages you already have are not reinstalled.
          </Body>
          <Body>
            Your package manager is detected from the lockfile:{' '}
            <Code>bun.lockb</Code>, <Code>pnpm-lock.yaml</Code>, or{' '}
            <Code>yarn.lock</Code>, falling back to npm.
          </Body>
          <Body>
            <Strong>Framework packages are not installed.</Strong> If a component needs{' '}
            <Code>react</Code>{' '}
            and the project does not have it, the CLI says so and leaves it to you. Installing a React version into someone&apos;s project is a
            worse outcome than the error.
          </Body>
          <Body>
            If the install itself fails, the exact command is printed so you can run it
            yourself. Files are already written at that point.
          </Body>
        </Section>

        <Section id="where-files-go" title="Where files go">
          <Body>
            Components land in <Code>components/stepwise/</Code>, shared primitives in{' '}
            <Code>components/stepwise/primitives/</Code>, and helpers in{' '}
            <Code>lib/</Code>. These paths are fixed, because the generated files import
            each other through the <Code>@/</Code> alias.
          </Body>
          <Body>
            Move things afterwards if you like - they are your files. You will need to
            update the imports.
          </Body>
        </Section>

        <Section id="config" title="Configuration">
          <Body>
            There is no config file, and nothing to set up. The one setting exists for a
            single situation: you have forked this repo, changed a component, and want
            to install your version instead of the published one.
          </Body>
          <Body>
            Run the site locally, then point the CLI at it with{' '}
            <Code>STEPWISE_REGISTRY_URL</Code>:
          </Body>
          <CodeBlock code={envCode} lang="bash" />
          <Body>
            Everything installs from your copy instead. Unset it and you are back on the
            published registry. If you are not forking Stepwise, you never need this.
          </Body>
        </Section>

        <Section id="reference" title="Command reference">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2.5 pr-6 font-medium text-zinc-900 dark:text-zinc-200">Command</th>
                  <th className="py-2.5 font-medium text-zinc-900 dark:text-zinc-200">What it does</th>
                </tr>
              </thead>
              <tbody className="text-zinc-600 dark:text-zinc-400">
                {commands.map(([cmd, desc]) => (
                  <tr key={cmd} className="border-b border-zinc-100 dark:border-zinc-900">
                    <td className="py-2.5 pr-6 align-top">
                      <code className="whitespace-nowrap font-mono text-[13px] text-zinc-800 dark:text-zinc-300">{cmd}</code>
                    </td>
                    <td className="py-2.5 align-top text-pretty">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Body>
            Source and issues on{' '}
            <A href="https://github.com/Stepwise-Studio/stepwise-ui">GitHub</A>.
          </Body>
        </Section>

      </div>
      <OnThisPage items={toc} />
    </div>
  )
}
