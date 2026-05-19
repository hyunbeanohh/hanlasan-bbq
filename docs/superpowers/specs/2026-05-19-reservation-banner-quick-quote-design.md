# 예약 섹션 개편 + 1분 견적 폼 디자인

작성일: 2026-05-19
대상 컴포넌트: `src/components/home/ReservationBanner.tsx`
관련 인프라: 기존 `/inquiry` 시스템 (D1 `inquiries` 테이블, Resend 알림, Turnstile, rate limit)

## 1. 배경과 목적

홈페이지의 "지금 바로 예약하세요" 섹션이 다음 약점을 가지고 있다.

- 카카오 채널 CTA가 빠져 있어 헤더·모바일 바와 일관성이 깨진다.
- 신뢰·긴급성 신호(응답시간, 누적 건수 등)가 없다.
- CTA 버튼 2개가 동일 무게로 세로 스택되어 시각 위계가 평탄하다.
- 모바일 하단 고정 CTA bar와 버튼이 중복된다.
- 견적 요청 폼이 없어 야간·전화 부담 사용자가 이탈한다.

이 작업은 위 섹션을 다음으로 바꾼다:

- 신뢰 chip 3개를 상단에 배치
- 헤드라인을 "1분이면 견적 도착"으로 교체해 행동 유도를 명확히
- **인라인 1분 견적 폼** (인원·날짜·장소·연락처 4필드)을 좌측 primary로 배치
- 우측에 전화·카카오·이메일 3채널 카드를 응답시간과 함께 표시
- 폼 제출 시 페이지 이동 없이 성공 토스트로 교체

## 2. 시각 디자인

### 2.1 데스크탑 레이아웃

```
                [⚡ 평일 10분 내 회신]  [⭐ 누적 N건+]  [🏝 제주 전 지역 출장]

                       1분이면 견적 도착
        인원·날짜·장소만 알려주시면 맞춤 메뉴와 가격을 빠르게 보내드려요.
                  상담은 무료, 견적 후 부담 없이 결정하세요.

  ┌─────────────────────────────────┐    ┌─ — 바로 통화·채팅 — ────┐
  │ 빠른 견적 요청 (1분)             │    │ 📞 가장 빠름            │
  │                                 │    │ 010-7332-4199          │ ← white card
  │ [인원]    [희망 날짜]            │    │ 통화 즉시 견적          │
  │                                 │    ├────────────────────────┤
  │ [출장 장소]                      │    │ 💬 카카오톡             │
  │                                 │    │ 1:1 채팅 상담           │ ← #FEE500
  │ [연락처]                         │    │ 평일 10분 내            │
  │ ☐ 개인정보 수집·이용 동의 (필수)  │    ├────────────────────────┤
  │ [Turnstile 위젯]                │    │ ✉ 이메일                │
  │                                 │    │ 상세 문의               │ ← ghost
  │ [    견적 받기 →    ]            │    │ 영업일 24h 내           │
  └─────────────────────────────────┘    └────────────────────────┘
```

- 배경: `bg-brand` (#ea580c) — 기존 색상 유지
- 폼 카드: `bg-white/95` 또는 `bg-white` (시각적 무게 ↑)
- 채널 카드: 첫번째(전화) white primary, 두번째(카톡) #FEE500, 세번째(이메일) `bg-white/10 border-white/22`

### 2.2 모바일 레이아웃

세로 적층:
1. trust chip 2개로 축약 (지역 chip 생략)
2. 헤드라인·서브카피 좌측 정렬
3. 폼 카드 (full width)
4. "— 바로 연락 —" 디바이더 후 채널 카드 2개 (전화 + 카톡, 이메일 카드 숨김)
5. 응답시간 부가 텍스트는 모바일에서 생략하여 카드 컴팩트화

이메일 카드를 모바일에서 숨기는 이유: 폼이 사실상 이메일 경로를 대체하고, 하단 고정 CTA bar에 전화·카톡이 또 있으므로 화면 길이를 줄인다.

### 2.3 trust chip 카피

- ⚡ `평일 10분 내 회신`
- ⭐ `10년 이상 경력`
- 🏝 `제주 전 지역 출장`

모바일에서는 chip 2개로 축약 (`⚡ 10분 내 회신`, `⭐ 10년 경력`). 지역 chip은 본문 카피에서 다시 강조되므로 모바일에선 생략.

## 3. "견적 받기" 동작 (Option A)

### 3.1 흐름

1. 사용자가 4필드(인원/날짜/장소/연락처) + 개인정보동의 + Turnstile 입력 후 "견적 받기" 클릭
2. 클라이언트가 `createQuickQuoteAction` server action 호출
3. 서버에서 검증·저장·알림 처리 (3.2 참조)
4. 성공 시 폼이 성공 토스트로 교체 — 페이지 이동 없음. 토스트 카피:
   > ✓ 견적 요청 접수 완료
   >
   > 평일 10분 내, 010-7332-4199에서 전화드릴게요.
5. 실패 시 폼 위에 에러 메시지 (`aria-live="polite"`)

### 3.2 server action: `createQuickQuoteAction`

위치: `src/app/(home)/_actions/quick-quote.ts` 또는 `src/components/home/quick-quote-action.ts`.
모델은 기존 `src/app/inquiry/new/actions.ts:20`의 `createInquiryAction`을 그대로 따른다.

처리 순서:

1. `quickQuoteSchema` (zod)로 validate — 다음 필드만 받는다:
   - `headcount`: number, 1~200
   - `eventDate`: string (`YYYY-MM-DD`), 오늘 이후
   - `location`: string, 2~80자
   - `phone`: string, 한국 휴대폰 정규식
   - `privacyConsent`: literal "on"
   - `turnstileToken`: string
2. IP 기반 rate limit — 기존 `RateLimiter`. 새 bucket `'quick-quote'`, **15건/일**. 게시판 인콰이어리(10건/일)보다 약간 높게 설정 — 폼이 가볍고 회사 NAT 공유 IP 시나리오를 커버하기 위함.
3. Turnstile 검증 — 기존 `verifyTurnstile` 재사용.
4. PII 암호화 — `encryptPII(phone, env.PII_KEY)`. 이메일은 받지 않으므로 `email_enc`에는 빈 문자열을 `encryptPII`로 처리해 저장 (스키마가 NOT NULL이므로).
5. `inquiries` 테이블에 INSERT:
   - `author_name`: `'[빠른 견적]'`
   - `password_hash`: NULL
   - `password_salt`: NULL
   - `phone_enc`: 위에서 암호화한 값
   - `email_enc`: 빈 값을 암호화 (아래 3.3 참조)
   - `title`: `\`[빠른 견적] ${headcount}명 · ${MM/DD} · ${location}\``
   - `content`: 폼 4필드를 사람이 읽기 좋은 텍스트로 포매팅 (예: `인원: 10명\n희망 날짜: 2026-06-01\n장소: 애월읍 …\n연락처: 010-0000-0000`)
   - `is_secret`: 1 (게시판 목록에 노출되지 않도록)
6. 기존 `sendNewInquiryNotification(env, { id, authorName, title, content })` 호출.
7. 성공 시 `{ ok: true }` 반환 — redirect 하지 **않는다**. 클라이언트가 토스트로 전환.

### 3.3 DB / 스키마 영향

`inquiries` 테이블 변경 **없음**. 다음 컬럼의 의미를 확장한다:

- `password_hash`, `password_salt` — 이미 nullable이므로 NULL 허용.
- `email_enc` — 현재 NOT NULL. 빈 문자열을 암호화한 값을 저장하여 위반 회피.
- `is_secret = 1` — `/inquiry` 게시판 목록 컴포넌트가 비밀글을 제목만 보이게 하는데, 빠른 견적은 사용자 본인이 다시 찾아올 일이 없으므로 비밀번호 없이는 본문도 보지 못한다. 어드민 페이지에서는 정상 조회.

**게시판 노출 차단**: `InquiryRepository`의 list 쿼리에 `WHERE author_name != '[빠른 견적]'` 필터를 추가한다. 구현 계획에서 명시할 변경점:

- `src/lib/inquiries/repository.ts`의 list 메서드(이름 확인 필요)에 위 조건 추가
- 어드민 뷰(`/admin/inquiry`)의 쿼리는 필터 적용 **하지 않음** — 사장님은 빠른 견적도 봐야 함
- vitest로 목록 쿼리 단위 테스트 추가

### 3.4 알림 메일

기존 `sendNewInquiryNotification` 그대로 사용. 받는 주소는 `wrangler.toml`의 `NOTIFY_EMAILS` = `ohnamsoo3822@naver.com, ohb4199@gmail.com`. 변경 없음.

샘플 메일:

```
제목: [한라산출장바베큐] 새 예약 문의 — [빠른 견적] 10명 · 6/1 · 애월읍

작성자: [빠른 견적]
제목: [빠른 견적] 10명 · 6/1 · 애월읍

내용 미리보기:
인원: 10명
희망 날짜: 2026-06-01
장소: 애월읍 ...
연락처: 010-0000-0000

관리자 페이지: https://.../admin/inquiry/123
```

### 3.5 보안·남용 방지

- Turnstile 동일 적용.
- Rate limit: IP당 15건/일. 제출마다 Resend 알림 메일 2통 발송되므로 최악의 경우 일 30통 한도로 인박스·비용 부담 관리.
- 개인정보 수집 동의 필수. 약관 표시는 폼 하단에 1줄 + `/privacy` 링크.

## 4. 컴포넌트 구조

`src/components/home/ReservationBanner.tsx`를 다음 하위 컴포넌트로 분해:

```
ReservationBanner.tsx                    (server component)
├─ ReservationTrustChips.tsx             (server, 정적 chip 3개)
├─ QuickQuoteForm.tsx                    (client, 폼 + 토스트 상태)
│   └─ TurnstileWidget (기존 재사용)
└─ ContactChannels.tsx                   (server, 3채널 카드)
```

- `QuickQuoteForm`만 client component. `useActionState`로 server action 결과 받음.
- 성공 시 폼 노드를 토스트 카드로 conditional render — 같은 grid cell을 유지하여 레이아웃 점프 방지.
- `ReservationBanner`는 Turnstile site key를 환경에서 읽어 prop으로 내려준다 (기존 `/inquiry/new` 패턴과 동일).

## 5. analytics 이벤트

기존 `trackNaverEvent` 패턴을 따라 다음 이벤트 추가:

- `quick_quote_view` — 섹션 in-view (`IntersectionObserver`)
- `quick_quote_submit` — 폼 제출 시도
- `quick_quote_success` — server action `ok: true` 반환 후
- `phone_click`, `kakao_click`, `email_click` — 채널 카드 클릭 (기존 이벤트와 동일 명칭 유지)

UTM 파라미터는 기존 `getUtm()` 사용.

## 6. 접근성

- 폼: 모든 input에 `<label>` 연결, 에러는 `aria-live="polite"` 영역에 출력.
- 채널 카드: `<a>` 태그로 구현, `aria-label`로 채널명·연락처 명시.
- trust chip: 의미가 아니라 강조이므로 시맨틱 태그 없이 span으로 충분.
- 키보드: 폼 → 채널 카드 순으로 tab order 자연스럽게.

## 7. 작업 범위 (구현 계획에서 확정)

- 새 server action `createQuickQuoteAction` + zod schema
- 새 client 컴포넌트 `QuickQuoteForm`, `ContactChannels`, `ReservationTrustChips`
- `ReservationBanner.tsx` 전면 교체 (기존 두 자식 CTA 제거)
- 게시판 목록(`/inquiry`)에서 빠른 견적 항목 필터링
- vitest로 server action 단위 테스트 (validate / rate limit / Turnstile mocking)
- 모바일·데스크탑 시각 확인

## 8. 비범위 (이번 작업에 포함하지 않음)

- 게시판(`/inquiry`) 자체 리디자인
- 어드민 뷰의 빠른 견적 전용 UI (기존 inquiry 상세로 충분)
- SMS·카카오 알림톡 (Resend 이메일로 한정)
- A/B 테스트 인프라

## 9. 오픈 이슈

출시 후 운영 데이터를 보고 조정할 수 있는 항목들 (이번 작업에선 결정된 값으로 진행):

1. **모바일에서 이메일 채널을 숨기는 결정** — 데스크탑 노출 / 모바일 생략. 추후 폼 전환률 vs 이메일 클릭률 비교 데이터로 재검토.
2. **rate limit 15건/일** — 어뷰즈·미사용 모두 모니터링. 일 30통 한도가 넘어가는 패턴이 보이면 하향, 정상 사용자 차단 케이스가 보고되면 상향.
