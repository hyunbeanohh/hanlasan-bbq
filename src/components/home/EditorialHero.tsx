'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { preload } from 'react-dom';
type Slide = { src: string; title: string };

const FALLBACK_SRC = '/images/menu/tongsamgyeop-v2.webp';
/**
 * 사이트에 있는 대표 사진은 화면 폭에 맞는 크기를 골라 받도록 크기별 WebP를 둔다.
 * (images.unoptimized라 next/image가 srcset을 만들지 않아 직접 지정한다.)
 */
const LOCAL_SRCSET: Record<string, string> = {
  [FALLBACK_SRC]:
    '/images/menu/tongsamgyeop-v2-480.webp 480w, /images/menu/tongsamgyeop-v2-750.webp 750w, /images/menu/tongsamgyeop-v2.webp 900w',
};
const HERO_SIZES = '(max-width: 767px) calc(100vw - 32px), min(1440px, calc(100vw - 80px))';

export default function EditorialHero({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const slide = slides[index];
  const failed = failedSources.includes(slide.src);
  const imageSrc = failed ? FALLBACK_SRC : slide.src;
  const srcSet = LOCAL_SRCSET[imageSrc];
  // 첫 슬라이드(첫 화면 가장 큰 사진)를 HTML 머리에서 바로 받기 시작한다.
  const firstSrcSet = LOCAL_SRCSET[slides[0]?.src];
  if (firstSrcSet) {
    preload(slides[0].src, {
      as: 'image',
      imageSrcSet: firstSrcSet,
      imageSizes: HERO_SIZES,
      fetchPriority: 'high',
    });
  }
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
      {srcSet ? (
        // eslint-disable-next-line @next/next/no-img-element -- 크기별 WebP(srcset)를 직접 쓴다
        <img
          key={imageSrc}
          src={imageSrc}
          srcSet={srcSet}
          sizes={HERO_SIZES}
          alt={failed ? '통삼겹살 바베큐' : slide.title}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Image
          key={slide.src}
          src={imageSrc}
          alt={slide.title}
          referrerPolicy="no-referrer"
          onError={() => {
            if (!failed) setFailedSources((sources) => [...sources, slide.src]);
          }}
          fill
          unoptimized
          className="object-cover"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/15" />
      <div className="relative px-6 pt-12 text-white sm:px-12 md:pt-16">
        <h1 className="mb-5 text-sm font-normal text-white/80">
          통돼지바베큐 출장 · 통삼겹살 바베큐 케이터링
        </h1>
        <p className="text-3xl leading-tight font-bold tracking-tight md:text-5xl">
          불 앞에서 준비한 맛, 행사 자리까지.
        </p>
        <p className="mt-6 text-lg">대표가 직접 준비하는 출장 바베큐 케이터링.</p>
        <p className="mt-1 text-sm text-white/80">기업 행사 · 워크샵 · 동문회 · 가족 모임</p>
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
