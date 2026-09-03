import { SidebarNav } from '@/components/stepwise/docs/sidebar-nav'
import { ScrollArea } from '@/components/stepwise/scroll-area'
import { DocsHeader } from '@/components/stepwise/docs/docs-header'
import { Toaster } from '@/components/stepwise/toast'
import { docsNav } from '@/components/stepwise/docs/nav'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <DocsHeader sections={docsNav} />

      {/* No header strip on mobile any more (see `DocsHeader`), so its
          64px only needs subtracting from the desktop min-height. */}
      <div className="max-w-[1400px] mx-auto flex min-h-screen md:min-h-[calc(100vh-64px)]">
        {/* Sidebar - hidden on mobile, visible on md+ */}
        <aside className="hidden md:block w-56 shrink-0 border-r border-zinc-100 dark:border-zinc-900 sticky top-16 h-[calc(100vh-64px)]">
          <ScrollArea axis="y" showScrollbar className="flex flex-col gap-8 px-4 py-8">
            <SidebarNav sections={docsNav} />
          </ScrollArea>
        </aside>

        {/* Main content - `MobileTopBar` is `sticky`, so (unlike the
            floating icons it replaced) it already reserves its own space
            in flow; only the bottom needs extra padding, clearing the
            fixed `MobileBottomNav` bar (~48px pill + 16px gap + safe-area).
            Not needed at `md`, where the real sticky header reserves its
            own space and there's no bottom bar at all. */}
        <main className="flex-1 min-w-0 px-4 pb-28 pt-12 md:px-10 md:py-12">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}
