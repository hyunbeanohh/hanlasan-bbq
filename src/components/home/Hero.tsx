import CallButton from '@/components/cta/CallButton';
import SmsButton from '@/components/cta/SmsButton';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[80px]">
      {/* Dark ember-glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black z-0">
        {/* Ember glow accent */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(249,94,20,0.35) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-6 block">
          HALLASAN BBQ — 제주에서, 직화로
        </span>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-black text-white mb-6 uppercase leading-tight tracking-tighter"
          style={{ fontFamily: 'var(--font-headline)', letterSpacing: '-0.02em' }}
        >
          불의 예술,
          <br />
          <span className="text-[#ffb59a]">직화의 풍미</span>
        </h1>

        {/* Decorative line */}
        <div className="w-24 h-1 bg-[#f95e14] mx-auto mb-8" />

        <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
          제주 직거래 식재료, 셰프 직출장, 세팅부터 정리까지.
          <br />
          기업·가족·동호회 어디든 한라산이 갑니다.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <CallButton variant="primary">지금 전화 문의</CallButton>
          <SmsButton variant="ghost">문자 견적 문의</SmsButton>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto border-t border-white/10 pt-10">
          <div className="text-center">
            <p
              className="text-3xl font-black text-[#ffb59a] mb-1"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              500+
            </p>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">행사 진행</p>
          </div>
          <div className="text-center border-x border-white/10">
            <p
              className="text-3xl font-black text-[#ffb59a] mb-1"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              12년
            </p>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">셰프 경력</p>
          </div>
          <div className="text-center">
            <p
              className="text-3xl font-black text-[#ffb59a] mb-1"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              100%
            </p>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">제주 직거래</p>
          </div>
        </div>
      </div>
    </section>
  );
}
