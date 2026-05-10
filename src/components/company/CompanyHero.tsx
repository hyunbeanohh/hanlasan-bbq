import { STORY } from '@/data/company';
import { SITE } from '@/lib/constants';

export default function CompanyHero() {
  return (
    <section className="py-20 md:py-28 bg-ink">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="inline-flex items-center gap-2 text-brand font-semibold text-sm uppercase tracking-widest mb-6">
          <span aria-hidden="true">🔥</span>
          회사소개
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight mb-6">
          {STORY.headline}
        </h1>
        <p className="text-cream/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {SITE.description}
        </p>
      </div>
    </section>
  );
}
