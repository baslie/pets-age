import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { locales } from "@/i18n/config";
import Analytics from "@/components/Analytics";
import CookieConsent from "@/components/CookieConsent";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://truedogage.com";

// Locale to Open Graph locale mapping
const ogLocaleMap: Record<string, string> = {
  en: "en_US",
  ru: "ru_RU",
  de: "de_DE",
  es: "es_ES",
  it: "it_IT",
  fr: "fr_FR",
  pt: "pt_BR",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const title = t("title");
  const description = t("description");
  const url = `${BASE_URL}/${locale}`;
  const ogImage = `${BASE_URL}/og-image.png`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ru: "/ru",
        de: "/de",
        es: "/es",
        it: "/it",
        fr: "/fr",
        pt: "/pt",
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "TrueDogAge",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: ogLocaleMap[locale] || "en_US",
      alternateLocale: Object.values(ogLocaleMap).filter(
        (l) => l !== ogLocaleMap[locale]
      ),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// JSON-LD structured data
function JsonLd({ locale }: { locale: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TrueDogAge",
    description:
      "Calculate your dog's age in human years using scientific epigenetic clock research",
    url: `${BASE_URL}/${locale}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "TrueDogAge",
      url: BASE_URL,
    },
    inLanguage: locale,
    isAccessibleForFree: true,
    browserRequirements: "Requires JavaScript",
    softwareVersion: "1.0.0",
    datePublished: "2024-01-01",
    potentialAction: {
      "@type": "UseAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/{locale}`,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="application-name" content="TrueDogAge" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TrueDogAge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3B82F6" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <JsonLd locale={locale} />
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
          <CookieConsent />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
