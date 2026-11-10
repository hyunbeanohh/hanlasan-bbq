# 한라산출장바베큐

출장 바베큐 케이터링 공식 홈페이지 **https://한라산출장바베큐.kr** (punycode: `xn--oi2b40g9l97kpyk0jjr0ee5l.kr`)

> 이 README는 다른 컴퓨터에서도 작업을 바로 이어갈 수 있도록 **현재 운영 상태와 작업 이력**을 함께 관리합니다.
> 코드나 외부 서비스 설정을 바꾸면 아래 '운영 현황'과 '작업 이력'을 같은 커밋에서 갱신하세요.

---

## 빠른 시작 (새 컴퓨터)

```bash
git clone https://github.com/hyunbeanohh/hanlasan-bbq.git
cd hanlasan-bbq
corepack enable            # 또는 npm i -g pnpm@10.20.0
pnpm install --frozen-lockfile
cp .dev.vars.example .dev.vars        # 로컬 런타임 비밀값 (실제 값은 별도 보관)
cp .env.local.example .env.local      # 공개 환경변수 (비워 둬도 동작)
pnpm dev                               # http://localhost:3000
```

- Node.js 22, pnpm 10.20.0 (`package.json`의 `packageManager`로 고정)
- 테스트: `pnpm test` (Vitest) / 린트: `pnpm lint`
- 로컬 D1 초기화: `pnpm db:generate`
- Next.js 16.x입니다. 코드 작성 전 `AGENTS.md` 안내대로 `node_modules/next/dist/docs/`를 확인하세요.

## 배포

**GitHub `main`에 push하면 자동 배포됩니다** (Cloudflare Workers Builds, 2026-11-10 연결).

| 항목 | 값 |
|---|---|
| Worker | `hanlasan-bbq` (Cloudflare 계정 ohb4199@gmail.com) |
| 빌드 명령 | `npx --yes pnpm@10.20.0 exec opennextjs-cloudflare build` |
| 배포 명령 | `npx --yes pnpm@10.20.0 exec opennextjs-cloudflare deploy` |
| 빌드 변수 | `TURNSTILE_SITE_KEY`(공개 키, 메인 prerender에 필요), `NODE_VERSION=22` |
| 진행 확인 | Cloudflare 대시보드 > Workers & Pages > hanlasan-bbq > Deployments |
| 롤백 | 같은 화면에서 이전 버전 선택 후 배포 |

- 빌드는 보통 2분 안에 끝납니다. 실패하면 Deployments의 빌드 로그를 확인하세요.
- 자동 배포가 안 될 때 수동 배포(WSL): [docs/windows-cloudflare-deployment.md](docs/windows-cloudflare-deployment.md)
  - `pnpm exec wrangler login` 후 `powershell -ExecutionPolicy Bypass -File scripts/cloudflare-wsl.ps1 -Mode check`, 이어서 `-Mode deploy`
  - Wrangler 로그인은 자주 만료됩니다. `Not logged in`이 나오면 다시 로그인하세요.
- 런타임 비밀값(`PII_KEY`, `SESSION_SECRET`, `RESEND_API_KEY`, `TURNSTILE_SECRET`, `CRON_SECRET` 등)은 Cloudflare Worker 설정에만 있고 저장소에는 없습니다.

## 기술 구성

- Next.js 16 (App Router) + React 19, Tailwind CSS
- Cloudflare Workers + OpenNext 어댑터, D1(문의 저장), Turnstile(스팸 방지), Cron(`0 18 * * *`, 오래된 문의 만료), Resend(문의 알림 메일)
- 관리자 페이지 `/admin/inquiry`는 Cloudflare Access로 보호
- 도메인: `한라산출장바베큐.kr`이 정식. `www`, `출장바베큐.kr`은 `src/middleware.ts`에서 301 리디렉션

### 주요 경로

| 경로 | 내용 |
|---|---|
| `/` | 메인 (빠른 견적 폼 포함) |
| `/company`, `/menu`, `/banquet`, `/gallery` | 회사소개, 메뉴, 잔치 메뉴, 행사 기록 |
| `/inquiry` | 견적 폼 + 문의 게시판 목록 (`#quote` 앵커) |
| `/inquiry/new`, `/inquiry/[id]` | 문의 게시판 작성/상세 (비밀번호, 비밀글) |
| `/admin/inquiry` | 관리자 답변 |
| `/api/cron/expire` | 크론 작업 |

### 주요 파일

| 파일 | 역할 |
|---|---|
| `src/lib/constants.ts` | 사이트명, 전화·문자·이메일, 사업장 주소, 영업시간, 블로그 ID |
| `src/app/page.tsx` | 메인 SEO 제목·설명 |
| `src/app/layout.tsx` | 공통 메타, 사이트 인증 태그(네이버·구글), 분석 스크립트 |
| `src/components/home/reservation/QuickQuoteForm.tsx` | 빠른 견적 폼 (전화·문자 버튼, 보안 확인 실패 안내) |
| `src/components/inquiry/TurnstileWidget.tsx` | Turnstile (`appearance: interaction-only`) |
| `src/components/layout/MobileCTABar.tsx` | 모바일 하단 고정 바 (전화, 견적, 문자, 이메일) |
| `src/components/analytics/*`, `src/lib/analytics/*` | GA4, 네이버 전환추적, UTM 저장 |
| `src/components/seo/LocalBusinessJsonLd.tsx` | 업체 구조화 데이터 |
| `next.config.ts` | CSP 헤더, 리디렉션 |

## 운영 현황 (2026-11-10 기준)

### 분석·측정

| 도구 | 상태 |
|---|---|
| GA4 | 측정 ID `G-F208LM9Z8K` (속성 a412415538p559491432). 주요 이벤트: `generate_lead`(견적 접수), `phone_click`(전화 클릭). Search Console 연결됨 |
| 네이버 전환추적 | 공통키 `s_3cd13a72248` (`src/lib/analytics/naver.ts`). 전환: `lead`(견적 접수, 게시판 등록), `custom001`(전화 클릭). 수집 서버 `wcs.naver.com`은 CSP에 허용. NHN DATA 검수 대기(광고주센터 상태 '신청중') |
| Google Search Console | URL 프리픽스 속성 `https://xn--oi2b40g9l97kpyk0jjr0ee5l.kr/` (ohb4199@gmail.com) |
| 네이버 서치어드바이저 | 인증 태그 2개(`layout.tsx`): 기존 계정 + ohnamsoo3822(광고 계정). 사이트맵 `/sitemap.xml` 제출됨 |

### 네이버 검색광고 (계정 ohnamsoo3822, 광고그룹 '한라산출장바베큐_new')

- 하루 예산 30,000원(캠페인·그룹), 시간별 균등 배분
- 소재 2개, 연결 URL에 UTM: `?utm_source=naver&utm_medium=cpc&utm_campaign=powerlink&utm_content=rsa_new` 또는 `rsa_original`
- 제외 검색어 약 600개(축제, 바베큐장 대여, 캠핑·펜션, 맛집류 등)
- 2일마다 자동 점검 메일 발송(ohb4199@gmail.com)
- 서비스 지역: 전국(원주, 광양 포함, 견적에 따라 다름)

### 남은 일

- [ ] NHN DATA 전환추적 검수 완료 확인 (https://navercts.channel.io/lounge)
- [ ] 비즈머니 자동충전 또는 잔액 알림 설정
- [ ] 견적 폼 개선 효과 확인(2026-11-17 이후). 접수율이 낮으면 필수 항목 축소, '날짜 미정' 선택지 검토
- [ ] 통돼지바베큐 입찰가: 최근 7일 CPC 7,000원 이상이고 그룹 비용 40% 이상이면 6,500원 검토

## 작업 이력

| 날짜 | 내용 |
|---|---|
| 2026-11-10 | `/opengraph-image` 를 `/opengraph-image.jpg` 로 301 리디렉션(Search Console 404 정리). README에 운영 현황, 작업 이력 추가 |
| 2026-11-10 | Cloudflare Workers Builds 자동 배포 연결, `packageManager: pnpm@10.20.0` 고정 |
| 2026-11-10 | 사업장 주소 반영(안양시 만안구 박달로578번길 36, 1층), 카카오톡 채널 코드 제거, 모바일 하단 바에 '견적' 버튼 |
| 2026-11-10 | 견적 폼: 상단 전화·문자 버튼, Turnstile 숨김 방식 + 실패 시 연락처 안내 |
| 2026-11-10 | 메인 제목·설명을 '통돼지바베큐 출장', '케이터링' 중심으로 변경 |
| 2026-11-10 | 네이버 서치어드바이저 ohnamsoo3822 계정 인증 태그 추가 |
| 2026-11-02 | 네이버 전환추적 설치(페이지뷰, lead, custom001), CSP에 `wcs.naver.com` 허용 |
| 2026-10-20 | GA4 방문, 전화 클릭, 견적 접수 이벤트 연동 |

## 문서

- [docs/windows-cloudflare-deployment.md](docs/windows-cloudflare-deployment.md): 수동 배포(WSL)
- [docs/inquiry-board-deployment.md](docs/inquiry-board-deployment.md): 문의 게시판 인프라(D1, 비밀값, Turnstile, Access)
- [docs/launch-checklist.md](docs/launch-checklist.md): 최초 런칭 체크리스트
- `docs/superpowers/`: 기능별 설계·계획 문서
