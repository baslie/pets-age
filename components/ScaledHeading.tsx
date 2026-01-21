'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';
import { useScaledText } from '@/hooks/useScaledText';

interface ScaledHeadingProps {
  children: ReactNode;
  className?: string;
  baseWidth?: number;
}

export function ScaledHeading({
  children,
  className = '',
  baseWidth = 500
}: ScaledHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scale = useScaledText(headingRef, baseWidth);
  const [baseHeight, setBaseHeight] = useState(0);

  // Запоминаем исходную высоту при первом рендере
  useEffect(() => {
    if (headingRef.current && baseHeight === 0) {
      setBaseHeight(headingRef.current.offsetHeight);
    }
  }, [baseHeight]);

  return (
    <div
      style={{
        height: baseHeight ? baseHeight * scale : 'auto',
        overflow: 'visible',
      }}
    >
      <h1
        ref={headingRef}
        className={className}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'left top',
        }}
      >
        {children}
      </h1>
    </div>
  );
}
