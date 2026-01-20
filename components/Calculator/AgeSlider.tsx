'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';

interface AgeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}

const springConfig = {
  stiffness: 300,
  damping: 20,
};

export default function AgeSlider({ label, value, min, max, onChange, className }: AgeSliderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const prefersReducedMotion = useReducedMotion();

  const springValue = useSpring(value, prefersReducedMotion ? { duration: 0 } : springConfig);
  const displayValue = useTransform(springValue, (v) => Math.max(min, Math.min(max, Math.round(v))));

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleInputBlur = () => {
    const num = parseInt(editValue, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
    setIsEditing(false);
    setEditValue('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue('');
    }
  };

  const handleValueClick = () => {
    setEditValue(value.toString());
    setIsEditing(true);
  };

  return (
    <div className={`mb-4 ${className || ''}`}>
      <div className="flex justify-between items-center mb-2">
        <label className="font-bold text-lg">{label}</label>
        {isEditing ? (
          <motion.input
            type="number"
            value={editValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            min={min}
            max={max}
            autoFocus
            className="w-16 text-center font-bold text-xl border-2 border-border rounded-base p-1 bg-secondary-background"
            initial={prefersReducedMotion ? {} : { scale: 1.1 }}
            animate={prefersReducedMotion ? {} : { scale: 1 }}
            transition={{ type: 'spring', ...springConfig }}
          />
        ) : (
          <motion.button
            onClick={handleValueClick}
            className="font-bold text-2xl tabular-nums min-w-[3rem] text-center hover:bg-main/20 px-2 py-1 border-2 border-transparent hover:border-border rounded-base transition-colors cursor-pointer"
            title="Click to edit"
            whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
          >
            <motion.span>{displayValue}</motion.span>
          </motion.button>
        )}
      </div>
      <motion.div
        className="relative py-2"
        whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
        transition={{ type: 'spring', ...springConfig }}
      >
        <Slider
          min={min}
          max={max}
          step={1}
          value={[value]}
          onValueChange={handleSliderChange}
          className="touch-manipulation"
        />
      </motion.div>
      <div className="flex justify-between text-sm text-foreground/60 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
