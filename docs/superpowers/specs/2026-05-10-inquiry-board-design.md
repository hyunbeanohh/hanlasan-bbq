# 예약 문의 게시판 — 설계 문서

작성일: 2026-05-10
대상: 한라산출장바베큐 사이트 (`/Users/devbean/Desktop/한라산출장바베큐`)

---

## 1. 목적

손님이 예약 문의 글을 작성하고, 사장님(관리자)이 답글로 응대하는 게시판 기능을 사이트에 추가한다. 운영 비용 0원, 보안·스팸 방지 기본기 확보, 첫 출시는 MVP 범위로 한정한다.

## 2. 범위

### MVP에 포함

- 손님: 문의 글 작성 (이름·연락처·이메일·제목·내용 + 비밀번호 + 개인정보 동의)
- 손님: 비밀글 옵션 (비밀번호 입력자만 본문 열람)
- 손님: 본인 글 수정 / 삭제 (비밀번호 검증)
- 목록 보기 (10건/페이지, 숫자 페이지네이션, 답글 인덴트 표시)
- 관리자: 답글 작성, 모든 글 열람·삭제
- 사장님 이메일 알림: 새 문의가 등록되면 두 주소로 발송
- 스팸 방지: Cloudflare Turnstile, IP 기반 rate limit
- 개인정보 보호: 전화·이메일 암호화 저장, 1년 후 자동 삭제

### MVP에서 제외 (추후 검토)

- 첨부파일 업로드
- 공개 댓글(다른 손님의 댓글)
- 검색·카테고리 필터
- 회원가입 / 사용자 계정

## 3. 기술 스택

| 영역 | 선택 | 비고 |
| --- | --- | --- |
| 프레임워크 | Next.js 16 + React 19 (기존) | App Router, Server Actions |
| 호스팅 | Cloudflare Pages (`@opennextjs/cloudflare` 어댑터) | 신규 도입 |
| DB | Cloudflare D1 (SQLite at edge) | 무료 티어 5GB / 일 100k writes |
| 어드민 인증 | Cloudflare Access (Self-hosted application) | 무료 50명까지, 코드 0줄 |
| 캡챠 | Cloudflare Turnstile | 무료, Cloudflare 통합 |
| 이메일 발송 | Resend | 무료 3,000건/월, fetch API |
| 암호화 | Web Crypto API (PBKDF2, AES-GCM) | Workers 런타임 호환 |
| 스케줄러 | Cloudflare Cron Trigger | 매일 1회 만료 글 삭제 |

**총 추가 비용: 0원** (모든 서비스 무료 티어 내)

## 4. 도메인 / 인프라

### 도메인 전략

- 메인: `한라산출장바베큐.kr`
- 서브: `출장바베큐.kr` → `한라산출장바베큐.kr` 으로 영구 리디렉트(301)
- 등록기관: 가비아
- DNS: 가비아 → Cloudflare 네임서버로 이전 (Cloudflare Pages·Access 사용 조건)

### 발신 이메일

- 주소: `noreply@한라산출장바베큐.kr`
- 인증: Resend 대시보드에서 도메인 등록 → DNS TXT 레코드 4개(SPF·DKIM·DMARC·verification) 추가
- IDN 처리: Resend가 Punycode(`xn--...`)로 자동 변환하므로 사용자는 한글 도메인 그대로 입력

### 알림 수신자

- `ohnamsoo3822@naver.com`
- `ohb4199@gmail.com`

## 5. 데이터 모델

단일 테이블 `inquiries` + `parent_id`로 1단계 답글 트리.

```sql
CREATE TABLE inquiries (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id     INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
  is_admin      INTEGER NOT NULL DEFAULT 0,
  author_name   TEXT    NOT NULL,
  password_hash TEXT,
  password_salt TEXT,
  phone_enc     TEXT    NOT NULL,
  email_enc     TEXT    NOT NULL,
  title         TEXT    NOT NULL,
  content       TEXT    NOT NULL,
  is_secret     INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT    NOT NULL DEFAULT (datetime('now')),
  expires_at    TEXT    NOT NULL
);
CREATE INDEX idx_inquiries_parent  ON inquiries(parent_id);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);
CREATE INDEX idx_inquiries_expires ON inquiries(expires_at);

CREATE TABLE rate_limits (
  ip          TEXT NOT NULL,
  bucket      TEXT NOT NULL,            -- 'post', 'verify'
  attempts    INTEGER NOT NULL DEFAULT 0,
  window_end  TEXT NOT NULL,
  PRIMARY KEY (ip, bucket)
);
```

### 필드 설명

- `parent_id`: NULL = 손님 원글, 값 있음 = 관리자 답글(원글 가리킴). 답글의 답글은 만들지 않는다.
- `is_admin`: 관리자 답글 식별 (목록에서 "관리자"로 표시)
- `password_hash` / `password_salt`: 손님 글에만 존재. PBKDF2(SHA-256, 100,000 iter, 16-byte random salt). 관리자 답글은 NULL.
- `phone_enc` / `email_enc`: AES-GCM 암호화 후 base64. 키는 Cloudflare Secret(`PII_KEY`)에 보관.
- `is_secret`: 1이면 본문 보기 시 비밀번호 검증 필요 (관리자는 무조건 가능).
- `expires_at`: `created_at + 1년`. Cron에서 이 값 기준으로 자동 삭제.

## 6. 라우팅 / 화면

| 경로 | 메서드 | 설명 |
| --- | --- | --- |
| `/inquiry` | GET | 문의 목록 (페이지네이션) |
| `/inquiry/new` | GET / POST | 글 작성 폼 / 등록 |
| `/inquiry/[id]` | GET | 글 상세 (비밀글이면 비번 폼 노출) |
| `/inquiry/[id]/verify` | POST | 비밀번호 검증 → 30분짜리 글 단위 쿠키 발급 |
| `/inquiry/[id]/edit` | GET / POST | 본인 글 수정 (verify 통과 필요) |
| `/inquiry/[id]/delete` | POST | 본인 글 삭제 (verify 통과 필요) |
| `/admin/inquiry` | GET | 관리자 목록 (Cloudflare Access 보호) |
| `/admin/inquiry/[id]` | GET | 관리자 상세 (모든 글 평문 열람) |
| `/admin/inquiry/[id]/reply` | POST | 답글 등록 |
| `/admin/inquiry/[id]/delete` | POST | 관리자 강제 삭제 |
| `/privacy` | GET | 개인정보처리방침 페이지 (신규) |

### 헤더 내비게이션

기존 메뉴 끝에 "예약 문의" 항목 추가 → `/inquiry` 링크.

### 목록 화면 컬럼

번호 / 제목 / 작성자 / 작성일

- 비밀글: 제목 옆 🔒 아이콘
- 답글: 같은 목록 내 다음 행에 `ㄴ` 인덴트로 노출 (참조 디자인 일치)
- 페이지네이션: 10건/페이지, 1~10 숫자 + 이전/다음

### 작성 폼 항목 (모두 필수)

고객명 / 비밀번호 / 연락처(010-0000-0000 형식 검증) / 이메일 / 제목 / 본문 / 비밀글 체크박스 / 개인정보 수집·이용 동의 체크박스 / Turnstile 위젯

### 상세 화면

- 일반 글: 본문 + 답글 섹션 + (작성자 본인이라면) 수정·삭제 버튼
- 비밀글 + 미인증 사용자: 비밀번호 입력 폼만 노출
- 관리자(Cloudflare Access 통과): 모든 평문 열람 + 답글 작성 폼

## 7. 보안 / 프라이버시

| 위협 | 대응 |
| --- | --- |
| 비밀번호 평문 저장 | PBKDF2(SHA-256, 100k iter, 16B salt) 해시 + salt 별도 컬럼 |
| 비밀번호 무차별 대입 | `rate_limits` 테이블, IP+bucket 기준 5회/시간, 초과 시 1시간 잠금 + Turnstile 재요구 |
| 글 작성 스팸 | Turnstile 검증 (서버 측 토큰 검증), IP당 10건/일 |
| CSRF | Next.js Server Action의 기본 Origin 검증 + `Sec-Fetch-Site` 확인 |
| 어드민 무단 접근 | Cloudflare Access 정책: `/admin/*` 경로에 사장님 이메일만 허용 (Email OTP) |
| 개인정보 평문 노출 | 전화·이메일 AES-GCM 암호화, 키는 Workers Secret |
| 개인정보 장기 보관 | 매일 03:00 KST Cron Trigger가 `expires_at < now()` 자동 삭제 |
| 비밀글 본문 노출 | 작성자 비번 검증 후 30분 쿠키, HttpOnly·Secure·SameSite=Strict |
| XSS | 본문 렌더링 시 마크다운 비활성, 일반 텍스트 + `<br>` 변환만, React 기본 escape 신뢰 |

## 8. 이메일 알림

새 손님 글 등록 시 사장님 두 주소(`ohnamsoo3822@naver.com`, `ohb4199@gmail.com`)로 동시 발송.

- 발신: `noreply@한라산출장바베큐.kr`
- 제목: `[한라산출장바베큐] 새 예약 문의 — {제목}`
- 본문: 작성자 / 작성일 / 제목 / 본문 첫 200자 / 어드민 링크(`https://한라산출장바베큐.kr/admin/inquiry/{id}`)
- 관리자 답글 등록 시 손님 알림은 MVP에서 미포함 (손님 이메일은 암호화되어 저장되므로 발송 시 복호화 단계 추가 필요 → 추후 검토)

발송 실패 시 글 등록 자체는 성공 처리하고, 별도 로그(Cloudflare Logpush 또는 console.error)로 남긴다.

## 9. 운영 / 배포

### 환경 변수 (Cloudflare Workers Secret)

- `PII_KEY` — AES-GCM 256bit 키 (base64)
- `RESEND_API_KEY`
- `TURNSTILE_SECRET`
- `NOTIFY_EMAILS` — 콤마 구분 수신 주소 목록
- `SITE_URL` — `https://한라산출장바베큐.kr`

### Cloudflare 바인딩

- D1 데이터베이스: `DB`
- Cron Trigger: `0 18 * * *` (UTC 기준 매일 18:00 = KST 03:00)

### 로컬 개발

- `wrangler d1 create hanlasan-bbq-dev` 후 마이그레이션 실행
- `.dev.vars` 에 위 환경변수 더미 값 작성
- `pnpm dev` (기존)

### 테스트 (Vitest)

- 비밀번호 해시 검증 (정확/오류/타이밍)
- 비밀글 권한 분기 (비인증/인증/관리자)
- Server Action 입력 검증 (빈값·형식 오류·길이 초과)
- 페이지네이션 경계값
- Cron 만료 삭제 로직 (시간 모킹)

### 모니터링

- Cloudflare Pages Analytics: 트래픽
- D1 쿼리 통계: Cloudflare 대시보드
- 이메일 발송 실패: Resend 대시보드

## 10. 구현 단계 (개요)

상세 구현 계획은 별도 plan 문서에서 다룬다. 큰 단계만 명시:

1. Cloudflare Pages 어댑터 + D1 바인딩 셋업
2. 도메인을 가비아 → Cloudflare DNS로 이전, Resend 도메인 인증
3. DB 스키마 마이그레이션
4. 손님 측: 목록 / 작성 / 상세 / 비밀번호 검증 / 수정·삭제
5. 관리자 측: Cloudflare Access 정책, 답글, 강제 삭제
6. 스팸 방지: Turnstile, rate limit
7. 알림: Resend 통합
8. 개인정보: 암호화, Cron 삭제, `/privacy` 페이지
9. 헤더 내비게이션 "예약 문의" 추가
10. 단위·통합 테스트, 운영 배포

## 11. 결정 로그

| 항목 | 선택 | 대안 / 이유 |
| --- | --- | --- |
| DB | Cloudflare D1 | Supabase는 외부 의존 추가, KV는 쿼리 부족 |
| 어드민 인증 | Cloudflare Access | 단일 비번 방식보다 보안 강하고 코드 0줄 |
| 첨부파일 | 미포함 | 운영상 카톡/이메일이 더 효율적, R2 추가 부담 회피 |
| 비번 정책 | 손님 비번 1개로 통합 | 비밀글 열람 + 본인 글 수정·삭제 동일 비번 사용 |
| 답글 깊이 | 1단계만 (관리자만) | 손님↔손님 댓글은 SNS화되면 문의 본질 흐려짐 |
| 보관 기간 | 1년 | 한국 개인정보보호법상 목적 달성 후 즉시 파기 원칙, 1년은 일반적 상담 보관 기간 |

## 12. 향후 검토

- 첨부파일(이미지) — R2 + presigned URL
- 관리자 답글 시 손님에게 이메일 알림 발송 (PII 복호화 후 Resend 발송)
- 카카오 알림톡 발송 — 이메일보다 도달률 높음, 유료
- 검색·카테고리 필터
- FAQ 분리 페이지
