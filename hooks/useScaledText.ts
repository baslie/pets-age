'use client';

import { useEffect, useState, RefObject } from 'react';

export function useScaledText(
  ref: RefObject<HTMLElement | null>,
  baseWidth = 500
) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = ref.current;
    const container = element?.parentElement;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      const newScale = Math.min(Math.max(containerWidth / baseWidth, 0.6), 1.5);
      setScale(newScale);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [baseWidth, ref]);

  return scale;
}
