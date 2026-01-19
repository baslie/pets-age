'use client';

import { useEffect, useState, useRef } from 'react';

interface ResultDisplayProps {
  humanAge: number;
}

export default function ResultDisplay({ humanAge }: ResultDisplayProps) {
  const [displayAge, setDisplayAge] = useState(0);
  const displayAgeRef = useRef(0);

  useEffect(() => {
    const targetAge = Math.round(humanAge);
    const duration = 300;
    const startTime = performance.now();
    const startAge = displayAgeRef.current;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out function
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentAge = Math.round(startAge + (targetAge - startAge) * easeOut);
      displayAgeRef.current = currentAge;
      setDisplayAge(currentAge);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [humanAge]);

  return (
    <div className="text-center py-8">
      <p className="text-lg font-medium text-gray-600 mb-2">In human years:</p>
      <div className="text-7xl font-bold tabular-nums text-blue-600">
        {displayAge}
      </div>
      <p className="text-lg text-gray-500 mt-2">years old</p>
    </div>
  );
}
