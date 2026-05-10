import { PROCESS_STEPS } from '@/data/company';

const STEP_ICONS = ['call', 'edit_note', 'outdoor_grill', 'check_circle'];

export default function ProcessSection() {
  return (
    <section className="py-[120px] bg-[#121414]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-4 block">
            HOW IT WORKS
          </span>
          <h2
            className="text-4xl md:text-5xl font-black text-white uppercase leading-tight"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            이용 안내
          </h2>
          <p className="text-zinc-400 text-lg mt-4 max-w-xl mx-auto">
            문의부터 마무리까지 — 단 4단계로 완성됩니다
          </p>
        </div>

        <div className="relative">
          {/* Timeline horizontal line */}
          <div className="absolute top-10 left-0 w-full h-px bg-white/10 hidden lg:block" aria-hidden="true" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.step} className="flex flex-col items-center text-center">
                {/* Step number */}
                <div className="w-20 h-20 flex items-center justify-center bg-zinc-900 border border-[#f95e14] mb-6 relative">
                  <span className="material-symbols-outlined text-[#f95e14] text-3xl">
                    {STEP_ICONS[index] ?? 'star'}
                  </span>
                  <span className="absolute -top-3 -right-3 w-6 h-6 bg-[#f95e14] text-white text-xs font-black flex items-center justify-center">
                    {step.step}
                  </span>
                </div>

                <h3
                  className="text-white font-bold text-lg mb-3 uppercase tracking-tight"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  {step.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
