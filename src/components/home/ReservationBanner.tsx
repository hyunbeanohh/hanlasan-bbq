'use client';

import { CONTACT } from '@/lib/constants';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';

export default function ReservationBanner() {
  return (
    <section id="contact" className="relative py-16 md:py-20 bg-brand">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center text-white">
        <p className="text-xs font-bold tracking-widest opacity-70">
          — 폼 입력이 어렵다면 —
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-2">
          바로 통화로 견적 받기
        </h2>
        <p className="opacity-85 mb-6">
          평일 10분 내 회신 · 통화 즉시 견적
        </p>
        <a
          href={CONTACT.phoneTel}
          onClick={() =>
            trackNaverEvent({ event: 'phone_click', source: 'bottom_cta', ...getUtm() })
          }
          className="inline-flex items-center gap-2 bg-white text-brand font-bold text-lg px-6 py-3 rounded-lg hover:brightness-95 transition"
          aria-label={`전화 ${CONTACT.phone}`}
        >
          <span aria-hidden="true">📞</span>
          <span>{CONTACT.phone}</span>
        </a>
      </div>
    </section>
  );
}
