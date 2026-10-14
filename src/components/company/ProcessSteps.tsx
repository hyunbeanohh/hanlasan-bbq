import { PROCESS_STEPS } from '@/data/company';

export default function ProcessSteps() {
  return (
    <section className="bg-bg py-16">
      <div className="site-width">
        <div className="mb-10">
          <h2 className="text-fg mb-3 text-3xl font-bold md:text-4xl">서비스 진행 과정</h2>
          <p className="text-fg-muted text-lg">문의부터 마무리까지, 4단계로 간단하게</p>
        </div>

        <ol className="grid gap-8 md:grid-cols-2">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step.step} className="flex gap-6">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="bg-surface-2 text-brand z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold">
                  {step.step}
                </div>
              </div>

              {/* Content */}
              <div className={index < PROCESS_STEPS.length - 1 ? 'pb-10' : ''}>
                <h3 className="text-fg mb-2 pt-2.5 text-xl font-bold">{step.title}</h3>
                <p className="text-fg-muted leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
