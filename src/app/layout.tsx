import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "../hooks/client-providers";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import SkipNav from "../components/layout/skip-nav";
import ErrorBoundary from "../components/ui/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "WdTmCollab",
  description: "Discover Actor Collaborations through Wikidata",
  openGraph: {
    title: "WdTmCollab",
    description: "Discover Actor Collaborations through Wikidata",
    url: "https://wdtmcollab.toolforge.org",
    siteName: "WdTmCollab"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SkipNav />
        {/* <ErrorBoundary> */}
        <ClientProviders>
          <Header />
          <main id='main-content' className='flex-grow'>
            {children}
          </main>
          <Footer />
        </ClientProviders>
        {/* </ErrorBoundary> */}
      </body>
    </html>
  );
}
