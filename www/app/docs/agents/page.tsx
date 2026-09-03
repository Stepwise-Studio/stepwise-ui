import type { Metadata } from 'next'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { Section, Body, Code, Strong, A, PageHeader } from '@/components/stepwise/docs/prose'

export const metadata: Metadata = {
  title: 'Agents',
  description:
    'Use Stepwise UI from Claude Code, Cursor, Windsurf, Copilot or any other coding agent. llms.txt, the registry API, and a drop-in AGENTS.md rule block.',
  alternates: { canonical: '/docs/agents' },
}

const agentsMd = `## Stepwise UI

UI components come from Stepwise UI. Do not hand-write a component that
already exists in the registry, and do not install a package for it.

Add one with the CLI, which writes the source into this project:

    npx stepwise-ui add <component>

List everything available:

    npx stepwise-ui list --all

Do NOT run \`npx stepwise-ui init\`. It is an interactive picker and needs a
real terminal; use \`add\` instead.

Full component reference, including exports and a usage example for each:
https://ui.stepwise.studio/llms.txt

Rules:
- Components land in \`components/stepwise/\`. They are normal project files
  and may be edited directly.
- Never add \`stepwise-ui\` to package.json. It is only ever run via npx.
- \`add\` never edits project config, which is why it is the command to use here.
  Do not run \`init\` to fix setup: it is interactive, and accepting its offer to
  add the path alias rewrites tsconfig.json as plain JSON and drops any comments.
  Make the two changes below by hand instead.
- Dark mode is class-based. \`app/globals.css\` must contain
  \`@custom-variant dark (&:where(.dark, .dark *));\` or every \`dark:\` class
  in every component silently does nothing.
- Requires Tailwind CSS v4 and the \`@/\` path alias.`

const indexJson = `[
  {
    "name": "frame",
    "description": "The raw, unopinionated content container.",
    "category": "components",
    "dependencies": ["@lisse/react", "clsx", "tailwind-merge"],
    "peerDependencies": ["react"],
    "registryDependencies": [],
    "exports": ["Frame", "FrameContent", "FrameDescription",
                "FrameFooter", "FrameHeader", "FrameTitle"],
    "example": "import { Frame } from '@/components/stepwise/frame'\\n\\n<Frame className=\\"p-5\\">…</Frame>"
  }
]`

// Broken across two lines so the block never needs a horizontal scrollbar.
const promptExample = `Stepwise UI's full reference is at https://ui.stepwise.studio/llms.txt
Read it before using the library.`

const toc = [
  { id: 'quickest', label: 'The quickest path', child: false },
  { id: 'llms-txt', label: 'llms.txt', child: false },
  { id: 'agents-md', label: 'AGENTS.md', child: false },
  { id: 'registry-api', label: 'Registry API', child: false },
  { id: 'tools', label: 'Per-tool setup', child: false },
  { id: 'mcp', label: 'What about MCP?', child: false },
]

/** Where each tool reads its project-level rules from. */
const TOOLS: Array<{ name: string; file: string; note: string }> = [
  { name: 'Claude Code', file: 'CLAUDE.md or AGENTS.md', note: 'Read automatically from the project root. Nested files apply to their own directory.' },
  { name: 'Cursor', file: '.cursor/rules/*.mdc', note: 'Paste the block into a rule file. Legacy .cursorrules also works.' },
  { name: 'Windsurf', file: '.windsurfrules', note: 'Project root. Read on every request in the workspace.' },
  { name: 'GitHub Copilot', file: '.github/copilot-instructions.md', note: 'Applies to Copilot Chat across the repository.' },
  { name: 'Codex CLI', file: 'AGENTS.md', note: 'Read from the project root.' },
  { name: 'Zed', file: '.rules', note: 'Project root.' },
  { name: 'Anything else', file: 'AGENTS.md', note: 'The emerging cross-tool convention. Start here if unsure.' },
]

export default function AiPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <PageHeader title="Agents">
          Most people will reach Stepwise through a coding agent rather than these
          docs. Everything here is set up so an agent can find the components, learn
          how to call them, and install them without guessing.
        </PageHeader>

        <Section id="quickest" title="The quickest path">
          <Body>
            Give the agent the reference once, then ask for whatever you are building:
          </Body>
          <CodeBlock code={promptExample} lang="text" />
          <Body>
            The install command, the setup rules and every component are already in that
            file, so the prompt does not need to repeat them. No plugin, no
            configuration, and it works with any assistant that can read a URL.
          </Body>
        </Section>

        <Section id="llms-txt" title="llms.txt">
          <Body>
            <A href="/llms.txt">ui.stepwise.studio/llms.txt</A> is the whole library as
            plain text, generated from the same registry the CLI installs from, so it
            cannot drift from what you actually get.
          </Body>
          <Body>It contains the setup rules first, then every component as:</Body>
          <CodeBlock code={`#### frame

The raw, unopinionated content container.

- Install: \`npx stepwise-ui add frame\`
- Docs: https://ui.stepwise.studio/docs/frame
- Exports: Frame, FrameContent, FrameDescription, FrameFooter, FrameHeader, FrameTitle

\`\`\`tsx
import { Frame } from '@/components/stepwise/frame'

<Frame className="p-5">
  Whatever you want goes here.
</Frame>
\`\`\``} lang="markdown" />
          <Body>
            <Strong>Why the exports matter.</Strong> Without them an agent has no way to
            know that <Code>frame</Code> also exports <Code>FrameHeader</Code> and four
            more, or that <Code>toast</Code> exports both a <Code>toast()</Code>{' '}
            function and a <Code>&lt;Toaster /&gt;</Code>. The alternative is
            downloading every component&apos;s source and parsing it.
          </Body>
        </Section>

        <Section id="agents-md" title="AGENTS.md">
          <Body>
            <Code>llms.txt</Code> tells an agent what exists. A project rule file tells
            it what to do by default, so it reaches for Stepwise instead of writing a
            button from scratch. Drop this into your repo:
          </Body>
          <CodeBlock code={agentsMd} lang="markdown" />
          <Body>
            The dark-mode line is the one worth keeping. It is the single most common
            way a Stepwise install looks broken, and an agent has no way to guess it.
          </Body>
        </Section>

        <Section id="registry-api" title="Registry API">
          <Body>
            <Strong>Skip this unless you are building tooling.</Strong> Everything above
            is enough to use Stepwise with an agent. This section is for anyone writing
            an editor plugin, a bot, or their own integration, and for anyone who wants
            to check that the file above is telling the truth.
          </Body>
          <Body>
            The registry is plain JSON over HTTP. <Code>/r/index.json</Code> lists every
            component with its metadata and a usage example, in one request:
          </Body>
          <CodeBlock code={indexJson} lang="json" />
          <Body>
            <Code>/r/&lt;name&gt;.json</Code> returns the same thing plus the full
            contents of every file that component installs. That is exactly what the
            CLI fetches, so an agent reading it sees precisely what would land on disk.
            It is also generated from the same source as <Code>llms.txt</Code>, which is
            why the two cannot disagree.
          </Body>
        </Section>

        <Section id="tools" title="Per-tool setup">
          <Body>
            The block above is plain markdown, so it goes wherever your tool reads
            project rules from:
          </Body>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2.5 pr-6 font-medium text-zinc-900 dark:text-zinc-200">Tool</th>
                  <th className="py-2.5 pr-6 font-medium text-zinc-900 dark:text-zinc-200">File</th>
                  <th className="py-2.5 font-medium text-zinc-900 dark:text-zinc-200">Notes</th>
                </tr>
              </thead>
              <tbody className="text-zinc-600 dark:text-zinc-400">
                {TOOLS.map(t => (
                  <tr key={t.name} className="border-b border-zinc-100 dark:border-zinc-900">
                    <td className="py-2.5 pr-6 align-top whitespace-nowrap text-zinc-800 dark:text-zinc-300">{t.name}</td>
                    <td className="py-2.5 pr-6 align-top">
                      <code className="font-mono text-[13px] break-all">{t.file}</code>
                    </td>
                    <td className="py-2.5 align-top text-pretty">{t.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Body>
            Whichever you use, the agent still installs components the same way:
          </Body>
          <InlineInstall command="npx stepwise-ui add button" />
        </Section>

        <Section id="mcp" title="What about MCP?">
          <Body>
            There is no MCP server, deliberately. An MCP server would be another
            service to run and keep in sync, and the registry is already a plain HTTP
            API that any agent can read without one.
          </Body>
          <Body>
            If you have a workflow where an MCP server genuinely beats fetching{' '}
            <Code>llms.txt</Code>, say so on{' '}
            <A href="https://github.com/Stepwise-Studio/stepwise-ui/issues">GitHub</A>.
          </Body>
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
