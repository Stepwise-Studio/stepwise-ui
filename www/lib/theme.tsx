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
      const x = e.clientX
      const y = e.clientY
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
            duration: 600,
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
