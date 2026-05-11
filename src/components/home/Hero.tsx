import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[88vh] md:min-h-screen flex items-center">
      {/* Full-bleed BBQ grill photo */}
      <Image
        src="https://images.unsplash.com/photo-1558030006-450675393462?w=1920&q=80&fm=jpg"
        alt="바베큐 그릴 현장 사진"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* Black gradient overlay for text legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            최고의 맛, 완벽한 서비스.
            <br />
            프리미엄 출장 바베큐.
          </h1>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 drop-shadow">
            당신의 특별한 행사를 위한 최고의 선택.
          </p>

          <Link
            href="/inquiry/new"
            className="inline-flex items-center justify-center bg-brand text-white font-bold text-base px-8 py-4 rounded-full hover:bg-brand-hover active:bg-brand-hover transition-colors shadow-xl"
          >
            상담 신청하기
          </Link>
        </div>
      </div>
    </section>
  );
}
