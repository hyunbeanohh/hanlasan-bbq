import { CHEF, STORY } from '@/data/company';

export default function ChefStory() {
  return (
    <section className="py-[120px] px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* Image placeholder — Option B */}
        <div className="relative group">
          <div className="absolute -inset-4 border border-white/10 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" aria-hidden="true" />
          <div className="relative z-10 w-full h-[500px] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex flex-col items-center justify-center gap-4">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 80%, rgba(249,94,20,0.4) 0%, transparent 70%)',
              }}
            />
            <span className="material-symbols-outlined text-[#f95e14] text-6xl relative z-10">
              person
            </span>
            <p className="text-zinc-500 text-sm relative z-10">[대표 사진 준비중]</p>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-8">
          <h2
            className="text-3xl md:text-4xl font-black text-white uppercase border-l-4 border-[#f95e14] pl-6 leading-tight"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            우리의 철학
          </h2>
          {STORY.body.map((para, i) => (
            <p key={i} className="text-white/80 text-lg leading-relaxed">
              {para}
            </p>
          ))}
          <div className="pt-4 border-t border-white/10">
            <p className="text-[#ffb59a] font-bold text-lg" style={{ fontFamily: 'var(--font-headline)' }}>
              {CHEF.name}
            </p>
            <p className="text-zinc-500 text-sm mt-1">{CHEF.role}</p>
          </div>
          <div className="pt-2">
            <p className="text-zinc-400 text-base leading-relaxed">{CHEF.summary}</p>
            <p className="text-zinc-400 text-base leading-relaxed mt-4">{CHEF.detail}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
