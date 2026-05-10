'use client';

import { CONTACT } from '@/lib/constants';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';

export default function MobileCTABar() {
  return (
    <nav
      aria-label="빠른 연락"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-cream border-t border-warm-100 flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* 전화 */}
      <a
        href={CONTACT.phoneTel}
        aria-label={`전화 연결: ${CONTACT.phone}`}
        onClick={() => trackNaverEvent({ event: 'phone_click', ...getUtm() })}
        className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-brand hover:bg-warm-100 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <span className="text-xs font-medium">전화</span>
      </a>

      {/* Divider */}
      <div className="w-px bg-warm-100 self-stretch my-2" aria-hidden="true" />

      {/* 문자 */}
      <a
        href={CONTACT.smsHref}
        aria-label={`문자 보내기: ${CONTACT.phone}`}
        onClick={() => trackNaverEvent({ event: 'sms_click', ...getUtm() })}
        className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-ink-soft hover:bg-warm-100 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="text-xs font-medium">문자</span>
      </a>

      {/* Divider */}
      <div className="w-px bg-warm-100 self-stretch my-2" aria-hidden="true" />

      {/* 이메일 */}
      <a
        href={CONTACT.mailtoHref}
        aria-label={`이메일 문의: ${CONTACT.email}`}
        onClick={() => trackNaverEvent({ event: 'email_click', ...getUtm() })}
        className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-ink-soft hover:bg-warm-100 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <span className="text-xs font-medium">이메일</span>
      </a>
    </nav>
  );
}
