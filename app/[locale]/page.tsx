import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import Calculator from "@/components/Calculator";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ScrollLink from "@/components/ScrollLink";
import FormulaSection from "@/components/FormulaSection";
import Copyright from "@/components/Copyright";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <main className="min-h-screen flex flex-col relative">
      {/* Переключатель языка в правом верхнем углу страницы */}
      <div className="absolute top-4 right-4 lg:right-8">
        <LanguageSwitcher />
      </div>

      {/* Основной контент — центрирован по вертикали */}
      <div className="flex-1 flex items-center px-4 lg:px-8 xl:px-12 pt-16 pb-12 lg:pt-16 lg:pb-12">
        <div className="w-full lg:flex lg:items-center lg:justify-between lg:gap-12 xl:gap-16">
          {/* Левая часть: заголовок с ограниченной шириной */}
          <header className="text-center lg:text-left lg:max-w-xl lg:flex-shrink-0 mb-8 lg:mb-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 font-serif">
              {t("calculator.title")}
            </h1>
            <p className="text-lg lg:text-xl text-foreground/80">
              {t("calculator.subtitlePrefix")}
              <ScrollLink
                targetId="formula-section"
                className="underline decoration-2 decoration-main underline-offset-2 hover:decoration-main/70 transition-colors cursor-pointer"
              >
                {t("calculator.subtitleLink")}
              </ScrollLink>
            </p>
          </header>

          {/* Правая часть: калькулятор — растягивается на доступную ширину */}
          <div className="lg:flex-1 lg:max-w-4xl">
            <Calculator />
          </div>
        </div>
      </div>

      {/* Блок с информацией о формуле */}
      <FormulaSection />

      {/* Footer — прижат к низу */}
      <footer className="px-4 lg:px-8 xl:px-12 pb-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-2">
          <div className="text-sm text-foreground/60 text-center lg:text-left">
            <Copyright />
          </div>
          <Link
            href={`/${locale}/privacy`}
            className="text-sm text-foreground/60 hover:text-main transition-colors text-center lg:text-right"
          >
            {t("cookie.privacyPolicy")}
          </Link>
        </div>
      </footer>
    </main>
  );
}
