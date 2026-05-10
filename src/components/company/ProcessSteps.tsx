import { PROCESS_STEPS } from '@/data/company';

export default function ProcessSteps() {
  return (
    <section className="py-20 md:py-24 bg-surface-2">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">
            PROCESS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-fg mb-3">
            서비스 진행 과정
          </h2>
          <div className="w-10 h-0.5 bg-brand mx-auto mb-4" aria-hidden="true" />
          <p className="text-fg-muted text-lg">
            문의부터 마무리까지, 4단계로 간단하게
          </p>
        </div>

        <ol className="relative space-y-0">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step.step} className="flex gap-6">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg shrink-0 z-10">
                  {step.step}
                </div>
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border my-2" aria-hidden="true" />
                )}
              </div>

              {/* Content */}
              <div className={index < PROCESS_STEPS.length - 1 ? 'pb-10' : ''}>
                <h3 className="font-bold text-fg text-xl mb-2 pt-2.5">{step.title}</h3>
                <p className="text-fg-muted leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
