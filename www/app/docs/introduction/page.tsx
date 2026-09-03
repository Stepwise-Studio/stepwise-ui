import type { Metadata } from 'next'
import { CodeBlock } from '@/components/stepwise/docs/code-block'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { Section, Body, Code, Strong, A, PageHeader } from '@/components/stepwise/docs/prose'

export const metadata: Metadata = {
  title: 'Introduction',
  description:
    'What Stepwise UI is, how components land in your project as editable source, and the details behind them - including squircle corners built on Lisse.',
  alternates: { canonical: '/docs/introduction' },
}

const surfaceCode = `import { SmoothCorners } from '@lisse/react'

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(({
  radius = 12,
  smoothing = 0.6,
  corners,
  ...rest
}, ref) => (
  <SmoothCorners corners={corners ?? { radius, smoothing }}>
    <div ref={ref} {...rest} />
  </SmoothCorners>
))`

const overrideCode = `import { Button } from '@/components/stepwise/button'

// props for the common cases
<Button variant="primary" size="lg">Save</Button>

// className for everything else - tailwind-merge lets these win
<Button variant="primary" className="rounded-full px-8" />`

const toc = [
  { id: 'what-it-is', label: 'What it is', child: false },
  { id: 'customising', label: 'Made to be changed', child: false },
  { id: 'squircles', label: 'Squircle corners', child: false },
  { id: 'vision', label: 'Where this is going', child: false },
  { id: 'next', label: 'Where to go next', child: false },
]

export default function IntroductionPage() {
  return (
    <div className="flex gap-12">
      <div className="flex min-w-0 flex-1 flex-col gap-12">

        <PageHeader title="Introduction">
          Stepwise UI is a growing collection of React components for building modern
          products. Each one arrives as source you can read, edit and make your own.
        </PageHeader>

        <Section id="what-it-is" title="What it is">
          <Body>
            The building blocks are here - buttons, inputs, modals, tables, menus - next
            to the pieces most projects keep putting off: a command palette, date and
            time pickers, carousels, file uploaders, text effects, backgrounds.
          </Body>
          <Body>
            Everything is typed, animated where movement helps, and works in light and
            dark from the start. Components are plain React with Tailwind classes, so
            they behave the same in Next.js, Vite or Remix.
          </Body>
          <Body>
            New components land regularly.
          </Body>
        </Section>

        <Section id="customising" title="Made to be changed">
          <Body>
            Most components ship with <Code>variant</Code>, <Code>size</Code> and
            similar props, so the common cases are already covered. Past that, every
            component takes a <Code>className</Code> that is merged through{' '}
            <Code>cn</Code>, a small helper built on <Code>clsx</Code> and{' '}
            <Code>tailwind-merge</Code>.
          </Body>
          <Body>
            Merging matters: <Code>tailwind-merge</Code> resolves conflicts in your
            favour, so passing <Code>rounded-full</Code>{' '}
            replaces the component&apos;s own
            radius instead of fighting it in the cascade. No <Code>!important</Code>, no
            wrapper div, no specificity games.
          </Body>
          <CodeBlock code={overrideCode} lang="tsx" />
          <Body>
            And when a prop and a class are not enough, the file is in your project.
            Open it and change whatever you need.
          </Body>
        </Section>

        <Section id="squircles" title="Squircle corners">
          <Body>
            Every rounded surface in Stepwise uses a squircle rather than{' '}
            <Code>border-radius</Code>. A CSS radius is a circular arc, so curvature
            jumps from zero to full the moment the corner starts. A squircle is a
            superellipse: the curve eases in from the flat edge, which is what makes
            iOS icons and hardware look smoother than a plain rounded rectangle.
          </Body>
          <Body>
            The math is handled by{' '}
            <A href="https://github.com/JaceThings/Lisse">Lisse</A>, an MIT-licensed
            library by <A href="https://github.com/JaceThings">JaceThings</A> that
            generates the <Code>clip-path</Code> for smooth corners. We use its{' '}
            <Code>SmoothCorners</Code> component through a small internal wrapper called{' '}
            <Code>Surface</Code>, which sets our defaults and passes everything else
            through:
          </Body>
          <CodeBlock code={surfaceCode} lang="tsx" />
          <Body>
            <Strong>Smoothing is 0.6 across the library.</Strong> 0 is an ordinary
            circular corner and 1 is fully continuous; 0.6 is close to Apple&apos;s value
            and reads as intentional without looking soft. Components accept{' '}
            <Code>radius</Code> and <Code>smoothing</Code>, or a <Code>corners</Code>{' '}
            object when corners need to differ from each other.
          </Body>
          <Body>
            <Code>@lisse/react</Code> is installed automatically with the first
            component you add. If corners ever render square, that install is usually
            the reason.
          </Body>
        </Section>

        <Section id="vision" title="Where this is going">
          <Body>
            This is the first thing Stepwise Studio has put out in the open, and it came
            from the obvious place: we kept rebuilding the same components across client
            projects. More tools are coming from that same place, each one meant to
            stand on its own and to work well next to the others.
          </Body>
          <Body>
            Stepwise UI is MIT licensed and stays that way. Issues and pull requests are
            welcome on{' '}
            <A href="https://github.com/Stepwise-Studio/stepwise-ui">GitHub</A>, and if
            you build something with it we would like to see it.
          </Body>
        </Section>

        <Section id="next" title="Where to go next">
          <Body>
            <A href="/docs/quick-start">Quick Start</A> gets a project configured and a
            component on screen. <A href="/docs/cli">CLI</A> covers the commands and
            flags in full. Otherwise, pick anything from the sidebar - each component
            page has a live preview and its source.
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
