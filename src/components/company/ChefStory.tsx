import Image from 'next/image';
import { CHEF, STORY } from '@/data/company';

export default function ChefStory() {
  return (
    <section className="py-20 md:py-24 bg-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Brand Story section header */}
        <div className="text-center mb-14">
          <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">
            OUR STORY
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-fg mb-3">
            브랜드 스토리
          </h2>
          <div className="w-10 h-0.5 bg-brand mx-auto" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Chef portrait */}
          <div className="relative aspect-[3/4] max-w-sm mx-auto lg:mx-0 w-full rounded-2xl overflow-hidden bg-surface border border-border">
            <Image
              src={CHEF.imageSrc}
              alt={`${CHEF.name} - ${CHEF.role}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 384px"
              priority
            />
          </div>

          {/* Story text */}
          <div>
            <p className="text-brand font-semibold text-sm uppercase tracking-widest mb-4">
              대표 인사말
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-fg mb-2">
              {CHEF.name}
            </h3>
            <p className="text-fg-muted text-base font-medium mb-6">{CHEF.role}</p>
            <div className="space-y-4 text-fg-soft leading-relaxed">
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
