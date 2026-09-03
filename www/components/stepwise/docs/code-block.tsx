import { codeToHtml } from 'shiki'
import { CopyButton } from './copy-button'
import { Surface } from '@/components/stepwise/primitives/surface'
import { cn } from '@/lib/utils/cn'

interface CodeBlockProps {
  code: string
  lang?: string
  copyable?: boolean
  flat?: boolean
  className?: string
}

export async function CodeBlock({ code, lang = 'tsx', copyable = true, flat = false, className }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  })

  return (
    <Surface
      // A stable hook for containers that want to own the code background
      // themselves - see PreviewCode, which paints it on the full-height panel
      // so a short snippet doesn't leave a bare strip underneath.
      data-code-block=""
      corners={flat ? {
        topLeft: 0, topRight: 0,
        bottomLeft: { radius: 24, smoothing: 0.6 },
        bottomRight: { radius: 24, smoothing: 0.6 },
      } : { radius: 24, smoothing: 0.6 }}
      className={cn(
        'relative group overflow-hidden bg-zinc-100/80 dark:bg-zinc-900/70',
        className,
      )}
    >
      {copyable && (
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-[150ms]">
          <CopyButton text={code} />
        </div>
      )}
      <div
        className="overflow-x-auto [scrollbar-width:thin] [scrollbar-color:theme(colors.zinc.300/50)_transparent] dark:[scrollbar-color:theme(colors.zinc.600/40)_transparent] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300/50 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600/40 px-5 py-4 text-[14px] leading-relaxed [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Surface>
  )
}

/**
 * A one-line install command.
 *
 * Highlighted by hand rather than through Shiki: these are always the same
 * shape (`npx <bin> <verb> <args>`), and a real bash grammar renders every
 * token the same colour anyway, which is why this read as flat text before.
 * The runner and the subcommand are what people scan for, so those are the
 * parts that get colour.
 */
export function InlineInstall({ command }: { command: string }) {
  const [runner, bin, verb, ...args] = command.split(' ')
  return (
    <Surface radius={20} className="flex items-center justify-between gap-4 bg-zinc-100/80 dark:bg-zinc-900/70 px-5 py-3.5">
      <span className="min-w-0 truncate text-[14px] font-mono">
        <span className="text-violet-600 dark:text-violet-400">{runner}</span>{' '}
        <span className="text-zinc-800 dark:text-zinc-200">{bin}</span>
        {verb && <>{' '}<span className="text-sky-600 dark:text-sky-400">{verb}</span></>}
        {args.length > 0 && (
          <>{' '}<span className="text-zinc-500 dark:text-zinc-400">{args.join(' ')}</span></>
        )}
      </span>
      <CopyButton text={command} className="shrink-0" />
    </Surface>
  )
}
