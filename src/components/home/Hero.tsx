import Image from 'next/image';
import CallButton from '@/components/cta/CallButton';
import SmsButton from '@/components/cta/SmsButton';
import EmailButton from '@/components/cta/EmailButton';

export default function Hero() {
  return (
    <section className="bg-cream py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            <p className="inline-flex items-center gap-2 text-brand font-semibold text-sm mb-6 uppercase tracking-widest">
              <span aria-hidden="true">🔥</span>
              제주 직화구이 출장 케이터링
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-tight mb-6">
              제주에서 시작되는
              <br />
              <span className="text-brand">진짜 직화구이</span>
              <br />
              출장 바베큐
            </h1>
            <p className="text-muted text-lg leading-relaxed mb-10 max-w-lg">
              기업·가족·동호회 어디든 한라산이 갑니다.
              <br />
              제주 직거래 식재료, 셰프 직출장, 세팅부터 정리까지.
            </p>
            <div className="flex flex-wrap gap-3">
              <CallButton variant="primary" />
              <SmsButton variant="ghost" />
              <EmailButton variant="ghost" />
            </div>
          </div>

          {/* Hero image placeholder */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-warm-100 flex items-center justify-center">
            <Image
              src="/images/hero/placeholder.svg"
              alt="한라산출장바베큐 직화구이 현장"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-7xl" aria-hidden="true">🔥</span>
              <p className="text-muted text-sm mt-3 font-medium">실제 사진으로 교체 예정</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
