import Link from 'next/link';
import { CONTACT } from '@/lib/constants';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-warm-200 min-h-[540px] md:min-h-[620px] flex items-center">
      {/* Photo placeholder — warm gradient simulating BBQ scene */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-warm-200 via-[#c4956a]/40 to-[#8b5e3c]/60"
        aria-hidden="true"
      />
      {/* Subtle dark overlay for text readability */}
      <div className="absolute inset-0 bg-ink/30" aria-hidden="true" />

      {/* Photo placeholder label */}
      <div className="absolute bottom-4 right-4 text-white/40 text-xs pointer-events-none" aria-hidden="true">
        사진 준비중
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
            출장바베큐로 가는 길!
            <br />
            한라산이 함께 합니다.
          </h1>
          <p className="text-white/85 text-lg md:text-xl leading-relaxed mb-8 max-w-xl drop-shadow">
            특별한 날을 위한 최고의 케이터링 — 한라산이 직접 책임집니다.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={CONTACT.phoneTel}
              className="inline-flex items-center justify-center bg-brand text-white font-bold text-base px-8 py-3.5 rounded-full hover:bg-brand-dark active:bg-brand-dark transition-colors shadow-lg"
            >
              예약하기
            </Link>
            <a
              href={CONTACT.phoneTel}
              className="inline-flex items-center gap-2 text-white/90 font-medium hover:text-white transition-colors"
              aria-label={`전화 연결: ${CONTACT.phone}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
