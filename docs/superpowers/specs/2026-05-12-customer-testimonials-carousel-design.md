# 고객 후기 스포트라이트 캐러셀

## 배경

홈 페이지(`src/app/page.tsx`)의 `Testimonials` 섹션은 현재 가짜 후기 3개를 3-column 그리드로 보여주고, 페이지네이션 점들은 시각용일 뿐 동작하지 않는다. 실제 네이버 블로그(`https://blog.naver.com/ohnamsoo3822`)에 운영자가 작성한 후기들을 활용해, 스포트라이트 카루셀로 최대 10개까지 자동 순환 노출한다.

## 결정 사항

| 항목 | 결정 |
|---|---|
| 레이아웃 | C. 스포트라이트 (가운데 카드 강조 + 양옆 슬라이드 살짝 노출) |
| 자동 재생 | 5초 간격, 호버 시 일시정지, `prefers-reduced-motion`이면 비활성 |
| 카드 구성 | 별점(고정 5★) + 인용문 + 아바타(그라데이션 원, "고N") + `고객N` + 역할(이벤트·인원) + 네이버 블로그 원문 링크 |
| 콘텐츠 출처 | 네이버 블로그 RSS(`https://rss.blog.naver.com/ohnamsoo3822.xml`) 일회성 스크립트로 수집 → 사용자 검수 → 정적 데이터로 저장 |
| 후기 개수 | 최대 10개 |

## 데이터 모델

`src/data/testimonials.ts`의 타입을 확장한다.

```ts
export type Testimonial = {
  id: string;
  rating: 5;
  quote: string;
  name: string;
  role: string;
  blogUrl: string;
};
```

- `rating`은 `5` 리터럴로 고정 (블로그 후기에 별점이 없음).
- `name`은 `'고객1'` ~ `'고객10'`.
- `role`은 이벤트 종류와 인원을 사람이 읽기 좋게 (예: `'가족 모임 · 12인'`). 블로그 본문에서 추론 가능하면 그것을, 아니면 일반적인 표기로.
- `blogUrl`은 새 탭으로 여는 원문 링크.

## 콘텐츠 파이프라인

런타임에 네이버를 호출하지 않는다. 정적 데이터로 빌드 타임에 고정.

1. `scripts/fetch-blog-reviews.ts` — 일회성 Node 스크립트. `rss-parser`로 RSS를 가져와 글 10개의 `title`, `link`, `pubDate`, `contentSnippet`을 출력한다.
2. 결과를 사용자에게 보여주고, 슬라이드용 인용문(2~3줄)으로 다듬은 초안 → 검수 → `src/data/testimonials.ts`의 `TESTIMONIALS` 배열에 반영.
3. 스크립트는 일회성이므로 산출물은 콘솔/파일 출력. 데이터를 직접 수정하지 않는다(검수 단계 강제).
4. RSS가 10개 미만이거나 일부 글이 후기가 아니라면, 사용 가능한 개수만 노출 (스크립트는 가져온 그대로 제시, 어떤 글을 슬라이드로 쓸지는 사람이 결정).

## UI / 인터랙션

### 컴포넌트

`src/components/home/Testimonials.tsx`를 `'use client'` 컴포넌트로 재작성한다. 홈의 다른 섹션들은 그대로 서버 컴포넌트 유지.

### 캐러셀 엔진

- `embla-carousel-react` + `embla-carousel-autoplay` 두 패키지를 추가 설치.
- 직접 구현 시 swipe / 키보드 / 무한 루프 / 자동 재생 일시정지 등을 모두 처리해야 하므로 검증된 라이브러리를 선택.
- Embla 옵션: `loop: true`, `align: 'center'`, `slidesToScroll: 1`.
- Autoplay 옵션: `delay: 5000`, `stopOnInteraction: false`, `stopOnMouseEnter: true`.

### 스포트라이트 효과

- 슬라이드 컨테이너 너비 (PC): 각 슬라이드 `flex: 0 0 44%`. 가운데 슬라이드 좌우로 양옆 슬라이드가 약 28%씩 보임.
- 모바일 (`< md`): 각 슬라이드 `flex: 0 0 88%`. 양옆 피크 최소화.
- 활성 슬라이드만 `scale-100 opacity-100 shadow-md`, 비활성은 `scale-[0.88] opacity-45`. CSS transition으로 부드럽게.
- Embla의 `on('select')` 이벤트에서 활성 인덱스를 React state에 반영, 슬라이드별 className을 토글.

### 컨트롤

- **화살표** (PC만, `md:flex`): 좌우 끝, 원형 버튼, 호버 시 진해짐. `aria-label="이전 후기" / "다음 후기"`.
- **점 인디케이터** (PC·모바일 공통): 슬라이드 수만큼 점, 활성 점은 가로로 늘어난 알약 모양 (현재 디자인 유지). 클릭 시 해당 슬라이드로 점프.
- **자동 재생** 시각적 컨트롤은 두지 않음 (호버 일시정지로 충분).

### 카드 내부

기존 카드 스타일을 그대로 이어받되 블로그 링크 추가.

```
[★★★★★]
"인용문 2~3줄"
[아바타] 고객N
        역할 · 인원
[📝 네이버 블로그 원문 →]   ← 새 탭, rel="noopener noreferrer"
```

- 인용문은 `min-height`로 모든 카드 높이를 맞춘다 (텍스트 길이가 들쭉날쭉해도 슬라이드 점프 방지).
- 블로그 링크는 `text-brand`, 호버 시 underline. 아이콘은 이모지 또는 SVG.

## 접근성

- `<section>`에 `aria-roledescription="carousel"`, `aria-label="고객 후기"`.
- 각 슬라이드 `<article>`에 `aria-roledescription="slide"`, `aria-label="후기 N / 총 10"`.
- 화살표 버튼, 점 버튼 모두 `aria-label` 명시.
- 활성 슬라이드 변경 시 `aria-live="polite"` 영역에 현재 슬라이드 번호 발표.
- `prefers-reduced-motion: reduce` 사용자에게는 autoplay 플러그인을 비활성화하고 트랜지션도 즉시.

## 테스트

`src/components/home/Testimonials.test.tsx`를 추가한다 (`vitest` + `@testing-library/react`).

- 후기 데이터를 모두 DOM에 렌더링한다.
- 각 카드의 블로그 링크가 `target="_blank"`와 `rel="noopener noreferrer"`를 가진다.
- 화살표 버튼 클릭 시 활성 슬라이드 인덱스가 바뀐다.
- `prefers-reduced-motion`을 모킹했을 때 autoplay 플러그인이 비활성화된다 (옵션을 검증하거나 mock된 함수 호출 인자 확인).

빌드(`npm run build`)와 린트(`npm run lint`)도 통과해야 한다. 시각 확인은 로컬 dev 서버에서 PC·모바일 뷰포트로.

## SEO

- 정적 데이터이므로 빌드 시 HTML에 모든 후기 본문이 그대로 포함된다 (네이버 크롤러가 인용문을 읽을 수 있음).
- 블로그 원문 링크는 사이트 → 블로그로의 자연스러운 백링크 (nofollow 없음).
- 자동 재생은 첫 트랜지션이 5초 후라 LCP/INP에 영향 없음.

## 파일 변경 요약

- `package.json` — `embla-carousel-react`, `embla-carousel-autoplay` 추가.
- `scripts/fetch-blog-reviews.ts` (신규) — RSS 파싱, 콘솔 출력.
- `src/data/testimonials.ts` — 타입에 `blogUrl` 추가, 데이터 최대 10개로 교체.
- `src/components/home/Testimonials.tsx` — 스포트라이트 카루셀로 재작성, `'use client'`.
- `src/components/home/Testimonials.test.tsx` (신규).

## 비범위

- 후기 관리자 페이지 / DB 저장 (정적 데이터로 충분).
- 별점 분포 표시 / 평균 별점 (전부 5★ 고정).
- 슬라이드 키보드 좌우 화살표 단축키 (Embla 기본 지원으로 충분, 별도 구현하지 않음).
- 블로그 글 자동 동기화 (이번 작업은 일회성 수집).
