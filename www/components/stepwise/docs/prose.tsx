import { Text } from '@/components/stepwise/typography'

/** Shared building blocks for the prose-heavy Getting Started pages. */

export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 flex flex-col gap-4">
      <Text variant="h3" className="text-zinc-900 dark:text-white">{title}</Text>
      {children}
    </section>
  )
}

export function Body({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="body-soft" className="text-zinc-600 dark:text-zinc-400 text-pretty">
      {children}
    </Text>
  )
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] dark:bg-zinc-800">{children}</code>
  )
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-medium text-zinc-900 dark:text-zinc-200">{children}</strong>
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      // A step brighter than the body text it sits in, with an underline at
      // least as visible as the text. Previously it inherited body colour and
      // drew the underline dimmer than the glyphs, so links read as emphasis
      // rather than as something clickable.
      className="font-medium text-zinc-800 underline decoration-zinc-400 underline-offset-2 transition-colors hover:text-zinc-950 hover:decoration-zinc-600 dark:text-zinc-200 dark:decoration-zinc-500 dark:hover:text-white dark:hover:decoration-zinc-300"
    >
      {children}
    </a>
  )
}

export function PageHeader({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <Text variant="headline" className="text-zinc-900 dark:text-white">{title}</Text>
      <Text variant="h5-soft" className="text-zinc-500 dark:text-zinc-400 text-pretty">
        {children}
      </Text>
    </div>
  )
}
