import { useTranslations } from "next-intl";
import Calculator from "@/components/Calculator";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FormulaInfoModal from "@/components/FormulaInfoModal";
import Copyright from "@/components/Copyright";

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen flex flex-col relative">
      {/* Переключатель языка в правом верхнем углу страницы */}
      <div className="absolute top-4 right-4 lg:right-8">
        <LanguageSwitcher />
      </div>

      {/* Основной контент — центрирован по вертикали */}
      <div className="flex-1 flex items-center px-4 lg:px-8 xl:px-12 py-12">
        <div className="w-full lg:flex lg:items-center lg:justify-between lg:gap-12 xl:gap-16">
          {/* Левая часть: заголовок с ограниченной шириной */}
          <header className="text-center lg:text-left lg:max-w-xl lg:flex-shrink-0 mb-8 lg:mb-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 font-serif">
              {t("calculator.title")}
            </h1>
            <p className="text-lg lg:text-xl text-foreground/80">
              {t("calculator.subtitlePrefix")}
              <FormulaInfoModal>
                <span className="underline decoration-2 decoration-main underline-offset-2 hover:decoration-main/70 transition-colors cursor-help">
                  {t("calculator.subtitleLink")}<sup className="text-xs">¹</sup>
                </span>
              </FormulaInfoModal>
            </p>
          </header>

          {/* Правая часть: калькулятор — растягивается на доступную ширину */}
          <div className="lg:flex-1 lg:max-w-4xl">
            <Calculator />
          </div>
        </div>
      </div>

      {/* Footer — прижат к низу */}
      <footer className="px-4 lg:px-8 xl:px-12 pb-6 text-center lg:text-left">
        <div className="text-sm text-foreground/60">
          <p className="text-xs text-foreground/40"><sup>1</sup> {t("info.basedOn")}</p>
          <Copyright />
        </div>
      </footer>
    </main>
  );
}
