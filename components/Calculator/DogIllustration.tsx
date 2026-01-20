'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import Image from 'next/image';

interface DogIllustrationProps {
  dogAgeInYears: number;
}

type DogStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const getDogStage = (ageInYears: number): DogStage => {
  if (ageInYears < 0.33) return 1;    // 0-4 мес → 2 мес
  if (ageInYears < 0.75) return 2;    // 4-9 мес → 6 мес
  if (ageInYears < 1.5) return 3;     // 9 мес - 1.5 года → 1 год
  if (ageInYears < 3) return 4;       // 1.5-3 года → 2 года
  if (ageInYears < 5) return 5;       // 3-5 лет → 4 года
  if (ageInYears < 7) return 6;       // 5-7 лет → 6 лет
  if (ageInYears < 9) return 7;       // 7-9 лет → 8 лет
  if (ageInYears < 11) return 8;      // 9-11 лет → 10 лет
  if (ageInYears < 13) return 9;      // 11-13 лет → 12 лет
  if (ageInYears < 15) return 10;     // 13-15 лет → 14 лет
  if (ageInYears < 17) return 11;     // 15-17 лет → 16 лет
  return 12;                          // 17+ лет → 18-20 лет
};

export default function DogIllustration({ dogAgeInYears }: DogIllustrationProps) {
  const prefersReducedMotion = useReducedMotion();
  const stage = useMemo(() => getDogStage(dogAgeInYears), [dogAgeInYears]);

  return (
    <div className="relative w-48 h-48 lg:w-40 lg:h-40 mx-auto mb-4 lg:mb-0 lg:mx-0">
      <AnimatePresence>
        <motion.div
          key={stage}
          className="absolute inset-0"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          exit={prefersReducedMotion ? {} : { opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Image
            src={`/images/dog/stage-${stage}.png`}
            alt={`Dog stage ${stage}`}
            fill
            className="object-contain"
            priority={stage <= 3}
            sizes="(min-width: 1024px) 128px, 192px"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
