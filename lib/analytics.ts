// Google Analytics 4 and Yandex Metrika tracking utilities

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: (counterId: number, method: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Environment variables for analytics IDs
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const YM_COUNTER_ID = 106346783;

// Check if analytics is enabled
export const isAnalyticsEnabled = () => {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem('cookie-consent');
  return consent === 'accepted';
};

// Google Analytics 4 tracking
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  if (!isAnalyticsEnabled()) return;

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// Specific event trackers
export const trackCalculateAge = (dogAge: number, humanAge: number) => {
  trackEvent('calculate_age', {
    dog_age: dogAge,
    human_age: humanAge,
  });
};

export const trackShare = (platform: string) => {
  trackEvent('share', {
    platform,
    content_type: 'result',
  });
};

export const trackLanguageChange = (language: string) => {
  trackEvent('change_language', {
    language,
  });
};

export const trackCookieConsent = (accepted: boolean) => {
  // This event is tracked regardless of consent status
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cookie_consent', {
      accepted,
    });
  }
};

// Page view tracking
export const trackPageView = (url: string) => {
  if (!isAnalyticsEnabled()) return;

  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }

  // Yandex Metrika hit
  if (window.ym && YM_COUNTER_ID) {
    window.ym(Number(YM_COUNTER_ID), 'hit', url);
  }
};
