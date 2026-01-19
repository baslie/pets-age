'use client';

import { useState, useMemo } from 'react';
import AgeSlider from './AgeSlider';
import ResultDisplay from './ResultDisplay';
import { calculateHumanAge, toDecimalYears } from '@/lib/calculateAge';

export default function Calculator() {
  const [years, setYears] = useState(3);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);

  const dogAgeInYears = useMemo(() => {
    return toDecimalYears(years, months, days);
  }, [years, months, days]);

  const humanAge = useMemo(() => {
    return calculateHumanAge(dogAgeInYears);
  }, [dogAgeInYears]);

  return (
    <div className="card-brutal p-6 md:p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">
        How old is your dog?
      </h2>

      <AgeSlider
        label="Years"
        value={years}
        min={0}
        max={25}
        onChange={setYears}
      />

      <AgeSlider
        label="Months"
        value={months}
        min={0}
        max={11}
        onChange={setMonths}
      />

      <AgeSlider
        label="Days"
        value={days}
        min={0}
        max={30}
        onChange={setDays}
      />

      <div className="border-t-3 border-black mt-6 pt-4">
        <ResultDisplay humanAge={humanAge} />
      </div>
    </div>
  );
}
