import { DIFFERENTIATORS } from '@/data/company';

export default function Differentiators() {
  return (
    <section className="py-20 md:py-24 bg-warm-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            한라산출장바베큐가 다른 이유
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            단순한 케이터링이 아닙니다. 경험 전체를 설계합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {DIFFERENTIATORS.map((item) => (
            <div
              key={item.id}
              className="bg-cream rounded-xl p-8 flex gap-5 hover:shadow-md transition-shadow"
            >
              <span className="text-4xl shrink-0 mt-1" aria-hidden="true">{item.icon}</span>
              <div>
                <h3 className="text-ink font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-muted leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
