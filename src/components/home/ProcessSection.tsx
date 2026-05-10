import { PROCESS_STEPS } from '@/data/company';

export default function ProcessSection() {
  return (
    <section className="py-20 md:py-24 bg-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            이용 안내
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            문의부터 마무리까지 — 단 4단계로 완성됩니다
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step, index) => (
            <div key={step.step} className="relative flex flex-col items-center text-center">
              {/* Step number circle */}
              <div className="w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xl mb-4 shrink-0">
                {step.step}
              </div>

              {/* Connector line (hidden on last item) */}
              {index < PROCESS_STEPS.length - 1 && (
                <div
                  className="hidden lg:block absolute h-px bg-warm-100 w-full top-7 left-1/2"
                  aria-hidden="true"
                />
              )}

              <h3 className="font-bold text-ink text-lg mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
