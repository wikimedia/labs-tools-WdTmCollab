//"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Loading from "./feed/loading";
import { ClientProviders } from "../hooks/client-providers";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import ErrorBoundary from "../components/ui/error-boundary";
import SkipNav from "../components/layout/skip-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WDTMCollab",
  description: "Discover Actor Collaborations through Wikidata",
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.svg",
  },
  // applicationName: "WDTMCollab",
  openGraph: {
    title: "WDTMCollab",
    description: "Discover Actor Collaborations through Wikidata",
    url: "https://wdtmcollab.toolforge.org",
    siteName: "WDTMCollab",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <SkipNav />
        <Loading />
        <ErrorBoundary>
          <ClientProviders>
            <Header />
            <div id="main-content">
              {children}
            </div>
            <Footer />
          </ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
