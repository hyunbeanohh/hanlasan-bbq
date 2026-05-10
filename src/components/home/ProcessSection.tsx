import { PROCESS_STEPS } from '@/data/company';

export default function ProcessSection() {
  return (
    <section className="py-20 md:py-24 bg-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">
            HOW IT WORKS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            이용 안내
          </h2>
          <div className="w-10 h-0.5 bg-brand mx-auto mb-4" aria-hidden="true" />
          <p className="text-muted text-lg max-w-xl mx-auto">
            문의부터 마무리까지 — 단 4단계로 완성됩니다
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, index) => (
            <div
              key={step.step}
              className="relative bg-warm-50 border border-warm-100 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              {/* Step number */}
              <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg mb-4 shrink-0">
                {step.step}
              </div>
              {/* Connector (desktop only, between cards) */}
              {index < PROCESS_STEPS.length - 1 && (
                <div
                  className="hidden lg:block absolute h-0.5 bg-warm-200 top-10 left-[calc(100%-0px)] w-6 -translate-y-0.5 z-10"
                  aria-hidden="true"
                />
              )}
              <h3 className="font-bold text-ink text-base mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
