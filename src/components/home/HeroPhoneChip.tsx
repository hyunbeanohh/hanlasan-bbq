'use client';

import { CONTACT } from '@/lib/constants';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';

export default function HeroPhoneChip() {
  return (
    <a
      href={CONTACT.phoneTel}
      onClick={() =>
        trackNaverEvent({ event: 'phone_click', source: 'hero_chip', ...getUtm() })
      }
      className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-full text-sm border border-white/25 hover:bg-white/20 transition-colors"
      aria-label={`전화 ${CONTACT.phone}`}
    >
      <span aria-hidden="true">📞</span>
      <span className="font-bold">{CONTACT.phone}</span>
      <span className="opacity-75 text-xs">통화 즉시 견적</span>
    </a>
  );
}
