import { Text } from '@/components/stepwise/typography'
import { CodeBlock, InlineInstall } from '@/components/stepwise/docs/code-block'
import { A } from '@/components/stepwise/docs/prose'
import { CssClassesTable } from '@/components/stepwise/docs/css-classes-table'
import { OnThisPage } from '@/components/stepwise/docs/on-this-page'
import { Surface } from '@/components/stepwise/primitives/surface'

/* ─── data ─────────────────────────────────────────────────────────────── */

const variantMeta = [
  { name: 'hero',          el: 'h1',   classes: 'text-[36px] md:text-[48px] lg:text-[64px] font-semibold tracking-[-0.03em] leading-none text-balance',    preview: 'Consistent by default' },
  { name: 'headline',      el: 'h1',   classes: 'text-[28px] md:text-[38px] lg:text-[48px] font-semibold tracking-[-0.03em] leading-none text-balance',    preview: 'Consistent by default' },
  { name: 'h1',            el: 'h1',   classes: 'text-[26px] md:text-[30px] lg:text-[36px] font-semibold tracking-[-0.03em] leading-tight text-balance',   preview: 'Consistent by default' },
  { name: 'h1-soft',       el: 'h1',   classes: 'text-[26px] md:text-[30px] lg:text-[36px] font-medium   tracking-[-0.03em] leading-tight text-balance',   preview: 'Consistent by default' },
  { name: 'h2',            el: 'h2',   classes: 'text-[22px] md:text-[26px] lg:text-[30px] font-semibold tracking-[-0.03em] leading-tight text-balance',   preview: 'Consistent by default' },
  { name: 'h2-soft',       el: 'h2',   classes: 'text-[22px] md:text-[26px] lg:text-[30px] font-medium   tracking-[-0.03em] leading-tight text-balance',   preview: 'Consistent by default' },
  { name: 'h3',            el: 'h3',   classes: 'text-[20px] md:text-[22px] lg:text-[24px] font-semibold tracking-[-0.03em] leading-snug  text-balance',   preview: 'Consistent by default' },
  { name: 'h3-soft',       el: 'h3',   classes: 'text-[20px] md:text-[22px] lg:text-[24px] font-medium   tracking-[-0.03em] leading-snug  text-balance',   preview: 'Consistent by default' },
  { name: 'h4',            el: 'h4',   classes: 'text-[18px] md:text-[20px] font-semibold tracking-[-0.03em] leading-snug  text-balance',                  preview: 'Consistent by default' },
  { name: 'h4-soft',       el: 'h4',   classes: 'text-[18px] md:text-[20px] font-medium   tracking-[-0.03em] leading-snug  text-balance',                  preview: 'Consistent by default' },
  { name: 'h5',            el: 'h5',   classes: 'text-[16px] md:text-[18px] font-semibold tracking-[-0.03em] leading-snug  text-balance',                  preview: 'Consistent by default' },
  { name: 'h5-soft',       el: 'h5',   classes: 'text-[16px] md:text-[18px] font-medium   tracking-[-0.03em] leading-snug  text-balance',                  preview: 'Consistent by default' },
  { name: 'h6',            el: 'h6',   classes: 'text-[15px] md:text-[16px] font-semibold tracking-[-0.03em] leading-normal text-balance',                 preview: 'Consistent by default' },
  { name: 'h6-soft',       el: 'h6',   classes: 'text-[15px] md:text-[16px] font-medium   tracking-[-0.03em] leading-normal text-balance',                 preview: 'Consistent by default' },
  { name: 'body',          el: 'p',    classes: 'text-[16px] font-semibold tracking-[-0.02em] leading-relaxed text-pretty',                                 preview: 'Consistent by default' },
  { name: 'body-soft',     el: 'p',    classes: 'text-[16px] font-normal   tracking-[-0.02em] leading-relaxed text-pretty',                                 preview: 'Consistent by default' },
  { name: 'detail',        el: 'p',    classes: 'text-[14px] font-normal   tracking-normal  leading-relaxed text-pretty',                                   preview: 'Consistent by default' },
  { name: 'caption',       el: 'span', classes: 'text-[13px] font-medium   tracking-normal  leading-normal  text-pretty',                                   preview: 'Consistent by default' },
  { name: 'caption-soft',  el: 'span', classes: 'text-[13px] font-normal   tracking-normal  leading-normal  text-pretty',                                   preview: 'Consistent by default' },
  { name: 'mono',          el: 'code', classes: 'text-[14px] font-normal   tracking-normal  leading-relaxed [font-family:var(--font-geist-mono,monospace)]', preview: 'Consistent by default' },
] as const

type Variant = typeof variantMeta[number]['name']

function parseMeta(classes: string) {
  // Extract all responsive sizes; show the largest (desktop canonical) as the reference
  const sizes = [...classes.matchAll(/text-\[(\d+)px\]/g)].map(m => m[1] + 'px')
  const size = sizes[sizes.length - 1] ?? '-'
  const fontMap: Record<string, string> = { semibold: 'Semibold', medium: 'Medium', normal: 'Regular' }
  const weight = fontMap[classes.match(/font-(\w+)/)?.[1] ?? ''] ?? ''
  return `${size} / ${weight}`
}

/* ─── code snippets ─────────────────────────────────────────────────────── */

const importCode = `import { Text } from '@/components/stepwise/typography'`

const headingsCode = `<Text variant="h1">Consistent by default</Text>
<Text variant="h2">Ship faster, look better</Text>
<Text variant="h3">Every detail matters</Text>`

const softCode = `{/* SemiBold - default emphasis */}
<Text variant="h2">Consistent by design</Text>

{/* Medium - reduced weight, same size */}
<Text variant="h2-soft">Consistent by design</Text>`

const bodyCode = `{/* SemiBold body - for emphasis in copy */}
<Text variant="body">
  Stepwise UI gives you a consistent type scale.
</Text>

{/* Regular body - default reading weight */}
<Text variant="body-soft">
  Stepwise UI gives you a consistent type scale.
</Text>

{/* 14px supporting text */}
<Text variant="detail">
  Supporting copy and secondary information.
</Text>`

const labelsCode = `<Text variant="caption">Labels, metadata, timestamps</Text>
<Text variant="caption-soft">Secondary label text</Text>`

const monoCode = `<Text variant="mono">const stepwise = () =&gt; "consistent"</Text>`

const asPropCode = `{/* Visual h1 style on a semantic h2 - correct for SEO */}
<Text variant="h1" as="h2">Page section title</Text>

{/* Styled timestamp with correct semantic element */}
<Text variant="caption" as="time" dateTime="2025-01-01">
  Jan 1, 2025
</Text>

{/* Form label with correct semantic element */}
<Text variant="body-soft" as="label" htmlFor="email">
  Email address
</Text>`

const typeDefinitionCode = `type TypographyVariant =
  | 'hero'     | 'headline'
  | 'h1'       | 'h1-soft'
  | 'h2'       | 'h2-soft'
  | 'h3'       | 'h3-soft'
  | 'h4'       | 'h4-soft'
  | 'h5'       | 'h5-soft'
  | 'h6'       | 'h6-soft'
  | 'body'     | 'body-soft'
  | 'detail'
  | 'caption'  | 'caption-soft'
  | 'mono'`

const onThisPage = [
  { id: 'installation',     label: 'Installation',    child: false },
  { id: 'font',             label: 'The font',        child: false },
  { id: 'import',           label: 'Import',          child: false },
  { id: 'type-scale',       label: 'Type scale',      child: false },
  { id: 'usage',            label: 'Usage',           child: false },
  { id: 'usage-headings',   label: 'Headings',        child: true  },
  { id: 'usage-soft',       label: 'Soft weight',     child: true  },
  { id: 'usage-body',       label: 'Body text',       child: true  },
  { id: 'usage-labels',     label: 'Labels',          child: true  },
  { id: 'usage-mono',       label: 'Monospace',       child: true  },
  { id: 'usage-as',         label: 'as prop',         child: true  },
  { id: 'css-classes',      label: 'CSS classes',     child: false },
  { id: 'default-elements', label: 'Default elements',child: false },
  { id: 'api',              label: 'API reference',   child: false },
]

/* ─── sub-components ────────────────────────────────────────────────────── */

function Preview({ children }: { children: React.ReactNode }) {
  return (
    <Surface
      corners={{
        topLeft: { radius: 24, smoothing: 0.6 },
        topRight: { radius: 24, smoothing: 0.6 },
        bottomLeft: 0,
        bottomRight: 0,
      }}
      className="px-5 md:px-8 py-8 md:py-10 bg-zinc-50 dark:bg-zinc-950 overflow-hidden"
    >
      {children}
    </Surface>
  )
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Text variant="h3" as="h2" id={id} className="mb-4 scroll-mt-20">
      {children}
    </Text>
  )
}

/* ─── page ──────────────────────────────────────────────────────────────── */

const fontSetupCode = `/* globals.css */
@import "tailwindcss";
@import "../components/stepwise/fonts.css";

:root {
  --font-sans: "Inter Display", ui-sans-serif, system-ui, sans-serif;
}`

const fontSwapCode = `/* Your own family - no Stepwise font needed */
:root {
  --font-sans: "Your Typeface", ui-sans-serif, system-ui, sans-serif;
}

/* The scale's tracking assumes Inter Display's tight spacing.
   On a wider face, dial it back: */
.text-balance { letter-spacing: -0.01em; }`

export default function TypographyPage() {
  return (
    <div className="flex gap-12">
      {/* ── content ── */}
      <div className="flex-1 min-w-0">

        {/* Header */}
        <div className="mb-10">
          <Text variant="headline" as="h1" className="mb-4">Typography</Text>
          <Text variant="h5-soft" as="p" className="text-zinc-500 text-pretty">
            A semantic type scale built on Inter Display. Every variant locks in size, weight,
            letter spacing, and line height - no decisions needed at the call site.
          </Text>
        </div>

        {/* Installation */}
        <section className="mb-12">
          <SectionHeading id="installation">Installation</SectionHeading>
          <InlineInstall command="npx stepwise-ui add typography" />
          <p className="mt-4 text-[15px] leading-relaxed text-zinc-500 text-pretty dark:text-zinc-400">
            This brings the typeface too. Four weights of{' '}
            <A href="https://rsms.me/inter/">Inter Display</A> - 400, 500, 600, 700 - land in{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">fonts/</code>,
            with the <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">@font-face</code>{' '}
            rules in{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">components/stepwise/fonts.css</code>{' '}
            and Inter&apos;s OFL licence alongside them. The scale is drawn against this
            family - its{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">-0.03em</code>{' '}
            tracking assumes Inter Display&apos;s tight default spacing.
          </p>
        </section>

        {/* Font */}
        <section className="mb-12">
          <SectionHeading id="font">The font</SectionHeading>
          <p className="mb-4 text-[15px] leading-relaxed text-zinc-500 text-pretty dark:text-zinc-400">
            Two lines wire it up. Import the face rules, then point Tailwind&apos;s sans
            stack at the family:
          </p>
          <CodeBlock code={fontSetupCode} lang="css" />
          <p className="mt-6 mb-4 text-[15px] leading-relaxed text-zinc-500 text-pretty dark:text-zinc-400">
            <strong className="font-medium text-zinc-700 dark:text-zinc-200">Using a different
            typeface instead:</strong> skip both lines and delete{' '}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">fonts/</code>.
            Nothing in the library hard-codes a family - every component inherits whatever
            your page sets, so your own type flows through the same scale untouched. Only the
            tracking is tuned for Inter Display; on a wider face, relax it:
          </p>
          <CodeBlock code={fontSwapCode} lang="css" />
        </section>

        {/* Import */}
        <section className="mb-12">
          <SectionHeading id="import">Import</SectionHeading>
          <CodeBlock code={importCode} lang="tsx" />
        </section>

        {/* Type scale */}
        <section className="mb-12">
          <SectionHeading id="type-scale">Type scale</SectionHeading>
          <Surface radius={24} lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' } }} className="overflow-hidden">
            <div className="grid grid-cols-[110px_1fr] md:grid-cols-[160px_1fr] px-4 md:px-6 py-3 bg-zinc-900 dark:bg-zinc-100">
              <Text variant="body" as="span" className="text-zinc-200 dark:text-zinc-800 font-semibold">Variant</Text>
              <Text variant="body" as="span" className="text-zinc-200 dark:text-zinc-800 font-semibold">Preview</Text>
            </div>
            {variantMeta.map((v, i) => (
              <div
                key={v.name}
                className={`grid grid-cols-[110px_1fr] md:grid-cols-[160px_1fr] items-center px-4 md:px-6 py-5 ${
                  i % 2 === 0 ? 'bg-zinc-100 dark:bg-zinc-900' : 'bg-zinc-200/60 dark:bg-zinc-800/60'
                } ${i < variantMeta.length - 1 ? 'border-b border-zinc-200/80 dark:border-zinc-700/50' : ''}`}
              >
                <div className="flex flex-col shrink-0">
                  <Text variant="body" as="span" className="font-bold text-zinc-700 dark:text-zinc-300">{v.name}</Text>
                  <Text variant="detail" as="span" className="tracking-normal text-zinc-500 dark:text-zinc-600">{parseMeta(v.classes)}</Text>
                </div>
                <div className="min-w-0">
                  <Text variant={v.name as Variant} className="text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    {v.preview}
                  </Text>
                </div>
              </div>
            ))}
          </Surface>
        </section>

        {/* Usage */}
        <section className="mb-12">
          <SectionHeading id="usage">Usage</SectionHeading>

          {/* Headings */}
          <Text variant="h5-soft" as="h3" id="usage-headings" className="text-zinc-500 dark:text-zinc-400 mb-3 mt-8 scroll-mt-20">Headings</Text>
          <Preview>
            <div className="flex flex-col text-zinc-700 dark:text-zinc-300 gap-4">
              <Text variant="h1">Consistent by default</Text>
              <Text variant="h2">Ship faster, look better</Text>
              <Text variant="h3">Every detail matters</Text>
            </div>
          </Preview>
          <CodeBlock code={headingsCode} lang="tsx" className="rounded-b-3xl" flat />

          {/* Soft weight */}
          <Text variant="h5-soft" as="h3" id="usage-soft" className="text-zinc-500 dark:text-zinc-400 mb-1 mt-8 scroll-mt-20">Soft weight</Text>
          <Text variant="h6-soft" as="p" className="text-zinc-500 dark:text-zinc-600 mb-4">
            Every heading has a <span className="text-zinc-700 dark:text-zinc-300 font-medium">-soft</span> counterpart at medium (500) weight instead of semibold (600). Same size, lighter feel.
          </Text>
          <Preview>
            <div className="flex flex-col text-zinc-700 dark:text-zinc-300 gap-3">
              <Text variant="h2">SemiBold - default weight</Text>
              <Text variant="h2-soft">Medium - reduced weight</Text>
            </div>
          </Preview>
          <CodeBlock code={softCode} lang="tsx" className="rounded-b-3xl" flat />

          {/* Body text */}
          <Text variant="h5-soft" as="h3" id="usage-body" className="text-zinc-500 dark:text-zinc-400 mb-3 mt-8 scroll-mt-20">Body text</Text>
          <Preview>
            <div className="flex flex-col gap-5">
              <div>
                <Text variant="caption" as="p" className="text-zinc-500 dark:text-zinc-600 mb-1">body</Text>
                <Text variant="body">Stepwise UI gives you a consistent type scale with zero decisions at the call site.</Text>
              </div>
              <div>
                <Text variant="caption" as="p" className="text-zinc-500 dark:text-zinc-600 mb-1">body-soft</Text>
                <Text variant="body-soft">Stepwise UI gives you a consistent type scale with zero decisions at the call site.</Text>
              </div>
              <div>
                <Text variant="caption" as="p" className="text-zinc-500 dark:text-zinc-600 mb-1">detail</Text>
                <Text variant="detail">Supporting copy, descriptions, and secondary information in your UI.</Text>
              </div>
            </div>
          </Preview>
          <CodeBlock code={bodyCode} className="rounded-b-3xl" lang="tsx" flat />

          {/* Labels */}
          <Text variant="h5-soft" as="h3" id="usage-labels" className="text-zinc-500 dark:text-zinc-400 mb-3 mt-8 scroll-mt-20">Labels</Text>
          <Preview>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-6">
                <Text variant="caption" as="span">caption</Text>
                <Text variant="caption-soft" as="span">caption-soft</Text>
              </div>
            </div>
          </Preview>
          <CodeBlock code={labelsCode} className="rounded-b-3xl" lang="tsx" flat />

          {/* Monospace */}
          <Text variant="h5-soft" as="h3" id="usage-mono" className="text-zinc-500 dark:text-zinc-400 mb-3 mt-8 scroll-mt-20">Monospace</Text>
          <Text variant="body-soft" as="p" className="text-zinc-500 mb-4">
            Uses Geist Mono. Renders as <span className="text-zinc-700 dark:text-zinc-300 font-medium">&lt;code&gt;</span> by default.
          </Text>
          <Preview>
            <Text variant="mono">const stepwise = () =&gt; &quot;consistent&quot;</Text>
          </Preview>
          <CodeBlock code={monoCode} className="rounded-b-3xl" lang="tsx" flat />

          {/* as prop */}
          <Text variant="h5-soft" as="h3" id="usage-as" className="text-zinc-500 dark:text-zinc-400 mb-3 mt-8 scroll-mt-20">
            The <span className="font-mono text-violet-400 text-[18px]">as</span> prop
          </Text>
          <Text variant="body-soft" as="p" className="text-zinc-500 mb-4">
            Separates visual style from semantic HTML. Use it to keep your heading hierarchy correct for SEO and screen readers without sacrificing design - a common need when one section visually calls for an h1 but structurally should be an h2.
          </Text>
          <Preview>
            <div className="flex flex-col gap-4">
              <Text variant="h1" as="h2">Visual h1, semantic h2</Text>
              <div className="flex items-center gap-4">
                <Text variant="caption" as="time">Jan 1, 2025</Text>
                <Text variant="body-soft" as="label" className="cursor-pointer">Email address</Text>
              </div>
            </div>
          </Preview>
          <CodeBlock code={asPropCode} className="rounded-b-3xl" lang="tsx" flat />
        </section>

        {/* CSS Classes */}
        <section className="mb-12">
          <SectionHeading id="css-classes">CSS classes</SectionHeading>
          <Text variant="body-soft" as="p" className="text-zinc-500 mb-6">
            The exact Tailwind classes applied per variant. Use them directly when you need the style without the component.
          </Text>
          <CssClassesTable rows={variantMeta.map(v => ({ name: v.name, classes: v.classes }))} />
        </section>

        {/* Default elements */}
        <section className="mb-12">
          <SectionHeading id="default-elements">Default elements</SectionHeading>
          <Text variant="body-soft" as="p" className="text-zinc-500 mb-6">
            The HTML element each variant renders when no <Text variant="mono" as="code" className="text-[13px] text-violet-400 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded">as</Text> prop is provided.
          </Text>
          <Surface radius={24} lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' } }} className="overflow-hidden">
            <div className="grid grid-cols-[110px_1fr] md:grid-cols-[160px_1fr] px-4 md:px-6 py-3 bg-zinc-900 dark:bg-zinc-100">
              <Text variant="body" as="span" className="text-zinc-200 dark:text-zinc-800 font-semibold">Variant</Text>
              <Text variant="body" as="span" className="text-zinc-200 dark:text-zinc-800 font-semibold">Element</Text>
            </div>
            {variantMeta.map((v, i) => (
              <div
                key={v.name}
                className={`grid grid-cols-[110px_1fr] md:grid-cols-[160px_1fr] items-center px-4 md:px-6 py-3 ${
                  i % 2 === 0 ? 'bg-zinc-100 dark:bg-zinc-900' : 'bg-zinc-200/60 dark:bg-zinc-800/60'
                } ${i < variantMeta.length - 1 ? 'border-b border-zinc-200/80 dark:border-zinc-700/50' : ''}`}
              >
                <Text variant="mono" as="code" className="text-zinc-500 dark:text-zinc-400">{v.name}</Text>
                <Text variant="mono" as="code" className="text-violet-400">&lt;{v.el}&gt;</Text>
              </div>
            ))}
          </Surface>
        </section>

        {/* API Reference */}
        <section className="mb-12">
          <SectionHeading id="api">API reference</SectionHeading>

          {/* Type definition */}
          <Text variant="h5-soft" as="h3" className="text-zinc-500 dark:text-zinc-400 mb-3">TypographyVariant</Text>
          <CodeBlock code={typeDefinitionCode} className="rounded-3xl" lang="ts" />

          {/* Props table */}
          <Text variant="h5-soft" as="h3" className="text-zinc-500 dark:text-zinc-400 mb-3 mt-8">Props</Text>
          <Surface radius={24} lisse={{ middleBorder: { width: 1, opacity: 1, color: 'var(--ui-border, rgb(138 138 141 / 0.23))' } }} className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-[120px_1fr_100px_80px] gap-4 px-6 py-3 bg-zinc-900 dark:bg-zinc-100">
                {['Prop', 'Type', 'Default', 'Required'].map(h => (
                  <Text key={h} variant="body" as="span" className="text-zinc-200 dark:text-zinc-800 font-semibold">{h}</Text>
                ))}
              </div>
              {[
                {
                  prop: 'variant',
                  type: 'TypographyVariant',
                  typeColor: 'text-amber-400',
                  default: '"body"',
                  required: false,
                  desc: 'Visual style to apply. Maps to size, weight, tracking, and line height.',
                },
                {
                  prop: 'as',
                  type: 'ElementType',
                  typeColor: 'text-violet-400',
                  default: 'per variant',
                  required: false,
                  desc: 'HTML element to render. Overrides the default without changing the visual style - essential for correct heading hierarchy and semantic markup.',
                },
                {
                  prop: 'children',
                  type: 'ReactNode',
                  typeColor: 'text-violet-400',
                  default: '-',
                  required: false,
                  desc: 'Content to render inside the element.',
                },
                {
                  prop: 'className',
                  type: 'string',
                  typeColor: 'text-sky-400',
                  default: '-',
                  required: false,
                  desc: 'Additional Tailwind classes merged via cn(). Applied after variant classes - use to override color, margin, or width.',
                },
                {
                  prop: '...rest',
                  type: 'HTMLAttributes',
                  typeColor: 'text-violet-400',
                  default: '-',
                  required: false,
                  desc: 'Any valid HTML attribute for the rendered element (id, onClick, data-*, aria-*, etc.).',
                },
              ].map((row, i, arr) => (
                <div key={row.prop} className={`px-6 py-4 ${i % 2 === 0 ? 'bg-zinc-100 dark:bg-zinc-900' : 'bg-zinc-200/60 dark:bg-zinc-800/60'} ${i < arr.length - 1 ? 'border-b border-zinc-200/80 dark:border-zinc-700/50' : ''}`}>
                  <div className="grid grid-cols-[120px_1fr_100px_80px] gap-4 items-start">
                    <Text variant="mono" as="code" className="text-[12px] text-zinc-800 dark:text-zinc-100">{row.prop}</Text>
                    <Text variant="mono" as="code" className={`text-[12px] ${row.typeColor}`}>{row.type}</Text>
                    <Text variant="mono" as="code" className="text-[12px] text-zinc-500">{row.default}</Text>
                    <Text variant="caption-soft" as="span" className="text-zinc-500 dark:text-zinc-600">{row.required ? 'Yes' : 'No'}</Text>
                  </div>
                  <Text variant="detail" as="p" className="text-zinc-500 mt-2 col-span-4">{row.desc}</Text>
                </div>
              ))}
            </div>
          </Surface>
        </section>
      </div>

      {/* ── On this page ── */}
      <aside className="w-44 shrink-0 hidden xl:block">
        <OnThisPage items={onThisPage} />
      </aside>
    </div>
  )
}
