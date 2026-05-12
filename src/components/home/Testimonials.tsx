'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { TESTIMONIALS, type Testimonial } from '@/data/testimonials';
import { prefersReducedMotion } from '@/lib/a11y/prefers-reduced-motion';

export default function Testimonials() {
  const [autoplay] = useState(() =>
    Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', slidesToScroll: 1 },
    [autoplay],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    if (prefersReducedMotion()) {
      autoplay.stop();
    }
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, autoplay]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  return (
    <section
      className="py-20 md:py-28 bg-surface-2"
      aria-roledescription="carousel"
      aria-label="고객 후기"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-fg">고객 후기</h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={t.id}
                  className="shrink-0 grow-0 basis-[88%] md:basis-[44%] px-2 md:px-3 transition-[transform,opacity] duration-300"
                  style={{
                    transform: i === selectedIndex ? 'scale(1)' : 'scale(0.88)',
                    opacity: i === selectedIndex ? 1 : 0.45,
                  }}
                >
                  <TestimonialCard
                    t={t}
                    index={i}
                    total={TESTIMONIALS.length}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollPrev}
            aria-label="이전 후기"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-surface border border-border items-center justify-center text-fg-muted hover:text-fg hover:border-fg-muted transition"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="다음 후기"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-surface border border-border items-center justify-center text-fg-muted hover:text-fg hover:border-fg-muted transition"
          >
            ›
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`${i + 1}번째 후기로 이동`}
              aria-current={i === selectedIndex}
              className={
                i === selectedIndex
                  ? 'h-2.5 w-5 rounded-full bg-brand transition-all'
                  : 'h-2.5 w-2.5 rounded-full bg-fg-muted/40 transition-all'
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  t,
  index,
  total,
}: {
  t: Testimonial;
  index: number;
  total: number;
}) {
  return (
    <article
      aria-roledescription="slide"
      aria-label={`후기 ${index + 1} / 총 ${total}`}
      className="bg-surface rounded-2xl p-8 border border-border flex flex-col gap-5 h-full shadow-sm"
    >
      <div className="flex gap-0.5" aria-label={`별점 ${t.rating}점`}>
        {Array.from({ length: t.rating }).map((_, i) => (
          <span key={i} className="text-yellow-400 text-xl" aria-hidden="true">
            ★
          </span>
        ))}
      </div>

      <blockquote className="text-fg-soft text-sm leading-relaxed flex-1 min-h-[120px]">
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs"
          style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)' }}
          aria-hidden="true"
        >
          고{index + 1}
        </div>
        <div>
          <p className="text-fg font-semibold text-sm">{t.name}</p>
          <p className="text-fg-muted text-xs">{t.role}</p>
        </div>
      </div>

      <a
        href={t.blogUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-brand hover:underline inline-flex items-center gap-1 mt-auto"
      >
        네이버 블로그 원문 →
      </a>
    </article>
  );
}
