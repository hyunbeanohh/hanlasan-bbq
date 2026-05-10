import { PROCESS_STEPS } from '@/data/company';

const STEP_ICONS = ['call', 'edit_note', 'outdoor_grill', 'check_circle'];

export default function ProcessSteps() {
  return (
    <section className="py-[120px] bg-[#121414]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-4 block">
            THE JOURNEY
          </span>
          <h2
            className="text-3xl md:text-4xl font-black text-white uppercase leading-tight"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            서비스 진행 과정
          </h2>
          <p className="text-zinc-400 text-lg mt-4">문의부터 마무리까지, 4단계로 간단하게</p>
        </div>

        {/* Timeline grid */}
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 hidden md:block" aria-hidden="true" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {PROCESS_STEPS.map((step, index) => (
              <div
                key={step.step}
                className={`bg-zinc-900 p-8 border border-white/5 hover:border-[#f95e14] transition-colors duration-500${index % 2 === 1 ? ' md:mt-12' : ''}`}
              >
                <span
                  className="text-4xl font-black text-[#f95e14] block mb-4"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  0{step.step}
                </span>
                <span className="material-symbols-outlined text-[#ffb59a] text-2xl block mb-3">
                  {STEP_ICONS[index] ?? 'star'}
                </span>
                <h3
                  className="text-white font-bold text-xl mb-3 uppercase"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  {step.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
