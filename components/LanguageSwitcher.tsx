'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { trackLanguageChange } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { GB, RU, DE, ES, IT, FR, BR } from 'country-flag-icons/react/3x2';

const flagComponents: Record<Locale, React.ComponentType<{ className?: string }>> = {
  en: GB,
  ru: RU,
  de: DE,
  es: ES,
  it: IT,
  fr: FR,
  pt: BR,
};

function FlagIcon({ locale }: { locale: Locale }) {
  const FlagComponent = flagComponents[locale];
  return <FlagComponent className="w-6 h-4 rounded-sm border border-border/30" />;
}

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('language');
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLocaleChange = (newLocale: Locale) => {
    trackLanguageChange(newLocale);
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="neutral"
        className="flex items-center gap-2"
        aria-label={t('select')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <FlagIcon locale={locale as Locale} />
        <span className="hidden sm:inline">{localeNames[locale as Locale]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 bg-secondary-background border-2 border-border shadow-shadow rounded-base z-50 min-w-[160px]"
            role="listbox"
            aria-label={t('select')}
          >
            {locales.map((loc) => (
              <li key={loc}>
                <button
                  onClick={() => handleLocaleChange(loc)}
                  className={`w-full px-4 py-3 text-left font-medium flex items-center gap-3 hover:bg-main/20 transition-colors ${
                    locale === loc ? 'bg-main/30' : ''
                  }`}
                  role="option"
                  aria-selected={locale === loc}
                >
                  <FlagIcon locale={loc} />
                  <span>{localeNames[loc]}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
