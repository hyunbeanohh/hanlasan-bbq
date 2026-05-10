'use client';
import { useEffect } from 'react';
import { captureUtmFromUrl } from '@/lib/analytics/utm';

export default function UtmCapture() {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);
  return null;
}
