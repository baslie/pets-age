'use client';

import { ReactNode } from 'react';

interface ScrollLinkProps {
  targetId: string;
  children: ReactNode;
  className?: string;
}

export default function ScrollLink({ targetId, children, className }: ScrollLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }}
      className={className}
    >
      {children}
    </a>
  );
}
