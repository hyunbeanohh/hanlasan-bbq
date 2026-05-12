'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

type EmblaApi = NonNullable<UseEmblaCarouselType[1]>;
import { TESTIMONIALS, type Testimonial } from '@/data/testimonials';
import { prefersReducedMotion } from '@/lib/a11y/prefers-reduced-motion';

const TWEEN_FACTOR = 0.6;
const MIN_SCALE = 0.88;
const MIN_OPACITY = 0.45;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

// Continuously update each slide's scale + opacity based on distance from the
// current scroll position. Uses embla's documented "tween" pattern so the
// effect tracks the scroll animation — including across the loop wrap point
// (last → first), where state-driven updates would otherwise snap abruptly.
function applyTween(emblaApi: EmblaApi) {
  type LoopPoint = { index: number; target: () => number };
  const engine = emblaApi.internalEngine() as unknown as {
    options: { loop: boolean };
    slideRegistry: number[][];
    slideLooper: { loopPoints: LoopPoint[] };
  };
  const scrollProgress = emblaApi.scrollProgress();
  const slideNodes = emblaApi.slideNodes();

  emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
    let diffToTarget = scrollSnap - scrollProgress;
    const slidesInSnap = engine.slideRegistry[snapIndex];
    if (!slidesInSnap) return;

    slidesInSnap.forEach((slideIndex) => {
      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (slideIndex === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1)
              diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1)
              diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }

      const tweenValue = 1 - Math.abs(diffToTarget * TWEEN_FACTOR);
      const scale = clamp(tweenValue, MIN_SCALE, 1);
      const opacity = clamp(tweenValue, MIN_OPACITY, 1);
      const slide = slideNodes[slideIndex];
      if (slide) {
        slide.style.transform = `scale(${scale})`;
        slide.style.opacity = `${opacity}`;
      }
    });
  });
}

export default function Testimonials() {
  const [autoplay] = useState(() =>
    Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', slidesToScroll: 1, containScroll: false },
    [autoplay],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    if (prefersReducedMotion()) {
      autoplay.stop();
    }
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onScrollOrReInit = () => {
      try {
        applyTween(emblaApi);
      } catch {
        // Some test environments (jsdom) lack the layout APIs the tween
        // pattern relies on. Silently ignore — the slides remain unstyled
        // but still render and respond to navigation.
      }
    };

    onSelect();
    onScrollOrReInit();

    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScrollOrReInit);
    emblaApi.on('reInit', onScrollOrReInit);
    emblaApi.on('slideFocus', onScrollOrReInit);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', onScrollOrReInit);
      emblaApi.off('reInit', onScrollOrReInit);
      emblaApi.off('slideFocus', onScrollOrReInit);
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
                  className="shrink-0 grow-0 basis-[88%] md:basis-[44%] px-2 md:px-3"
                  style={{ transformOrigin: 'center center' }}
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
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full bg-surface border border-border items-center justify-center text-fg-muted hover:text-fg hover:border-fg-muted transition z-10"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="다음 후기"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full bg-surface border border-border items-center justify-center text-fg-muted hover:text-fg hover:border-fg-muted transition z-10"
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
