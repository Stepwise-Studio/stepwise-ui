import Link from 'next/link'
import { HomeHero } from '@/components/home/hero'
import { HomeCanvas } from '@/components/home/canvas'

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <HomeHero />
      <HomeCanvas />

      {/* footer strip */}
      <footer className="border-t border-zinc-200/70 dark:border-zinc-800/70">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-3 px-5 py-8 text-[13px] text-zinc-400 sm:flex-row md:px-8 dark:text-zinc-500">
          <span>Built with obsession — Stepwise UI</span>
          <div className="flex items-center gap-5">
            <Link href="/docs/typography" className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-200">Docs</Link>
            <Link href="/docs/button" className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-200">Components</Link>
            <span className="hidden select-none text-zinc-300 md:inline dark:text-zinc-700" title="↑↑↓↓←→←→BA">
              psst — ↑↑↓↓←→←→BA
            </span>
          </div>
        </div>
      </footer>
    </main>
  )
}
