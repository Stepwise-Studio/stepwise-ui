import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/lib/theme'
import { RisoDefs } from '@/components/riso/defs'
import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import './globals.css'

/* Four weights, no italics, Latin + Latin Extended. Served from public/fonts as
 * .woff2 - the only format worth shipping on the web.
 *
 * The metric overrides pin the numbers every engine uses to place tight-leading
 * text. Without them Gecko and Blink read different tables from the same file
 * and land icon+label rows a couple of pixels apart. Values are read from the
 * font itself, not guessed. */
const interDisplay = localFont({
  src: [
    { path: '../public/fonts/InterDisplay-Regular.woff2',  weight: '400', style: 'normal' },
    { path: '../public/fonts/InterDisplay-Medium.woff2',   weight: '500', style: 'normal' },
    { path: '../public/fonts/InterDisplay-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/InterDisplay-Bold.woff2',     weight: '700', style: 'normal' },
  ],
  variable: '--font-inter-display',
  display : 'swap',
  declarations: [
    { prop: 'ascent-override',   value: '96.875%' },
    { prop: 'descent-override',  value: '24.121%' },
    { prop: 'line-gap-override', value: '0%' },
  ],
})

export const metadata: Metadata = {
  title: {
    default : 'MedixGo — Your medicines. Made simpler.',
    template: '%s — MedixGo',
  },
  description:
    'Order genuine medicines online or upload your prescription and let us take care of the rest.',
}

/* Runs before React hydrates, so the page never paints the wrong theme and
 * then swaps. Light is the default here (the library it was vendored from is
 * dark-first); an explicit choice still wins on every later visit. */
const noFlashScript = `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interDisplay.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <RisoDefs />
        <ThemeProvider>
          <Navbar />
          <main id="content" className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
