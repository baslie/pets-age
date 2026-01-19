'use client';

import { useState } from 'react';

interface AgeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export default function AgeSlider({ label, value, min, max, onChange }: AgeSliderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    } else {
      setInputValue(value.toString());
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
    if (e.key === 'Escape') {
      setInputValue(value.toString());
      setIsEditing(false);
    }
  };

  const handleValueClick = () => {
    setInputValue(value.toString());
    setIsEditing(true);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="font-bold text-lg">{label}</label>
        {isEditing ? (
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            min={min}
            max={max}
            autoFocus
            className="w-16 text-center font-bold text-xl border-2 border-black p-1"
          />
        ) : (
          <button
            onClick={handleValueClick}
            className="font-bold text-2xl tabular-nums min-w-[3rem] text-center hover:bg-yellow-200 px-2 py-1 border-2 border-transparent hover:border-black transition-colors"
            title="Click to edit"
          >
            {value}
          </button>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleSliderChange}
        className="w-full h-12 touch-manipulation"
        style={{ touchAction: 'manipulation' }}
      />
      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
