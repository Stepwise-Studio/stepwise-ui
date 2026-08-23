import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Geist_Mono, Special_Elite } from 'next/font/google'
import { ThemeProvider } from '@/lib/theme'
import './globals.css'

const interDisplay = localFont({
  src: [
    { path: './fonts/InterDisplay-Regular.woff2',         weight: '400', style: 'normal' },
    { path: './fonts/InterDisplay-Italic.woff2',          weight: '400', style: 'italic' },
    { path: './fonts/InterDisplay-Medium.woff2',          weight: '500', style: 'normal' },
    { path: './fonts/InterDisplay-MediumItalic.woff2',    weight: '500', style: 'italic' },
    { path: './fonts/InterDisplay-SemiBold.woff2',        weight: '600', style: 'normal' },
    { path: './fonts/InterDisplay-SemiBoldItalic.woff2',  weight: '600', style: 'italic' },
    { path: './fonts/InterDisplay-Bold.woff2',            weight: '700', style: 'normal' },
    { path: './fonts/InterDisplay-BoldItalic.woff2',      weight: '700', style: 'italic' },
    { path: './fonts/InterDisplay-ExtraBold.woff2',       weight: '800', style: 'normal' },
    { path: './fonts/InterDisplay-ExtraBoldItalic.woff2', weight: '800', style: 'italic' },
    { path: './fonts/InterDisplay-Black.woff2',           weight: '900', style: 'normal' },
    { path: './fonts/InterDisplay-BlackItalic.woff2',     weight: '900', style: 'italic' },
  ],
  variable: '--font-inter-display',
  display: 'swap',
  // Pins the metrics every engine uses to compute line-height:1 positioning.
  // Without this, Gecko and Blink can read different internal tables (hhea vs
  // OS/2) from the same font file and place tight-leading text a few px apart
  // — e.g. icon+label rows in Button looking vertically off in Firefox-family
  // browsers but fine in Chromium. Values read directly from the actual font
  // file (fontkit) rather than assumed, so both engines now agree exactly.
  declarations: [
    { prop: 'ascent-override', value: '96.875%' },
    { prop: 'descent-override', value: '24.121%' },
    { prop: 'line-gap-override', value: '0%' },
  ],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

// Classic distressed typewriter face — used by the Retro Typewriter component.
const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-typewriter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Stepwise UI',
  description: 'A premium component library for React',
}

/* Runs synchronously before React hydrates — prevents dark/light flash */
const noFlashScript = `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${interDisplay.variable} ${geistMono.variable} ${specialElite.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Must be first child — runs before paint to apply theme class */}
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
