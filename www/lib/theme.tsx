'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggle: (e: React.MouseEvent) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  }, [])

  const toggle = useCallback(
    (e: React.MouseEvent) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark'

      /* The sweep should always start at the control that was pressed.
       * `clientX/clientY` are right for a mouse - the cursor is on the button
       * when it fires - but a touch-driven click can report coordinates that
       * are stale or zeroed, which starts the circle somewhere else entirely
       * (often the last place the screen was touched, or the top-left corner).
       * So the pointer position is used only when it actually falls inside the
       * control, and the control's own centre is the fallback. */
      const rect = (e.currentTarget as HTMLElement | null)?.getBoundingClientRect()
      let x = e.clientX
      let y = e.clientY
      const pointerOnControl =
        rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      if (!pointerOnControl && rect) {
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
      }

      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      const apply = () => {
        document.documentElement.classList.toggle('dark', next === 'dark')
        localStorage.setItem('theme', next)
        setTheme(next)
      }

      if (!('startViewTransition' in document)) {
        apply()
        return
      }

      // A full-page view transition is the most expensive thing this site does,
      // and a phone pays for it twice - once to snapshot, once to composite the
      // 600ms sweep. Shortening it on a touch device keeps the same gesture
      // without the drag. Reduced-motion skips the sweep altogether.
      const coarse = window.matchMedia('(pointer: coarse)').matches
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduced) {
        apply()
        return
      }

      const vt = (document as unknown as { startViewTransition: (fn: () => void) => { ready: Promise<void> } })
        .startViewTransition(apply)

      vt.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: coarse ? 420 : 600,
            easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
            pseudoElement: '::view-transition-new(root)',
            fill: 'forwards',
          },
        )
      })
    },
    [theme],
  )

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
