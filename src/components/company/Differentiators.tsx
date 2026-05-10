import { DIFFERENTIATORS } from '@/data/company';

const DIFF_ICONS: Record<string, string> = {
  'direct-jeju': 'water',
  'chef-onsite': 'restaurant',
  'full-setup': 'outdoor_grill',
  'cleanup': 'cleaning_services',
};

export default function Differentiators() {
  return (
    <section className="py-[120px] bg-[#1a1c1c]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-4 block">
            QUALITY WITHOUT COMPROMISE
          </span>
          <h2
            className="text-3xl md:text-4xl font-black text-white uppercase leading-tight"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            한라산출장바베큐가 다른 이유
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DIFFERENTIATORS.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center p-12 bg-[#333535]/30 border border-white/5 hover:shadow-[0_0_20px_rgba(230,81,0,0.1)] transition-all"
            >
              <div className="w-20 h-20 flex items-center justify-center bg-zinc-900 rounded-full mb-6 border border-[#f95e14]">
                <span className="material-symbols-outlined text-[#f95e14] text-4xl">
                  {DIFF_ICONS[item.id] ?? 'star'}
                </span>
              </div>
              <h4
                className="text-white font-bold text-xl mb-3 uppercase"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                {item.title}
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* 4th differentiator — full width */}
        {DIFFERENTIATORS[3] && (
          <div className="mt-8 flex flex-col items-center text-center p-12 bg-[#333535]/30 border border-white/5 hover:shadow-[0_0_20px_rgba(230,81,0,0.1)] transition-all max-w-md mx-auto">
            <div className="w-20 h-20 flex items-center justify-center bg-zinc-900 rounded-full mb-6 border border-[#f95e14]">
              <span className="material-symbols-outlined text-[#f95e14] text-4xl">
                {DIFF_ICONS[DIFFERENTIATORS[3].id] ?? 'star'}
              </span>
            </div>
            <h4
              className="text-white font-bold text-xl mb-3 uppercase"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              {DIFFERENTIATORS[3].title}
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed">{DIFFERENTIATORS[3].description}</p>
          </div>
        )}
      </div>
    </section>
  );
}
