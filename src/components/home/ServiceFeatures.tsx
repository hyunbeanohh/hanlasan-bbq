import { SERVICES } from '@/data/services';

export default function ServiceFeatures() {
  return (
    <section className="py-20 md:py-24 bg-ink">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-cream mb-4">
            왜 한라산출장바베큐인가요?
          </h2>
          <p className="text-cream/60 text-lg max-w-xl mx-auto">
            직화의 풍미부터 현장 정리까지 — 모든 순간을 책임집니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((feature) => (
            <div
              key={feature.id}
              className="bg-cream/5 border border-cream/10 rounded-xl p-6 flex flex-col gap-4 hover:bg-cream/10 transition-colors"
            >
              <span className="text-4xl" aria-hidden="true">{feature.icon}</span>
              <div>
                <h3 className="text-cream font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-cream/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
