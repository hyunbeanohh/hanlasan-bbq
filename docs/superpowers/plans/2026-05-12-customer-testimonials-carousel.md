# 고객 후기 스포트라이트 캐러셀 — 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈 페이지의 `Testimonials` 섹션을 정적 그리드에서 스포트라이트 카루셀로 전환하고, 운영자 네이버 블로그(`ohnamsoo3822`) 후기 최대 10개를 자동 순환 노출한다.

**Architecture:** `Testimonials.tsx`를 클라이언트 컴포넌트로 재작성하여 `embla-carousel-react` + `embla-carousel-autoplay` 기반 캐러셀로 만든다. 데이터는 `src/data/testimonials.ts`에 정적으로 둔다 (런타임 RSS 호출 없음). 콘텐츠 초안은 기존 `fetchNaverBlogRss` 유틸을 호출하는 일회성 Node 스크립트로 수집하고 사용자 검수 후 배열에 반영한다.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, TypeScript, Vitest, jsdom, `embla-carousel-react`, `embla-carousel-autoplay`, 기존 `src/lib/blog/naver-rss.ts`.

**Spec deviation:** 원본 spec은 `rss-parser` 라이브러리 사용을 명시했으나, 코드베이스에 이미 `fetchNaverBlogRss(blogId)`(regex 기반)가 갤러리 섹션에서 동일 블로그에 대해 사용 중. 같은 함수를 재사용한다 — 새 의존성 0개 추가.

---

## File Structure

**New files**
- `scripts/fetch-blog-reviews.mts` — 일회성 Node 스크립트. `fetchNaverBlogRss`를 호출해 게시글 목록을 JSON으로 stdout에 출력.
- `src/components/home/Testimonials.test.tsx` — Testimonials 컴포넌트 단위 테스트.
- `src/lib/a11y/prefers-reduced-motion.ts` — `window.matchMedia('(prefers-reduced-motion: reduce)')`를 안전하게 감지하는 헬퍼.
- `src/lib/a11y/prefers-reduced-motion.test.ts` — 헬퍼 단위 테스트.

**Modified files**
- `package.json` — `embla-carousel-react`, `embla-carousel-autoplay` 추가.
- `src/data/testimonials.ts` — `Testimonial` 타입에 `blogUrl` 추가, 데이터 최대 10개로 교체.
- `src/components/home/Testimonials.tsx` — `'use client'` 캐러셀 컴포넌트로 재작성.

---

## Task 1: 캐러셀 의존성 설치

**Files:**
- Modify: `package.json`

- [ ] **Step 1: embla 패키지 설치**

Run:
```bash
npm install embla-carousel-react embla-carousel-autoplay
```

Expected: 두 패키지가 `dependencies`에 추가되고 `package-lock.json`이 업데이트된다.

- [ ] **Step 2: 설치 결과 확인**

Run: `grep -E "embla-carousel" package.json`

Expected output:
```
    "embla-carousel-autoplay": "^8.x.x",
    "embla-carousel-react": "^8.x.x",
```

- [ ] **Step 3: 커밋**

```bash
git add package.json package-lock.json
git commit -m "chore: add embla-carousel deps for testimonials slider

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: RSS 수집 스크립트 작성 및 실행

**Files:**
- Create: `scripts/fetch-blog-reviews.mts`

- [ ] **Step 1: 스크립트 작성**

Create `scripts/fetch-blog-reviews.mts`:

```ts
import { fetchNaverBlogRss } from '../src/lib/blog/naver-rss';
import { NAVER } from '../src/lib/constants';

async function main() {
  const posts = await fetchNaverBlogRss(NAVER.blogId);
  const top = posts.slice(0, 10).map((p, i) => ({
    index: i + 1,
    title: p.title,
    summary: p.summary,
    originalUrl: p.originalUrl,
    publishedAt: p.publishedAt,
  }));
  console.log(JSON.stringify(top, null, 2));
  console.error(`Fetched ${posts.length} posts, showing top ${top.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: 스크립트 실행하여 후기 후보 출력**

Run:
```bash
npx tsx scripts/fetch-blog-reviews.mts > /tmp/blog-reviews.json
```

Expected: `/tmp/blog-reviews.json` 에 후보 게시글 최대 10개의 JSON 배열이 저장된다. stderr에 "Fetched N posts, showing top M" 메시지.

만약 `tsx`가 없으면 먼저 설치: `npm install -D tsx`.

- [ ] **Step 3: 결과를 사용자에게 보여주고 검수 받기**

`/tmp/blog-reviews.json` 내용을 사용자에게 출력하고, 어떤 글을 슬라이드에 쓸지, 각 글의 인용문(2~3줄)·역할(이벤트·인원 표기)을 함께 결정한다. 결정된 내용은 Task 7에서 데이터 파일에 반영한다.

스크립트는 일회성이므로 git에 추가하지 않는다 (`.gitignore`에 `scripts/fetch-blog-reviews.mts`를 명시할 필요 없음 — `scripts/` 디렉터리는 트래킹되지만 이 스크립트는 결과만 사용하고 보관). 단, 향후 재실행 가능성이 있으므로 커밋해도 된다 — 다음 스텝.

- [ ] **Step 4: 스크립트 커밋**

```bash
git add scripts/fetch-blog-reviews.mts
git commit -m "chore: add one-shot script to fetch naver blog reviews

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: `prefers-reduced-motion` 헬퍼 (TDD)

**Files:**
- Test: `src/lib/a11y/prefers-reduced-motion.test.ts`
- Create: `src/lib/a11y/prefers-reduced-motion.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

Create `src/lib/a11y/prefers-reduced-motion.test.ts`:

```ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { prefersReducedMotion } from './prefers-reduced-motion';

describe('prefersReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false when window is undefined (SSR)', () => {
    vi.stubGlobal('window', undefined);
    expect(prefersReducedMotion()).toBe(false);
  });

  it('returns true when the media query matches', () => {
    vi.stubGlobal('window', {
      matchMedia: (q: string) => ({
        matches: q.includes('reduce'),
        media: q,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
    expect(prefersReducedMotion()).toBe(true);
  });

  it('returns false when the media query does not match', () => {
    vi.stubGlobal('window', {
      matchMedia: () => ({
        matches: false,
        media: '',
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });
    expect(prefersReducedMotion()).toBe(false);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/lib/a11y/prefers-reduced-motion.test.ts`

Expected: FAIL — 모듈을 찾을 수 없다는 에러.

- [ ] **Step 3: 헬퍼 구현**

Create `src/lib/a11y/prefers-reduced-motion.ts`:

```ts
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/lib/a11y/prefers-reduced-motion.test.ts`

Expected: PASS — 3 tests pass.

- [ ] **Step 5: 커밋**

```bash
git add src/lib/a11y/prefers-reduced-motion.ts src/lib/a11y/prefers-reduced-motion.test.ts
git commit -m "feat(a11y): add prefersReducedMotion helper

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Testimonials 데이터 타입 확장 + 플레이스홀더 10개

**Files:**
- Modify: `src/data/testimonials.ts`

Task 7에서 Task 2의 검수 결과로 교체하므로 우선 그럴듯한 플레이스홀더 10개로 채운다. 컴포넌트 구현/테스트가 데이터 진위와 무관하게 진행되도록 하기 위함.

- [ ] **Step 1: 타입과 데이터 교체**

Replace contents of `src/data/testimonials.ts`:

```ts
export type Testimonial = {
  id: string;
  rating: 5;
  quote: string;
  name: string;
  role: string;
  blogUrl: string;
};

const BLOG_HOME = 'https://blog.naver.com/ohnamsoo3822';

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    rating: 5,
    quote: '제주 가족 여행 마지막 밤 펜션에서 진행했어요. 셰프님이 직접 흑돼지를 구워주시는데 향이 정말 좋았고, 아이들도 너무 좋아했습니다.',
    name: '고객1',
    role: '가족 모임 · 10인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't2',
    rating: 5,
    quote: '회사 워크샵 30명 출장. 셰프님이 직접 와주셔서 모든 분들이 만족했습니다. 흑돼지 퀄리티가 인상적이었어요.',
    name: '고객2',
    role: '기업 워크샵 · 30인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't3',
    rating: 5,
    quote: '돌잔치 출장 케이터링으로 부탁드렸는데 음식 퀄리티는 물론 세팅과 정리까지 흠잡을 데가 없었습니다.',
    name: '고객3',
    role: '돌잔치 · 50인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't4',
    rating: 5,
    quote: '동호회 야외 모임에서 진행했는데 셰프님이 분위기까지 살려주셔서 모두 즐겁게 즐겼습니다.',
    name: '고객4',
    role: '동호회 · 25인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't5',
    rating: 5,
    quote: '제주 펜션 가족 모임. 사전 상담부터 정리까지 완벽했고 음식도 기대 이상이었습니다.',
    name: '고객5',
    role: '가족 모임 · 12인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't6',
    rating: 5,
    quote: '바닷가 펜션에서 진행한 친구 모임. 해산물 조합이 신선했고 셰프님 친절하셨어요.',
    name: '고객6',
    role: '친구 모임 · 8인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't7',
    rating: 5,
    quote: '생일 파티 출장. 메뉴 구성도 풍성하고 사진 찍기 좋게 세팅해 주셔서 너무 만족스러웠습니다.',
    name: '고객7',
    role: '생일 파티 · 15인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't8',
    rating: 5,
    quote: '결혼 기념일에 부모님 모시고 진행. 직화 향과 셰프님 응대 모두 최고였습니다.',
    name: '고객8',
    role: '가족 모임 · 6인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't9',
    rating: 5,
    quote: '회사 팀 회식. 식재료 신선도와 양 모두 만족스러웠고 정리도 깔끔했습니다.',
    name: '고객9',
    role: '기업 회식 · 18인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't10',
    rating: 5,
    quote: '제주 출장 일정 중 바베큐. 일정 조율부터 음식까지 모든 면에서 추천할 만합니다.',
    name: '고객10',
    role: '기업 출장 · 20인',
    blogUrl: BLOG_HOME,
  },
];
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`

Expected: no errors.

이 시점에서 `Testimonials.tsx`는 기존 그리드 코드 그대로지만, 새 타입 필드(`blogUrl`)는 사용하지 않으므로 컴파일 통과. 데이터 10개 중 3개만 그리드에 표시될 것이지만 다음 Task에서 캐러셀로 교체된다.

- [ ] **Step 3: 커밋**

```bash
git add src/data/testimonials.ts
git commit -m "feat(data): expand testimonials to 10 items with blogUrl field

Placeholder content — will be replaced with Naver blog content after review.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Testimonials 캐러셀 컴포넌트 재작성

**Files:**
- Modify: `src/components/home/Testimonials.tsx`

- [ ] **Step 1: 컴포넌트를 캐러셀로 재작성**

Replace contents of `src/components/home/Testimonials.tsx`:

```tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { TESTIMONIALS, type Testimonial } from '@/data/testimonials';
import { prefersReducedMotion } from '@/lib/a11y/prefers-reduced-motion';

export default function Testimonials() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(prefersReducedMotion());
  }, []);

  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false })
  );

  const plugins = reduceMotion ? [] : [autoplayRef.current];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', slidesToScroll: 1 },
    plugins
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

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
                  <TestimonialCard t={t} index={i} total={TESTIMONIALS.length} />
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
```

- [ ] **Step 2: 타입 체크 + 빌드**

Run: `npx tsc --noEmit`

Expected: no errors.

- [ ] **Step 3: 로컬 dev 서버에서 시각 확인**

Run (백그라운드): `npm run dev`

브라우저에서 `http://localhost:3000` 열고 고객 후기 섹션 확인:
- 가운데 카드가 강조되고 양옆 카드가 흐리게 보이는지
- 5초마다 자동 슬라이드되는지
- 마우스 호버 시 멈추는지
- 좌우 화살표·점 클릭이 동작하는지
- 모바일 뷰포트(devtools 375px)에서 화살표는 숨고 카드 1개 위주로 보이는지
- 블로그 링크 클릭 시 새 탭이 열리는지

확인 후 dev 서버 종료.

- [ ] **Step 4: 커밋**

```bash
git add src/components/home/Testimonials.tsx
git commit -m "feat(home): convert Testimonials to spotlight carousel

Replaces the static 3-card grid with an embla-carousel-based slider
that highlights the center card, auto-plays every 5s (paused on hover),
honors prefers-reduced-motion, and links each card to the original
Naver blog post.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Testimonials 컴포넌트 단위 테스트

**Files:**
- Create: `src/components/home/Testimonials.test.tsx`

`embla-carousel-react`는 jsdom에서 레이아웃을 계산하지 못해 실제 슬라이드 동작 검증은 어렵다. 따라서 (a) 데이터 렌더링, (b) 접근성 속성, (c) 외부 링크 안전성에 집중한다.

- [ ] **Step 1: 테스트 작성**

Create `src/components/home/Testimonials.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Testimonials from './Testimonials';
import { TESTIMONIALS } from '@/data/testimonials';

describe('Testimonials carousel', () => {
  it('renders all testimonials in the DOM', () => {
    render(<Testimonials />);
    TESTIMONIALS.forEach((t) => {
      expect(screen.getByText(t.name)).toBeInTheDocument();
      expect(screen.getByText(t.role)).toBeInTheDocument();
      expect(screen.getByText(`“${t.quote}”`)).toBeInTheDocument();
    });
  });

  it('exposes section as a carousel with proper aria label', () => {
    render(<Testimonials />);
    const section = screen.getByRole('region', { name: '고객 후기' });
    expect(section).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('renders one blog link per testimonial with safe target/rel', () => {
    render(<Testimonials />);
    const links = screen
      .getAllByRole('link')
      .filter((a) => a.textContent?.includes('네이버 블로그 원문'));
    expect(links).toHaveLength(TESTIMONIALS.length);
    links.forEach((link, i) => {
      expect(link).toHaveAttribute('href', TESTIMONIALS[i].blogUrl);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders prev/next arrow buttons', () => {
    render(<Testimonials />);
    expect(screen.getByRole('button', { name: '이전 후기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음 후기' })).toBeInTheDocument();
  });

  it('renders one dot button per slide', () => {
    render(<Testimonials />);
    const dots = screen.getAllByRole('button', { name: /번째 후기로 이동$/ });
    expect(dots).toHaveLength(TESTIMONIALS.length);
  });
});
```

`<section>`은 `aria-label`이 있으면 암묵적으로 `role="region"`이 되므로 `getByRole('region', ...)`이 동작한다.

- [ ] **Step 2: matchMedia 폴리필 확인**

jsdom에는 `window.matchMedia`가 없어 `prefersReducedMotion()`이 호출 시 `false`를 반환해야 한다. 이미 헬퍼가 `typeof window.matchMedia !== 'function'`을 체크하므로 별도 스텁 불필요.

- [ ] **Step 3: 테스트 실행**

Run: `npx vitest run src/components/home/Testimonials.test.tsx`

Expected: PASS — 5 tests pass.

만약 `Autoplay` 플러그인이 jsdom에서 타이머 관련 에러를 던지면 다음 두 옵션 중 선택:
- `vi.useFakeTimers()`를 `beforeEach`에 추가
- 컴포넌트 마운트 시점에 `prefersReducedMotion()` 결과가 `true`가 되도록 `vi.stubGlobal('matchMedia', ...)`로 강제 (autoplay 비활성)

먼저 그냥 실행해 보고, 에러가 나면 위 옵션 적용.

- [ ] **Step 4: 커밋**

```bash
git add src/components/home/Testimonials.test.tsx
git commit -m "test(home): unit tests for Testimonials carousel

Covers data rendering, aria semantics, safe external link
attributes, and presence of navigation controls.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: 실제 블로그 콘텐츠로 후기 데이터 교체

**Files:**
- Modify: `src/data/testimonials.ts`

Task 2의 사용자 검수 결과를 반영한다. 인용문, 역할, `blogUrl`을 실제 블로그 글 정보로 채운다.

- [ ] **Step 1: 검수 결과 정리**

Task 2에서 사용자와 함께 결정한 항목:
- 사용할 블로그 글 N개 (최대 10개)
- 각 글의 인용문 (2~3줄, 카드 높이 균일하게 비슷한 길이로)
- 각 글의 역할(이벤트·인원) — 블로그 글에 명시되어 있으면 그것을, 아니면 운영자와 사용자가 합의한 표기
- 각 글의 `blogUrl` — `originalUrl` 그대로

- [ ] **Step 2: `src/data/testimonials.ts`의 `TESTIMONIALS` 배열 갱신**

플레이스홀더 데이터를 실제 데이터로 교체. 사용 가능한 글이 10개 미만이면 배열 크기를 그만큼 줄인다 (컴포넌트는 길이에 무관하게 작동).

각 엔트리 형식:
```ts
{
  id: 't1',            // 'tN' 유지
  rating: 5,
  quote: '<인용문>',
  name: `고객${i + 1}`,
  role: '<이벤트 · 인원>',
  blogUrl: '<원문 URL>',
}
```

- [ ] **Step 3: 테스트와 빌드 통과 확인**

Run:
```bash
npx vitest run src/components/home/Testimonials.test.tsx
npx tsc --noEmit
```

Expected: PASS / no errors.

- [ ] **Step 4: 커밋**

```bash
git add src/data/testimonials.ts
git commit -m "feat(data): replace testimonials with curated Naver blog reviews

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: 최종 검증

- [ ] **Step 1: 전체 테스트 실행**

Run: `npm test`

Expected: 모든 테스트 통과. 새로 추가된 6개 테스트 (prefers-reduced-motion 3개 + Testimonials 5개) 포함.

- [ ] **Step 2: 린트**

Run: `npm run lint`

Expected: no errors, no warnings.

- [ ] **Step 3: 프로덕션 빌드**

Run: `npm run build`

Expected: 빌드 성공. `src/app/page.tsx`가 클라이언트 컴포넌트(`Testimonials`)를 포함해도 라우트 자체는 정적으로 prerender 되어야 함 (`revalidate = 3600`).

- [ ] **Step 4: 로컬에서 최종 시각 확인**

Run (백그라운드): `npm run start` (또는 `npm run dev`)

`http://localhost:3000` 방문, 고객 후기 섹션에서 다음 항목을 모두 확인:
- 가운데 카드 강조, 양옆 카드 흐림
- 5초 간격 자동 순환, 호버 시 정지
- 좌우 화살표 동작 (PC)
- 점 인디케이터 클릭 시 해당 슬라이드로 점프
- 모바일 뷰포트(375px): 화살표 숨김, 카드 1개 위주, 스와이프 동작
- 각 카드 하단 "네이버 블로그 원문 →" 링크가 새 탭으로 열림
- 시스템 설정에서 "동작 줄이기" 활성 시 자동 재생이 멈춰 있는지 (macOS: 시스템 설정 > 손쉬운 사용 > 디스플레이 > 동작 줄이기)

서버 종료. 모든 항목 OK면 작업 완료.
