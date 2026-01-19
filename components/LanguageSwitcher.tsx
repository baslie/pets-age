'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { locales, localeNames, type Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('language');
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLocaleChange = (newLocale: Locale) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`) || `/${newLocale}`;
    router.push(newPathname);
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
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-brutal bg-white px-4 py-2 font-bold flex items-center gap-2"
        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        aria-label={t('select')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg">{getFlagEmoji(locale as Locale)}</span>
        <span className="hidden sm:inline">{localeNames[locale as Locale]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 bg-white border-3 border-black shadow-[4px_4px_0_#000] z-50 min-w-[160px]"
            role="listbox"
            aria-label={t('select')}
          >
            {locales.map((loc) => (
              <li key={loc}>
                <button
                  onClick={() => handleLocaleChange(loc)}
                  className={`w-full px-4 py-3 text-left font-medium flex items-center gap-3 hover:bg-yellow-100 transition-colors ${
                    locale === loc ? 'bg-yellow-200' : ''
                  }`}
                  role="option"
                  aria-selected={locale === loc}
                >
                  <span className="text-lg">{getFlagEmoji(loc)}</span>
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

function getFlagEmoji(locale: Locale): string {
  const flags: Record<Locale, string> = {
    en: '\u{1F1EC}\u{1F1E7}',
    ru: '\u{1F1F7}\u{1F1FA}',
    de: '\u{1F1E9}\u{1F1EA}',
    es: '\u{1F1EA}\u{1F1F8}',
    it: '\u{1F1EE}\u{1F1F9}',
    fr: '\u{1F1EB}\u{1F1F7}',
    pt: '\u{1F1E7}\u{1F1F7}',
  };
  return flags[locale];
}
