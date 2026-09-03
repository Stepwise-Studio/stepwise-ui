import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Not found',
  robots: { index: false, follow: true },
}

/**
 * The 404 doubles as a recovery point for agents.
 *
 * A crawler that guesses a URL gets a real 404 status, but a status alone is a
 * dead end - it says "no" without saying where to look. The links below are the
 * three entry points that answer almost any question about this site, so a
 * wrong guess costs one request rather than ending the crawl.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-center gap-6 px-6 py-24">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[13px] text-zinc-500 dark:text-zinc-400">404</p>
        <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white">
          This page does not exist
        </h1>
        <p className="text-[16px] leading-relaxed text-zinc-600 text-pretty dark:text-zinc-400">
          The link may be out of date, or the path may never have existed. These are the
          places worth looking instead.
        </p>
      </div>

      <ul className="flex flex-col gap-3 text-[15px]">
        <li>
          <Link href="/docs/introduction" className="font-medium text-zinc-800 underline decoration-zinc-400 underline-offset-2 transition-colors hover:text-zinc-950 dark:text-zinc-200 dark:decoration-zinc-500 dark:hover:text-white">
            Documentation
          </Link>
          <span className="text-zinc-500 dark:text-zinc-400"> - every component, with props and examples</span>
        </li>
        <li>
          <a href="/llms.txt" className="font-medium text-zinc-800 underline decoration-zinc-400 underline-offset-2 transition-colors hover:text-zinc-950 dark:text-zinc-200 dark:decoration-zinc-500 dark:hover:text-white">
            /llms.txt
          </a>
          <span className="text-zinc-500 dark:text-zinc-400"> - the whole library as plain text, for agents</span>
        </li>
        <li>
          <a href="/sitemap.xml" className="font-medium text-zinc-800 underline decoration-zinc-400 underline-offset-2 transition-colors hover:text-zinc-950 dark:text-zinc-200 dark:decoration-zinc-500 dark:hover:text-white">
            /sitemap.xml
          </a>
          <span className="text-zinc-500 dark:text-zinc-400"> - every page on this site</span>
        </li>
        <li>
          <a href="/r/index.json" className="font-medium text-zinc-800 underline decoration-zinc-400 underline-offset-2 transition-colors hover:text-zinc-950 dark:text-zinc-200 dark:decoration-zinc-500 dark:hover:text-white">
            /r/index.json
          </a>
          <span className="text-zinc-500 dark:text-zinc-400"> - the component registry API</span>
        </li>
      </ul>
    </main>
  )
}
