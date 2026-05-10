# 예약 문의 게시판 배포 가이드

작성일: 2026-05-10
대상 도메인: `한라산출장바베큐.kr` (메인), `출장바베큐.kr` (서브 → 301)
Git 저장소: https://github.com/hyunbeanohh/hanlasan-bbq (main 브랜치)
관련 문서:
- 설계: `docs/superpowers/specs/2026-05-10-inquiry-board-design.md`
- 구현 계획: `docs/superpowers/plans/2026-05-10-inquiry-board.md`

---

## 사전 안내

### 진행 시점
코드는 main에 모두 머지·푸시 완료. 이 문서의 단계는 **사장님이 외부 서비스 대시보드에서 직접 진행**합니다. 한 번만 하면 끝나는 일회성 셋업입니다.

### 예상 소요 시간
- 처음부터 끝까지 집중하면 **2~3시간**
- DNS 전파(B단계 끝) 대기 30분~24시간 포함하면 **반나절~하루**

### 단계 의존 관계
```
A. Cloudflare 가입 + 도메인 등록
       ↓
B. 가비아 네임서버 변경 (DNS 이전)
       ↓ (전파 대기 30분~24시간)
   ┌───┴────────────┬──────────────┐
   ↓                ↓              ↓
C. Pages           D. D1          E. Resend
   배포             생성           도메인 인증
   ↓                ↓              ↓
   └─→ F. 시크릿 등록 ←─┘          ↓
                ↓                  └─→ (인증 완료 후)
       G. Turnstile 등록
                ↓
       H. Cloudflare Access
                ↓
       I. Cron Trigger 외부 호출
                ↓
       J. 종단 검증
```

**핵심 의존**: B(DNS 이전)가 끝나야 C·D·E·G·H가 의미 있게 동작합니다. B 진행 후 전파 기다리는 동안 D(D1 생성)는 미리 진행 가능.

### 비용
모든 서비스 무료 티어 내. 추가 비용 0원.

---

## A. Cloudflare 계정 준비 + 도메인 추가

**목적**: Cloudflare에 두 도메인을 등록해 DNS·Pages·Access·Turnstile·D1을 모두 한 곳에서 관리.

- [ ] **A.1** https://dash.cloudflare.com/sign-up 가입 (이메일+비번, 2단계 인증 권장)
- [ ] **A.2** 대시보드 → **Add a Site** → `한라산출장바베큐.kr` 입력
  - 한글 그대로 입력하면 Cloudflare가 Punycode(`xn--910br3lvy4eq...`)로 자동 변환
  - **Free 플랜** 선택
- [ ] **A.3** 안내된 **네임서버 2개**를 메모 (예: `arnold.ns.cloudflare.com`, `gabriella.ns.cloudflare.com`)
- [ ] **A.4** 같은 절차로 `출장바베큐.kr` 도 Add a Site → Free 플랜 → 네임서버 메모

**검증**: Cloudflare 대시보드 좌측에 두 도메인이 모두 "Pending nameserver update" 상태로 보임.

---

## B. 가비아 네임서버 변경 (DNS 이전)

**목적**: 도메인 등록 자체는 가비아에 그대로 두고, DNS 응답만 Cloudflare가 하도록 전환.

- [ ] **B.1** https://my.gabia.com/service 로그인 → 도메인 관리
- [ ] **B.2** `한라산출장바베큐.kr` 선택 → **네임서버 변경**
  - 1차: `arnold.ns.cloudflare.com` (실제로는 A.3에서 받은 값)
  - 2차: `gabriella.ns.cloudflare.com` (실제로는 A.3에서 받은 값)
  - 저장
- [ ] **B.3** 같은 절차로 `출장바베큐.kr` 도 Cloudflare 네임서버 2개로 변경
- [ ] **B.4** Cloudflare 대시보드에서 두 도메인 상태가 **Active** 로 바뀔 때까지 대기 (5분~24시간, 보통 30분 내)

**검증**:
```bash
dig NS xn--910br3lvy4eq...kr +short      # 실제 punycode 값 사용
# 출력에 cloudflare.com 도메인이 보이면 OK
```
또는 https://www.whatsmydns.net 에서 도메인 입력 → NS 레코드가 cloudflare.com 으로 보이면 OK.

> **주의**: 전파 기다리는 동안 D 단계(D1 생성)는 병행 가능. C·E·G·H는 활성화 후 진행 권장.

---

## C. Cloudflare Pages 프로젝트 생성

**목적**: GitHub 저장소를 Cloudflare Pages에 연결하고 main 브랜치에 push할 때마다 자동 배포.

- [ ] **C.1** Cloudflare 대시보드 → **Workers & Pages** → **Create** → **Pages** 탭 → **Connect to Git**
- [ ] **C.2** GitHub 인증 후 `hyunbeanohh/hanlasan-bbq` 저장소 선택
- [ ] **C.3** 빌드 설정:
  - Production branch: `main`
  - Framework preset: **Next.js (OpenNext)** — 만약 없으면 **None** 선택 후 아래 수동 설정
  - Build command: `pnpm install --frozen-lockfile && pnpm build && npx opennextjs-cloudflare build`
  - Build output directory: `.open-next/dist`
  - Root directory: (비워둠 — 저장소 루트)
  - Node version: `20` 또는 `22` (Environment variables에서 `NODE_VERSION=20` 추가)
- [ ] **C.4** **Save and Deploy** 클릭 → 첫 배포 시작 (3~5분 소요)
- [ ] **C.5** 배포 완료 후 임시 URL(예: `hanlasan-bbq.pages.dev`) 에서 사이트가 뜨는지 확인
  - 이 시점 `/inquiry`는 D1 미연결로 500 에러 — 정상

**검증**: 임시 URL에서 헤더의 "예약 문의" 메뉴와 `/privacy` 페이지가 정상 노출.

---

## D. Cloudflare D1 데이터베이스 생성 + 스키마 적용

**목적**: 운영 D1 DB 만들고 `wrangler.toml`에 ID를 박아 main에 커밋.

- [ ] **D.1** 로컬 터미널에서 wrangler 인증:
  ```bash
  cd /Users/devbean/Desktop/한라산출장바베큐
  pnpm wrangler login
  ```
  브라우저 OAuth 화면 → Allow.

- [ ] **D.2** D1 데이터베이스 생성:
  ```bash
  pnpm wrangler d1 create hanlasan-bbq
  ```
  출력 예:
  ```
  ✅ Successfully created DB 'hanlasan-bbq'
  [[d1_databases]]
  binding = "DB"
  database_name = "hanlasan-bbq"
  database_id = "abc12345-6789-..."
  ```
  `database_id` 값을 복사.

- [ ] **D.3** `wrangler.toml` 9번째 줄의 placeholder를 실제 ID로 교체:
  ```toml
  database_id = "abc12345-6789-..."   # D.2에서 받은 값
  ```
- [ ] **D.4** 변경 커밋·push:
  ```bash
  git add wrangler.toml
  git commit -m "chore(d1): set production database id"
  git push origin main
  ```
  Cloudflare Pages가 재배포함 (이때부터 D1 바인딩 활성화).

- [ ] **D.5** 원격 D1에 스키마 적용:
  ```bash
  pnpm db:generate:remote
  ```
  출력에 "✅ Successfully executed" 가 보이면 OK.

**검증**:
```bash
pnpm wrangler d1 execute hanlasan-bbq --remote --command="SELECT name FROM sqlite_master WHERE type='table'"
```
`inquiries`, `rate_limits` 두 테이블이 보이면 OK.

---

## E. Resend 도메인 인증

**목적**: `noreply@한라산출장바베큐.kr` 발신자로 이메일 발송 가능하게 만들기. 인증 안 하면 Naver/Gmail이 스팸 처리.

- [ ] **E.1** https://resend.com 가입
- [ ] **E.2** **Domains** → **Add Domain** → `한라산출장바베큐.kr` (한글 그대로 OK, Resend가 punycode 변환)
- [ ] **E.3** Resend가 안내하는 DNS 레코드 4개를 메모:
  - SPF (TXT)
  - DKIM (TXT)
  - DMARC (TXT)
  - Verification (TXT)
- [ ] **E.4** Cloudflare 대시보드 → `한라산출장바베큐.kr` → **DNS** → **Add record** 로 4개 모두 추가
- [ ] **E.5** Resend 대시보드로 돌아와 **Verify** 클릭 → 4개 모두 ✓ 표시될 때까지 대기 (보통 5~10분)
- [ ] **E.6** **API Keys** → **Create API Key** → 이름 "hanlasan-bbq-prod" → 생성 → **값 즉시 복사** (다시 못 봄)

**검증**: Resend 대시보드 → Domains → 상태 **Verified** 표시.

---

## F. Cloudflare Pages 시크릿 등록

**목적**: 운영 환경에서 사용할 비밀 값들 등록.

- [ ] **F.1** 로컬에서 시크릿 값 생성:
  ```bash
  node -e "console.log('PII_KEY=' + require('crypto').randomBytes(32).toString('base64'))"
  node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
  node -e "console.log('CRON_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
  ```
  세 값을 **안전한 곳에 저장**(1Password 등). 분실 시 PII_KEY는 기존 데이터 복호화 불가능.

- [ ] **F.2** Pages 시크릿 등록:
  ```bash
  pnpm wrangler pages secret put PII_KEY --project-name=hanlasan-bbq
  # 프롬프트에 위에서 만든 값 붙여넣기 + Enter
  pnpm wrangler pages secret put SESSION_SECRET --project-name=hanlasan-bbq
  pnpm wrangler pages secret put RESEND_API_KEY --project-name=hanlasan-bbq
  # E.6에서 받은 키 붙여넣기
  pnpm wrangler pages secret put CRON_SECRET --project-name=hanlasan-bbq
  pnpm wrangler pages secret put TURNSTILE_SECRET --project-name=hanlasan-bbq
  # G.3에서 받을 값 — 일단 빈값으로 두고 G단계 후에 등록 가능
  pnpm wrangler pages secret put ACCESS_TEAM_DOMAIN --project-name=hanlasan-bbq
  # H.6에서 받음
  pnpm wrangler pages secret put ACCESS_AUD --project-name=hanlasan-bbq
  # H.6에서 받음
  ```

**검증**: Pages 대시보드 → 프로젝트 → **Settings** → **Environment Variables (Production)** 에서 7개 시크릿이 모두 "Encrypted" 상태로 보임.

---

## G. Turnstile 위젯 등록

**목적**: 작성 폼에 캡챠 추가 → 봇 차단.

- [ ] **G.1** Cloudflare 대시보드 → **Turnstile** → **Add site**
- [ ] **G.2** 설정:
  - Site name: "한라산출장바베큐 inquiry"
  - Domain: `한라산출장바베큐.kr` (punycode 자동)
  - Widget Type: **Managed** (난이도 자동 조절)
- [ ] **G.3** 발급된 **Site Key** 와 **Secret Key** 메모
- [ ] **G.4** Site Key를 `wrangler.toml`의 `TURNSTILE_SITE_KEY` 값으로 입력 + 커밋·push:
  ```toml
  [vars]
  TURNSTILE_SITE_KEY = "0x4AAA..."  # G.3 Site Key
  ```
  ```bash
  git add wrangler.toml
  git commit -m "chore(turnstile): set production site key"
  git push origin main
  ```
- [ ] **G.5** Secret Key를 F.2의 `TURNSTILE_SECRET` 시크릿으로 등록 (이미 비워뒀으면 다시 put):
  ```bash
  pnpm wrangler pages secret put TURNSTILE_SECRET --project-name=hanlasan-bbq
  ```

**검증**: 재배포 후 `https://한라산출장바베큐.kr/inquiry/new` 에서 폼 하단에 Turnstile 위젯이 노출.

---

## H. Cloudflare Access (어드민 인증)

**목적**: `/admin/*` 경로에 사장님 두 이메일만 접근 허용.

- [ ] **H.1** Cloudflare 대시보드 → **Zero Trust** 진입 → 처음이면 팀명 입력 (예: `hanlasan-bbq`)
  - 팀 도메인: `hanlasan-bbq.cloudflareaccess.com` 형태 → 메모
- [ ] **H.2** **Access** → **Applications** → **Add an application** → **Self-hosted**
- [ ] **H.3** Application 설정:
  - Name: "Hanlasan BBQ Admin"
  - Session Duration: `24 hours`
  - Application domain: `한라산출장바베큐.kr` + Path `/admin`
- [ ] **H.4** Identity providers: **One-time PIN** (이메일 OTP) 활성화
- [ ] **H.5** Policy 추가:
  - Name: "Allow owners"
  - Action: **Allow**
  - Include: **Emails** → `ohnamsoo3822@naver.com`, `ohb4199@gmail.com`
- [ ] **H.6** Application 생성 완료 후, **Application Audience (AUD) Tag** 값 메모 (긴 hex 문자열)
- [ ] **H.7** AUD와 Team Domain을 시크릿으로 등록:
  ```bash
  pnpm wrangler pages secret put ACCESS_TEAM_DOMAIN --project-name=hanlasan-bbq
  # 값: hanlasan-bbq.cloudflareaccess.com (H.1에서 정한 팀명)
  pnpm wrangler pages secret put ACCESS_AUD --project-name=hanlasan-bbq
  # 값: H.6 AUD 값
  ```

**검증**: 시크릿 창에서 `https://한라산출장바베큐.kr/admin/inquiry` 접속 → Cloudflare Access OTP 화면. 사장님 이메일로 6자리 코드 받아 입력 → 어드민 목록 페이지 진입.

---

## I. Cron Trigger 외부 호출 설정

**목적**: 매일 03:00 KST에 만료된 글(1년 경과) 자동 삭제.

> Cloudflare Pages는 자체 Cron Trigger가 제한적이라 외부 무료 서비스로 호출.

- [ ] **I.1** https://cron-job.org 가입
- [ ] **I.2** **Cronjobs** → **Create cronjob** 클릭
- [ ] **I.3** 설정:
  - Title: "Hanlasan BBQ - expire inquiries"
  - URL: `https://한라산출장바베큐.kr/api/cron/expire`
  - Schedule: **Every day at 18:00 UTC** (= KST 03:00)
  - Request method: **POST**
- [ ] **I.4** **Advanced** → **Headers** → 추가:
  - Name: `Authorization`
  - Value: `Bearer <F.1에서 만든 CRON_SECRET 값>`
- [ ] **I.5** **Save** → 즉시 1회 수동 실행 (Run now)

**검증**: 실행 직후 cron-job.org 대시보드에서 응답 코드 **200** + 응답 바디 `{"removed":0}` (운영 직후라 만료된 글 없음).

---

## J. 종단 검증

운영 환경에서 사용자 시나리오 전체를 한 번 돌리며 확인.

- [ ] **J.1** 시크릿 창에서 `https://한라산출장바베큐.kr/inquiry/new` 접속
- [ ] **J.2** 폼 작성 → 등록
  - 고객명: 테스트
  - 비밀번호: test1234
  - 연락처: 010-0000-0000
  - 이메일: 본인 이메일 (수신 확인용)
  - 제목: 운영 테스트
  - 내용: 운영 테스트 글입니다.
  - 비밀글: 체크
  - 개인정보 동의: 체크
  - Turnstile: 자동 통과
- [ ] **J.3** 등록 후 `/inquiry/{id}?created=1` 으로 리다이렉트
- [ ] **J.4** `ohnamsoo3822@naver.com`, `ohb4199@gmail.com` 두 이메일 수신함 확인 → "[한라산출장바베큐] 새 예약 문의 — 운영 테스트" 메일 도착 (스팸함이 아닌 받은편지함에)
- [ ] **J.5** 메일 본문의 어드민 링크 클릭 → Cloudflare Access OTP → 어드민 페이지 진입
- [ ] **J.6** 어드민 상세에서 답글 작성 → 등록 → 손님 측 `/inquiry/{id}` 새로고침 → 답글 노출 확인
- [ ] **J.7** 비밀글 본문은 다른 시크릿 창에서 비번 없이 접근 시 비번 폼이 뜨는지 확인
- [ ] **J.8** 잘못된 비번 5회 시도 → "시도 횟수를 초과했습니다" 메시지 (rate limit 동작)
- [ ] **J.9** 본인 글 비번 인증 후 수정/삭제 동작 확인
- [ ] **J.10** I.5에서 트리거한 cron 응답이 정상이었으니 자동 트리거 일정도 정상이라 가정 (다음 03:00 이후 cron-job.org 로그에서 재확인)
- [ ] **J.11** 테스트로 등록한 글 삭제 (어드민에서)

---

## K. 운영 정기 점검 (월 1회)

- [ ] Resend 대시보드 → 발송 성공률 확인 (스팸 신고 없는지)
- [ ] cron-job.org → 최근 30일 cron 성공률 100% 인지
- [ ] Cloudflare D1 대시보드 → 사용량(읽기·쓰기) 무료 티어 내인지 (5GB / 5M reads / 100k writes 일일)
- [ ] 어드민 들어가서 1년 경과한 글이 자동 삭제되었는지 확인 (`expires_at` 1년 룰)

---

## 롤백 / 트러블슈팅

### 배포가 깨졌을 때
Cloudflare Pages 대시보드 → **Deployments** → 마지막 정상 배포 → **Rollback to this deployment**.

### 이메일이 스팸함으로 가는 경우
1. Resend 대시보드 → Domain → SPF/DKIM/DMARC 모두 ✓ 인지 재확인
2. 받는 메일함에서 발신자(`noreply@한라산출장바베큐.kr`)를 "스팸 아님" / "주소록 추가" 처리
3. DMARC 정책이 너무 엄격하면 `p=quarantine` → `p=none`으로 일시 완화 후 재인증

### Cloudflare Access OTP 메일이 안 옴
1. Zero Trust → Logs → Access → 해당 사용자 시도 로그 확인
2. 이메일 주소 오타 / 정책에서 빠뜨린 주소가 있는지 H.5 재검토
3. Naver 메일이 OTP를 스팸으로 분류 가능 → 첫 시도 시 스팸함 확인

### D1 쿼리 에러 ("no such table")
배포 후 처음 발생 시 D.5(`pnpm db:generate:remote`)를 안 한 경우. 다시 실행.

### `getCloudflareContext has been called without...` 로컬 dev 에러
`next.config.ts`에 `initOpenNextCloudflareForDev()` 호출이 있는지 확인. 있으면 dev 서버 재시작.

---

## 부록: 시크릿 분실 / 키 교체

| 시크릿 | 분실 영향 | 교체 방법 |
|---|---|---|
| `PII_KEY` | 기존 글의 전화·이메일 **복호화 불가** (영구 손실) | 절대 분실 금지. 1Password 등에 백업 |
| `SESSION_SECRET` | 기존 발급된 owner 쿠키 무효화 (사용자가 다시 비번 입력) | 안전. 즉시 교체 가능 |
| `RESEND_API_KEY` | 새 문의 알림만 끊김 (글 등록은 계속 됨) | Resend 대시보드에서 재발급 |
| `CRON_SECRET` | cron 호출 403 → 만료 글 삭제 일시 중단 | 새 값 생성 → secret put + cron-job.org Header 동시 갱신 |
| `TURNSTILE_SECRET` | 폼 등록 시 봇 검증 실패 → 모든 등록 거부 | Turnstile 대시보드에서 재발급 |
| `ACCESS_AUD` | 어드민 페이지 접근 차단 | Application 재생성 후 새 AUD 등록 |

---

## 향후 확장 (Plan 별도)

- 첨부파일 (R2 + presigned URL)
- 손님에게 답글 알림 (관리자 답글 시 이메일)
- 카카오 알림톡 (도달률 ↑, 유료)
- 검색·카테고리 필터
- 어드민 대시보드(통계, 최근 30일 문의 추이)

각 항목은 별도 spec → plan → implementation 사이클로 진행.
