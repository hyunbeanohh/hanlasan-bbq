import { TESTIMONIALS } from '@/data/testimonials';

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-surface-2">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-fg">고객 후기</h2>
        </div>

        {/* 3-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              className="bg-surface rounded-2xl p-8 border border-border flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-0.5" aria-label={`별점 ${t.rating}점`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl" aria-hidden="true">★</span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-fg-soft text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Customer info */}
              <div className="flex items-center gap-3">
                {/* Avatar placeholder — gradient circle */}
                <div
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}
                  aria-hidden="true"
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-fg font-semibold text-sm">{t.name}</p>
                  <p className="text-fg-muted text-xs">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination dots — visual only */}
        <div className="flex justify-center gap-2 mt-10" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-brand" />
          <span className="w-2.5 h-2.5 rounded-full bg-fg-muted/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-fg-muted/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-fg-muted/40" />
        </div>
      </div>
    </section>
  );
}
