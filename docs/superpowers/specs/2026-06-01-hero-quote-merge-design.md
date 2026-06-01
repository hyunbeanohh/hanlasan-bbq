# 히어로 섹션에 1분 견적 폼 통합 — 디자인 스펙

작성일: 2026-06-01
상태: 디자인 승인 후 사용자 리뷰 단계

## 배경

현재 홈 페이지(`src/app/page.tsx`)는 위에서 아래로 `Hero → SignatureMenu → WhyUs → Testimonials → ReservationBanner` 순으로 렌더된다. 빠른 견적 폼(`QuickQuoteForm`)은 가장 마지막의 `ReservationBanner` 안에 있어, 첫 폴드에 노출되지 않는다. 네이버 파워링크 등 유입자가 폼에 도달하려면 4개 섹션을 스크롤해야 한다.

## 목표

- **첫 화면에서 즉시 전환을 유도한다.** 히어로 안에 견적 폼을 통합 노출한다.
- 데스크톱은 좌우 분할, 모바일은 폼이 첫 폴드 안에 들어오도록 한다.
- 하단 `ReservationBanner`는 "통화로 견적" 단일 CTA로 단순화하여, 끝까지 스크롤한 사용자(폼 외 경로 선호)를 위한 두 번째 진입점 역할만 한다.
- 카카오톡 채널은 디자인에서 제외한다(`CONTACT.kakaoChannelUrl: ''`로 이미 비활성 상태이며, 이번 디자인에서도 노출 영역을 두지 않는다).

## 비목표

- 폼 자체의 UX 개선(스마트 디폴트, 진척 표시 등)은 별건.
- `KakaoButton.tsx`, `MobileCTABar.tsx`의 카톡 분기 코드 정리는 이번 PR 범위 밖(후속 클린업).
- 페이지 메타데이터, 서버 액션(`createQuickQuoteAction`), 폼 검증 스키마는 변경하지 않는다.

## 페이지 구조

```
<HomePage>
  <BG photo + dark overlay>           ← 변경 없음
  <Hero>                              ← 견적 폼 포함하도록 재구성
    좌측: HeroCopy (신뢰칩 + H1 + 카피 + 전화 보조 칩)
    우측: QuickQuoteForm (기존 그대로 재사용)
  <SignatureMenu />
  <WhyUs />
  <Testimonials />
  <ReservationBanner>                 ← 단순화: 통화 CTA만
```

렌더 순서는 그대로 유지하여 SEO와 분석 추적의 기준 위치 변동을 최소화한다.

## 컴포넌트 책임

### Hero.tsx (재작성)

좌우 분할 컨테이너 역할만 한다. 반응형 그리드와 배경 그라데이션만 책임진다.

- 데스크톱: `grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center`
- 모바일: 1열 스택. 위→아래로 `HeroCopy`, 폼.
- 컨테이너: `min-h-[100svh] flex items-center` (현재 `min-h-[88vh] md:min-h-screen` 대체)
- 패딩: `py-16 md:py-20` (현재 `py-24 md:py-32`은 폼이 폴드 밖으로 밀려서 축소)
- 그라데이션: `bg-gradient-to-b from-black/35 via-black/30 to-black/55` (폼 카드 가독성 위해 미세 조정)

### HeroCopy.tsx (신규)

좌측 콘텐츠를 담는 서버 컴포넌트. `'use client'` 불필요.

```
TrustChips (3개: ⚡ 평일 10분 내 회신 · ⭐ 10년 이상 경력 · 🚚 전국 출장)
H1: "정직한 직화,\n전국 출장바베큐" (정적, 2줄)
서브카피: "1분 안에 견적이 도착합니다. 인원·날짜·장소만 알려주세요."
전화 보조 칩: <a href={CONTACT.phoneTel}>📞 010-7332-4199 · 통화 즉시 견적</a>
  - 클릭 이벤트: trackNaverEvent({ event: 'phone_click', source: 'hero_chip', ...getUtm() })
  - 클라이언트 분석 호출이 필요하므로 이 칩만 별도 클라이언트 컴포넌트 또는 HeroCopy 전체가 클라이언트
  - 결정: HeroCopy는 서버 컴포넌트로 유지, 전화 칩만 별도 `<HeroPhoneChip />` 클라이언트 컴포넌트로 분리
```

H1은 `text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg`. 모바일 작아진 폼 노출 우선이라 현재 `text-4xl sm:text-5xl lg:text-6xl`에서 한 단계 축소.

### QuickQuoteForm.tsx (이동, 변경 없음)

파일 자체는 변경하지 않는다. `ReservationBanner`에서 import하던 위치를 `Hero`로 옮긴다. `siteKey={process.env.TURNSTILE_SITE_KEY ?? ''}` 전달도 `Hero`에서 동일하게 수행.

카드 컨테이너 스타일(`bg-white text-neutral-900 rounded-xl p-5 shadow-md`)은 그대로 유지한다. Hero 어두운 배경에서도 `shadow-md`가 충분히 카드를 분리해 보여주므로 wrapper 추가는 하지 않는다. 만약 구현 후 그림자가 약해 보이면 `QuickQuoteForm` 자체의 `shadow-md` → `shadow-xl`로 한 단어만 교체(파일 1줄 수정). wrapper div를 추가하지는 않는다(중첩 마진/패딩 디버깅 회피).

### ReservationBanner.tsx (단순화)

기존 의존(`TrustChips`, `QuickQuoteForm`, `ContactChannels`)을 모두 제거.

```
<section id="contact" className="relative py-16 md:py-20 bg-brand">
  <div className="mx-auto max-w-3xl px-4 text-center text-white">
    <p className="text-xs font-bold tracking-widest opacity-70">— 폼 입력이 어렵다면 —</p>
    <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-2">바로 통화로 견적 받기</h2>
    <p className="opacity-85 mb-6">평일 10분 내 회신 · 통화 즉시 견적</p>
    <a href={CONTACT.phoneTel}
       onClick={() => trackNaverEvent({ event: 'phone_click', source: 'bottom_cta', ...getUtm() })}
       className="inline-flex items-center gap-2 bg-white text-brand font-bold text-lg px-6 py-3 rounded-lg">
      📞 {CONTACT.phone}
    </a>
  </div>
</section>
```

`id="contact"`는 유지하여 헤더 등에서 앵커 링크가 살아 있도록 한다. 클라이언트 컴포넌트 필요(`onClick`) — 단순화된 채로 `'use client'`.

### TrustChips.tsx (수정)

호출 위치를 `ReservationBanner`에서 `HeroCopy`로 이동. 카피 1개 수정:

- `🏝 제주 전 지역 출장` → `🚚 전국 출장`
- 모바일 노출: `🏝` 칩이 현재 `hidden md:inline-flex`로 데스크톱에서만 노출 — 변경하여 **모바일에서도 3개 모두 노출** (전국 출장은 핵심 차별점이므로). 클래스: `inline-flex` 통일.
- 색상: Hero 좌측은 어두운 배경 위 흰색 칩이므로 기존 `bg-white/14 text-white` 유지.

### 삭제 후보 (사용처 0 확인 후 삭제)

- `src/components/home/HeroTitleTyping.tsx` — 정적 H1로 대체
- `src/components/home/reservation/ContactChannels.tsx` — 하단 단순화로 미사용

## 반응형 동작

| Breakpoint | 좌측 (HeroCopy) | 우측 (Form) |
|---|---|---|
| `< sm (640px)` | 신뢰칩 가로 스크롤 없이 wrap, H1 `text-3xl`, 카피 1줄 | 폼 카드 전체 폭 |
| `sm` | 동일, H1 `text-4xl` | 동일 |
| `lg (1024px) ↑` | 좌측 컬럼 `1.1fr`, H1 `text-5xl`, 좌측 중앙 정렬 | 우측 컬럼 `0.9fr`, 카드 그림자 `shadow-2xl` |

모바일에서 폼이 첫 폴드 안에 들어오는지의 기준은 `100svh` 기준 375×667(iPhone SE) 이상에서 폼 제출 버튼까지 보이는 것.

## 배경 가독성

- 페이지 전역 BBQ 이미지(`page.tsx`의 fixed BG) 위에 Hero 자체 그라데이션 `from-black/35 via-black/30 to-black/55`.
- 폼 카드는 흰색 + `shadow-2xl ring-1 ring-black/5` — 어두운 배경에서 명확히 떠 보임.
- 라이트하우스 대비 검사 통과 기준: 흰 카드 위 본문 텍스트(`text-neutral-900`)는 자명히 통과, 어두운 배경 위 흰 텍스트(H1, 카피)는 그라데이션 `via-black/30`에서도 WCAG AA 통과.

## 접근성

- Hero `<section aria-labelledby="hero-title">`, H1 `id="hero-title"`.
- 폼 영역에 `<h2 className="sr-only">빠른 견적 요청</h2>`로 SR 의미 보강. 시각적 강조 라벨(`"1분이면 견적 도착"`)은 `<p>` 그대로.
- 키보드 탭 순서: 헤더 → 신뢰칩(논포커스, ul) → H1(논포커스) → 전화 보조 칩 → 폼 필드(인원→날짜→장소→연락처→약관→Turnstile→제출) → 하단 섹션 진입. 시각 순서와 일치.
- 신뢰칩 `aria-label="신뢰 정보"` 유지.

## SEO

- `<h1>` 1개(좌측 H1). 폼 카드의 시각 라벨은 `<p>`로 두고 SR-only `<h2>`로 의미 보강.
- 페이지 메타데이터 변경 없음(`pageMetadata({ title: '전국 출장바베큐 케이터링', ... })`).
- 폼 라벨 텍스트(인원/날짜/장소/연락처/견적 받기)가 첫 폴드에 들어가 네이버 크롤러가 페이지 핵심 콘텐츠로 인식 — SEO 친화적 부수 효과.

## 성능

- **LCP**: 페이지 fixed 배경 이미지(`unsplash photo-1558030006...`)가 LCP. `priority` 유지로 기존과 동일.
- **JS 페이로드**: `HeroTitleTyping` 제거 → 클라이언트 컴포넌트 1개 감소.
- **CLS**: `QuickQuoteForm`의 입력 4개 + 버튼은 SSR 마크업으로 즉시 자리 잡음. Turnstile 위젯이 로드되며 약간의 시프트 가능 — 위젯 컨테이너에 `min-h-[65px]` 등 자리 예약 권장(구현 시 확인).
- **DatePickerField**: 현재 동적 로드 여부 확인 필요. 폼이 첫 폴드라 초기 JS에 포함되면 인터랙티브 지연 가능. 구현 후 측정하여 필요시 `next/dynamic`으로 지연 로드.
- **Turnstile**: 폼 카드 내부에 있어 폴드 안에서 외부 스크립트 1건 로드. LCP 영향 없음(이미지가 LCP), TBT 약간 증가 가능 — 기존 위젯 구현의 `defer`/`async` 유지.

## 분석 이벤트

기존 키 유지, source 구분 추가:

| 이벤트 | 위치 | source |
|---|---|---|
| `quick_quote_submit` | 폼 제출 클릭 | (기존) |
| `quick_quote_success` | 제출 성공 시 | (기존) |
| `phone_click` | Hero 좌측 전화 보조 칩 | `'hero_chip'` (신규) |
| `phone_click` | 하단 ReservationBanner CTA | `'bottom_cta'` (신규, 기존 `'quick_quote_section'` 대체) |
| `kakao_click` | (사용처 사라짐) | — |

폼 임프레션 이벤트는 추가하지 않는다(다른 섹션도 안 함, 일관성 유지).

## 카피

- H1: `정직한 직화,\n전국 출장바베큐` (2줄)
- 서브카피: `1분 안에 견적이 도착합니다. 인원·날짜·장소만 알려주세요.`
- 전화 보조 칩 텍스트: `📞 010-7332-4199 · 통화 즉시 견적`
- 폼 카드 헤더(기존): `빠른 견적 요청 (1분)` — 시각적, 그대로
- 하단 섹션:
  - kicker: `— 폼 입력이 어렵다면 —`
  - H2: `바로 통화로 견적 받기`
  - 부가 카피: `평일 10분 내 회신 · 통화 즉시 견적`
  - 버튼: `📞 010-7332-4199`

## 변경 파일

**수정**
- `src/components/home/Hero.tsx` — 좌우 분할 컨테이너로 재작성. `QuickQuoteForm` import.
- `src/components/home/ReservationBanner.tsx` — 단일 전화 CTA로 축소.
- `src/components/home/reservation/TrustChips.tsx` — 제주→전국 카피, 모바일 노출.

**신규**
- `src/components/home/HeroCopy.tsx` — 좌측 콘텐츠(서버 컴포넌트).
- `src/components/home/HeroPhoneChip.tsx` — 전화 보조 칩(클라이언트, 분석 이벤트용).

**삭제 후보** (다른 사용처 없을 시)
- `src/components/home/HeroTitleTyping.tsx`
- `src/components/home/reservation/ContactChannels.tsx`

**변경 없음**
- `src/app/page.tsx` (렌더 순서 유지)
- `src/components/home/reservation/QuickQuoteForm.tsx`
- `src/components/home/reservation/quick-quote-action.ts`
- `src/components/home/reservation/DatePickerField.tsx`
- `src/components/inquiry/TurnstileWidget.tsx`

## 검증

- 디바이스: 1440px / 1280px / 1024px / 768px / 414px / 375px에서 첫 폴드 안에 폼 제출 버튼이 보이는지 확인.
- 폼 제출 → 성공 상태(`✓ 견적 요청 접수 완료`) 정상.
- 키보드 탭 순서, 스크린리더 reading order.
- Lighthouse: LCP < 2.5s, CLS < 0.1 유지. 회귀 시 폼 카드 placeholder/`min-h` 추가.
- 신뢰칩 카피 `🚚 전국 출장`이 모바일·데스크톱 모두에서 노출됨.
- 하단 ReservationBanner 전화 CTA `tel:` 동작.
- 네이버 분석 이벤트: `phone_click` source 구분 확인.

## 후속 (이번 범위 밖)

- `KakaoButton.tsx`, `MobileCTABar.tsx`의 카카오톡 분기 코드 정리(현재는 `CONTACT.kakaoChannelUrl` 빈 문자열로 자동 숨김).
- `HeroTitleTyping.tsx`, `ContactChannels.tsx` 삭제 — 다른 사용처 0 확인 후 동시 삭제.
- 폼 자체 UX 개선(스마트 디폴트, 인라인 검증, 진척 표시 등).
