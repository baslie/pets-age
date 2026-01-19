'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

interface DogIllustrationProps {
  dogAgeInYears: number;
}

type DogStage = 'puppy' | 'young' | 'adult' | 'senior';

const getDogStage = (ageInYears: number): DogStage => {
  if (ageInYears < 1) return 'puppy';
  if (ageInYears < 3) return 'young';
  if (ageInYears < 8) return 'adult';
  return 'senior';
};

const stageLabels: Record<DogStage, string> = {
  puppy: 'Puppy',
  young: 'Young Dog',
  adult: 'Adult Dog',
  senior: 'Senior Dog',
};

const stageColors: Record<DogStage, { body: string; accent: string }> = {
  puppy: { body: '#FBBF24', accent: '#F59E0B' },
  young: { body: '#F472B6', accent: '#EC4899' },
  adult: { body: '#3B82F6', accent: '#2563EB' },
  senior: { body: '#9CA3AF', accent: '#6B7280' },
};

function DogSVG({ stage }: { stage: DogStage }) {
  const colors = stageColors[stage];

  const tailWag = stage === 'puppy' || stage === 'young';
  const eyeSize = stage === 'puppy' ? 8 : stage === 'senior' ? 5 : 6;

  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-label={`${stageLabels[stage]} illustration`}
    >
      {/* Body */}
      <ellipse
        cx="100"
        cy="100"
        rx={stage === 'puppy' ? 45 : 55}
        ry={stage === 'puppy' ? 35 : 40}
        fill={colors.body}
        stroke="#000"
        strokeWidth="3"
      />

      {/* Head */}
      <circle
        cx={stage === 'puppy' ? 155 : 160}
        cy={stage === 'puppy' ? 75 : 70}
        r={stage === 'puppy' ? 28 : 32}
        fill={colors.body}
        stroke="#000"
        strokeWidth="3"
      />

      {/* Ears */}
      <ellipse
        cx={stage === 'puppy' ? 140 : 140}
        cy={stage === 'puppy' ? 50 : 42}
        rx="10"
        ry={stage === 'puppy' ? 12 : 18}
        fill={colors.accent}
        stroke="#000"
        strokeWidth="3"
        transform={`rotate(-15 140 ${stage === 'puppy' ? 50 : 42})`}
      />
      <ellipse
        cx={stage === 'puppy' ? 175 : 180}
        cy={stage === 'puppy' ? 50 : 42}
        rx="10"
        ry={stage === 'puppy' ? 12 : 18}
        fill={colors.accent}
        stroke="#000"
        strokeWidth="3"
        transform={`rotate(15 ${stage === 'puppy' ? 175 : 180} ${stage === 'puppy' ? 50 : 42})`}
      />

      {/* Eyes */}
      <circle
        cx={stage === 'puppy' ? 148 : 150}
        cy={stage === 'puppy' ? 70 : 65}
        r={eyeSize}
        fill="#000"
      />
      <circle
        cx={stage === 'puppy' ? 165 : 172}
        cy={stage === 'puppy' ? 70 : 65}
        r={eyeSize}
        fill="#000"
      />

      {/* Eye highlights */}
      <circle
        cx={stage === 'puppy' ? 150 : 152}
        cy={stage === 'puppy' ? 68 : 63}
        r={eyeSize / 3}
        fill="#FFF"
      />
      <circle
        cx={stage === 'puppy' ? 167 : 174}
        cy={stage === 'puppy' ? 68 : 63}
        r={eyeSize / 3}
        fill="#FFF"
      />

      {/* Nose */}
      <ellipse
        cx={stage === 'puppy' ? 180 : 185}
        cy={stage === 'puppy' ? 80 : 75}
        rx="6"
        ry="5"
        fill="#000"
      />

      {/* Mouth/Smile */}
      <path
        d={
          stage === 'puppy' || stage === 'young'
            ? `M ${stage === 'puppy' ? 172 : 175} ${stage === 'puppy' ? 90 : 88} Q ${stage === 'puppy' ? 180 : 185} ${stage === 'puppy' ? 98 : 96} ${stage === 'puppy' ? 188 : 195} ${stage === 'puppy' ? 90 : 88}`
            : `M 175 85 Q 185 88 195 85`
        }
        stroke="#000"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Legs */}
      <rect
        x="65"
        y="130"
        width="14"
        height={stage === 'puppy' ? 20 : 25}
        rx="5"
        fill={colors.body}
        stroke="#000"
        strokeWidth="3"
      />
      <rect
        x="90"
        y="130"
        width="14"
        height={stage === 'puppy' ? 20 : 25}
        rx="5"
        fill={colors.body}
        stroke="#000"
        strokeWidth="3"
      />
      <rect
        x="115"
        y="130"
        width="14"
        height={stage === 'puppy' ? 20 : 25}
        rx="5"
        fill={colors.body}
        stroke="#000"
        strokeWidth="3"
      />
      <rect
        x="140"
        y="130"
        width="14"
        height={stage === 'puppy' ? 20 : 25}
        rx="5"
        fill={colors.body}
        stroke="#000"
        strokeWidth="3"
      />

      {/* Tail */}
      <motion.path
        d={`M 45 95 Q 25 ${stage === 'puppy' ? 75 : 85} 30 ${stage === 'puppy' ? 60 : 70}`}
        stroke={colors.accent}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        animate={
          tailWag
            ? {
                d: [
                  `M 45 95 Q 25 75 30 60`,
                  `M 45 95 Q 35 70 45 55`,
                  `M 45 95 Q 25 75 30 60`,
                ],
              }
            : {}
        }
        transition={
          tailWag
            ? {
                duration: 0.4,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }
            : {}
        }
      />

      {/* Collar - only for adult and senior */}
      {(stage === 'adult' || stage === 'senior') && (
        <>
          <rect
            x="148"
            y="95"
            width="24"
            height="8"
            rx="2"
            fill="#EF4444"
            stroke="#000"
            strokeWidth="2"
          />
          <circle cx="160" cy="103" r="4" fill="#FBBF24" stroke="#000" strokeWidth="1.5" />
        </>
      )}

      {/* Gray muzzle for senior */}
      {stage === 'senior' && (
        <ellipse
          cx="178"
          cy="82"
          rx="12"
          ry="8"
          fill="#D1D5DB"
          stroke="#000"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}

export default function DogIllustration({ dogAgeInYears }: DogIllustrationProps) {
  const prefersReducedMotion = useReducedMotion();
  const stage = useMemo(() => getDogStage(dogAgeInYears), [dogAgeInYears]);

  return (
    <div className="relative w-48 h-40 mx-auto mb-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          className="absolute inset-0"
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={prefersReducedMotion ? {} : { opacity: 1 }}
          exit={prefersReducedMotion ? {} : { opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DogSVG stage={stage} />
        </motion.div>
      </AnimatePresence>
      <p className="text-center text-sm font-medium text-gray-600 mt-2">
        {stageLabels[stage]}
      </p>
    </div>
  );
}
