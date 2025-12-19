import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/src/i18n/routing'
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { ClientProviders } from "@/src/hooks/client-providers"
import Footer from "@/src/components/layout/footer"
import Header from "@/src/components/layout/header"
import SkipNav from "@/src/components/layout/skip-nav"
import ErrorBoundary from "@/src/components/ui/error-boundary"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
})

const siteUrl = "https://wdtmcollab.toolforge.org";

export const metadata: Metadata = {
  title: {
    default: 'WdTmCollab',
    template: '%s | Wikidata TransMedia Collaboration',
  },
  description:
    'Discover the interconnected world of cinema. Explore actor collaborations, shared productions, and network clusters using Wikidata.',
  keywords: [
    'wikidata',
    'cinema',
    'actors',
    'collaboration',
    'network',
    'visualization',
    'movies',
    'tv shows',
    'data visualization',
  ],
  authors: [{ name: 'WdTmCollab Team' }],
  creator: 'WdTmCollab',
  publisher: 'WdTmCollab',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'fr': '/fr',
      'ja': '/ja',
      'zh-Hans': '/zh-Hans',
      'zh-Hant': '/zh-Hant',
    },
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'WdTmCollab',
    title: 'WdTmCollab - Actor Collaborations',
    description:
      'Discover the interconnected world of cinema. Explore actor collaborations and network clusters.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'WdTmCollab Network Graph',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WdTmCollab',
    description: 'Explore actor collaborations and shared productions.',
    images: [`${siteUrl}/og-image.png`],
  },
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-icon.png' }],
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className="h-full">
      <head>
        <link rel="dns-prefetch" href="https://www.wikidata.org" />
        <link rel="preconnect" href="https://www.wikidata.org" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-slate-50 text-slate-900`}>
        <NextIntlClientProvider messages={messages}>
          <SkipNav />

          <ErrorBoundary>
            <ClientProviders>
              <Header />

              <main id="main-content" className="flex-grow transition-all duration-300">
                {children}
              </main>

              <Footer />
            </ClientProviders>
          </ErrorBoundary>

        </NextIntlClientProvider>
      </body>
    </html>
  )
}