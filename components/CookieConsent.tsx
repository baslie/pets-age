'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { trackCookieConsent } from '@/lib/analytics';

export default function CookieConsent() {
  const t = useTranslations('cookie');
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay to avoid layout shift on initial load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    trackCookieConsent(true);
    setIsVisible(false);
    // Reload to enable analytics
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    trackCookieConsent(false);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 100 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="bg-white border-3 border-black shadow-[4px_4px_0_#000] p-4 md:p-6">
            <h3 className="font-bold text-lg mb-2">{t('title')}</h3>
            <p className="text-sm text-gray-700 mb-4">{t('description')}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 bg-blue-500 text-white border-3 border-black shadow-[4px_4px_0_#000]
                           hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]
                           active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
                           transition-all px-4 py-2 font-bold text-sm"
              >
                {t('accept')}
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 bg-gray-200 text-gray-800 border-3 border-black shadow-[4px_4px_0_#000]
                           hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]
                           active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
                           transition-all px-4 py-2 font-bold text-sm"
              >
                {t('decline')}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {t('learnMore')}{' '}
              <a href="/privacy" className="underline hover:text-blue-500">
                {t('privacyPolicy')}
              </a>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
