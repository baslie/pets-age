'use client';

import { GoogleAnalytics as GA } from '@next/third-parties/google';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;
  return <GA gaId={GA_MEASUREMENT_ID} />;
}
