'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, type AnimationPlaybackControls } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Scroll01Icon } from '@hugeicons/core-free-icons'
import { Text } from '@/components/stepwise/typography'
import { cn } from '@/lib/utils/cn'

interface TocItem {
  id: string
  label: string
  child: boolean
}

// Scroll offset to account for sticky header / breathing room
const SCROLL_OFFSET = 48

export function OnThisPage({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const scrollAnimRef = useRef<AnimationPlaybackControls | null>(null)

  useEffect(() => {
    const ids = items.map(i => i.id)
    const visible = new Map<string, number>()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.boundingClientRect.top)
          } else {
            visible.delete(entry.target.id)
          }
        })

        if (visible.size === 0) return
        const topmost = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0]
        setActiveId(topmost)
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0 },
    )

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [items])

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()

    const target = document.getElementById(id)
    if (!target) return

    const from = window.scrollY
    const to = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET
    const goingDown = to > from

    // Cancel any in-progress scroll
    scrollAnimRef.current?.stop()

    scrollAnimRef.current = animate(from, to, {
      type: 'spring',
      // Direction-aware: going down feels deliberate, up feels snappy
      stiffness: goingDown ? 70 : 100,
      damping: goingDown ? 18 : 22,
      bounce: 0,
      onUpdate(v) {
        window.scrollTo(0, v)
      },
      onComplete() {
        // Sync active state immediately after landing
        setActiveId(id)
      },
    })
  }

  return (
    <div className="sticky top-20">
      <div className="flex items-center gap-1.5 mb-3">
        <HugeiconsIcon icon={Scroll01Icon} size={16} strokeWidth={2.2} color="currentColor" className="text-zinc-400 dark:text-zinc-500" />
        <Text variant="h6" as="p" className="text-zinc-400 dark:text-zinc-500">On this page</Text>
      </div>
      <ul className="flex flex-col">
        {items.map((s, i) => {
          const active = activeId === s.id
          const prevIsChild = i > 0 && items[i - 1].child
          const isGroupStart = s.child && !prevIsChild

          return (
            <li key={s.id} className={isGroupStart ? 'mt-0.5' : ''}>
              {s.child ? (
                <a
                  href={`#${s.id}`}
                  onClick={(e) => handleClick(e, s.id)}
                  className={cn(
                    'group flex items-center py-1 pl-3 border-l transition-colors duration-150',
                    active
                      ? 'border-sky-500'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600',
                  )}
                >
                  <Text
                    variant="detail"
                    as="span"
                    className={cn(
                      'transition-colors duration-150 tracking-wide',
                      active
                        ? 'text-sky-500'
                        : 'text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-200',
                    )}
                  >
                    {s.label}
                  </Text>
                </a>
              ) : (
                <a
                  href={`#${s.id}`}
                  onClick={(e) => handleClick(e, s.id)}
                  className="group flex items-center py-1 transition-colors duration-150"
                >
                  <Text
                    variant="detail"
                    as="span"
                    className={cn(
                      'transition-colors duration-150 tracking-wide font-medium',
                      active
                        ? 'text-sky-500'
                        : 'text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-200',
                    )}
                  >
                    {s.label}
                  </Text>
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
