# Интеграция Яндекс.Метрики в Next.js (App Router)

## Проблема

Стандартный код счётчика Яндекс.Метрики не работает корректно с Next.js App Router:
- Next.js оптимизирует загрузку скриптов через preload, что может нарушить работу счётчика
- Клиентская навигация (SPA) не отслеживается стандартным скриптом
- Нужно учитывать GDPR и cookie consent

## Решение

Проект использует npm-пакет [`next-yandex-metrica`](https://www.npmjs.com/package/next-yandex-metrica), который предоставляет React-провайдер с автоматическим отслеживанием SPA-навигации.

### Шаг 1. Установка

```bash
npm install next-yandex-metrica
```

### Шаг 2. Конфигурация ID счётчика

ID счётчика и утилиты трекинга определены в `lib/analytics.ts`:

```typescript
// lib/analytics.ts

export const YM_COUNTER_ID = 106346783;

// Проверка cookie consent
export const isAnalyticsEnabled = () => {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem('cookie-consent');
  return consent === 'accepted';
};
```

### Шаг 3. Подключение провайдера

`YandexMetricaProvider` подключается в `app/[locale]/layout.tsx`, оборачивая всё содержимое `<body>`:

```tsx
// app/[locale]/layout.tsx

import { YandexMetricaProvider } from "next-yandex-metrica";
import { YM_COUNTER_ID } from "@/lib/analytics";

export default async function LocaleLayout({ children, params }: Props) {
  // ...

  return (
    <html lang={locale}>
      <body>
        <YandexMetricaProvider
          tagID={YM_COUNTER_ID}
          initParameters={{
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            defer: true,
            trackHash: true,
          }}
          router="app"
        >
          {/* Контент приложения */}
        </YandexMetricaProvider>
      </body>
    </html>
  );
}
```

Ключевой параметр — `router="app"`. Он включает автоматическое отслеживание SPA-навигации для App Router (без ручного `usePathname` + `useEffect`).

## Параметры инициализации

| Параметр | Значение | Описание |
|----------|----------|----------|
| `defer` | `true` | **Обязательно!** Отключает автоматическую отправку хита при загрузке (провайдер отправляет его сам) |
| `clickmap` | `true` | Карта кликов |
| `trackLinks` | `true` | Автоотслеживание переходов по внешним ссылкам |
| `accurateTrackBounce` | `true` | Точное определение отказов |
| `webvisor` | `true` | Запись сессий (Вебвизор) |
| `trackHash` | `true` | Отслеживание hash-навигации (#anchor) |

### Опциональные параметры

```tsx
<YandexMetricaProvider
  tagID={YM_COUNTER_ID}
  initParameters={{
    // ... базовые параметры ...
    ecommerce: "dataLayer",  // Для e-commerce трекинга
    triggerEvent: true,       // Событие yacounter{ID}inited при готовности
  }}
  router="app"
/>
```

## Отслеживание хитов (page views)

Хиты SPA-навигации отслеживаются автоматически благодаря `router="app"` в провайдере.

Дополнительно, при программном трекинге используется функция `trackPageView` из `lib/analytics.ts`:

```typescript
// lib/analytics.ts

export const trackPageView = (url: string) => {
  if (!isAnalyticsEnabled()) return;

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
  }

  // Yandex Metrika
  if (window.ym && YM_COUNTER_ID) {
    window.ym(Number(YM_COUNTER_ID), 'hit', url);
  }
};
```

## Отслеживание целей

### Базовый вызов

```typescript
// В любом клиентском компоненте ("use client")
import { YM_COUNTER_ID } from '@/lib/analytics';

window.ym?.(YM_COUNTER_ID, 'reachGoal', 'goal_name');
```

### Пример: трекинг через утилиты analytics.ts

В проекте трекинг событий унифицирован через GA4 `trackEvent`. Для целей Яндекс.Метрики можно вызывать `window.ym` напрямую:

```typescript
import { YM_COUNTER_ID, isAnalyticsEnabled } from '@/lib/analytics';

const trackYMGoal = (goalName: string) => {
  if (!isAnalyticsEnabled()) return;
  window.ym?.(YM_COUNTER_ID, 'reachGoal', goalName);
};
```

## GDPR и Cookie Consent

Аналитика активируется только после согласия пользователя. Механизм работает так:

1. **`CookieConsent`** (`components/CookieConsent.tsx`) — показывает баннер при первом визите
2. Пользователь нажимает «Принять» → `localStorage.setItem('cookie-consent', 'accepted')` → `window.location.reload()`
3. Пользователь нажимает «Отклонить» → `localStorage.setItem('cookie-consent', 'declined')`
4. **`isAnalyticsEnabled()`** (`lib/analytics.ts`) — проверяет `localStorage` перед отправкой данных

```typescript
// lib/analytics.ts
export const isAnalyticsEnabled = () => {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem('cookie-consent');
  return consent === 'accepted';
};
```

Все функции трекинга (`trackEvent`, `trackPageView`, `trackCalculateAge`, `trackShare`) вызывают `isAnalyticsEnabled()` перед отправкой данных.

> **Примечание:** `YandexMetricaProvider` загружает скрипт метрики независимо от consent. Функция `isAnalyticsEnabled()` контролирует отправку кастомных событий через `trackEvent`/`trackPageView`.

## Верификация домена

Верификация в Яндекс.Вебмастере реализована через Metadata API Next.js в `app/[locale]/layout.tsx`:

```typescript
// app/[locale]/layout.tsx → generateMetadata()

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    // ...
    verification: {
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  };
}
```

Код верификации задаётся через переменную окружения `NEXT_PUBLIC_YANDEX_VERIFICATION` в `.env.local`.

## Проверка работы

1. Открой DevTools → вкладка Network
2. Отфильтруй по `mc.yandex`
3. Должны быть запросы:
   - `tag.js` — загрузка скрипта метрики
   - `watch/106346783` — отправка данных

### Отладка

В консоли браузера:

```js
// Проверить что метрика загружена
typeof window.ym // должно быть "function"

// Вручную отправить цель
window.ym(106346783, "reachGoal", "test_goal");

// Проверить consent
localStorage.getItem('cookie-consent') // "accepted" | "declined" | null
```

## Архитектура

```
lib/analytics.ts          ← YM_COUNTER_ID, isAnalyticsEnabled(), trackPageView()
app/[locale]/layout.tsx   ← YandexMetricaProvider (router="app")
components/CookieConsent  ← GDPR баннер, управляет localStorage
```

## Ссылки

- [next-yandex-metrica](https://www.npmjs.com/package/next-yandex-metrica) — npm-пакет провайдера
- [Справка Яндекс.Метрики](https://yandex.ru/support/metrica/code/counter-initialize.html) — параметры инициализации
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — верификация домена
