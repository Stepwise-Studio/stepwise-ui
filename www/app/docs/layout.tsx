import { SidebarNav } from '@/components/stepwise/docs/sidebar-nav'
import { ScrollArea } from '@/components/stepwise/scroll-area'
import { DocsHeader } from '@/components/stepwise/docs/docs-header'
import { Toaster } from '@/components/stepwise/toast'
import { docsNav } from '@/components/stepwise/docs/nav'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <DocsHeader sections={docsNav} />

      <div className="max-w-[1400px] mx-auto flex min-h-[calc(100vh-56px)]">
        {/* Sidebar — hidden on mobile, visible on md+ */}
        <aside className="hidden md:block w-56 shrink-0 border-r border-zinc-100 dark:border-zinc-900 sticky top-14 h-[calc(100vh-56px)]">
          <ScrollArea axis="y" showScrollbar className="flex flex-col gap-8 px-4 py-8">
            <SidebarNav sections={docsNav} />
          </ScrollArea>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 md:px-10 py-12">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}
