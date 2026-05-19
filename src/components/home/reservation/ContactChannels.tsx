'use client';

import { CONTACT } from '@/lib/constants';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';

export default function ContactChannels() {
  return (
    <div className="flex flex-col gap-2.5" aria-label="연락 채널">
      <p className="text-center text-[11px] tracking-widest uppercase text-white/65 hidden md:block">
        — 바로 통화·채팅 —
      </p>

      <a
        href={CONTACT.phoneTel}
        onClick={() =>
          trackNaverEvent({ event: 'phone_click', source: 'quick_quote_section', ...getUtm() })
        }
        className="flex items-center gap-3 bg-white text-brand rounded-xl px-4 py-3.5 hover:brightness-95"
        aria-label={`전화 ${CONTACT.phone}`}
      >
        <span className="text-2xl leading-none w-9 text-center" aria-hidden="true">
          📞
        </span>
        <span className="flex-1">
          <span className="block text-[11px] font-semibold opacity-75">가장 빠름</span>
          <span className="block font-bold text-base leading-tight">{CONTACT.phone}</span>
          <span className="block text-[11px] opacity-70 mt-0.5 hidden md:block">통화 즉시 견적</span>
        </span>
      </a>

      {CONTACT.kakaoChannelUrl ? (
        <a
          href={CONTACT.kakaoChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackNaverEvent({ event: 'kakao_click', source: 'quick_quote_section', ...getUtm() })
          }
          className="flex items-center gap-3 bg-[#FEE500] text-[#181600] rounded-xl px-4 py-3.5 hover:brightness-95"
          aria-label="카카오톡 1:1 채팅"
        >
          <span className="text-2xl leading-none w-9 text-center" aria-hidden="true">
            💬
          </span>
          <span className="flex-1">
            <span className="block text-[11px] font-semibold opacity-75">카카오톡</span>
            <span className="block font-bold text-base leading-tight">1:1 채팅 상담</span>
            <span className="block text-[11px] opacity-70 mt-0.5 hidden md:block">평일 10분 내</span>
          </span>
        </a>
      ) : null}

      <a
        href={CONTACT.mailtoHref}
        onClick={() =>
          trackNaverEvent({ event: 'email_click', source: 'quick_quote_section', ...getUtm() })
        }
        className="hidden md:flex items-center gap-3 bg-white/10 text-white border border-white/22 rounded-xl px-4 py-3.5 hover:bg-white/15"
        aria-label="이메일 문의"
      >
        <span className="text-2xl leading-none w-9 text-center" aria-hidden="true">
          ✉
        </span>
        <span className="flex-1">
          <span className="block text-[11px] font-semibold opacity-75">이메일</span>
          <span className="block font-bold text-base leading-tight">상세 문의</span>
          <span className="block text-[11px] opacity-70 mt-0.5">영업일 24h 내</span>
        </span>
      </a>
    </div>
  );
}
