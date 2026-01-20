'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { trackCookieConsent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';

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
          <div className="bg-secondary-background border-2 border-border shadow-shadow rounded-base p-4 md:p-6">
            <h3 className="font-bold text-lg mb-2">{t('title')}</h3>
            <p className="text-sm text-foreground/80 mb-4">{t('description')}</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleAccept}
                variant="default"
                className="flex-1"
              >
                {t('accept')}
              </Button>
              <Button
                onClick={handleDecline}
                variant="neutral"
                className="flex-1"
              >
                {t('decline')}
              </Button>
            </div>
            <p className="text-xs text-foreground/50 mt-3">
              {t('learnMore')}{' '}
              <Link href="/privacy" className="underline hover:text-main">
                {t('privacyPolicy')}
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
