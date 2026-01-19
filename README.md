# TrueDogAge.com

Одностраничный веб-сайт для расчёта «человеческого» возраста собаки на основе научной формулы учёных Калифорнийского университета в Сан-Диего.

## Научная основа

В отличие от популярного правила «1 собачий год = 7 человеческих», формула учитывает эпигенетические часы и паттерны метилирования ДНК.

**Формула расчёта:**
```
Человеческий возраст = 16 × ln(возраст_собаки_в_годах) + 31
```

| Возраст собаки | Человеческий эквивалент |
|----------------|-------------------------|
| 1 год | 31 год |
| 2 года | 42 года |
| 5 лет | 57 лет |
| 10 лет | 68 лет |
| 15 лет | 74 года |

## Технологии

| Категория | Технология | Версия |
|-----------|------------|--------|
| Фреймворк | Next.js (App Router) | 15.1.x |
| Язык | TypeScript | 5.7.x |
| Стилизация | Tailwind CSS | 4.x |
| Анимации | Framer Motion | 12.x |
| i18n | next-intl | 4.x |
| PWA | @ducanh2912/next-pwa | 5.6.x |
| Node.js | Node.js | 22.x LTS |
| Хостинг | Vercel | — |

## Установка

```bash
# Клонирование репозитория
git clone <repository-url>
cd truedogage

# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## Скрипты

```bash
npm run dev      # Запуск в режиме разработки
npm run build    # Сборка для продакшена
npm run start    # Запуск продакшен-сервера
npm run lint     # Проверка кода линтером
```

## Структура проекта

```
truedogage/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Calculator/
│   │   ├── AgeSlider.tsx
│   │   ├── DatePicker.tsx
│   │   ├── ResultDisplay.tsx
│   │   └── DogIllustration.tsx
│   ├── ShareButtons.tsx
│   ├── LanguageSwitcher.tsx
│   ├── InfoSection.tsx
│   └── CookieConsent.tsx
├── lib/
│   ├── calculateAge.ts
│   └── analytics.ts
├── messages/
│   ├── en.json
│   ├── ru.json
│   ├── de.json
│   ├── es.json
│   ├── it.json
│   ├── fr.json
│   └── pt.json
├── public/
│   ├── images/
│   └── manifest.json
└── package.json
```

## Поддерживаемые языки

- English (en)
- Русский (ru)
- Deutsch (de)
- Español (es)
- Italiano (it)
- Français (fr)
- Português (pt)

## Дизайн

Стиль: **Необрутализм (Neobrutalism)**

- Жёсткие тени: `box-shadow: 4px 4px 0 #000`
- Чёткие границы: `border: 3px solid #000`
- Яркие, насыщенные цвета
- Шрифт: Inter (Google Fonts)

### Цветовая палитра

```
Основной фон:     #FEF3C7
Карточки:         #FFFFFF
Акцент (CTA):     #3B82F6
Акцент (результат): #F472B6
Акцент (успех):   #34D399
Акцент (декор):   #FBBF24
Текст:            #1F2937
Границы/тени:     #000000
```

## Лицензия

MIT

## Ссылки

- [Оригинальное исследование](https://doi.org/10.1016/j.cels.2020.06.006) — Cell Systems, 2020
