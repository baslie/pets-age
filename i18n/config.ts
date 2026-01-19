export const locales = ['en', 'ru', 'de', 'es', 'it', 'fr', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  fr: 'Français',
  pt: 'Português',
};
