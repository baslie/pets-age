'use client';

import { useTranslations } from 'next-intl';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function FormulaSection() {
  const t = useTranslations('formulaModal');

  // Render LaTeX formula
  const formulaHtml = katex.renderToString('H = 16 \\cdot \\ln(D) + 31', {
    throwOnError: false,
    displayMode: true,
  });

  return (
    <section
      id="formula-section"
      className="px-4 lg:px-8 xl:px-12 py-8 lg:py-12"
    >
      <div className="max-w-2xl mx-auto bg-secondary-background border-2 border-border shadow-shadow rounded-base p-6 lg:p-8">
        {/* Header */}
        <h2 className="font-bold text-2xl lg:text-3xl mb-6 font-serif">
          {t('title')}
        </h2>

        {/* Content */}
        <div className="space-y-5 text-base">
          <p className="text-foreground/80">{t('intro')}</p>

          <p className="font-bold text-foreground">{t('mythBuster')}</p>

          {/* Formula */}
          <div className="bg-background border-2 border-border rounded-base p-4 lg:p-6 my-6">
            <div
              dangerouslySetInnerHTML={{ __html: formulaHtml }}
              className="text-center text-lg"
            />
            <p className="text-sm text-foreground/60 text-center mt-3">
              {t('formulaExplanation')}
            </p>
          </div>

          {/* Examples */}
          <div>
            <p className="font-bold mb-3">{t('examplesTitle')}</p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-foreground/80">
              <li className="bg-background border border-border rounded-base px-3 py-2 text-center">
                {t('example1')}
              </li>
              <li className="bg-background border border-border rounded-base px-3 py-2 text-center">
                {t('example2')}
              </li>
              <li className="bg-background border border-border rounded-base px-3 py-2 text-center">
                {t('example3')}
              </li>
              <li className="bg-background border border-border rounded-base px-3 py-2 text-center">
                {t('example4')}
              </li>
            </ul>
          </div>

          {/* Sources */}
          <div className="pt-4 border-t border-border/50">
            <p className="font-bold mb-2">{t('sourcesTitle')}</p>
            <a
              href="https://doi.org/10.1016/j.cels.2020.06.006"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="text-main hover:underline cursor-pointer"
            >
              {t('sourceLink')}
            </a>
            <p className="text-sm text-foreground/60 mt-1">
              {t('sourcePaperTitle')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
