import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { ClientProviders } from "@/src/hooks/client-providers";
import Footer from "@/src/components/layout/footer";
import Header from "@/src/components/layout/header";
import SkipNav from "@/src/components/layout/skip-nav";
import ErrorBoundary from "@/src/components/ui/error-boundary";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SkipNav />
      <ErrorBoundary>
        <ClientProviders>
          <Header />

          <main
            id="main-content"
            className="flex-grow transition-all duration-300"
          >
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </ErrorBoundary>
    </NextIntlClientProvider>
  );
}
