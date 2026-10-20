'use client';

import { useEffect } from 'react';
import { trackGoogleConversion } from '@/lib/analytics/google';

export default function GoogleConversionEvents() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a[href]');
      if (link?.getAttribute('href')?.startsWith('tel:')) {
        trackGoogleConversion('phone_click');
      }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
