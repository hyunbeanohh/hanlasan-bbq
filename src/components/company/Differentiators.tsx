import { DIFFERENTIATORS } from '@/data/company';

export default function Differentiators() {
  return (
    <section className="py-20 md:py-24 bg-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">
            CORE VALUES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            핵심 가치
          </h2>
          <div className="w-10 h-0.5 bg-brand mx-auto mb-4" aria-hidden="true" />
          <p className="text-muted text-lg max-w-xl mx-auto">
            단순한 케이터링이 아닙니다. 경험 전체를 설계합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFFERENTIATORS.map((item) => (
            <div
              key={item.id}
              className="bg-warm-50 border border-warm-100 rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow"
            >
              <span className="text-4xl" aria-hidden="true">{item.icon}</span>
              <div>
                <h3 className="text-ink font-bold text-base mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
