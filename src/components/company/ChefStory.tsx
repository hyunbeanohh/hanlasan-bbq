import { CHEF, STORY } from '@/data/company';

export default function ChefStory() {
  return (
    <section className="py-20 md:py-24 bg-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Chef image placeholder */}
          <div className="relative aspect-[3/4] max-w-sm mx-auto lg:mx-0 w-full rounded-2xl overflow-hidden bg-warm-100 flex flex-col items-center justify-center gap-4">
            <span className="text-7xl" aria-hidden="true">👨‍🍳</span>
            <p className="text-muted text-sm font-medium">셰프 사진 교체 예정</p>
          </div>

          {/* Story text */}
          <div>
            <p className="text-brand font-semibold text-sm uppercase tracking-widest mb-4">
              우리의 이야기
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight">
              {CHEF.name}
            </h2>
            <p className="text-muted text-base font-medium mb-6">{CHEF.role}</p>
            <div className="space-y-4 text-ink/80 leading-relaxed">
              {STORY.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              <p>{CHEF.summary}</p>
              <p>{CHEF.detail}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
