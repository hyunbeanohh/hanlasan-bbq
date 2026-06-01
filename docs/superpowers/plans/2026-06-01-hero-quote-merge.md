# 히어로 ↔ 1분 견적 폼 통합 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈 페이지 `Hero` 안에 `QuickQuoteForm`을 통합 노출(데스크톱 좌우 분할, 모바일 첫 폴드 안)하고, `ReservationBanner`는 통화 CTA 단일 박스로 단순화한다. 폼 자체와 서버 액션은 변경하지 않는다.

**Architecture:** `Hero.tsx`를 좌우 분할 컨테이너로 재작성하고, 좌측 콘텐츠를 `HeroCopy.tsx`(서버)와 `HeroPhoneChip.tsx`(클라이언트)로 분리한다. `TrustChips.tsx`는 호출 위치 이동과 카피 한 줄 수정만 한다. `QuickQuoteForm`은 그대로 import 위치만 옮긴다. `ReservationBanner.tsx`는 통화 CTA만 남기고 의존 컴포넌트(`TrustChips`/`QuickQuoteForm`/`ContactChannels`) 호출을 제거한다. 사용처가 없어진 `HeroTitleTyping.tsx`, `ContactChannels.tsx`는 삭제한다.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript, Tailwind 4, vitest, @testing-library/react.

**Spec:** `docs/superpowers/specs/2026-06-01-hero-quote-merge-design.md`

---

## File Structure

**Create:**
- `src/components/home/HeroCopy.tsx` — 서버. 신뢰칩+H1+서브카피+전화 보조 칩 콘텐츠.
- `src/components/home/HeroCopy.test.tsx`
- `src/components/home/HeroPhoneChip.tsx` — 클라이언트. `tel:` 링크 + 네이버 분석 이벤트.
- `src/components/home/HeroPhoneChip.test.tsx`
- `src/components/home/ReservationBanner.test.tsx`

**Modify:**
- `src/components/home/Hero.tsx` — 좌우 분할 컨테이너로 재작성, `QuickQuoteForm` 호출.
- `src/components/home/ReservationBanner.tsx` — 통화 CTA 단일 박스로 단순화.
- `src/components/home/reservation/TrustChips.tsx` — `🏝 제주` 칩 카피·노출 수정.

**Delete (사용처 0 확인 후):**
- `src/components/home/HeroTitleTyping.tsx`
- `src/components/home/reservation/ContactChannels.tsx`

**Variables shared across tasks (use exactly these names):**
- 신뢰칩 카피 3종: `⚡ 평일 10분 내 회신`, `⭐ 10년 이상 경력`, `🚚 전국 출장`
- H1: `정직한 직화,\n전국 출장바베큐` (두 줄 — `<br />` 사용)
- 서브카피: `1분 안에 견적이 도착합니다. 인원·날짜·장소만 알려주세요.`
- 분석 이벤트 source: `'hero_chip'` (Hero 전화 칩), `'bottom_cta'` (ReservationBanner 통화 CTA)

---

## Task 1: TrustChips 카피·노출 수정

**Files:**
- Modify: `src/components/home/reservation/TrustChips.tsx`
- Create: `src/components/home/reservation/TrustChips.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```typescript
// src/components/home/reservation/TrustChips.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import TrustChips from './TrustChips';

describe('TrustChips', () => {
  it('renders all three chips with correct copy', () => {
    render(<TrustChips />);
    expect(screen.getByText(/평일 10분 내 회신/)).toBeInTheDocument();
    expect(screen.getByText(/10년/)).toBeInTheDocument();
    expect(screen.getByText(/전국 출장/)).toBeInTheDocument();
  });

  it('does not render legacy 제주 copy', () => {
    render(<TrustChips />);
    expect(screen.queryByText(/제주/)).not.toBeInTheDocument();
  });

  it('marks the list with the trust label', () => {
    render(<TrustChips />);
    expect(screen.getByRole('list', { name: '신뢰 정보' })).toBeInTheDocument();
  });

  it('shows all three chips without responsive hiding classes', () => {
    const { container } = render(<TrustChips />);
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(3);
    items.forEach((li) => {
      expect(li.className).not.toMatch(/hidden/);
    });
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test -- src/components/home/reservation/TrustChips.test.tsx`
Expected: FAIL — `제주` 카피가 여전히 매칭되거나 `🏝` 칩이 `hidden md:inline-flex` 클래스를 가짐.

- [ ] **Step 3: TrustChips.tsx 수정**

```tsx
// src/components/home/reservation/TrustChips.tsx
export default function TrustChips() {
  return (
    <ul
      className="flex flex-wrap gap-2 justify-start md:justify-center mb-4 md:mb-5 text-white/95 text-xs md:text-sm"
      aria-label="신뢰 정보"
    >
      <li className="inline-flex items-center gap-1.5 bg-white/14 px-3 py-1 rounded-full">
        <span aria-hidden="true">⚡</span>평일 10분 내 회신
      </li>
      <li className="inline-flex items-center gap-1.5 bg-white/14 px-3 py-1 rounded-full">
        <span aria-hidden="true">⭐</span>
        <span className="md:hidden">10년 경력</span>
        <span className="hidden md:inline">10년 이상 경력</span>
      </li>
      <li className="inline-flex items-center gap-1.5 bg-white/14 px-3 py-1 rounded-full">
        <span aria-hidden="true">🚚</span>전국 출장
      </li>
    </ul>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- src/components/home/reservation/TrustChips.test.tsx`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: 커밋**

```bash
git add src/components/home/reservation/TrustChips.tsx \
        src/components/home/reservation/TrustChips.test.tsx
git commit -m "feat(hero): trust chips show 전국 출장 on all breakpoints"
```

---

## Task 2: HeroPhoneChip (클라이언트) 컴포넌트

좌측 컬럼 전화 보조 칩. `tel:` 링크 + `phone_click` 이벤트(`source: 'hero_chip'`).

**Files:**
- Create: `src/components/home/HeroPhoneChip.tsx`
- Create: `src/components/home/HeroPhoneChip.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```typescript
// src/components/home/HeroPhoneChip.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

const trackMock = vi.fn();
vi.mock('@/lib/analytics/naver', () => ({
  trackNaverEvent: (e: unknown) => trackMock(e),
}));
vi.mock('@/lib/analytics/utm', () => ({
  getUtm: () => ({ utm_source: 'test' }),
}));

import HeroPhoneChip from './HeroPhoneChip';
import { CONTACT } from '@/lib/constants';

describe('HeroPhoneChip', () => {
  beforeEach(() => {
    trackMock.mockReset();
  });

  it('renders a tel link with the contact phone number', () => {
    render(<HeroPhoneChip />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', CONTACT.phoneTel);
    expect(link.textContent).toContain(CONTACT.phone);
  });

  it('fires phone_click with source=hero_chip on click', () => {
    render(<HeroPhoneChip />);
    fireEvent.click(screen.getByRole('link'));
    expect(trackMock).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'phone_click', source: 'hero_chip' }),
    );
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test -- src/components/home/HeroPhoneChip.test.tsx`
Expected: FAIL — `Cannot find module './HeroPhoneChip'`.

- [ ] **Step 3: HeroPhoneChip 구현**

```tsx
// src/components/home/HeroPhoneChip.tsx
'use client';

import { CONTACT } from '@/lib/constants';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';

export default function HeroPhoneChip() {
  return (
    <a
      href={CONTACT.phoneTel}
      onClick={() =>
        trackNaverEvent({ event: 'phone_click', source: 'hero_chip', ...getUtm() })
      }
      className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-full text-sm border border-white/25 hover:bg-white/20 transition-colors"
      aria-label={`전화 ${CONTACT.phone}`}
    >
      <span aria-hidden="true">📞</span>
      <span className="font-bold">{CONTACT.phone}</span>
      <span className="opacity-75 text-xs">통화 즉시 견적</span>
    </a>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- src/components/home/HeroPhoneChip.test.tsx`
Expected: PASS — 2 tests passing.

- [ ] **Step 5: 커밋**

```bash
git add src/components/home/HeroPhoneChip.tsx \
        src/components/home/HeroPhoneChip.test.tsx
git commit -m "feat(hero): add HeroPhoneChip client component with analytics"
```

---

## Task 3: HeroCopy (서버) 컴포넌트

좌측 컬럼의 컨테이너. `TrustChips` + `<h1>` + 서브카피 + `<HeroPhoneChip />`을 조합.

**Files:**
- Create: `src/components/home/HeroCopy.tsx`
- Create: `src/components/home/HeroCopy.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```typescript
// src/components/home/HeroCopy.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

vi.mock('@/lib/analytics/naver', () => ({ trackNaverEvent: () => {} }));
vi.mock('@/lib/analytics/utm', () => ({ getUtm: () => ({}) }));

import HeroCopy from './HeroCopy';
import { CONTACT } from '@/lib/constants';

describe('HeroCopy', () => {
  it('renders the H1 brand line', () => {
    render(<HeroCopy />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toMatch(/정직한 직화/);
    expect(h1.textContent).toMatch(/전국 출장바베큐/);
  });

  it('renders the action-oriented subcopy', () => {
    render(<HeroCopy />);
    expect(
      screen.getByText(/1분 안에 견적이 도착합니다/),
    ).toBeInTheDocument();
  });

  it('renders TrustChips with all three items', () => {
    render(<HeroCopy />);
    expect(screen.getByRole('list', { name: '신뢰 정보' })).toBeInTheDocument();
    expect(screen.getByText(/전국 출장/)).toBeInTheDocument();
  });

  it('renders a tel link to the contact phone', () => {
    render(<HeroCopy />);
    const links = screen.getAllByRole('link');
    expect(
      links.some((l) => l.getAttribute('href') === CONTACT.phoneTel),
    ).toBe(true);
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test -- src/components/home/HeroCopy.test.tsx`
Expected: FAIL — `Cannot find module './HeroCopy'`.

- [ ] **Step 3: HeroCopy 구현**

```tsx
// src/components/home/HeroCopy.tsx
import TrustChips from './reservation/TrustChips';
import HeroPhoneChip from './HeroPhoneChip';

export default function HeroCopy() {
  return (
    <div className="text-white text-left">
      <TrustChips />
      <h1
        id="hero-title"
        className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 drop-shadow-lg"
      >
        정직한 직화,
        <br />
        전국 출장바베큐
      </h1>
      <p className="text-white/85 text-base md:text-lg leading-relaxed mb-5 drop-shadow">
        1분 안에 견적이 도착합니다. 인원·날짜·장소만 알려주세요.
      </p>
      <HeroPhoneChip />
    </div>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- src/components/home/HeroCopy.test.tsx`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: 커밋**

```bash
git add src/components/home/HeroCopy.tsx \
        src/components/home/HeroCopy.test.tsx
git commit -m "feat(hero): add HeroCopy server component"
```

---

## Task 4: Hero.tsx 좌우 분할로 재작성

`HeroCopy` + `QuickQuoteForm` 조합. `min-h-[100svh]`, 패딩 축소, 그라데이션 미세 조정.

**Files:**
- Modify: `src/components/home/Hero.tsx`

- [ ] **Step 1: 기존 Hero.test.tsx가 없음을 확인하고 새로 작성**

```typescript
// src/components/home/Hero.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

vi.mock('@/lib/analytics/naver', () => ({ trackNaverEvent: () => {} }));
vi.mock('@/lib/analytics/utm', () => ({ getUtm: () => ({}) }));
// QuickQuoteForm pulls in TurnstileWidget which fetches a remote script.
// Stub TurnstileWidget so JSDOM does not try to load network resources.
vi.mock('@/components/inquiry/TurnstileWidget', () => ({
  default: () => null,
}));

import Hero from './Hero';

describe('Hero', () => {
  it('renders H1 from HeroCopy', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(
      /전국 출장바베큐/,
    );
  });

  it('renders the QuickQuoteForm fields', () => {
    render(<Hero />);
    // QuickQuoteForm input labels: 인원 / 희망 날짜 / 출장 장소 / 연락처
    expect(screen.getByLabelText(/인원/)).toBeInTheDocument();
    expect(screen.getByLabelText(/출장 장소/)).toBeInTheDocument();
    expect(screen.getByLabelText(/연락처/)).toBeInTheDocument();
  });

  it('has the section landmark with the hero title', () => {
    render(<Hero />);
    const section = screen.getByRole('region', { name: /전국 출장바베큐/ });
    expect(section).toBeInTheDocument();
  });
});
```

Run: `npm test -- src/components/home/Hero.test.tsx`
Expected: FAIL — 기존 Hero는 H1에 타이핑된 텍스트가 sr-only로 들어가고 form은 없음.

- [ ] **Step 2: Hero.tsx 재작성**

```tsx
// src/components/home/Hero.tsx
import QuickQuoteForm from './reservation/QuickQuoteForm';
import HeroCopy from './HeroCopy';

export default function Hero() {
  const siteKey = process.env.TURNSTILE_SITE_KEY ?? '';

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden min-h-[100svh] flex items-center"
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/30 to-black/55"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
          <HeroCopy />
          <div>
            <h2 className="sr-only">빠른 견적 요청</h2>
            <QuickQuoteForm siteKey={siteKey} />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 테스트 통과 확인**

Run: `npm test -- src/components/home/Hero.test.tsx`
Expected: PASS — 3 tests passing.

- [ ] **Step 4: 전체 테스트 스위트가 깨지지 않는지 확인**

Run: `npm test`
Expected: PASS — 전체 통과.

- [ ] **Step 5: 커밋**

```bash
git add src/components/home/Hero.tsx src/components/home/Hero.test.tsx
git commit -m "feat(hero): split layout with integrated quick-quote form"
```

---

## Task 5: ReservationBanner를 통화 CTA 단일 박스로 단순화

`TrustChips`/`QuickQuoteForm`/`ContactChannels` 호출 제거, `id="contact"` 유지, `phone_click` source `'bottom_cta'`.

**Files:**
- Modify: `src/components/home/ReservationBanner.tsx`
- Create: `src/components/home/ReservationBanner.test.tsx`

- [ ] **Step 1: 실패하는 테스트 작성**

```typescript
// src/components/home/ReservationBanner.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

const trackMock = vi.fn();
vi.mock('@/lib/analytics/naver', () => ({
  trackNaverEvent: (e: unknown) => trackMock(e),
}));
vi.mock('@/lib/analytics/utm', () => ({ getUtm: () => ({}) }));

import ReservationBanner from './ReservationBanner';
import { CONTACT } from '@/lib/constants';

describe('ReservationBanner (simplified)', () => {
  beforeEach(() => trackMock.mockReset());

  it('renders the section with id="contact" for anchor links', () => {
    const { container } = render(<ReservationBanner />);
    expect(container.querySelector('section#contact')).toBeInTheDocument();
  });

  it('renders the bottom phone CTA with the contact number', () => {
    render(<ReservationBanner />);
    const link = screen.getByRole('link', { name: new RegExp(CONTACT.phone) });
    expect(link).toHaveAttribute('href', CONTACT.phoneTel);
  });

  it('does NOT render any form input', () => {
    render(<ReservationBanner />);
    expect(screen.queryByLabelText(/인원/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/연락처/)).not.toBeInTheDocument();
  });

  it('fires phone_click with source=bottom_cta', () => {
    render(<ReservationBanner />);
    fireEvent.click(screen.getByRole('link', { name: new RegExp(CONTACT.phone) }));
    expect(trackMock).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'phone_click', source: 'bottom_cta' }),
    );
  });
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npm test -- src/components/home/ReservationBanner.test.tsx`
Expected: FAIL — 기존 ReservationBanner는 form input(`/인원/`)을 렌더하며 `'quick_quote_section'` source를 사용.

- [ ] **Step 3: ReservationBanner.tsx 재작성**

```tsx
// src/components/home/ReservationBanner.tsx
'use client';

import { CONTACT } from '@/lib/constants';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';

export default function ReservationBanner() {
  return (
    <section id="contact" className="relative py-16 md:py-20 bg-brand">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center text-white">
        <p className="text-xs font-bold tracking-widest opacity-70">
          — 폼 입력이 어렵다면 —
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-2">
          바로 통화로 견적 받기
        </h2>
        <p className="opacity-85 mb-6">
          평일 10분 내 회신 · 통화 즉시 견적
        </p>
        <a
          href={CONTACT.phoneTel}
          onClick={() =>
            trackNaverEvent({ event: 'phone_click', source: 'bottom_cta', ...getUtm() })
          }
          className="inline-flex items-center gap-2 bg-white text-brand font-bold text-lg px-6 py-3 rounded-lg hover:brightness-95 transition"
          aria-label={`전화 ${CONTACT.phone}`}
        >
          <span aria-hidden="true">📞</span>
          <span>{CONTACT.phone}</span>
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- src/components/home/ReservationBanner.test.tsx`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: 커밋**

```bash
git add src/components/home/ReservationBanner.tsx \
        src/components/home/ReservationBanner.test.tsx
git commit -m "refactor(reservation): simplify ReservationBanner to call-only CTA"
```

---

## Task 6: 사용처 없어진 컴포넌트 삭제

`HeroTitleTyping.tsx`, `ContactChannels.tsx`는 Task 4·5 후 어디서도 import되지 않는다. `react-type-animation` 패키지도 `HeroTitleTyping`이 유일한 사용처이므로 함께 제거한다.

**Files:**
- Delete: `src/components/home/HeroTitleTyping.tsx`
- Delete: `src/components/home/reservation/ContactChannels.tsx`
- Modify: `package.json` (devDependencies/dependencies 중 `react-type-animation` 제거)

- [ ] **Step 1: 사용처 0인지 검증**

Run:
```bash
grep -rn "HeroTitleTyping\|ContactChannels\|react-type-animation" \
     /Users/devbean/Desktop/한라산출장바베큐/src/ \
     /Users/devbean/Desktop/한라산출장바베큐/app/ 2>/dev/null \
  | grep -v "HeroTitleTyping.tsx\|ContactChannels.tsx"
```
Expected: 출력 없음. 출력이 있다면 그 파일에서 import를 제거하거나, 이 Task를 중단하고 보고한다.

- [ ] **Step 2: 파일 삭제**

```bash
git rm src/components/home/HeroTitleTyping.tsx
git rm src/components/home/reservation/ContactChannels.tsx
```

- [ ] **Step 3: `react-type-animation` 의존성 제거**

Run:
```bash
npm uninstall react-type-animation
```

`package.json`에서 `react-type-animation` 라인이 사라지고 `package-lock.json`이 업데이트되는지 확인.

- [ ] **Step 4: 타입 체크 및 전체 테스트**

Run:
```bash
npx tsc --noEmit
npm test
```
Expected: 둘 다 통과. 타입 에러나 테스트 실패가 발생하면 다른 사용처가 있는 것 — 그 위치에서 정리 후 다시 진행.

- [ ] **Step 5: 빌드 검증**

Run: `npm run build`
Expected: 성공.

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "chore: remove unused HeroTitleTyping, ContactChannels, and react-type-animation"
```

---

## Task 7: 수동 시각 검증

자동 테스트로 잡히지 않는 반응형·시각적 회귀를 확인한다.

- [ ] **Step 1: 개발 서버 기동**

Run: `npm run dev`
Expected: `http://localhost:3000`에서 응답.

- [ ] **Step 2: 데스크톱 검증 (≥ 1024px)**

다음을 확인:
- 좌측에 신뢰칩 3개 → H1 두 줄 → 서브카피 → 📞 전화 칩.
- 우측에 흰 폼 카드. 4필드(인원/희망 날짜/출장 장소/연락처) + 동의 체크박스 + Turnstile + `견적 받기 →` 버튼이 모두 보임.
- 폼 카드 그림자가 어두운 배경에서 명확히 떠 보임. 약하면 `QuickQuoteForm.tsx`의 `shadow-md`를 `shadow-xl`로 한 단어 교체.

- [ ] **Step 3: 모바일 검증 (375×667)**

브라우저 DevTools 디바이스 모드(iPhone SE 또는 폭 375) 기준:
- 위에서부터 신뢰칩 → H1 → 서브카피 → 폼 카드 순.
- **폼 제출 버튼(`견적 받기 →`)이 첫 폴드(스크롤 없이) 안에 보일 것**.
- 들어가지 않으면: `Hero.tsx`의 `py-16` → `py-10`, H1 `text-3xl` → `text-2xl`, 서브카피 `mb-5` → `mb-3` 순서로 조정.

- [ ] **Step 4: 첫 폴드 안에 폼이 안 보이면 Hero.tsx 조정 후 재확인**

위 Step 3의 조정 가이드대로 수정하고 다시 확인. 조정한 경우 추가 커밋:

```bash
git add src/components/home/Hero.tsx
git commit -m "fix(hero): tighten mobile spacing so form fits first fold"
```

- [ ] **Step 5: 폼 제출 동작 확인**

브라우저에서 임의 값(인원 10, 미래 날짜, 장소 "테스트", 연락처 010-0000-0000)을 입력하고 동의 체크 후 제출. 성공 카드(`✓ 견적 요청 접수 완료`)가 폼 자리에 나타나는지 확인. 로컬에서 D1/Resend 미설정으로 실패할 수 있으므로 네트워크 탭에서 server action 요청이 발생하는지만 확인하면 충분.

- [ ] **Step 6: 하단 ReservationBanner 확인**

페이지를 끝까지 스크롤. "— 폼 입력이 어렵다면 — / 바로 통화로 견적 받기 / 평일 10분 내 회신 · 통화 즉시 견적 / 📞 010-7332-4199" 한 줄 박스가 보이고, 버튼 클릭 시 `tel:` 동작.

- [ ] **Step 7: 키보드 탭 순서 확인**

`Tab` 키로 페이지 진입. 헤더 → Hero 좌측 전화 칩 → 폼 필드(인원→날짜→장소→연락처→동의→Turnstile→제출) 순서로 포커스 이동.

- [ ] **Step 8: Lighthouse 측정 (선택)**

Chrome DevTools > Lighthouse 모바일 모드로 측정. LCP < 2.5s, CLS < 0.1 유지.
회귀 시: 폼 카드에 `min-h-[440px]` 등 자리 예약을 `QuickQuoteForm.tsx` 카드 wrapper에 추가하고 별도 커밋.

---

## Self-Review (작성자 인라인 검토)

**Spec 커버리지:**
- ✅ 페이지 구조 변경 (Task 4·5)
- ✅ Hero 분할 + HeroCopy + HeroPhoneChip 분리 (Task 2·3·4)
- ✅ QuickQuoteForm 변경 없음 (Task 4에서 import만 이동)
- ✅ ReservationBanner 단순화 + `phone_click` source `'bottom_cta'` (Task 5)
- ✅ TrustChips 카피·반응형 수정 (Task 1)
- ✅ HeroTitleTyping·ContactChannels 삭제 (Task 6)
- ✅ react-type-animation 정리 (Task 6에 추가됨)
- ✅ 반응형/접근성 (Task 4의 `aria-labelledby`, Task 7 수동 검증)
- ✅ 분석 이벤트 source 추가 (`'hero_chip'` Task 2, `'bottom_cta'` Task 5)

**Placeholder 스캔:** 모든 코드는 인라인 작성, "TBD"/"적절한 에러 처리" 등 없음. Task 7 Step 4·8에서 조건부 조정 가이드는 구체적인 클래스 값을 제시.

**타입 일관성:** `trackNaverEvent({ event, source, ...getUtm() })` 형태가 Task 2·5에서 동일. `siteKey` prop은 Task 4에서 `process.env.TURNSTILE_SITE_KEY ?? ''`로 전달, `QuickQuoteForm`의 `Props { siteKey: string }`와 일치.

---

Plan complete and saved to `docs/superpowers/plans/2026-06-01-hero-quote-merge.md`.
