import { STORY } from '@/data/company';

export default function CompanyHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-[80px]">
      {/* Dark ember-glow hero background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950 z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black z-0">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(249,94,20,0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
        <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-6 block">
          제주에서, 직화로
        </span>
        <h1
          className="text-5xl md:text-7xl font-black text-white mb-6 uppercase leading-tight"
          style={{ fontFamily: 'var(--font-headline)', letterSpacing: '-0.02em' }}
        >
          불의 예술:
          <br />
          <span className="text-[#ffb59a]">우리의 이야기</span>
        </h1>
        <div className="w-24 h-1 bg-[#f95e14] mx-auto mb-8" />
        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {STORY.headline}
        </p>
      </div>
    </section>
  );
}
