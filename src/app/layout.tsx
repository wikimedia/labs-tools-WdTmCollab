import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://wdtmcollab.toolforge.org";

export const metadata: Metadata = {
  title: {
    default: "WdTmCollab",
    template: "%s | Wikidata TransMedia Collaboration",
  },
  description:
    "Discover the interconnected world of cinema. Explore actor collaborations, shared productions, and network clusters using Wikidata.",
  keywords: [
    "wikidata",
    "cinema",
    "actors",
    "collaboration",
    "network",
    "visualization",
    "movies",
    "tv shows",
    "data visualization",
  ],
  authors: [{ name: "WdTmCollab Team" }],
  creator: "WdTmCollab",
  publisher: "WdTmCollab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      fr: "/fr",
      es: "/es",
      de: "/de",
      it: "/it",
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "WdTmCollab",
    title: "WdTmCollab - Actor Collaborations",
    description:
      "Discover the interconnected world of cinema. Explore actor collaborations and network clusters.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "WdTmCollab Network Graph",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WdTmCollab",
    description: "Explore actor collaborations and shared productions.",
    images: [`${siteUrl}/og-image.png`],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://www.wikidata.org" />
        <link
          rel="preconnect"
          href="https://www.wikidata.org"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
