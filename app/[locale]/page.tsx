import { useTranslations } from "next-intl";
import Calculator from "@/components/Calculator";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">TrueDogAge</h1>
          <p className="text-lg text-foreground/80">{t("calculator.subtitle")}</p>
        </header>

        <Calculator />

        <footer className="text-center mt-12 text-sm text-foreground/60">
          <p>{t("info.basedOn")}</p>
          <p className="mt-2">{t("info.formula")}</p>
        </footer>
      </div>
    </main>
  );
}
