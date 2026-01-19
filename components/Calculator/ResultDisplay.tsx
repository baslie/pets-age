'use client';

import { motion, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ResultDisplayProps {
  humanAge: number;
}

export default function ResultDisplay({ humanAge }: ResultDisplayProps) {
  const t = useTranslations('calculator');
  const prefersReducedMotion = useReducedMotion();

  const springConfig = {
    stiffness: 300,
    damping: 20,
  };

  const springValue = useSpring(0, prefersReducedMotion ? { duration: 0 } : springConfig);
  const displayValue = useTransform(springValue, (value) => Math.round(value));

  useEffect(() => {
    springValue.set(humanAge);
  }, [humanAge, springValue]);

  return (
    <div className="text-center py-8">
      <p className="text-lg font-medium text-gray-600 mb-2">{t('result')}</p>
      <motion.div
        className="text-7xl font-bold tabular-nums text-blue-600"
        initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
        animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
        transition={{ type: 'spring', ...springConfig }}
      >
        <motion.span>{displayValue}</motion.span>
      </motion.div>
    </div>
  );
}
