'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
type Slide = { src: string; title: string };
export default function EditorialHero({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const slide = slides[index];
  const failed = failedSources.includes(slide.src);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (
      paused ||
      hover ||
      slides.length < 2 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [paused, hover, slides.length]);
  function move(step: number) {
    setPaused(true);
    setIndex((i) => (i + step + slides.length) % slides.length);
  }
  return (
    <section
      className="editorial-hero"
      aria-label="바베큐와 행사 사진"
      aria-roledescription="슬라이드"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHover(false);
      }}
    >
      <Image
        key={slide.src}
        src={failed ? '/images/menu/tongsamgyeop-v2.jpg' : slide.src}
        alt={failed ? '통삼겹살 바베큐' : slide.title}
        referrerPolicy="no-referrer"
        onError={() => {
          if (!failed) setFailedSources((sources) => [...sources, slide.src]);
        }}
        fill
        priority
        unoptimized
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/15" />
      <div className="relative px-6 pt-12 text-white sm:px-12 md:pt-16">
        <p className="mb-5 text-sm text-white/80">기업 행사 · 워크샵 · 동문회 · 가족 모임</p>
        <h1 className="text-3xl leading-tight font-bold tracking-tight md:text-5xl">
          불 앞에서 준비한 맛, 행사 자리까지.
        </h1>
        <p className="mt-6 text-lg">대표가 직접 준비하는 출장 바베큐 케이터링.</p>
        <p className="mt-2 text-sm text-white/80">
          통돼지·통삼겹살·해물 바베큐를 현장에서 준비합니다.
          <br />
          식사 구성과 출장 가능 여부는 상담해 주세요.
        </p>
      </div>
      <div className="absolute inset-x-6 bottom-5 flex items-end justify-between gap-4 text-white sm:inset-x-12">
        <p className="line-clamp-2 max-w-[55%] text-sm">{slides[index].title}</p>
        <div className="flex items-center gap-1 rounded-lg bg-black/40 p-1">
          <span className="px-2 text-xs tabular-nums">
            {index + 1} / {slides.length}
          </span>
          <button type="button" className="p-3" onClick={() => move(-1)} aria-label="이전 사진">
            ←
          </button>
          <button
            type="button"
            className="p-3 text-xs"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? '슬라이드 재생' : '슬라이드 일시 정지'}
          >
            {paused ? '재생' : '정지'}
          </button>
          <button type="button" className="p-3" onClick={() => move(1)} aria-label="다음 사진">
            →
          </button>
        </div>
      </div>
    </section>
  );
}
