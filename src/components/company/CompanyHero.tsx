export default function CompanyHero() {
  return (
    <section className="relative overflow-hidden bg-surface-2 min-h-[380px] md:min-h-[440px] flex items-center border-b border-border">
      {/* Dark gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-surface-2 via-surface to-bg"
        aria-hidden="true"
      />
      {/* Brand accent */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, #ea580c, transparent 60%)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-4">
          ABOUT US
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fg leading-tight mb-4">
          회사 소개
        </h1>
        <p className="text-fg-soft text-lg md:text-xl max-w-xl mx-auto">
          정성, 전통, 프리미엄의 만남
        </p>
      </div>
    </section>
  );
}
