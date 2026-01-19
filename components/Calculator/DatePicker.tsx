'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface DatePickerProps {
  onAgeChange: (years: number, months: number, days: number) => void;
}

const springConfig = {
  stiffness: 300,
  damping: 20,
};

export default function DatePicker({ onAgeChange }: DatePickerProps) {
  const [birthDate, setBirthDate] = useState<string>('');
  const prefersReducedMotion = useReducedMotion();

  const maxDate = new Date().toISOString().split('T')[0];
  const minDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 25)
  ).toISOString().split('T')[0];

  useEffect(() => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const today = new Date();

    if (birth > today) return;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    onAgeChange(years, months, days);
  }, [birthDate, onAgeChange]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthDate(e.target.value);
  };

  return (
    <motion.div
      className="mb-6"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ type: 'spring', ...springConfig }}
    >
      <label className="font-bold text-lg block mb-2">
        Enter birthdate
      </label>
      <motion.input
        type="date"
        value={birthDate}
        onChange={handleDateChange}
        min={minDate}
        max={maxDate}
        className="w-full p-3 text-lg border-3 border-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        whileFocus={prefersReducedMotion ? {} : { scale: 1.02 }}
        transition={{ type: 'spring', ...springConfig }}
      />
    </motion.div>
  );
}
