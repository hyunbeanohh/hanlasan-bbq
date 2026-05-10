import { SERVICES } from '@/data/services';

export default function ServiceFeatures() {
  return (
    <section className="py-20 md:py-24 bg-warm-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">
            WHY HALLASAN
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            왜 한라산출장바베큐인가요?
          </h2>
          <div className="w-10 h-0.5 bg-brand mx-auto" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((feature) => (
            <div
              key={feature.id}
              className="bg-cream rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow border border-warm-100"
            >
              <span className="text-4xl" aria-hidden="true">{feature.icon}</span>
              <div>
                <h3 className="text-ink font-bold text-base mb-2">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
