'use client'

import Link from 'next/link'
import type { ComponentType } from 'react'
import {
  HeroDrift,
  HeroHaze,
  HeroBloom,
  HeroTide,
  HeroMist,
  HeroHazeDark,
  HeroFilm,
  FooterFade,
  FooterRipple,
  FooterLattice,
  FooterTide,
  FooterDither,
  FooterFadeDark,
  FooterGrain,
} from '@/components/shaders'

type HeroDemo = {
  name: string
  Shader: ComponentType
  dark?: boolean
  title: string
  body: string
}

type FooterDemo = {
  name: string
  Shader: ComponentType
  dark?: boolean
}

const HEROES: HeroDemo[] = [
  { name: 'HeroHaze', Shader: HeroHaze, title: 'Ship faster with less noise.', body: 'Cool mesh gradient — good for product and SaaS heroes.' },
  { name: 'HeroDrift', Shader: HeroDrift, title: 'Warmth you can feel.', body: 'Grain wave in terracotta tones — editorial and lifestyle.' },
  { name: 'HeroBloom', Shader: HeroBloom, title: 'Light from above.', body: 'Radial bloom in amber — launches and announcements.' },
  { name: 'HeroTide', Shader: HeroTide, title: 'Calm horizontal motion.', body: 'Wave lines — fintech, wellness, anything restrained.' },
  { name: 'HeroMist', Shader: HeroMist, title: 'Rays through the room.', body: 'God rays from the corner — photography and craft brands.' },
  { name: 'HeroFilm', Shader: HeroFilm, title: 'Texture without noise.', body: 'Film grain corners — minimal portfolios and studios.' },
  { name: 'HeroHazeDark', Shader: HeroHazeDark, dark: true, title: 'Built for the dark.', body: 'Violet and cyan mesh — dev tools and night-mode products.' },
]

const FOOTERS: FooterDemo[] = [
  { name: 'FooterFade', Shader: FooterFade },
  { name: 'FooterRipple', Shader: FooterRipple },
  { name: 'FooterLattice', Shader: FooterLattice },
  { name: 'FooterTide', Shader: FooterTide },
  { name: 'FooterGrain', Shader: FooterGrain },
  { name: 'FooterDither', Shader: FooterDither, dark: true },
  { name: 'FooterFadeDark', Shader: FooterFadeDark, dark: true },
]

function HeroSection({ demo }: { demo: HeroDemo }) {
  const { Shader, dark, title, body, name } = demo
  return (
    <section className={`sh-hero ${dark ? 'sh-hero--dark' : ''}`} style={{ background: dark ? '#09090b' : '#fafaf9' }}>
      <Shader />
      <div className="sh-hero-inner">
        <h2>{title}</h2>
        <p>{body}</p>
        <div className="sh-hero-actions">
          <button type="button" className="sh-btn">Get started</button>
          <button type="button" className="sh-btn sh-btn--ghost">Learn more</button>
        </div>
      </div>
      <span className={`sh-label ${dark ? 'sh-label--dark' : ''}`}>{name}</span>
    </section>
  )
}

function FooterSection({ demo }: { demo: FooterDemo }) {
  const { Shader, dark, name } = demo
  return (
    <>
      <div className="sh-page-stub">↑ page content above</div>
      <footer className={`sh-footer ${dark ? 'sh-footer--dark' : ''}`} style={{ background: dark ? '#09090b' : '#fafaf9' }}>
        <Shader />
        <div className="sh-footer-inner">
          <p>© 2026 Stepwise</p>
          <ul className="sh-footer-links">
            <li><a href="#">Docs</a></li>
            <li><a href="#">GitHub</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <span className={`sh-label ${dark ? 'sh-label--dark' : ''}`}>{name}</span>
      </footer>
    </>
  )
}

export default function ShadersPage() {
  return (
    <>
      <a href="#content" className="sh-skip">Skip to content</a>

      <nav className="sh-nav">
        <Link href="/">← Stepwise UI</Link>
        <span style={{ color: '#a3a3a3' }}>Shader previews</span>
      </nav>

      <main id="content" style={{ paddingTop: '3rem' }}>
        <p className="sh-divider">Hero sections — scroll</p>
        {HEROES.map(d => (
          <HeroSection key={d.name} demo={d} />
        ))}

        <p className="sh-divider">Footers — scroll</p>
        {FOOTERS.map(d => (
          <FooterSection key={d.name} demo={d} />
        ))}
      </main>
    </>
  )
}
