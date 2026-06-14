# 잔치메뉴 — 단체 옵션 · 부대 가격표 섹션 설계

- 작성일: 2026-06-14
- 대상 페이지: `/banquet` (잔치 메뉴)
- 작업 범위: 기존 `BanquetMenuGrid` 아래에 단체 행사용 부대/옵션 가격을 정리한 표 섹션을 신규 추가.
- 기존 카드 그리드(`BANQUET_ITEMS`)는 손대지 않는다. 가격이 일부 겹치는 항목(잡채·모듬전·홍어무침 등)이 있어도 표는 "단체/대량 단위 옵션 가격"이라는 별도 맥락이므로 충돌이 아님.

## 1. 배경

잔치메뉴 페이지에는 현재 카드 그리드(이미지 + 1인분/8인분 단위 가격)만 노출되어 있다.
실제 영업 현장에서는 테이블·천막·생맥주 같은 부대 비용과 1Kg 단위 단체 옵션 가격을
별도 안내해야 하는 일이 잦다. 손글씨 안내표를 그대로 디지털화해 페이지 하단에 표 형태로 노출한다.

## 2. 노출 위치 / IA

`src/app/banquet/page.tsx`의 섹션 순서:

1. Hero — 그대로
2. `BanquetMenuGrid` 섹션 — 그대로
3. **(신규) 단체 옵션 · 부대 가격표 섹션** ← 본 스펙
4. Bottom CTA — 그대로

신규 섹션의 톤:

- 배경: `bg-surface` (그리드 섹션의 `bg-bg`와 톤 구분)
- 상단: 작은 eyebrow + h2 제목 + 1줄 보조 문구
- 본문: 표 한 개
- 하단: 푸터 노트 `※ 물가 변동이 있을 수 있습니다`

## 3. 표 데이터 (확정)

| 항목 | 구성·단위 | 가격 (원) |
|---|---|---|
| 채소 | 상추·고추·마늘·당근 | 40,000 |
| 김치 | — | 40,000 |
| 식사 (밥 외 2종 포함) | 시래기·김치찌개·콩나물·김칫국·오뎅탕 중 | 6,000 |
| 육개장 · 동태탕 | 밥·찬 별도 | 8,000 |
| 모듬전 | 1Kg (5~8인 기준) | 30,000 |
| 홍어무침 | 1Kg (5~8인 기준) | 30,000 |
| 잡채 | 1Kg (5~8인 기준) | 20,000 |
| 6인 테이블 | 테이블 보 포함 | 13,000 |
| 의자 | — | 1,300 |
| 천막 | — | 60,000 |
| 생맥주 | 20,000cc · 잔 포함 | 160,000 |

- "구성·단위" 컬럼의 `—` 표기는 별도 부기 사항이 없음을 의미. 화면에는 빈 셀이 아니라 옅은 톤의 `—`로 표시한다.
- 가격 표기는 셀 내부에서 천 단위 콤마 + 마지막에 `원`을 붙인 문자열로 노출 (`40,000원`).
- 1Kg 단위 항목은 모두 동일하게 `1Kg (5~8인 기준)` 표기로 통일.

## 4. 컴포넌트 / 파일 구조

신규 파일 2개, 수정 파일 1개.

### 4.1 `src/data/banquet-options.ts` (신규)

- 표에 들어갈 11개 행을 배열 상수로 정의한다.
- 타입 정의는 같은 파일 안에 둔다 (`BanquetOption`). 다른 곳에서 재사용할 일이 없는 페이지 단위 데이터이므로 `src/types/index.ts`로 끌어올리지 않는다.
- `id`(키용), `label`(항목명), `detail`(구성·단위, 없으면 `null`), `priceWon`(숫자) 필드.
- 노트: 가격은 숫자로 저장하고 렌더 시 `toLocaleString('ko-KR')`로 포맷팅. 향후 가격 변경 시 데이터 한 곳만 고치면 되도록.

### 4.2 `src/components/banquet/BanquetOptionsTable.tsx` (신규)

- 클라이언트 상태 없음. 서버 컴포넌트로 둔다.
- 시맨틱 `<table>` 사용:
  - `<caption className="sr-only">단체 옵션 및 부대 가격표</caption>`
  - `<thead>`: `항목 / 구성·단위 / 가격` 세 컬럼, 각 `<th scope="col">`
  - `<tbody>`: 데이터에서 매핑
  - 가격 셀은 `text-right`로 우측 정렬, 다른 셀은 좌측 정렬
- 모바일에서 가로 스크롤 가능하도록 `<div className="overflow-x-auto">`로 감싼다.
- 색/간격은 기존 `BanquetMenuCard`/페이지 hero에서 쓰는 토큰(`bg-surface`, `text-fg`, `text-fg-soft`, `border-border`, `text-brand`)을 그대로 사용 — 새 색 정의 금지.
- 행 호버 효과 없음 (정보표라 인터랙션 불필요).
- 테이블 폭은 부모(max-w-4xl 정도)로 제한해 가독성 확보. 데스크톱에서는 카드 그리드(6xl)보다 좁게 두고 가운데 정렬한다.

### 4.3 `src/app/banquet/page.tsx` (수정)

- 신규 컴포넌트 import.
- `BanquetMenuGrid` 섹션과 `Bottom CTA` 섹션 사이에 새 `<section>` 추가:

```tsx
<section className="py-16 md:py-20 bg-surface border-t border-border">
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
    <p className="text-brand font-semibold text-xs uppercase tracking-widest mb-3">
      GROUP OPTIONS
    </p>
    <h2 className="text-3xl md:text-4xl font-bold text-fg mb-3 leading-tight">
      단체 옵션 · 부대 가격표
    </h2>
    <p className="text-fg-soft mb-8">
      테이블·천막·생맥주·1Kg 단위 단체 구성 등 잔치 행사용 부대 가격입니다.
    </p>
    <BanquetOptionsTable />
    <p className="text-fg-soft text-sm mt-6">
      ※ 물가 변동이 있을 수 있습니다.
    </p>
  </div>
</section>
```

(위 마크업은 결정된 디자인이며 구현 시 그대로 따른다.)

## 5. 접근성 / SEO

- `<table>` + `<caption className="sr-only">` 로 스크린리더에 표 의미 전달.
- 헤더 셀은 `<th scope="col">`.
- 가격은 셀 안에 그대로 텍스트로 둔다 — 별도 `<data>` 태그 등은 도입하지 않는다 (YAGNI).
- `/banquet`의 기존 `pageMetadata` 설명문은 단체 옵션을 직접 다루지는 않지만 잔치 메뉴 범주에 포함되므로 별도 메타데이터 변경 없음.
- BreadcrumbJsonLd 등도 변경 없음.

## 6. 테스트 전략

- 단위 테스트 부담은 낮다 — 정적 데이터를 렌더하는 표.
- 한 가지 가벼운 RTL 테스트를 추가: `BanquetOptionsTable`이 모든 행을 렌더하고, 가격이 `XX,XXX원` 포맷으로 표시되는지 확인.
  - 위치: `src/components/banquet/BanquetOptionsTable.test.tsx`
  - 기존 `BanquetMenuCard.test.tsx`와 동일한 vitest + RTL 패턴 사용.

## 7. 비범위 (Out of scope)

- 기존 `BANQUET_ITEMS`의 가격 수정은 하지 않는다. (사용자가 명시적으로 "기존 카드 유지"로 결정)
- 메뉴 페이지(`/menu`)에는 영향 없음 — `[[feedback_menu_vs_home_scope]]` 메모와 별개로 잔치 페이지만 변경.
- 단체 옵션을 카드로 표현하는 방안은 채택하지 않음 — 손글씨 표의 정보 밀도에 표 형식이 더 적합.
- 가격 산정/견적 자동화 기능은 본 작업 범위 밖.

## 8. 향후 확장 여지 (참고만)

- 추후 부대 옵션이 늘어나면 데이터 파일에 행을 추가하기만 하면 됨.
- "예약/문의" 버튼에 부대 옵션 정보를 함께 묶어 보내는 흐름은 별도 작업으로 분리.
