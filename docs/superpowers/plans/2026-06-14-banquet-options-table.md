# 잔치메뉴 단체 옵션·부대 가격표 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/banquet` 페이지의 기존 카드 그리드 아래에 9행짜리 "단체 옵션 · 부대 가격표" 섹션을 추가한다.

**Architecture:** 정적 데이터(`src/data/banquet-options.ts`) → 서버 컴포넌트 테이블(`src/components/banquet/BanquetOptionsTable.tsx`) → 페이지(`src/app/banquet/page.tsx`)에 새 `<section>`으로 삽입. 기존 `BANQUET_ITEMS`/카드 그리드는 변경하지 않는다.

**Tech Stack:** Next.js 16(App Router) · React 19(서버 컴포넌트) · TailwindCSS 4 · Vitest + RTL + jsdom

**Spec:** `docs/superpowers/specs/2026-06-14-banquet-options-table-design.md`

---

## File Structure

- **Create** `src/data/banquet-options.ts` — 9개 옵션 데이터 + 페이지 단위 타입(`BanquetOption`). 재사용 없음이라 `src/types/index.ts`로 끌어올리지 않는다.
- **Create** `src/components/banquet/BanquetOptionsTable.tsx` — 시맨틱 `<table>` 렌더. 클라이언트 상태 없음.
- **Create** `src/components/banquet/BanquetOptionsTable.test.tsx` — RTL로 렌더 + 행 수 + 가격 포맷 검증.
- **Modify** `src/app/banquet/page.tsx` — 그리드와 CTA 사이에 새 `<section>` 삽입.

---

### Task 1: 데이터 파일 생성

**Files:**
- Create: `src/data/banquet-options.ts`

- [ ] **Step 1: 데이터 파일 작성**

`src/data/banquet-options.ts` 내용 전체:

```ts
export interface BanquetOption {
  id: string;
  label: string;
  detail: string | null;
  priceWon: number;
}

export const BANQUET_OPTIONS: BanquetOption[] = [
  { id: 'vegetables',   label: '채소',                                                   detail: '상추·고추·마늘·양파 (30~40명 기준)', priceWon: 40000  },
  { id: 'kimchi',       label: '김치',                                                   detail: null,                                  priceWon: 40000  },
  { id: 'meal-set',     label: '식사',                                                   detail: '콩나물 김칫국·오뎅탕, 반찬 3종',       priceWon: 6000   },
  { id: 'soup-bowls',   label: '육개장 · 동태탕',                                        detail: '밥·찬 별도',                           priceWon: 8000   },
  { id: 'party-platter', label: '모듬전·홍어무침·잡채·골뱅이(오징어)무침·과일',           detail: '30~40명 기준',                         priceWon: 120000 },
  { id: 'table-6p',     label: '6인 테이블',                                             detail: '테이블 보 포함',                       priceWon: 13000  },
  { id: 'chair',        label: '의자',                                                   detail: null,                                  priceWon: 1300   },
  { id: 'tent',         label: '천막',                                                   detail: null,                                  priceWon: 60000  },
  { id: 'draft-beer',   label: '생맥주',                                                 detail: '20,000cc · 잔 포함',                  priceWon: 160000 },
];
```

- [ ] **Step 2: 타입체크 통과 확인**

Run: `pnpm exec tsc --noEmit`
Expected: 에러 없이 종료.

- [ ] **Step 3: 커밋**

```bash
git add src/data/banquet-options.ts
git commit -m "feat(banquet): 단체 옵션·부대 가격표 데이터 추가"
```

---

### Task 2: BanquetOptionsTable 실패하는 테스트 작성

**Files:**
- Create: `src/components/banquet/BanquetOptionsTable.test.tsx`

- [ ] **Step 1: 테스트 파일 작성**

`src/components/banquet/BanquetOptionsTable.test.tsx` 내용 전체:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BanquetOptionsTable from './BanquetOptionsTable';
import { BANQUET_OPTIONS } from '@/data/banquet-options';

describe('BanquetOptionsTable', () => {
  it('renders one row per option', () => {
    render(<BanquetOptionsTable />);
    const table = screen.getByRole('table');
    const bodyRows = within(table).getAllByRole('row').slice(1); // skip header row
    expect(bodyRows).toHaveLength(BANQUET_OPTIONS.length);
  });

  it('formats prices as locale-aware Korean won', () => {
    render(<BanquetOptionsTable />);
    expect(screen.getByText('160,000원')).toBeInTheDocument();
    expect(screen.getByText('120,000원')).toBeInTheDocument();
    expect(screen.getByText('1,300원')).toBeInTheDocument();
    expect(screen.getByText('40,000원')).toBeInTheDocument();
  });

  it('shows detail text for items that have a detail, and an em dash otherwise', () => {
    render(<BanquetOptionsTable />);
    expect(screen.getByText('테이블 보 포함')).toBeInTheDocument();
    expect(screen.getByText('20,000cc · 잔 포함')).toBeInTheDocument();
    // 김치/의자/천막은 detail이 null이라 em dash 노출
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(3);
  });

  it('has an accessible caption', () => {
    render(<BanquetOptionsTable />);
    expect(screen.getByRole('table', { name: '단체 옵션 및 부대 가격표' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트 실행해 실패 확인**

Run: `pnpm test -- src/components/banquet/BanquetOptionsTable.test.tsx`
Expected: FAIL — `Cannot find module './BanquetOptionsTable'` 또는 그에 준하는 import 에러.

---

### Task 3: BanquetOptionsTable 구현

**Files:**
- Create: `src/components/banquet/BanquetOptionsTable.tsx`

- [ ] **Step 1: 컴포넌트 작성**

`src/components/banquet/BanquetOptionsTable.tsx` 내용 전체:

```tsx
import { BANQUET_OPTIONS } from '@/data/banquet-options';

export default function BanquetOptionsTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface-2">
      <table className="w-full text-left">
        <caption className="sr-only">단체 옵션 및 부대 가격표</caption>
        <thead>
          <tr className="border-b border-border bg-surface-3">
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-fg">
              항목
            </th>
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-fg">
              구성·단위
            </th>
            <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-fg">
              가격
            </th>
          </tr>
        </thead>
        <tbody>
          {BANQUET_OPTIONS.map((option) => (
            <tr key={option.id} className="border-b border-border last:border-b-0">
              <td className="px-4 py-3 text-fg font-medium">{option.label}</td>
              <td className="px-4 py-3 text-fg-soft text-sm">
                {option.detail ?? <span className="text-fg-muted">—</span>}
              </td>
              <td className="px-4 py-3 text-right text-fg font-semibold whitespace-nowrap">
                {option.priceWon.toLocaleString('ko-KR')}원
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: 테스트 실행해 통과 확인**

Run: `pnpm test -- src/components/banquet/BanquetOptionsTable.test.tsx`
Expected: PASS — 4개 테스트 모두 통과.

- [ ] **Step 3: 커밋**

```bash
git add src/components/banquet/BanquetOptionsTable.tsx src/components/banquet/BanquetOptionsTable.test.tsx
git commit -m "feat(banquet): 단체 옵션·부대 가격표 테이블 컴포넌트 추가"
```

---

### Task 4: 잔치 페이지에 섹션 삽입

**Files:**
- Modify: `src/app/banquet/page.tsx`

- [ ] **Step 1: import 추가**

`src/app/banquet/page.tsx` 상단 import 블록에서, 기존 `BanquetMenuGrid` import 줄 바로 아래에 다음 줄을 추가한다:

```ts
import BanquetOptionsTable from '@/components/banquet/BanquetOptionsTable';
```

- [ ] **Step 2: 새 섹션 삽입**

`src/app/banquet/page.tsx`에서 `BanquetMenuGrid`를 감싸는 `<section>` (현재 `{/* Grid */}` 주석이 붙은 섹션) 바로 다음 줄, `{/* Bottom CTA */}` 섹션 앞에 다음 마크업을 그대로 삽입한다:

```tsx
      {/* 단체 옵션 · 부대 가격표 */}
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

- [ ] **Step 3: 빌드/타입체크 통과 확인**

다음 두 명령을 순서대로 실행한다.

Run: `pnpm exec tsc --noEmit`
Expected: 에러 없이 종료.

Run: `pnpm lint`
Expected: 에러 없이 종료 (경고는 무방).

- [ ] **Step 4: 테스트 전체 통과 확인**

Run: `pnpm test`
Expected: 전체 테스트 통과(신규 4개 포함). 기존 테스트가 영향 받지 않아야 함.

- [ ] **Step 5: 개발 서버에서 시각 검증**

Run (다른 터미널 또는 백그라운드): `pnpm dev`
브라우저로 `http://localhost:3000/banquet` 열기.

확인할 것:
- 카드 그리드 아래에 "GROUP OPTIONS / 단체 옵션 · 부대 가격표" 섹션이 보이는가
- 9개 행이 모두 노출되는가
- 가격이 `40,000원`, `1,300원`, `120,000원`, `160,000원` 등 천 단위 콤마로 표시되는가
- 김치/의자/천막 행의 "구성·단위" 칸이 `—` 로 표시되는가
- 모바일 폭(<640px)에서 좌우 스크롤로 표 전체 열람 가능한가
- 표 하단에 `※ 물가 변동이 있을 수 있습니다.` 가 보이는가

- [ ] **Step 6: 커밋**

```bash
git add src/app/banquet/page.tsx
git commit -m "feat(banquet): /banquet 페이지에 단체 옵션·부대 가격표 섹션 노출"
```

---

## Self-Review 결과

- **Spec coverage:** 스펙의 모든 절(섹션 위치, 데이터 9행, 컴포넌트 분리, 접근성 caption/scope, 테스트, 푸터 노트, 비범위)을 Task 1~4가 모두 다룬다.
- **Placeholder scan:** "TBD/TODO/적절한" 류 없음. 모든 코드와 명령이 실제 사용할 그대로다.
- **Type consistency:** `BanquetOption`(id, label, detail, priceWon)을 Task 1에서 정의했고 Task 3에서 동일 필드명으로만 접근한다. 가격은 숫자 → `toLocaleString('ko-KR')`로 일관되게 포맷.
