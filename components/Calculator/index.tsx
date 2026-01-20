'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import AgeSlider from './AgeSlider';
import DatePicker from './DatePicker';
import ResultDisplay from './ResultDisplay';
import DogIllustration from './DogIllustration';
import { calculateHumanAge, toDecimalYears } from '@/lib/calculateAge';
import { trackCalculateAge } from '@/lib/analytics';

type InputMode = 'slider' | 'date';

const springConfig = {
  stiffness: 300,
  damping: 20,
};

export default function Calculator() {
  const t = useTranslations('calculator');
  const [years, setYears] = useState(3);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [inputMode, setInputMode] = useState<InputMode>('slider');
  const prefersReducedMotion = useReducedMotion();

  const dogAgeInYears = useMemo(() => {
    return toDecimalYears(years, months, days);
  }, [years, months, days]);

  const humanAge = useMemo(() => {
    return calculateHumanAge(dogAgeInYears);
  }, [dogAgeInYears]);

  // Track analytics with debounce
  const lastTrackedAge = useRef<number | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only track if age has changed significantly (more than 0.1 years)
      if (
        lastTrackedAge.current === null ||
        Math.abs(dogAgeInYears - lastTrackedAge.current) >= 0.1
      ) {
        trackCalculateAge(dogAgeInYears, humanAge);
        lastTrackedAge.current = dogAgeInYears;
      }
    }, 1000); // Debounce 1 second

    return () => clearTimeout(timer);
  }, [dogAgeInYears, humanAge]);

  const handleDateAgeChange = useCallback((y: number, m: number, d: number) => {
    setYears(y);
    setMonths(m);
    setDays(Math.min(d, 30));
  }, []);

  return (
    <motion.div
      className="rounded-base border-2 border-border shadow-shadow bg-secondary-background p-6 md:p-8 max-w-lg mx-auto"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ type: 'spring', ...springConfig }}
    >
      {/* Result section */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <DogIllustration dogAgeInYears={dogAgeInYears} />
        <ResultDisplay humanAge={humanAge} />
      </div>

      {/* Tabs */}
      <div className="flex mb-6 border-2 border-border rounded-base overflow-hidden">
        <button
          onClick={() => setInputMode('slider')}
          className={`flex-1 py-3 px-4 font-bold text-sm transition-colors ${
            inputMode === 'slider'
              ? 'bg-main text-main-foreground'
              : 'bg-secondary-background text-foreground hover:bg-main/20'
          }`}
          type="button"
        >
          {t('ageTab')}
        </button>
        <button
          onClick={() => setInputMode('date')}
          className={`flex-1 py-3 px-4 font-bold text-sm border-l-2 border-border transition-colors ${
            inputMode === 'date'
              ? 'bg-main text-main-foreground'
              : 'bg-secondary-background text-foreground hover:bg-main/20'
          }`}
          type="button"
        >
          {t('birthdateTab')}
        </button>
      </div>

      {/* Input section */}
      {inputMode === 'slider' ? (
        <motion.div
          key="sliders"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
          transition={{ type: 'spring', ...springConfig }}
        >
          <AgeSlider
            label={t('years')}
            value={years}
            min={0}
            max={25}
            onChange={setYears}
          />

          <AgeSlider
            label={t('months')}
            value={months}
            min={0}
            max={11}
            onChange={setMonths}
          />

          <AgeSlider
            label={t('days')}
            value={days}
            min={0}
            max={30}
            onChange={setDays}
          />
        </motion.div>
      ) : (
        <motion.div
          key="datepicker"
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
          transition={{ type: 'spring', ...springConfig }}
        >
          <DatePicker onAgeChange={handleDateAgeChange} />
          <div className="text-center text-foreground/60 text-sm">
            <p>
              {t('ageDisplay', { years, months, days })}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
