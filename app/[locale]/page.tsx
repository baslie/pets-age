import { useTranslations } from "next-intl";
import Calculator from "@/components/Calculator";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FormulaInfoModal from "@/components/FormulaInfoModal";
import Copyright from "@/components/Copyright";

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("calculator.title")}
          </h1>
          <p className="text-lg text-foreground/80">
            {t("calculator.subtitlePrefix")}
            <FormulaInfoModal>
              <span className="underline decoration-2 decoration-main underline-offset-2 hover:decoration-main/70 transition-colors cursor-help">
                {t("calculator.subtitleLink")}<sup className="text-xs">¹</sup>
              </span>
            </FormulaInfoModal>
          </p>
        </header>

        <Calculator />

        <footer className="text-center mt-12 text-sm text-foreground/60">
          <p className="text-xs text-foreground/40"><sup>1</sup> {t("info.basedOn")}</p>
          <Copyright />
        </footer>
      </div>
    </main>
  );
}
