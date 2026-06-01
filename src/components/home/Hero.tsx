import Link from 'next/link';
import HeroTitleTyping from './HeroTitleTyping';

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[88vh] md:min-h-screen flex items-center">
      {/* Local gradient on top of the page-level BBQ background for hero text legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg min-h-[2.5em]">
            <span className="sr-only">최고의 맛, 완벽한 서비스. 프리미엄 출장 바베큐.</span>
            <span aria-hidden="true">
              <HeroTitleTyping />
            </span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 drop-shadow">
            당신의 특별한 행사를 위한 최고의 선택.
          </p>

          <Link
            href="/inquiry/new"
            className="inline-flex items-center justify-center bg-brand text-white font-bold text-base px-8 py-4 rounded-full hover:bg-brand-hover active:bg-brand-hover transition-colors shadow-xl"
          >
            예약 문의
          </Link>
        </div>
      </div>
    </section>
  );
}
