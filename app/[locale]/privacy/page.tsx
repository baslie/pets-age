import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { locales } from "@/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://truedogage.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  const title = t("meta.title");
  const description = t("meta.description");
  const url = `${BASE_URL}/${locale}/privacy`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/privacy`])
      ),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "TrueDogAge",
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <main className="min-h-screen py-8 px-4 md:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-foreground/70 hover:text-main transition-colors mb-8 group"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t("backToHome")}
        </Link>

        {/* Main content card */}
        <article className="bg-secondary-background border-2 border-border shadow-shadow rounded-base p-6 md:p-8 lg:p-10">
          {/* Header */}
          <header className="mb-8 pb-6 border-b-2 border-border">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">
              {t("title")}
            </h1>
            <p className="text-foreground/60 text-sm">
              {t("lastUpdated")}: {t("updateDate")}
            </p>
          </header>

          {/* Introduction */}
          <p className="text-foreground/80 mb-8">{t("intro")}</p>

          {/* Data Collection */}
          <section className="mb-8 pb-6 border-b-2 border-border">
            <h2 className="text-xl md:text-2xl font-bold font-serif mb-4">
              {t("dataCollection.title")}
            </h2>
            <p className="text-foreground/80 mb-4">
              {t("dataCollection.description")}
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>{t("dataCollection.item1")}</li>
              <li>{t("dataCollection.item2")}</li>
              <li>{t("dataCollection.item3")}</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-8 pb-6 border-b-2 border-border">
            <h2 className="text-xl md:text-2xl font-bold font-serif mb-4">
              {t("cookies.title")}
            </h2>
            <p className="text-foreground/80 mb-4">{t("cookies.description")}</p>

            <div className="space-y-4">
              {/* Essential cookies */}
              <div className="bg-background border-2 border-border rounded-base p-4">
                <h3 className="font-bold mb-2">{t("cookies.essential.title")}</h3>
                <p className="text-foreground/80 text-sm">
                  {t("cookies.essential.description")}
                </p>
              </div>

              {/* Analytics cookies */}
              <div className="bg-background border-2 border-border rounded-base p-4">
                <h3 className="font-bold mb-2">{t("cookies.analytics.title")}</h3>
                <p className="text-foreground/80 text-sm">
                  {t("cookies.analytics.description")}
                </p>
              </div>
            </div>
          </section>

          {/* Analytics */}
          <section className="mb-8 pb-6 border-b-2 border-border">
            <h2 className="text-xl md:text-2xl font-bold font-serif mb-4">
              {t("analytics.title")}
            </h2>
            <p className="text-foreground/80 mb-4">{t("analytics.description")}</p>

            <div className="space-y-4">
              {/* Google Analytics */}
              <div className="bg-background border-2 border-border rounded-base p-4">
                <h3 className="font-bold mb-2">Google Analytics 4</h3>
                <p className="text-foreground/80 text-sm mb-2">
                  {t("analytics.ga4.description")}
                </p>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-main hover:underline text-sm"
                >
                  {t("analytics.ga4.link")} →
                </a>
              </div>

              {/* Yandex Metrica */}
              <div className="bg-background border-2 border-border rounded-base p-4">
                <h3 className="font-bold mb-2">{t("analytics.yandex.title")}</h3>
                <p className="text-foreground/80 text-sm mb-2">
                  {t("analytics.yandex.description")}
                </p>
                <a
                  href="https://yandex.com/legal/confidential/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-main hover:underline text-sm"
                >
                  {t("analytics.yandex.link")} →
                </a>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className="mb-8 pb-6 border-b-2 border-border">
            <h2 className="text-xl md:text-2xl font-bold font-serif mb-4">
              {t("rights.title")}
            </h2>
            <p className="text-foreground/80 mb-4">{t("rights.description")}</p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>{t("rights.item1")}</li>
              <li>{t("rights.item2")}</li>
              <li>{t("rights.item3")}</li>
              <li>{t("rights.item4")}</li>
            </ul>
          </section>

          {/* Security */}
          <section className="mb-8 pb-6 border-b-2 border-border">
            <h2 className="text-xl md:text-2xl font-bold font-serif mb-4">
              {t("security.title")}
            </h2>
            <p className="text-foreground/80">{t("security.description")}</p>
          </section>

          {/* Contact */}
          <section className="mb-8 pb-6 border-b-2 border-border">
            <h2 className="text-xl md:text-2xl font-bold font-serif mb-4">
              {t("contact.title")}
            </h2>
            <p className="text-foreground/80">
              {t("contact.description")}{" "}
              <a
                href="mailto:rytrycon@gmail.com"
                className="text-main hover:underline"
              >
                rytrycon@gmail.com
              </a>
            </p>
          </section>

          {/* Policy Changes */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold font-serif mb-4">
              {t("changes.title")}
            </h2>
            <p className="text-foreground/80">{t("changes.description")}</p>
          </section>
        </article>
      </div>
    </main>
  );
}
