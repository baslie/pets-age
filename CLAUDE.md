# CLAUDE.md — Инструкции для ИИ-агента

Этот файл содержит все необходимые инструкции для разработки проекта TrueDogAge.com.

## Обзор проекта

**TrueDogAge.com** — одностраничный калькулятор «человеческого» возраста собаки. Использует научную формулу на основе эпигенетических часов (исследование UC San Diego, 2020).

### Формула расчёта

```typescript
const calculateHumanAge = (dogAgeInYears: number): number => {
  if (dogAgeInYears <= 0) return 0;
  return 16 * Math.log(dogAgeInYears) + 31;
};
```

**Важно:** `Math.log()` — это натуральный логарифм (ln).

---

## Технический стек

| Технология | Версия | Назначение |
|------------|--------|------------|
| Next.js | 15.1.x | App Router, SSR/SSG |
| TypeScript | 5.7.x | Типизация |
| Tailwind CSS | 4.x | Стилизация |
| Framer Motion | 12.x | Анимации |
| next-intl | 4.x | Интернационализация |
| @ducanh2912/next-pwa | 5.6.x | PWA функционал |
| Node.js | 22.x LTS | Runtime |

---

## Команды

```bash
npm run dev      # Разработка (localhost:3000)
npm run build    # Сборка
npm run start    # Продакшен-сервер
npm run lint     # ESLint проверка
```

---

## Структура файлов

```
app/
├── [locale]/
│   ├── layout.tsx      # Layout с i18n провайдером
│   └── page.tsx        # Главная страница
├── layout.tsx          # Root layout
└── globals.css         # Глобальные стили + Tailwind

components/
├── Calculator/
│   ├── AgeSlider.tsx       # Ползунок (годы/месяцы/дни)
│   ├── DatePicker.tsx      # Ввод даты рождения
│   ├── ResultDisplay.tsx   # Отображение результата
│   └── DogIllustration.tsx # SVG иллюстрация собаки
├── ShareButtons.tsx        # Кнопки шеринга
├── LanguageSwitcher.tsx    # Переключатель языка
├── InfoSection.tsx         # Блок с информацией
└── CookieConsent.tsx       # GDPR баннер

lib/
├── calculateAge.ts    # Функция расчёта возраста
└── analytics.ts       # GA4 + Яндекс.Метрика

messages/
├── en.json, ru.json, de.json, es.json, it.json, fr.json, pt.json
```

---

## Стиль: Необрутализм

### CSS переменные (добавить в globals.css)

```css
:root {
  --color-background: #FEF3C7;
  --color-card: #FFFFFF;
  --color-primary: #3B82F6;
  --color-accent: #F472B6;
  --color-success: #34D399;
  --color-warning: #FBBF24;
  --color-text: #1F2937;
  --color-border: #000000;

  --shadow-brutal: 4px 4px 0 #000;
  --border-brutal: 3px solid #000;
}
```

### Tailwind классы (паттерны)

```tsx
// Карточка
className="bg-white border-3 border-black shadow-[4px_4px_0_#000] p-6"

// Кнопка
className="bg-blue-500 text-white border-3 border-black shadow-[4px_4px_0_#000]
           hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]
           active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
           transition-all px-6 py-3 font-bold"

// Ползунок track
className="h-3 bg-gray-200 border-2 border-black rounded-none"

// Ползунок thumb
className="w-6 h-6 bg-yellow-400 border-2 border-black cursor-grab"
```

### Типографика

- Шрифт: **Inter** (Google Fonts)
- Заголовки: `font-bold` (700)
- Результат: `text-6xl font-bold tabular-nums`

---

## Компоненты: требования

### AgeSlider

- Три ползунка: годы (0-25), месяцы (0-11), дни (0-30)
- Snap к целым значениям
- Тап на значение = ручной ввод
- Touch target минимум 44px
- Spring анимация (stiffness: 300, damping: 20)

### DatePicker

- Нативный `<input type="date">`
- Синхронизация с ползунками
- Расчёт возраста от текущей даты

### ResultDisplay

- Крупное число (64px)
- Анимация счётчика (300ms, ease-out)
- Обновление в реальном времени

### DogIllustration

- 4 состояния: puppy (0-1), young (1-3), adult (3-8), senior (8+)
- Crossfade анимация (400ms)
- SVG формат

### ShareButtons

Платформы: Twitter/X, Facebook, WhatsApp, Telegram, Copy link

Текст (пример):
```
Моей собаке 5 лет — это как 57 человеческих!
Узнай возраст своей собаки: truedogage.com
```

---

## Интернационализация (next-intl)

### Конфигурация

```typescript
// i18n.ts
export const locales = ['en', 'ru', 'de', 'es', 'it', 'fr', 'pt'] as const;
export const defaultLocale = 'en';
```

### Структура messages/*.json

```json
{
  "meta": {
    "title": "TrueDogAge — Real Dog Age Calculator",
    "description": "Calculate your dog's age in human years using science"
  },
  "calculator": {
    "title": "How old is your dog?",
    "years": "Years",
    "months": "Months",
    "days": "Days",
    "or": "or",
    "enterBirthdate": "Enter birthdate",
    "result": "In human years:"
  },
  "info": {
    "title": "The Science",
    "description": "...",
    "disclaimer": "Based on Labrador Retrievers research"
  },
  "share": {
    "title": "Share result",
    "text": "My dog is {dogAge} years old — that's {humanAge} in human years!"
  }
}
```

---

## Аналитика

### Google Analytics 4

```typescript
// lib/analytics.ts
export const trackEvent = (name: string, params?: Record<string, any>) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', name, params);
  }
};

// События:
trackEvent('calculate_age', { dog_age: 5, human_age: 57 });
trackEvent('share', { platform: 'twitter' });
trackEvent('change_language', { language: 'ru' });
```

### Яндекс.Метрика

Базовая интеграция + вебвизор.

---

## Анимации (Framer Motion)

### Отключение для reduced motion

```tsx
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.1 }}
/>
```

### Конфигурация spring

```typescript
const springConfig = {
  stiffness: 300,
  damping: 20
};
```

---

## SEO чеклист

- [ ] `<title>` уникальный для каждого языка (до 60 символов)
- [ ] `<meta name="description">` (до 155 символов)
- [ ] Canonical URL для каждой локали
- [ ] hreflang теги для всех языков
- [ ] Open Graph теги (og:title, og:description, og:image)
- [ ] Twitter Card (summary_large_image)
- [ ] JSON-LD (WebApplication schema)
- [ ] Semantic HTML (main, article, section, nav)

---

## Производительность

### Целевые метрики

- LCP < 2.5s
- INP < 200ms
- CLS < 0.1
- Lighthouse: 90+ по всем категориям

### Оптимизации

- next/image для изображений
- Шрифт Inter: `display: swap`, preload
- Минимизация JS bundle
- Static generation где возможно

---

## PWA

### manifest.json

```json
{
  "name": "TrueDogAge — Dog Age Calculator",
  "short_name": "TrueDogAge",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FEF3C7",
  "theme_color": "#3B82F6",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## Этапы разработки

### Этап 1: Базовая функциональность
1. Инициализация Next.js 15 + TypeScript
2. Настройка Tailwind CSS 4
3. Компонент калькулятора с ползунками
4. Функция расчёта возраста
5. Базовый UI в стиле необрутализма

### Этап 2: UX и анимации
1. Интеграция Framer Motion 12
2. Анимация счётчика результата
3. Смена иллюстраций собаки
4. Snap и ручной ввод для ползунков
5. Date picker

### Этап 3: Мультиязычность
1. Настройка next-intl 4
2. Переводы для 7 языков
3. Переключатель языка
4. SEO для i18n (hreflang)

### Этап 4: SEO и аналитика
1. Meta-теги и Open Graph
2. JSON-LD разметка
3. Google Analytics 4
4. Яндекс.Метрика
5. Cookie consent (GDPR)

### Этап 5: PWA и финализация
1. PWA manifest и service worker
2. Оптимизация производительности
3. Тестирование
4. Деплой на Vercel

---

## Критерии приёмки

1. Калькулятор корректно рассчитывает возраст по формуле
2. Ползунки удобны на мобильных и десктопе
3. Все 7 языков работают корректно
4. Lighthouse Performance >= 90
5. Lighthouse SEO >= 95
6. Lighthouse Accessibility >= 90
7. Аналитика отправляет события
8. PWA устанавливается на устройство
9. Шеринг работает во всех соцсетях
10. Дизайн соответствует стилю необрутализма

---

## Ссылки

- [Техническое задание](./TrueDogAge-TZ.md)
- [Исследование Cell Systems](https://doi.org/10.1016/j.cels.2020.06.006)
- [Next.js Docs](https://nextjs.org/docs)
- [next-intl Docs](https://next-intl-docs.vercel.app/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
