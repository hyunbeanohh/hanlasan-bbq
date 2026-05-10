import { SERVICES } from '@/data/services';

const SERVICE_ICONS: Record<string, string> = {
  'flame-grill': 'local_fire_department',
  'anywhere': 'local_shipping',
  'chef-care': 'restaurant',
  'honest-ingredients': 'eco',
};

export default function ServiceFeatures() {
  return (
    <section className="py-[120px] bg-[#1a1c1c] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-4 block">
            HALLASAN BBQ
          </span>
          <h2
            className="text-4xl md:text-5xl font-black text-white uppercase border-l-0 leading-tight"
            style={{ fontFamily: 'var(--font-headline)', letterSpacing: '-0.01em' }}
          >
            왜 한라산출장바베큐인가요
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((feature) => (
            <div
              key={feature.id}
              className="bg-zinc-900 p-8 border border-white/5 hover:border-[#f95e14] transition-colors duration-500 flex flex-col gap-6"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-zinc-800 border border-[#f95e14]/30 rounded-sm">
                <span
                  className="material-symbols-outlined text-[#f95e14] text-2xl"
                >
                  {SERVICE_ICONS[feature.id] ?? 'star'}
                </span>
              </div>
              <div>
                <h3
                  className="text-white font-bold text-lg mb-3 uppercase tracking-tight"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
