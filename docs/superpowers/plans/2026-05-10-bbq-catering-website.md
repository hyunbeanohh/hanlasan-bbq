# 한라산출장바베큐 홈페이지 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 출장 바베큐 홍보·전화/문자 전환·네이버 파워링크 광고 효율을 동시에 만족하는 4페이지(메인/회사소개/메뉴/갤러리) Next.js 웹사이트를 출시한다.

**Architecture:** Next.js 15 (App Router) SSG/ISR + Vercel CDN 단일 배포. 두 한국어 도메인(`한라산출장바베큐.kr`, `출장바베큐.kr`)을 모두 동일 콘텐츠로 서비스하되 `<link rel="canonical">`로 `한라산출장바베큐.kr`를 표준화. 갤러리는 네이버 블로그 RSS를 ISR(`revalidate=3600`)로 크롤링해 자동 갱신. 전환은 폼 없이 `tel:`/`sms:` 클릭 액션 + 네이버 지도 임베드.

**Tech Stack:**
- Next.js 15 (App Router, RSC, ISR), TypeScript, Tailwind CSS
- Vercel (Production + Preview), Cloudflare (DNS only)
- `next/image`, `rss-parser` (네이버 블로그 RSS), `fast-xml-parser`(필요 시)
- 네이버 애널리틱스 + 네이버 서치어드바이저
- ESLint, Prettier, Vitest (lib 단위 테스트), Playwright (선택; 스모크 e2e)

**확정 결정:**
- D1: **네이버 블로그 RSS** (Phase 2에서 blogId 입력 필요)
- D2: 두 도메인 모두 200 응답, canonical=`한라산출장바베큐.kr`
- D3: GitHub 저장소 (이름 제안: `hallasan-bbq`) — 사용자 GitHub 계정명 입력 필요
- D4: Vercel + Cloudflare + 네이버 서치어드바이저 + 네이버 애널리틱스 사용. GA4·카카오 채널은 NOT in scope.

**아직 필요한 입력 (Phase 0/2 진입 시):**
- GitHub username/org
- 네이버 블로그 ID (`https://blog.naver.com/{blogId}`의 blogId)
- 대표 전화번호, 사업자 주소, 영업시간, 사업자번호
- 네이버 서치어드바이저 사이트 소유 확인 메타값
- 네이버 애널리틱스 트래킹 ID

---

## File Structure

```
/한라산출장바베큐
├── docs/superpowers/plans/2026-05-10-bbq-catering-website.md
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # 메인
│   │   ├── company/page.tsx        # 회사소개
│   │   ├── menu/page.tsx           # 메뉴소개
│   │   ├── gallery/page.tsx        # 갤러리 (ISR 1h)
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── opengraph-image.tsx
│   │   └── globals.css
│   ├── middleware.ts               # 도메인 처리 (canonical 헤더 부가)
│   ├── components/
│   │   ├── layout/{Header,Footer,MobileCTABar}.tsx
│   │   ├── home/{Hero,ServiceFeatures,MenuPreview,GalleryPreview}.tsx
│   │   ├── company/{CompanyHero,ChefStory,ProcessSteps}.tsx
│   │   ├── menu/{MenuCategory,MenuCard}.tsx
│   │   ├── gallery/{GalleryGrid,GalleryCard}.tsx
│   │   ├── cta/{CallButton,SmsButton,NaverMapEmbed}.tsx
│   │   └── seo/{LocalBusinessJsonLd,BreadcrumbJsonLd}.tsx
│   ├── lib/
│   │   ├── blog/
│   │   │   ├── naver-rss.ts        # RSS fetch
│   │   │   ├── parser.ts           # 본문→썸네일/요약
│   │   │   ├── parser.test.ts
│   │   │   └── types.ts
│   │   ├── seo/{metadata,jsonld,canonical}.ts
│   │   ├── analytics/naver.ts
│   │   └── constants.ts
│   ├── data/{menu,company,services}.ts
│   └── types/index.ts
├── public/
│   ├── images/{hero,menu,og}/
│   ├── favicon.ico
│   └── apple-icon.png
├── .env.local.example
├── next.config.ts
├── middleware.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── package.json
└── README.md
```

---

## Phase 0 — 프로젝트 셋업 (0.5일)

**Goal:** 빈 Next.js 15 프로젝트가 `한라산출장바베큐.kr`/`출장바베큐.kr` 양쪽 모두에서 200 응답하고, Vercel에 자동 배포되며, canonical이 한라산 도메인으로 고정.

### Task 0.1 저장소 초기화
**Files:** Create: `.gitignore`, `README.md`

- [ ] **Step 1** 작업 디렉터리에서 git 초기화
  ```bash
  cd "/Users/devbean/Desktop/한라산출장바베큐"
  git init -b main
  ```
- [ ] **Step 2** GitHub 빈 저장소 생성 후 원격 등록 (사용자 username 필요)
  ```bash
  gh repo create {GITHUB_USER}/hallasan-bbq --private --source=. --remote=origin
  ```
  또는 수동:
  ```bash
  git remote add origin git@github.com:{GITHUB_USER}/hallasan-bbq.git
  ```
- [ ] **Step 3** 첫 커밋 (빈 README + .gitignore)
  ```bash
  git add .gitignore README.md
  git commit -m "chore: initialize repository"
  git push -u origin main
  ```

### Task 0.2 Next.js 프로젝트 생성
**Files:** Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `src/app/*`

- [ ] **Step 1** create-next-app 실행
  ```bash
  pnpm dlx create-next-app@latest . \
    --typescript --tailwind --app --eslint --src-dir \
    --import-alias "@/*" --use-pnpm --no-turbopack
  ```
- [ ] **Step 2** dev 서버 동작 확인
  ```bash
  pnpm dev
  curl -s http://localhost:3000 | head
  ```
  예상: `<!DOCTYPE html>` 출력
- [ ] **Step 3** 기본 페이지 한국어로 교체 (`src/app/page.tsx`를 임시 `<h1>한라산출장바베큐</h1>`로)
- [ ] **Step 4** 커밋
  ```bash
  git add .
  git commit -m "feat: scaffold Next.js 15 with TS + Tailwind"
  git push
  ```

### Task 0.3 상수 모듈
**Files:** Create: `src/lib/constants.ts`

- [ ] **Step 1** 사이트 전역 상수 정의
  ```ts
  // src/lib/constants.ts
  export const SITE = {
    canonicalHost: '한라산출장바베큐.kr',
    canonicalOrigin: 'https://한라산출장바베큐.kr',
    altHosts: ['출장바베큐.kr'] as const,
    name: '한라산출장바베큐',
    nameEn: 'Hallasan BBQ Catering',
    description: '제주에서 시작하는 프리미엄 출장 바베큐 케이터링',
  } as const;

  export const CONTACT = {
    phone: '010-0000-0000', // TODO 실제 번호로 교체
    phoneTel: 'tel:01000000000',
    smsBody: encodeURIComponent('출장바베큐 문의드립니다.'),
    address: '제주특별자치도 …',
    businessHours: '매일 09:00 - 22:00',
    businessNumber: '000-00-00000',
  } as const;

  export const NAVER = {
    blogId: '', // Phase 2 진입 시 입력
    searchAdvisorVerification: '',
    analyticsId: '',
  } as const;
  ```
- [ ] **Step 2** 커밋
  ```bash
  git add src/lib/constants.ts
  git commit -m "feat: add site constants module"
  ```

### Task 0.4 도메인 canonical 미들웨어
**Files:** Create: `src/middleware.ts`, `src/lib/seo/canonical.ts`

- [ ] **Step 1** Canonical URL 헬퍼
  ```ts
  // src/lib/seo/canonical.ts
  import { SITE } from '@/lib/constants';

  export function buildCanonical(pathname: string): string {
    const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return `${SITE.canonicalOrigin}${clean === '/' ? '' : clean}`;
  }
  ```
- [ ] **Step 2** 미들웨어 — 두 도메인 모두 통과시키되 응답 헤더에 `Link: <canonical>; rel="canonical"` 추가
  ```ts
  // src/middleware.ts
  import { NextResponse, type NextRequest } from 'next/server';
  import { buildCanonical } from '@/lib/seo/canonical';

  export function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const canonical = buildCanonical(req.nextUrl.pathname);
    res.headers.set('Link', `<${canonical}>; rel="canonical"`);
    return res;
  }

  export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
  };
  ```
- [ ] **Step 3** 커밋
  ```bash
  git add src/middleware.ts src/lib/seo/canonical.ts
  git commit -m "feat: enforce canonical link header across domains"
  ```

### Task 0.5 next.config.ts (이미지 도메인, 한국어 도메인 인식)
**Files:** Modify: `next.config.ts`

- [ ] **Step 1** 네이버 블로그 이미지 + Vercel 자동 도메인 화이트리스트
  ```ts
  // next.config.ts
  import type { NextConfig } from 'next';
  const config: NextConfig = {
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'postfiles.pstatic.net' },
        { protocol: 'https', hostname: 'blogfiles.naver.net' },
        { protocol: 'https', hostname: 'mblogthumb-phinf.pstatic.net' },
      ],
    },
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          ],
        },
      ];
    },
  };
  export default config;
  ```
- [ ] **Step 2** 빌드 확인
  ```bash
  pnpm build
  ```
- [ ] **Step 3** 커밋
  ```bash
  git add next.config.ts
  git commit -m "chore: configure image domains and security headers"
  git push
  ```

### Task 0.6 Vercel 배포 + 도메인 연결
> 사용자 액션이 일부 필요. 가이드만 단계화.

- [ ] **Step 1** Vercel에서 GitHub 저장소 import → 프로젝트 생성 (Production branch=main)
- [ ] **Step 2** Settings → Domains 에서 두 도메인 모두 추가
  - `한라산출장바베큐.kr`
  - `출장바베큐.kr`
  - 각각 `www.` 변형도 추가 권장 (자동 redirect)
- [ ] **Step 3** Cloudflare DNS 설정 (DNS-only, 회색 구름):
  - 두 도메인 모두 A/CNAME 레코드를 Vercel이 안내한 값으로 설정
  - Punycode 변환 자동 — Cloudflare 대시보드에서는 `xn--…` 표기로 보임
- [ ] **Step 4** Vercel에서 도메인 SSL 발급 완료 대기 (1~10분)
- [ ] **Step 5** 검증
  ```bash
  curl -sI https://한라산출장바베큐.kr | head -5
  curl -sI https://출장바베큐.kr | head -5
  curl -s https://출장바베큐.kr | grep -o '<link rel="canonical"[^>]*>'
  ```
  기대: 두 도메인 모두 `200`, canonical은 한라산 도메인을 가리킴
- [ ] **Step 6** README에 운영 메모 추가 후 커밋

### Task 0.7 ESLint/Prettier/Vitest 셋업
**Files:** Create: `vitest.config.ts`, `.prettierrc`, Modify: `package.json`

- [ ] **Step 1** 패키지 추가
  ```bash
  pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom \
    prettier prettier-plugin-tailwindcss
  ```
- [ ] **Step 2** `vitest.config.ts`
  ```ts
  import { defineConfig } from 'vitest/config';
  import react from '@vitejs/plugin-react';
  import path from 'node:path';
  export default defineConfig({
    plugins: [react()],
    test: { environment: 'jsdom', globals: true, setupFiles: [] },
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  });
  ```
- [ ] **Step 3** `package.json` scripts에 추가
  ```json
  { "scripts": {
      "test": "vitest run",
      "test:watch": "vitest",
      "format": "prettier --write ."
  }}
  ```
- [ ] **Step 4** 더미 테스트로 동작 확인
  ```bash
  echo "import { expect, test } from 'vitest'; test('sanity', () => expect(1).toBe(1));" > src/sanity.test.ts
  pnpm test
  rm src/sanity.test.ts
  ```
- [ ] **Step 5** 커밋
  ```bash
  git add . && git commit -m "chore: add vitest + prettier" && git push
  ```

---

## Phase 1 — 정적 페이지 4종 (1.5일)

**Goal:** Stitch 디자인 4종이 Next.js 컴포넌트로 재작성되고, 모바일/데스크톱에서 의도된 레이아웃으로 보임.

### Task 1.1 Stitch HTML 다운로드 (참조용)
- [ ] Stitch MCP `get_screen` 또는 `get_files`로 다음 4개 화면 HTML/스크린샷을 `/docs/stitch-export/`에 저장
  - `screens/ec1ccf44...` 메인
  - `screens/65ede66c...` 회사소개
  - `screens/9fbbc32a...` 메뉴소개
  - `screens/14b127f7...` 갤러리
- [ ] 디렉토리 구조와 산출물 README 추가
- [ ] 커밋: `chore: vendor Stitch design references`

### Task 1.2 공통 레이아웃 / 폰트 / 메타
**Files:** Modify: `src/app/layout.tsx`, Create: `src/lib/seo/metadata.ts`

- [ ] **Step 1** Pretendard 폰트 적용 (CDN 권장: `cdn.jsdelivr.net/gh/orioncactus/pretendard`)
  - `src/app/globals.css` 상단에 `@font-face` 또는 next/font/local
- [ ] **Step 2** `metadata.ts` 헬퍼
  ```ts
  // src/lib/seo/metadata.ts
  import type { Metadata } from 'next';
  import { SITE } from '@/lib/constants';
  import { buildCanonical } from './canonical';

  export function pageMetadata(opts: {
    title: string; description: string; path: string; ogImage?: string;
  }): Metadata {
    const url = buildCanonical(opts.path);
    return {
      title: `${opts.title} | ${SITE.name}`,
      description: opts.description,
      alternates: { canonical: url },
      openGraph: {
        title: opts.title, description: opts.description, url,
        siteName: SITE.name, locale: 'ko_KR', type: 'website',
        images: opts.ogImage ? [{ url: opts.ogImage }] : undefined,
      },
      twitter: { card: 'summary_large_image', title: opts.title, description: opts.description },
    };
  }
  ```
- [ ] **Step 3** `app/layout.tsx`에서 `<html lang="ko">` + Pretendard 클래스 + Header/Footer/MobileCTABar 마운트
- [ ] **Step 4** 커밋

### Task 1.3 Header / Footer / MobileCTABar
**Files:** Create: `src/components/layout/{Header,Footer,MobileCTABar}.tsx`

- [ ] **Step 1** `Header.tsx` — 로고 + 4 nav (`/`, `/company`, `/menu`, `/gallery`)
- [ ] **Step 2** `Footer.tsx` — 사업자 정보, 전화/주소, 카피라이트
- [ ] **Step 3** `MobileCTABar.tsx` — 모바일에서만 노출되는 하단 고정 바, `<CallButton/>` `<SmsButton/>`
- [ ] **Step 4** 모바일 360px·데스크톱 1280px 시각 확인 (preview)
- [ ] **Step 5** 커밋: `feat: layout shell and mobile CTA bar`

### Task 1.4 메인 페이지
**Files:** Create: `src/app/page.tsx`, `src/components/home/*`

- [ ] **Step 1** Stitch 메인 디자인을 5개 섹션으로 분해
  - Hero, ServiceFeatures, MenuPreview, GalleryPreview, FinalCTA
- [ ] **Step 2** 각 섹션 컴포넌트 작성 (Tailwind, 정적)
- [ ] **Step 3** `page.tsx`에서 `pageMetadata({ title:'메인', description:'…', path:'/' })`
- [ ] **Step 4** `MenuPreview`는 `data/menu.ts` 상위 4개 사용
- [ ] **Step 5** `GalleryPreview`는 Phase 2 전 placeholder
- [ ] **Step 6** 빌드/시각 확인 후 커밋

### Task 1.5 회사소개 페이지
**Files:** Create: `src/app/company/page.tsx`, `src/components/company/*`, `src/data/company.ts`

- [ ] CompanyHero, ChefStory, ProcessSteps, Differentiators 섹션
- [ ] `data/company.ts`에 텍스트 콘텐츠 (한국어)
- [ ] 메타데이터 적용
- [ ] 커밋

### Task 1.6 메뉴소개 페이지
**Files:** Create: `src/app/menu/page.tsx`, `src/components/menu/*`, `src/data/menu.ts`

- [ ] `data/menu.ts` 카테고리/항목 정의
  ```ts
  export type MenuItem = {
    id: string; categoryId: string; name: string;
    priceText: string; description: string; imageSrc: string;
  };
  export const MENU_CATEGORIES = [
    { id: 'signature', name: '시그니처' },
    { id: 'beef', name: '소고기' },
    { id: 'pork', name: '돼지고기' },
    { id: 'side', name: '사이드' },
  ] as const;
  export const MENU_ITEMS: MenuItem[] = [ /* 5~10개 */ ];
  ```
- [ ] `MenuCategory` (탭/필터), `MenuCard` 컴포넌트
- [ ] 메타데이터 + 커밋

### Task 1.7 갤러리 골격 (Phase 2 전)
**Files:** Create: `src/app/gallery/page.tsx`, `src/components/gallery/{GalleryGrid,GalleryCard}.tsx`

- [ ] `GalleryCard` props: `title, summary, thumbnailUrl, originalUrl, publishedAt`
- [ ] `GalleryGrid`: 반응형 그리드 (모바일 1, 태블릿 2, 데스크톱 3 컬럼)
- [ ] `app/gallery/page.tsx`에 더미 6개로 렌더 + 메타데이터
- [ ] 커밋

### Task 1.8 시각 회귀 점검
- [ ] Vercel preview 배포 (push)
- [ ] 모바일 / 데스크톱 4페이지 모두 스크린샷 확인
- [ ] Stitch 원본과 차이 정리, 핵심 차이는 별 이슈 등록 후 진행
- [ ] 커밋: `docs: log Phase 1 visual review notes`

---

## Phase 2 — 갤러리 자동 크롤링 (1일)

**Goal:** 네이버 블로그에 글 작성 후 1시간 이내 갤러리 페이지에 자동 노출됨. RSS는 최근 ~10개 글만 노출되므로 "최근 글 갤러리"로 동작.

> ⚠ 네이버 블로그 RSS는 최신 글 약 10개로 제한됨. 더 많은 누적 표시가 필요해지면 Phase 7로 OpenAPI/누적 캐시 도입을 별도 계획.

### Task 2.1 타입 / 의존성
**Files:** Create: `src/lib/blog/types.ts`; Modify: `package.json`

- [ ] **Step 1** rss-parser 설치
  ```bash
  pnpm add rss-parser
  ```
- [ ] **Step 2** 타입 정의
  ```ts
  // src/lib/blog/types.ts
  export type GalleryPost = {
    id: string;            // logNo (네이버 블로그 글 번호)
    title: string;
    summary: string;       // 200자 이내
    thumbnailUrl: string | null;
    originalUrl: string;
    publishedAt: string;   // ISO 8601
  };
  ```
- [ ] **Step 3** 커밋

### Task 2.2 본문 파서 (TDD)
**Files:** Create: `src/lib/blog/parser.ts`, `src/lib/blog/parser.test.ts`

- [ ] **Step 1 (FAIL)** 실패 테스트 먼저 작성
  ```ts
  // src/lib/blog/parser.test.ts
  import { describe, it, expect } from 'vitest';
  import { extractThumbnail, summarize } from './parser';

  describe('extractThumbnail', () => {
    it('returns first <img src> from html', () => {
      const html = '<p>hi</p><img src="https://x.test/a.jpg"><img src="https://x.test/b.jpg">';
      expect(extractThumbnail(html)).toBe('https://x.test/a.jpg');
    });
    it('returns null when no img', () => {
      expect(extractThumbnail('<p>no images</p>')).toBeNull();
    });
  });

  describe('summarize', () => {
    it('strips html and trims to 200 chars', () => {
      const html = '<p>' + 'ㄱ'.repeat(300) + '</p>';
      const s = summarize(html);
      expect(s.length).toBeLessThanOrEqual(200);
      expect(s).not.toMatch(/</);
    });
  });
  ```
- [ ] **Step 2 (FAIL 확인)**
  ```bash
  pnpm test --run src/lib/blog/parser.test.ts
  ```
  Expected: FAIL `Cannot find module './parser'`
- [ ] **Step 3 (구현)**
  ```ts
  // src/lib/blog/parser.ts
  export function extractThumbnail(html: string): string | null {
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return m ? m[1] : null;
  }

  export function summarize(html: string, max = 200): string {
    const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    return text.length <= max ? text : text.slice(0, max - 1) + '…';
  }
  ```
- [ ] **Step 4 (PASS 확인)** `pnpm test` → 전부 PASS
- [ ] **Step 5** 커밋

### Task 2.3 네이버 블로그 RSS fetcher (TDD)
**Files:** Create: `src/lib/blog/naver-rss.ts`, `src/lib/blog/naver-rss.test.ts`

> RSS 응답 샘플은 실제 사용자 blogId로 한 번 받아 `__fixtures__/naver-rss.xml`에 저장 후 테스트에 활용.

- [ ] **Step 1 (FAIL)**
  ```ts
  // src/lib/blog/naver-rss.test.ts
  import { describe, it, expect } from 'vitest';
  import { readFileSync } from 'node:fs';
  import { parseNaverRss } from './naver-rss';

  describe('parseNaverRss', () => {
    it('maps RSS items to GalleryPost', () => {
      const xml = readFileSync('src/lib/blog/__fixtures__/naver-rss.xml', 'utf-8');
      const posts = parseNaverRss(xml, 'hallasanbbq');
      expect(posts.length).toBeGreaterThan(0);
      expect(posts[0]).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        originalUrl: expect.stringMatching(/^https:\/\/blog\.naver\.com\//),
        publishedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      });
    });
  });
  ```
- [ ] **Step 2 (FIXTURE 확보)** Phase 0 종료 시 받은 blogId로 실제 RSS를 한 번 받아 fixture 저장
  ```bash
  curl "https://rss.blog.naver.com/{blogId}.xml" \
    -o src/lib/blog/__fixtures__/naver-rss.xml
  ```
- [ ] **Step 3 (구현)**
  ```ts
  // src/lib/blog/naver-rss.ts
  import Parser from 'rss-parser';
  import { extractThumbnail, summarize } from './parser';
  import type { GalleryPost } from './types';

  const parser = new Parser({
    customFields: { item: ['description', 'pubDate', 'link', 'guid'] },
  });

  export async function fetchNaverBlogRss(blogId: string): Promise<GalleryPost[]> {
    const xml = await fetch(`https://rss.blog.naver.com/${blogId}.xml`, {
      next: { revalidate: 3600 },
      headers: { 'user-agent': 'hallasan-bbq-site/1.0' },
    }).then((r) => r.text());
    return parseNaverRss(xml, blogId);
  }

  export function parseNaverRss(xml: string, blogId: string): GalleryPost[] {
    // rss-parser는 기본적으로 동기 변환은 안 됨 → fast-xml-parser 또는 parser.parseString 사용
    // 여기서는 단순 XML 정규식으로 item 추출 (테스트 결정성 확보)
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
    return items.map((raw) => {
      const pick = (tag: string) =>
        raw.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim() ?? '';
      const title = pick('title').replace(/<!\[CDATA\[(.*?)\]\]>/, '$1');
      const link = pick('link');
      const pubDate = pick('pubDate');
      const description = pick('description').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1');
      const id = link.match(/logNo=(\d+)/)?.[1] ?? link;
      return {
        id,
        title,
        summary: summarize(description),
        thumbnailUrl: extractThumbnail(description),
        originalUrl: link,
        publishedAt: new Date(pubDate).toISOString(),
      } satisfies GalleryPost;
    });
  }
  ```
- [ ] **Step 4 (PASS)** `pnpm test`
- [ ] **Step 5** 커밋

### Task 2.4 갤러리 페이지 ISR 연결
**Files:** Modify: `src/app/gallery/page.tsx`

- [ ] **Step 1**
  ```ts
  // src/app/gallery/page.tsx
  import { fetchNaverBlogRss } from '@/lib/blog/naver-rss';
  import { NAVER } from '@/lib/constants';
  import GalleryGrid from '@/components/gallery/GalleryGrid';
  import { pageMetadata } from '@/lib/seo/metadata';

  export const revalidate = 3600;

  export const metadata = pageMetadata({
    title: '갤러리',
    description: '한라산출장바베큐 행사 갤러리 - 최신 소식',
    path: '/gallery',
  });

  export default async function GalleryPage() {
    const posts = NAVER.blogId ? await fetchNaverBlogRss(NAVER.blogId).catch(() => []) : [];
    return <GalleryGrid posts={posts} />;
  }
  ```
- [ ] **Step 2** `GalleryGrid`/`GalleryCard`를 실제 `GalleryPost` 타입에 맞게 수정
- [ ] **Step 3** `originalUrl`로 외부 새 탭 열기 (`target="_blank" rel="noopener"`)
- [ ] **Step 4** 빌드/배포 후 실제 RSS 반영 확인
- [ ] **Step 5** 커밋

### Task 2.5 Home 페이지의 GalleryPreview에도 연결
- [ ] Home의 `GalleryPreview`에 `fetchNaverBlogRss(blogId).slice(0,3)` 노출
- [ ] 메인은 `revalidate=3600` 동일
- [ ] 커밋

---

## Phase 3 — SEO 풀패키지 (0.5일)

### Task 3.1 sitemap.ts / robots.ts
**Files:** Create: `src/app/sitemap.ts`, `src/app/robots.ts`

- [ ] sitemap에 4 정적 페이지 + 갤러리 글들 동적 포함
  ```ts
  // src/app/sitemap.ts
  import type { MetadataRoute } from 'next';
  import { SITE, NAVER } from '@/lib/constants';
  import { fetchNaverBlogRss } from '@/lib/blog/naver-rss';
  export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = SITE.canonicalOrigin;
    const staticPages = ['', '/company', '/menu', '/gallery'].map((p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: p === '' ? 1 : 0.8,
    }));
    const posts = NAVER.blogId ? await fetchNaverBlogRss(NAVER.blogId).catch(() => []) : [];
    const blogEntries = posts.map((p) => ({
      url: p.originalUrl,
      lastModified: new Date(p.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
    return [...staticPages, ...blogEntries];
  }
  ```
- [ ] robots
  ```ts
  // src/app/robots.ts
  import type { MetadataRoute } from 'next';
  import { SITE } from '@/lib/constants';
  export default function robots(): MetadataRoute.Robots {
    return {
      rules: [{ userAgent: '*', allow: '/' }],
      sitemap: `${SITE.canonicalOrigin}/sitemap.xml`,
      host: SITE.canonicalHost,
    };
  }
  ```
- [ ] 커밋

### Task 3.2 LocalBusiness JSON-LD
**Files:** Create: `src/components/seo/LocalBusinessJsonLd.tsx`

- [ ] FoodEstablishment + LocalBusiness 결합
  ```tsx
  // src/components/seo/LocalBusinessJsonLd.tsx
  import { CONTACT, SITE } from '@/lib/constants';
  export default function LocalBusinessJsonLd() {
    const data = {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'FoodEstablishment'],
      name: SITE.name,
      url: SITE.canonicalOrigin,
      telephone: CONTACT.phone,
      address: { '@type': 'PostalAddress', addressCountry: 'KR', streetAddress: CONTACT.address },
      openingHours: 'Mo-Su 09:00-22:00',
      servesCuisine: 'Barbecue',
      priceRange: '₩₩',
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
  }
  ```
- [ ] `app/layout.tsx`에 마운트
- [ ] 커밋

### Task 3.3 OG 동적 이미지
**Files:** Create: `src/app/opengraph-image.tsx`

- [ ] Next.js ImageResponse로 1200×630 OG 생성 (브랜드명/태그라인)
- [ ] 커밋

### Task 3.4 네이버 서치어드바이저 / 사이트맵 제출
- [ ] 사이트 소유 확인 메타 태그를 `app/layout.tsx`에 추가
  ```tsx
  <meta name="naver-site-verification" content={NAVER.searchAdvisorVerification} />
  ```
- [ ] 두 도메인 모두 등록 (각 도메인을 Variant로 인식하므로)
- [ ] 사이트맵 제출 (`/sitemap.xml`)

---

## Phase 4 — 전환(CTA) 최적화 (0.5일)

### Task 4.1 CallButton / SmsButton
**Files:** Create: `src/components/cta/{CallButton,SmsButton}.tsx`

- [ ] **Step 1** 컴포넌트 작성 + 클릭 시 네이버 애널리틱스 이벤트 호출
  ```tsx
  // src/components/cta/CallButton.tsx
  'use client';
  import { CONTACT } from '@/lib/constants';
  import { trackEvent } from '@/lib/analytics/naver';
  type Props = { variant?: 'primary' | 'ghost'; label?: string };
  export default function CallButton({ variant = 'primary', label = '전화하기' }: Props) {
    return (
      <a href={CONTACT.phoneTel}
         onClick={() => trackEvent('phone_click')}
         className={variant === 'primary'
           ? 'inline-flex items-center justify-center rounded-2xl bg-orange-600 px-6 py-4 font-bold text-white'
           : 'inline-flex items-center justify-center rounded-2xl border px-6 py-4 font-semibold'}>
        {label}
      </a>
    );
  }
  ```
- [ ] **Step 2** SmsButton 동일 패턴 (`href={\`sms:${CONTACT.phone}?body=${CONTACT.smsBody}\`}`)
- [ ] **Step 3** Header/Hero/Footer/MobileCTABar 모든 적절한 위치에 배치
- [ ] **Step 4** 모바일 실기 테스트 (실제 기기에서 통화/문자 앱 호출되는지)
- [ ] 커밋

### Task 4.2 NaverMap 임베드
**Files:** Create: `src/components/cta/NaverMapEmbed.tsx`

- [ ] iframe (네이버 지도 API 또는 단순 임베드 URL)
- [ ] 회사소개 페이지·푸터 부근에 노출
- [ ] 커밋

### Task 4.3 모바일 하단 고정 CTA 바 검증
- [ ] 스크롤 100px 이상에서 표시
- [ ] iOS Safari safe-area-inset 적용 (`pb-[env(safe-area-inset-bottom)]`)
- [ ] 커밋

---

## Phase 5 — 분석 / 광고 추적 (0.5일)

### Task 5.1 네이버 애널리틱스 통합
**Files:** Create: `src/lib/analytics/naver.ts`, Modify: `src/app/layout.tsx`

- [ ] `<Script strategy="afterInteractive">`로 네이버 애널리틱스 스니펫 로드
- [ ] `trackEvent(name)` 함수 노출 (`window.wcs_do` 호출)
- [ ] CallButton/SmsButton/외부링크에서 호출
- [ ] 커밋

### Task 5.2 UTM 보존
**Files:** Create: `src/lib/analytics/utm.ts`

- [ ] 첫 방문 시 `?utm_*` 파라미터를 sessionStorage에 저장
- [ ] CallButton/SmsButton 호출 시 sessionStorage UTM을 이벤트 properties로 첨부
- [ ] 커밋

### Task 5.3 Vercel Analytics 활성화
- [ ] `pnpm add @vercel/analytics`
- [ ] `app/layout.tsx`에 `<Analytics />` 마운트
- [ ] 커밋

### Task 5.4 Lighthouse / Core Web Vitals 점검
- [ ] Vercel preview에서 모바일 Lighthouse 점수 측정 (Performance/SEO 90+ 목표)
- [ ] 미달 항목 별 이슈 작성 후 즉시 수정 가능한 것은 처리

---

## Phase 6 — 런칭 + 파워링크 (0.5일)

### Task 6.1 도메인 최종 점검
- [ ] 두 도메인 모두 200, canonical 한라산 도메인 확인
- [ ] `https://www.한라산출장바베큐.kr` → non-www 301 (Vercel 자동)
- [ ] sitemap.xml/robots.txt 200 확인

### Task 6.2 네이버 서치어드바이저 색인
- [ ] 사이트 소유 확인 → 사이트맵 제출 → 수동 색인 요청
- [ ] 두 도메인 별도 등록

### Task 6.3 파워링크 캠페인
- [ ] 키워드 그룹 설계 (예: 출장바베큐, 제주출장바베큐, 한라산출장바베큐, 단체회식 출장)
- [ ] 광고 소재 2~3종 (USP/가격/사진 변형) A/B
- [ ] 랜딩=메인 (`/`), UTM 부착: `?utm_source=naver&utm_medium=cpc&utm_campaign=launch`
- [ ] 첫 7일: 일 1회 CTR/전화 클릭/체류시간 점검 → 키워드/소재 조정

---

## 비기능 요구 / 합격 기준
- 모바일 LCP < 2.0s, CLS < 0.1, INP < 200ms
- Lighthouse Performance/SEO/Accessibility 90+
- 두 도메인 모두 HTTPS·200, canonical은 한라산 도메인
- 갤러리: 신규 블로그 글 작성 후 1시간 이내 자동 반영
- 전화·문자 클릭 이벤트가 네이버 애널리틱스에 기록됨
- 네이버 서치어드바이저 색인 완료(D+7)

## NOT in scope
- 예약 폼 / 결제 / 회원가입
- GA4, 카카오 채널, 다국어
- 관리자 백오피스
- 누적 갤러리(10건 초과 누적 보관) — 필요 시 Phase 7 별도 계획

---

## 다음 단계 (실행 모드 선택 필요)

계획 작성 완료. 두 가지 실행 옵션:

1. **Subagent-Driven (권장)** — 작업당 fresh subagent 디스패치 + 작업 사이 리뷰
2. **Inline Execution** — 본 세션에서 executing-plans 스킬로 체크포인트 단위 실행

또한 Phase 0 진입을 위해 다음 입력이 필요합니다:
- GitHub username/org
- 네이버 블로그 ID (Phase 2까지는 빈 값으로 진행 가능)
- 대표 전화번호, 사업자 주소, 영업시간, 사업자번호
- 네이버 서치어드바이저 / 네이버 애널리틱스 토큰 (Phase 3·5에서 사용)
