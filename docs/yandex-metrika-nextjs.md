# Интеграция Яндекс.Метрики в Next.js (App Router)

## Проблема

Стандартный код счётчика Яндекс.Метрики не работает корректно с Next.js App Router:
- Next.js оптимизирует Yandex пиксель через preload, что ломает отслеживание
- Клиентская навигация (SPA) не отслеживается стандартным скриптом
- Нужно вручную отправлять хиты при смене страниц

## Решение

### Шаг 1. Создать компонент `components/YandexMetrika.tsx`

```tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

// Замени на свой ID счётчика из Яндекс.Метрики
const METRIKA_ID = 12345678;

// Типизация глобального объекта window
declare global {
  interface Window {
    ym: (id: number, action: string, ...args: unknown[]) => void;
  }
}

export function YandexMetrika() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Отслеживание навигации для SPA
  useEffect(() => {
    if (typeof window.ym === "function") {
      const url = pathname + (searchParams.toString() ? "?" + searchParams.toString() : "");
      window.ym(METRIKA_ID, "hit", url);
    }
  }, [pathname, searchParams]);

  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${METRIKA_ID}, "init", {
              defer: true,
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true,
              trackHash: true
            });
          `,
        }}
      />
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
```

### Шаг 2. Подключить в `app/layout.tsx`

```tsx
import { Suspense } from "react";
import { YandexMetrika } from "@/components/YandexMetrika";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        {children}

        {/* Suspense обязателен для useSearchParams */}
        <Suspense fallback={null}>
          <YandexMetrika />
        </Suspense>
      </body>
    </html>
  );
}
```

## Параметры инициализации

| Параметр | Значение | Описание |
|----------|----------|----------|
| `defer` | `true` | **Обязательно!** Отключает автоматическую отправку хита при загрузке (мы отправляем вручную) |
| `clickmap` | `true` | Карта кликов |
| `trackLinks` | `true` | Автоотслеживание переходов по внешним ссылкам |
| `accurateTrackBounce` | `true` | Точное определение отказов |
| `webvisor` | `true` | Запись сессий (Вебвизор) |
| `trackHash` | `true` | Отслеживание hash-навигации (#anchor) |

### Опциональные параметры

```tsx
ym(METRIKA_ID, "init", {
  // ... базовые параметры ...
  ecommerce: "dataLayer",  // Для e-commerce трекинга
  triggerEvent: true,      // Событие yacounter{ID}inited при готовности
});
```

## Отслеживание целей

### Базовый вызов

```tsx
// В любом клиентском компоненте ("use client")
window.ym(METRIKA_ID, "reachGoal", "goal_name");
```

### Пример: отслеживание кликов по определённым ссылкам

Добавь в компонент `YandexMetrika.tsx`:

```tsx
// Отслеживание кликов по Telegram-ссылкам
useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");
    if (link?.href?.includes("t.me/")) {
      window.ym(METRIKA_ID, "reachGoal", "telegram_click");
    }
  };
  document.addEventListener("click", handleClick);
  return () => document.removeEventListener("click", handleClick);
}, []);
```

### Пример: глобальная функция для вызова из других компонентов

```tsx
// В YandexMetrika.tsx добавь в declare global
declare global {
  interface Window {
    ym: (id: number, action: string, ...args: unknown[]) => void;
    trackTelegramClick: () => void;  // Добавь свою функцию
  }
}

// В useEffect
useEffect(() => {
  window.trackTelegramClick = () => {
    if (typeof window.ym === "function") {
      window.ym(METRIKA_ID, "reachGoal", "telegram_click");
    }
  };
}, []);
```

Теперь можно вызывать из любого компонента:

```tsx
// В любом компоненте
const handleClick = () => {
  if (typeof window !== "undefined" && window.trackTelegramClick) {
    window.trackTelegramClick();
  }
};
```

## Использование с ENV-переменными

Для вынесения ID счётчика в переменные окружения:

### 1. Создай `.env.local`

```env
NEXT_PUBLIC_YANDEX_METRIKA_ID=12345678
```

### 2. Измени компонент

```tsx
const METRIKA_ID = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID);

// Добавь проверку
if (!METRIKA_ID) {
  console.warn("Yandex Metrika ID not configured");
  return null;
}
```

## Проверка работы

1. Открой DevTools → вкладка Network
2. Отфильтруй по `mc.yandex`
3. Должны быть запросы:
   - `tag.js` — загрузка скрипта метрики
   - `watch/YOUR_ID` — отправка данных

### Отладка целей

В консоли браузера:
```js
// Проверить что метрика загружена
typeof window.ym // должно быть "function"

// Вручную отправить цель
window.ym(12345678, "reachGoal", "test_goal");
```

## Верификация домена (опционально)

Для подтверждения владения сайтом в Яндекс.Вебмастер, добавь в `<head>`:

```tsx
// В app/layout.tsx
<head>
  <meta name="yandex-verification" content="YOUR_VERIFICATION_CODE" />
</head>
```

## Важные нюансы

1. **Suspense обязателен** — `useSearchParams()` требует обёртку в `<Suspense>`
2. **defer: true обязателен** — без него будет двойной хит при загрузке
3. **strategy="afterInteractive"** — загружает скрипт после гидратации React
4. **noscript блок** — для пользователей без JS (SEO, краулеры)

## Ссылки

- [GitHub Issue #56882](https://github.com/vercel/next.js/issues/56882) — обсуждение проблемы
- [Справка Яндекс.Метрики](https://yandex.ru/support/metrica/code/counter-initialize.html) — параметры инициализации
- [Next.js Script component](https://nextjs.org/docs/app/api-reference/components/script) — документация Script
