import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Geist_Mono } from 'next/font/google'
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
  // - e.g. icon+label rows in Button looking vertically off in Firefox-family
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

const SITE_URL = 'https://ui.stepwise.studio'
const DESCRIPTION =
  'A growing collection of React components for building modern products. Each one arrives as source you can read and edit, and works with your coding agent, so what it ships looks designed rather than generated.'

export const metadata: Metadata = {
  // Required for the OG/Twitter image URLs to resolve absolutely. Without it
  // Next falls back to localhost at build time and crawlers get a dead image.
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Stepwise UI',
    // Docs pages set their own `title`; this frames them without each page
    // having to repeat the brand.
    template: '%s - Stepwise UI',
  },
  description: DESCRIPTION,
  applicationName: 'Stepwise UI',
  keywords: [
    'react components', 'component library', 'tailwind css', 'design system',
    'react ui', 'nextjs components', 'copy paste components', 'shadcn alternative',
    'motion', 'accessible components', 'stepwise ui',
  ],
  authors: [{ name: 'Stepwise Studio', url: 'https://stepwise.studio' }],
  creator: 'Stepwise Studio',
  publisher: 'Stepwise Studio',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Stepwise UI',
    title: 'Stepwise UI',
    description: DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stepwise UI',
    description: DESCRIPTION,
    creator: '@akhil_4109',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  category: 'technology',
  // Theme-aware marks, matching how stepwise.studio serves its own: two SVGs
  // behind prefers-color-scheme queries, both on a transparent ground. The
  // .ico is the light mark, since an .ico cannot carry a media query.
  icons: {
    icon: [
      { url: '/icons/icon-light.svg', media: '(prefers-color-scheme: light)', type: 'image/svg+xml' },
      { url: '/icons/icon-dark.svg', media: '(prefers-color-scheme: dark)', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

/* Runs synchronously before React hydrates - prevents dark/light flash.
 * Dark is the default rather than the OS preference: the library is designed
 * dark-first and that is how it should be seen on a first visit. An explicit
 * choice, once made, still wins on every later visit. */
const noFlashScript = `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){document.documentElement.classList.add('dark')}})();`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${interDisplay.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Must be first child - runs before paint to apply theme class */}
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
