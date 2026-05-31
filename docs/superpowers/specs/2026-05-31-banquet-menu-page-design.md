# 잔치 메뉴 페이지 설계 (`/banquet`)

- **작성일**: 2026-05-31
- **상태**: 승인 대기
- **관련**: Header/Footer 네비게이션의 "잔치 메뉴" 링크 (이미 추가됨)

## 배경

기존 `/menu`는 출장 바베큐(통돼지·통삼겹·해물모듬·훈제오리)의 시그니처 코스 카드를 인원별 가격 tier와 함께 노출한다. 잔치 음식(잡채·전·무침·찌개·김치 등)은 단가 표기와 항목 수가 많아 같은 카드 패턴을 재사용하기에 적합하지 않다. 카탈로그형 그리드를 별도 라우트(`/banquet`)에 신설해 가정 행사(돌잔치·환갑·회갑·집들이 등) 검색 유입을 별도 페이지로 흡수한다.

## 레퍼런스

사용자가 제시한 케이터링 업체 메뉴 페이지를 그대로 따른다:

- 3열 정사각형 그리드 (모바일은 2열)
- 카드 = 음식 사진 + 하단 다크 그래디언트 + "메뉴명 인원/중량 / 가격" 한 줄 오버레이
- 카테고리 헤더 없는 평탄 리스트 12개
- 클릭 동작 없음 — 카탈로그 열람용

## 라우트 / 페이지 구조

```
/banquet
├─ Hero            (다크, 기존 /menu와 동일 톤·구성)
├─ Grid 섹션       (밝은 bg, 12개 카드)
└─ Bottom CTA      (전화 견적 안내)
```

### Hero
- 라벨: `BANQUET MENU` (brand 색, uppercase, tracking-widest)
- 제목: "잔치 메뉴"
- 부제: 1줄, 잔치 음식 케이터링 안내 문구
- 기존 `/menu` Hero의 `bg-surface-2`, `radial-gradient(brand)` 패턴 재사용

### Grid 섹션
- 컨테이너: `max-w-6xl`
- 그리드: `grid-cols-2 md:grid-cols-3 gap-4 md:gap-6`
- 카테고리 헤더/탭 없음

### Bottom CTA
- 카피: "원하시는 잔치 상차림이 따로 있으신가요?" + 인원·구성 맞춤 견적 안내 문구
- `CallButton variant="primary"` 재사용

## 데이터 모델

기존 `MenuItem`은 pricing tier·카테고리 칩 등 출장 바베큐 전용 필드가 많아 재사용하지 않고 별도 타입을 신설한다.

```ts
// src/types/index.ts
export interface BanquetMenuItem {
  id: string;
  name: string;          // 예: "홍어무침"
  portion: string;       // 예: "400g", "8인분 (1Kg)", "1인분", "30~40인분"
  price: string;         // 예: "20,000원"
  imageSrc?: string;     // /images/banquet/*.jpg — 없으면 fallback 노출
}
```

```ts
// src/data/banquet.ts
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

배열 순서가 그대로 그리드 노출 순서가 된다 (레퍼런스 이미지와 동일).

## 컴포넌트

### `BanquetMenuCard`
- 단일 항목 카드. 클릭 동작 없음.
- 구조:
  - 외곽: `aspect-square rounded-2xl overflow-hidden bg-surface-3 relative group`
  - 이미지: `next/image fill object-cover`. `imageSrc` 없으면 fallback (이모지 + "사진 준비중")
  - 그래디언트 오버레이: 하단 60% 영역에 `bg-gradient-to-t from-black/80 via-black/40 to-transparent`
  - 텍스트 블록: `absolute inset-x-0 bottom-0 p-3 md:p-4`
    - `name + portion` → 흰색, `text-sm md:text-base font-semibold`
    - `price` → brand 색, `text-sm md:text-base font-bold`, `/` 구분자 또는 별도 줄
  - 호버: `group-hover:scale-[1.03] transition-transform` (이미지에만 적용)
- 첫 카드만 `preload` 옵션을 받아 LCP 이미지로 처리 (`/menu`와 동일 패턴).

### `BanquetMenuGrid`
- `BANQUET_ITEMS`를 받아 그리드로 렌더링.
- 위치: 페이지 컨테이너 안에서 `grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6` 적용.
- 첫 번째 카드에 `preload` 전달.

## SEO

- `pageMetadata({ title: '잔치 메뉴', description: '...', path: '/banquet' })` 사용
- 메타 description은 잔치/돌·환갑·회갑·집들이 키워드 포함 1~2줄
- `BreadcrumbJsonLd` items: `홈 → 잔치 메뉴`
- `src/app/sitemap.ts`에 `/banquet` 엔트리 추가 (`priority: 0.8`, `changeFrequency: 'weekly'`)

## 파일 변경 목록

- 신규
  - `src/app/banquet/page.tsx`
  - `src/components/banquet/BanquetMenuCard.tsx`
  - `src/components/banquet/BanquetMenuGrid.tsx`
  - `src/data/banquet.ts`
  - `public/images/banquet/` (빈 디렉토리, gitkeep)
- 수정
  - `src/types/index.ts` — `BanquetMenuItem` 인터페이스 추가
  - `src/app/sitemap.ts` — `/banquet` 엔트리 추가

`src/components/layout/Header.tsx`와 `src/components/layout/Footer.tsx`의 `/banquet` 링크는 이미 반영되어 있다.

## 비범위 (Out of Scope)

- 실제 음식 사진 업로드 — 일단 모든 카드가 fallback 상태로 노출됨. 사진은 별도 작업으로 추후 추가.
- 카테고리 필터/탭 — 항목 수가 더 늘어나기 전까지는 평탄 리스트 유지.
- 상세 모달/상세 페이지 — 카탈로그형 카드 그리드면 충분, 추후 필요 시 별도 스펙.
- 다국어 — 사이트 전체가 한국어이므로 이번 페이지도 동일.
- 기존 `/menu` 페이지 변경 — 메모리 가이드(메뉴/홈 독립 관리)에 따라 손대지 않음.

## 검증 기준

- `/banquet` 라우트가 헤더·푸터 링크로 진입 가능
- 모바일(2열) / 데스크탑(3열) 그리드가 레퍼런스 이미지와 시각적으로 부합
- 모든 카드가 이미지 부재 시 fallback 상태로 깨지지 않음
- 사이트맵·메타데이터·BreadcrumbJsonLd가 출력됨
- 타입체크 통과
