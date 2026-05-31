# 잔치 메뉴 페이지(`/banquet`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 잔치 음식 12종을 정사각형 사진 그리드로 노출하는 새 라우트 `/banquet`을 추가한다.

**Architecture:** 기존 `/menu` 패턴을 답습하되, pricing tier 없는 단순 카드 그리드 — 별도 타입(`BanquetMenuItem`), 별도 데이터(`src/data/banquet.ts`), 별도 컴포넌트(`src/components/banquet/*`). 카테고리 헤더 없는 평탄 그리드(모바일 2열 / 데스크탑 3열), 카드 클릭 동작 없음, 하단에 전화 CTA 1개.

**Tech Stack:** Next.js 16 (app router), React 19, TailwindCSS 4, next/image, vitest + @testing-library/react

**Spec:** `docs/superpowers/specs/2026-05-31-banquet-menu-page-design.md`

---

## File Structure

신규
- `src/app/banquet/page.tsx` — 페이지 컴포넌트 (Hero, Grid, CTA 섹션)
- `src/components/banquet/BanquetMenuCard.tsx` — 단일 카드 (정사각형 + 오버레이)
- `src/components/banquet/BanquetMenuCard.test.tsx` — 카드 렌더 스모크 테스트
- `src/components/banquet/BanquetMenuGrid.tsx` — 12개 카드 그리드 래퍼
- `src/data/banquet.ts` — `BANQUET_ITEMS` 12개 데이터
- `public/images/banquet/.gitkeep` — 이미지 자리 (지금은 빈 디렉토리)

수정
- `src/types/index.ts` — `BanquetMenuItem` 인터페이스 추가
- `src/app/sitemap.ts` — `/banquet` 엔트리 추가

손대지 않음
- `src/components/layout/Header.tsx`, `Footer.tsx` — 링크는 이미 반영됨
- `src/app/menu/**`, `src/data/menu.ts`, `src/components/menu/**` — 메모리 가이드(메뉴/홈 독립 관리) 준수

---

## Task 1: `BanquetMenuItem` 타입 추가

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: 타입 정의 추가**

`src/types/index.ts`의 마지막 `};` 뒤(파일 끝)에 추가:

```ts
export type BanquetMenuItem = {
  id: string;
  name: string;
  portion: string;
  price: string;
  imageSrc?: string;
};
```

- [ ] **Step 2: 타입체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 3: 커밋**

```bash
git add src/types/index.ts
git commit -m "feat(banquet): add BanquetMenuItem type"
```

---

## Task 2: 잔치 메뉴 데이터 12종

**Files:**
- Create: `src/data/banquet.ts`

- [ ] **Step 1: 데이터 파일 작성**

```ts
import type { BanquetMenuItem } from '@/types';

export const BANQUET_ITEMS: BanquetMenuItem[] = [
  { id: 'hongeo-muchim',    name: '홍어무침',          portion: '400g',        price: '20,000원' },
  { id: 'ojingeo-muchim',   name: '오징어무침',        portion: '8인분 (1Kg)', price: '14,000원' },
  { id: 'golbaengi-muchim', name: '골뱅이무침',        portion: '8인분 (1Kg)', price: '19,000원' },
  { id: 'japchae',          name: '잡채',              portion: '8인분 (1Kg)', price: '25,000원' },
  { id: 'dubu-kimchi',      name: '두부김치',          portion: '8인분 (1Kg)', price: '15,000원' },
  { id: 'gwail-salad',      name: '과일사라다',        portion: '8인분 (1Kg)', price: '25,000원' },
  { id: 'kimchi-jjigae',    name: '김치찌개',          portion: '1인분',       price: '5,000원'  },
  { id: 'dongtae-tang',     name: '동태탕',            portion: '1인분',       price: '6,000원'  },
  { id: 'eomuk-tang',       name: '어묵탕',            portion: '1인분',       price: '5,000원'  },
  { id: 'yachae-set',       name: '야채set',           portion: '30~40인분',   price: '40,000원' },
  { id: 'pogi-kimchi',      name: '포기김치(국내산)',  portion: '30~40인분',   price: '30,000원' },
  { id: 'modeun-jeon',      name: '모든전',            portion: '6인분',       price: '20,000원' },
];
```

- [ ] **Step 2: 타입체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 3: 커밋**

```bash
git add src/data/banquet.ts
git commit -m "feat(banquet): add 12 banquet menu items"
```

---

## Task 3: `BanquetMenuCard` — 실패하는 테스트부터

**Files:**
- Create: `src/components/banquet/BanquetMenuCard.test.tsx`

기존 `src/components/home/Testimonials.test.tsx`의 testing-library 패턴을 따른다. 카드는 정적 렌더이므로 embla처럼 jsdom polyfill은 불필요.

- [ ] **Step 1: 테스트 파일 작성**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BanquetMenuCard from './BanquetMenuCard';
import type { BanquetMenuItem } from '@/types';

const withImage: BanquetMenuItem = {
  id: 'japchae',
  name: '잡채',
  portion: '8인분 (1Kg)',
  price: '25,000원',
  imageSrc: '/images/banquet/japchae.jpg',
};

const withoutImage: BanquetMenuItem = {
  id: 'kimchi-jjigae',
  name: '김치찌개',
  portion: '1인분',
  price: '5,000원',
};

describe('BanquetMenuCard', () => {
  it('renders name, portion, and price', () => {
    render(<BanquetMenuCard item={withImage} />);
    expect(screen.getByText('잡채')).toBeInTheDocument();
    expect(screen.getByText('8인분 (1Kg)')).toBeInTheDocument();
    expect(screen.getByText('25,000원')).toBeInTheDocument();
  });

  it('renders the photo when imageSrc is provided', () => {
    render(<BanquetMenuCard item={withImage} />);
    const img = screen.getByAltText('잡채');
    expect(img).toBeInTheDocument();
  });

  it('renders fallback placeholder when imageSrc is missing', () => {
    render(<BanquetMenuCard item={withoutImage} />);
    expect(screen.getByText('사진 준비중')).toBeInTheDocument();
    expect(screen.queryByAltText('김치찌개')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실행해 실패 확인**

Run: `npm test -- src/components/banquet/BanquetMenuCard.test.tsx`
Expected: FAIL — `Cannot find module './BanquetMenuCard'` 또는 유사 에러.

---

## Task 4: `BanquetMenuCard` 구현

**Files:**
- Create: `src/components/banquet/BanquetMenuCard.tsx`

- [ ] **Step 1: 컴포넌트 작성**

```tsx
import Image from 'next/image';
import type { BanquetMenuItem } from '@/types';

interface BanquetMenuCardProps {
  item: BanquetMenuItem;
  preload?: boolean;
}

export default function BanquetMenuCard({ item, preload = false }: BanquetMenuCardProps) {
  const hasPhoto = Boolean(item.imageSrc);

  return (
    <article className="group relative aspect-square overflow-hidden rounded-2xl bg-surface-3 border border-border">
      {hasPhoto ? (
        <Image
          src={item.imageSrc as string}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 384px"
          preload={preload}
          fetchPriority={preload ? 'high' : undefined}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-3">
          <span className="text-5xl" aria-hidden="true">🎉</span>
          <p className="text-fg-muted text-xs">사진 준비중</p>
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 md:p-4"
        aria-hidden="false"
      >
        <p className="text-white text-sm md:text-base font-semibold leading-snug">
          <span>{item.name}</span>
          <span className="text-white/80 ml-1.5 text-xs md:text-sm font-normal">{item.portion}</span>
        </p>
        <p className="text-brand text-sm md:text-base font-bold tabular-nums leading-snug mt-0.5">
          {item.price}
        </p>
      </div>
    </article>
  );
}
```

> 참고: `next/image`의 `preload`/`fetchPriority` 사용은 기존 `MenuCard.tsx`와 동일한 패턴.

- [ ] **Step 2: 테스트가 통과하는지 확인**

Run: `npm test -- src/components/banquet/BanquetMenuCard.test.tsx`
Expected: 3개 모두 PASS.

- [ ] **Step 3: 타입체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 4: 커밋**

```bash
git add src/components/banquet/BanquetMenuCard.tsx src/components/banquet/BanquetMenuCard.test.tsx
git commit -m "feat(banquet): add BanquetMenuCard component"
```

---

## Task 5: `BanquetMenuGrid` 작성

**Files:**
- Create: `src/components/banquet/BanquetMenuGrid.tsx`

- [ ] **Step 1: 그리드 컴포넌트 작성**

```tsx
import { BANQUET_ITEMS } from '@/data/banquet';
import BanquetMenuCard from './BanquetMenuCard';

export default function BanquetMenuGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {BANQUET_ITEMS.map((item, index) => (
        <BanquetMenuCard key={item.id} item={item} preload={index === 0} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: 타입체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 3: 커밋**

```bash
git add src/components/banquet/BanquetMenuGrid.tsx
git commit -m "feat(banquet): add BanquetMenuGrid"
```

---

## Task 6: `/banquet` 페이지 라우트

**Files:**
- Create: `src/app/banquet/page.tsx`
- Create: `public/images/banquet/.gitkeep`

- [ ] **Step 1: 이미지 디렉토리 자리만 만들기**

Run: `mkdir -p public/images/banquet && touch public/images/banquet/.gitkeep`
Expected: 디렉토리 생성, gitkeep 파일 존재.

- [ ] **Step 2: 페이지 파일 작성**

```tsx
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import BanquetMenuGrid from '@/components/banquet/BanquetMenuGrid';
import CallButton from '@/components/cta/CallButton';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = pageMetadata({
  title: '잔치 메뉴',
  description:
    '한라산출장바베큐 잔치 메뉴 안내 — 잡채·전·무침·찌개·김치까지, 돌잔치·환갑·회갑·집들이 등 가정 행사용 출장 음식 메뉴를 한자리에서 확인하세요.',
  path: '/banquet',
});

export default function BanquetPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: '홈', path: '/' }, { name: '잔치 메뉴', path: '/banquet' }]} />

      {/* Page hero — dark, /menu와 동일 톤 */}
      <section className="relative overflow-hidden bg-surface-2 py-16 md:py-20 border-b border-border">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, #ea580c, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand font-semibold text-xs uppercase tracking-widest mb-3">
            BANQUET MENU
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-4 leading-tight">
            잔치 메뉴
          </h1>
          <p className="text-fg-soft text-lg max-w-2xl">
            돌잔치·환갑·회갑·집들이까지 — 한라산출장바베큐가 차려드리는 가정 행사용 잔치 음식 메뉴입니다.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-20 bg-bg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <BanquetMenuGrid />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 bg-surface">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <p className="text-fg font-bold text-xl mb-2">
            원하시는 잔치 상차림이 따로 있으신가요?
          </p>
          <p className="text-fg-soft mb-8">
            인원수·구성·예산을 알려주시면 맞춤 잔치상을 제안해 드립니다.
          </p>
          <CallButton variant="primary">전화 문의</CallButton>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 3: 타입체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 4: 빌드 통과 확인**

Run: `npm run build`
Expected: `/banquet` 라우트가 build 출력에 포함되고 에러 없이 완료.

- [ ] **Step 5: 커밋**

```bash
git add src/app/banquet/page.tsx public/images/banquet/.gitkeep
git commit -m "feat(banquet): add /banquet page route"
```

---

## Task 7: 사이트맵에 `/banquet` 추가

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: 사이트맵 엔트리 추가**

기존 `/menu` 라인 바로 아래에 추가:

```ts
import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.canonicalOrigin;
  const now = new Date();
  return [
    { url: `${base}/`,         lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/company`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/menu`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/banquet`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/gallery`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
  ];
}
```

> 참고: 만약 `sitemap.ts`가 현재 추가로 다른 라우트(예: `/inquiry`, `/privacy`)도 포함하고 있다면 그건 건드리지 말고 `/banquet`만 끼워 넣어라.

- [ ] **Step 2: 타입체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음.

- [ ] **Step 3: 커밋**

```bash
git add src/app/sitemap.ts
git commit -m "feat(banquet): add /banquet to sitemap"
```

---

## Task 8: 통합 검증 (dev server + 브라우저)

이 태스크는 시각 확인 단계 — 자동화 테스트로 잡히지 않는 부분을 사람이 본다.

- [ ] **Step 1: 전체 테스트 스위트 통과 확인**

Run: `npm test`
Expected: 모든 테스트 PASS (새로 추가한 3개 + 기존 테스트).

- [ ] **Step 2: 린트 통과**

Run: `npm run lint`
Expected: 에러 없음.

- [ ] **Step 3: 빌드 통과**

Run: `npm run build`
Expected: `/banquet` 라우트가 출력 라우트 목록에 보이고, 빌드 에러 없음.

- [ ] **Step 4: 개발 서버에서 시각 확인**

Run: `npm run dev` 후 브라우저에서 다음 확인:

1. 헤더 "잔치 메뉴" 링크 → `/banquet` 진입 OK
2. 푸터 두 컬럼의 "잔치 메뉴" 링크 → `/banquet` 진입 OK
3. Hero 다크 톤이 `/menu`와 동일하게 보이는지
4. 그리드: 데스크탑(>=768px)에서 3열, 모바일에서 2열로 떨어지는지
5. 12개 카드 전부 다 fallback("🎉 + 사진 준비중")으로 렌더되는지 (아직 이미지 파일 없음)
6. 카드 하단 그래디언트 위로 메뉴명·인원·가격이 잘 읽히는지
7. 호버 시 카드 이미지 영역이 살짝 확대되는지
8. 하단 CTA "전화 문의" 버튼 동작 OK
9. 브레드크럼 JSON-LD가 페이지 소스에 들어가 있는지 (개발자도구 → Elements → `application/ld+json` 검색)
10. `/sitemap.xml`에서 `/banquet` URL이 노출되는지

문제가 보이면 해당 Task로 돌아가서 수정 후 재커밋.

- [ ] **Step 5: 시각 검증 결과 사용자에게 보고**

발견된 이슈를 정리해 사용자에게 보고하고, 없으면 "검증 통과, 머지 준비 완료"로 마무리.

---

## 후속 (이 플랜 범위 밖)

- 실제 잔치 음식 사진 12장 업로드 (`/public/images/banquet/<id>.jpg`)
- 업로드 후 `src/data/banquet.ts`에 `imageSrc` 필드 채우기
- 헤더/푸터 변경분(이미 워킹트리에 있음)을 별도 커밋으로 정리하거나 본 플랜 마무리 시점에 묶어 커밋
