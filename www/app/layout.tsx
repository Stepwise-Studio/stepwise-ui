import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/lib/theme'
import './globals.css'

const interDisplay = localFont({
  /* Four weights, no italics, subset to Latin + Latin Extended.
   *
   * This used to load all twelve files at full glyph coverage - 1.5 MB that
   * every visitor downloaded. Nothing on the site sets an italic or uses
   * extrabold/black, so eight of those files were never rendering anything,
   * and `next/font/local` does not subset: it serves whatever it is given.
   *
   * The files are the same ones the registry ships to users, read straight
   * from public/fonts, so the site and an installed copy can never drift onto
   * different versions of the typeface. */
  src: [
    { path: '../public/fonts/InterDisplay-Regular.woff2',  weight: '400', style: 'normal' },
    { path: '../public/fonts/InterDisplay-Medium.woff2',   weight: '500', style: 'normal' },
    { path: '../public/fonts/InterDisplay-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/InterDisplay-Bold.woff2',     weight: '700', style: 'normal' },
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
const REPO_URL = 'https://github.com/Stepwise-Studio/stepwise-ui'
const DESCRIPTION =
  'A growing collection of React components for building modern products. Each one arrives as source you can read and edit, and works with your coding agent, so what it ships looks designed rather than generated.'

/* JSON-LD identity, for agents that parse rather than read.
 *
 * Two objects: what this is (SoftwareApplication) and who made it
 * (Organization). Without them an agent has to infer both from prose, and
 * "Stepwise UI" is generic enough that the inference often lands wrong.
 *
 * The contact point is the issue tracker rather than an email - it is the
 * honest route for an open-source library, and it keeps a scrapeable address
 * out of every page's source. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: 'Stepwise UI',
      url: SITE_URL,
      description: DESCRIPTION,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      softwareRequirements: 'React 19, Tailwind CSS v4, TypeScript',
      // Free, and saying so explicitly is what lets an agent answer "does this
      // cost anything" without guessing from the absence of a pricing page.
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      license: 'https://opensource.org/licenses/MIT',
      downloadUrl: 'https://www.npmjs.com/package/stepwise-ui',
      codeRepository: REPO_URL,
      publisher: { '@id': `${SITE_URL}/#org` },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: 'Stepwise Studio',
      url: 'https://stepwise.studio',
      logo: `${SITE_URL}/brand/logo-mark.svg`,
      sameAs: [REPO_URL, 'https://www.npmjs.com/package/stepwise-ui'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        url: `${REPO_URL}/issues`,
      },
    },
  ],
}

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
