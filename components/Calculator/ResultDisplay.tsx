'use client';

import { motion, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ResultDisplayProps {
  humanAge: number;
  dogAgeInYears: number;
}

// Threshold: 8 weeks in years
const YOUNG_PUPPY_THRESHOLD = 8 / 52;

export default function ResultDisplay({ humanAge, dogAgeInYears }: ResultDisplayProps) {
  const t = useTranslations('calculator');
  const prefersReducedMotion = useReducedMotion();
  const isVeryYoungPuppy = dogAgeInYears > 0 && dogAgeInYears < YOUNG_PUPPY_THRESHOLD;

  const springConfig = {
    stiffness: 300,
    damping: 20,
  };

  const springValue = useSpring(0, prefersReducedMotion ? { duration: 0 } : springConfig);
  const displayValue = useTransform(springValue, (value) => Math.max(0, Math.round(value)));

  useEffect(() => {
    springValue.set(humanAge);
  }, [humanAge, springValue]);

  return (
    <div className="text-center py-8 lg:py-4">
      <p className="text-lg font-medium text-foreground/60 mb-2">{t('result')}</p>
      <motion.div
        className="text-7xl font-bold tabular-nums text-main font-serif"
        initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
        animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
        transition={{ type: 'spring', ...springConfig }}
      >
        <motion.span>{displayValue}</motion.span>
      </motion.div>
      {isVeryYoungPuppy && (
        <p className="text-sm text-foreground/50 mt-2">
          {t('youngPuppyNote')}
        </p>
      )}
    </div>
  );
}
