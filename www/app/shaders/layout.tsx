import type { Metadata } from 'next'
import './shaders.css'

export const metadata: Metadata = {
  title: 'Shaders',
  description: 'Subtle shader veils for hero sections and footers.',
}

export default function ShadersLayout({ children }: { children: React.ReactNode }) {
  return <div className="shaders-root min-h-dvh">{children}</div>
}
