export default function CompanyHero() {
  return (
    <section className="relative overflow-hidden bg-warm-200 min-h-[380px] md:min-h-[440px] flex items-center">
      {/* Photo placeholder gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-warm-200 via-[#c4956a]/40 to-[#8b5e3c]/60"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-ink/40" aria-hidden="true" />
      <div className="absolute bottom-4 right-4 text-white/30 text-xs pointer-events-none" aria-hidden="true">
        사진 준비중
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-brand-soft text-xs font-semibold uppercase tracking-widest mb-4">
          ABOUT US
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
          회사 소개
        </h1>
        <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto">
          정성, 전통, 프리미엄의 만남
        </p>
      </div>
    </section>
  );
}
