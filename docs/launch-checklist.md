# 한라산출장바베큐 런칭 체크리스트 (Cloudflare)

코드는 모두 완성되어 GitHub `main`에 푸시되어 있습니다.
이 문서는 사장님 직접 진행하셔야 하는 외부 서비스 연동·등록 작업입니다.
**위→아래 순서대로** 진행하시면 됩니다.

배포 플랫폼은 **Cloudflare Workers (OpenNext 어댑터)** 입니다.
이유: D1(문의 저장), Turnstile(스팸 방어), Cron(자동 만료) 기능이 모두 Cloudflare 전용으로 작성되어 있습니다.

---

## ① Cloudflare 계정 및 wrangler 로그인 (예상 5분)

1. https://dash.cloudflare.com → 회원가입 (이미 있다면 로그인)
2. 터미널에서 프로젝트 폴더로 이동 후:
   ```
   npx wrangler login
   ```
   브라우저가 열리고 권한 허용 → 터미널에 `Successfully logged in` 표시되면 OK
3. 동작 확인:
   ```
   npx wrangler whoami
   ```
   계정 이메일이 나오면 됩니다.

---

## ② 도메인을 Cloudflare로 이전 (이미 Cloudflare면 건너뛰기, 10~30분)

`한라산출장바베큐.kr`와 `출장바베큐.kr` 두 도메인 모두 Cloudflare DNS에서 관리해야 합니다.

이미 Cloudflare에 있다면 ③으로.

새로 옮기는 경우:
1. 대시보드 → **Websites → Add a site** → 도메인 입력
2. Free plan 선택
3. Cloudflare가 보여주는 2개의 네임서버(NS) 주소 복사
4. 기존 도메인 등록 업체(가비아 등)에서 NS를 Cloudflare 것으로 변경
5. NS 전파 대기 (보통 1~6시간, 최대 24시간)
6. 두 도메인 모두 동일하게 처리

---

## ③ D1 데이터베이스 생성 및 스키마 적용 (예상 5분)

문의 내역이 저장될 데이터베이스입니다.

1. 생성:
   ```
   npx wrangler d1 create hanlasan-bbq
   ```
   출력 마지막에 `database_id = "xxxxxxxx-xxxx-..."` 형태의 ID가 표시됩니다. **그 ID를 복사하세요.**

2. `wrangler.toml` 9번째 줄의 placeholder ID를 위에서 복사한 실제 ID로 교체:
   ```toml
   database_id = "여기에-방금-받은-ID-붙여넣기"
   ```

3. 스키마 적용(테이블 생성):
   ```
   pnpm db:generate:remote
   ```
   `Executed X commands` 표시되면 OK.

---

## ④ Turnstile (스팸 방어 캡차) 사이트 생성 (예상 3분)

문의 폼이 봇으로부터 보호받기 위해 필요합니다.

1. https://dash.cloudflare.com → 좌측 메뉴 **Turnstile** → **Add site**
2. 사이트 이름: `한라산출장바베큐`
3. Hostnames: `한라산출장바베큐.kr`, `출장바베큐.kr`, `xn--*.kr` 모두 추가 (Cloudflare가 자동 punycode 변환)
4. Widget mode: **Managed** (권장)
5. 생성 완료 후 다음 두 값을 메모:
   - **Site Key** (공개) — 예: `0x4AAAAAAA...`
   - **Secret Key** (비공개) — 예: `0x4AAAAAAA...`

6. `wrangler.toml` 18번째 줄(`TURNSTILE_SITE_KEY`)을 실제 Site Key로 교체.
7. Secret Key는 ⑥에서 등록합니다.

---

## ⑤ Resend 이메일 발송 키 발급 (예상 3분)

새 문의 알림 이메일에 필요합니다.

1. https://resend.com → 회원가입
2. **Domains → Add Domain** → `한라산출장바베큐.kr` 입력
3. Resend가 보여주는 SPF / DKIM DNS 레코드를 Cloudflare DNS(②번 단계의 그 계정)에 추가
4. 검증 완료 후 **API Keys → Create API Key** → 권한 `Sending access` 선택
5. 생성된 키(`re_...`) 메모. ⑥에서 등록합니다.

---

## ⑥ 시크릿(비공개) 환경변수 등록 (예상 5분)

`.dev.vars`에 있는 값들은 로컬 전용입니다. 프로덕션엔 따로 등록해야 합니다.

터미널에서 아래 5개 명령을 차례로 실행. 각 명령마다 값을 묻는 프롬프트가 나오면 입력 후 Enter:

```
npx wrangler secret put TURNSTILE_SECRET
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put PII_KEY
npx wrangler secret put SESSION_SECRET
npx wrangler secret put CRON_SECRET
```

| 키 | 값 | 비고 |
|---|---|---|
| `TURNSTILE_SECRET` | ④에서 받은 Secret Key | |
| `RESEND_API_KEY` | ⑤에서 받은 `re_...` 키 | |
| `PII_KEY` | 32바이트 base64 랜덤 문자열 | `openssl rand -base64 32`로 새로 생성 권장 (개발용 `.dev.vars` 값 재사용 가능하나 분리가 안전) |
| `SESSION_SECRET` | 동상동문 | 동상동문 |
| `CRON_SECRET` | 64자 hex 랜덤 | `openssl rand -hex 32`로 생성. 크론 엔드포인트 보호용 |

각 명령이 `Success!` 응답하면 OK.

---

## ⑦ 빌드 시점 환경변수 파일 작성 (예상 2분)

`NEXT_PUBLIC_*` 변수는 빌드 시점에 JS에 인라인되므로 시크릿이 아닌 별도 파일에 둡니다.

프로젝트 루트에 `.env.production.local` 파일을 만들고 다음 내용을 채워 넣습니다 (이 파일은 `.gitignore`에 이미 포함):

```
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_NAVER_ANALYTICS_ID=
TURNSTILE_SITE_KEY=
```

`TURNSTILE_SITE_KEY` 값은 ④번에서 받은 Site Key를 그대로 사용.
나머지 3개는 ⑩, ⑪, ⑫번 단계에서 발급되면 그때 채우고 재배포합니다 (지금은 빈 값으로 둬도 OK).

---

## ⑧ 첫 배포 (예상 3~5분)

```
pnpm deploy
```

빌드 → Cloudflare에 업로드까지 자동 진행됩니다. 마지막에 `https://hanlasan-bbq.<your-subdomain>.workers.dev` 형태의 임시 URL이 표시되면 배포 성공입니다.

브라우저로 그 URL을 열어 사이트가 보이는지 확인하세요.

---

## ⑨ 커스텀 도메인 연결 (예상 5분)

1. https://dash.cloudflare.com → **Workers & Pages → hanlasan-bbq** 클릭
2. **Settings → Domains & Routes → Add → Custom Domain**
3. `한라산출장바베큐.kr` 입력 (자동으로 punycode 변환됨)
4. `출장바베큐.kr`도 동일하게 추가
5. 각 도메인의 `www.` 서브도메인도 추가 (선택)
6. SSL 발급 대기 (보통 1~5분)
7. 검증:
   ```
   curl -sI https://한라산출장바베큐.kr | head -3
   curl -s https://한라산출장바베큐.kr | grep -i 'rel="canonical"'
   ```
   첫 명령은 `HTTP/2 200`, 두 번째 명령은 `<link rel="canonical" href="https://xn--…/"/>` 라인이 나오면 OK.
   `출장바베큐.kr`도 같은 방식으로 확인.

---

## ⑩ 네이버 서치어드바이저 등록 (필수)

1. https://searchadvisor.naver.com → 로그인 → **사이트 관리 → 사이트 추가**
2. URL 입력: `https://한라산출장바베큐.kr`와 `https://출장바베큐.kr` **각각 별도로 등록**
3. 소유 확인 → **HTML 태그** 방식 선택 → 메타 태그의 `content="..."` 값 복사
4. `.env.production.local`의 `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` 에 그 값을 입력
5. 재배포:
   ```
   pnpm deploy
   ```
6. 다시 서치어드바이저로 돌아와 **소유 확인** 클릭
7. 확인 완료 후 **요청 → 사이트맵 제출** 에 `https://한라산출장바베큐.kr/sitemap.xml` 입력
8. **요청 → 웹페이지 수집 요청** 으로 4개 URL 직접 수집 요청:
   - `/` `/company` `/menu` `/gallery`

---

## ⑪ 네이버 애널리틱스 (선택이지만 강력 권장)

1. https://analytics.naver.com → 로그인 → **사이트 추가**
2. URL: `https://한라산출장바베큐.kr`
3. 추적 코드 ID(`s_xxxxxxxxx` 형태)를 복사
4. `.env.production.local`의 `NEXT_PUBLIC_NAVER_ANALYTICS_ID`에 입력 → `pnpm deploy` 재실행
5. 24시간 후 데이터 수집 확인. 전화/문자/이메일 클릭이 자동 이벤트로 기록됩니다.

---

## ⑫ Google Search Console 등록 (선택)

네이버가 주력이지만, 지도/검색 일부에 구글도 영향. 5분 작업.

1. https://search.google.com/search-console → 속성 추가 → **URL 접두어**
2. `https://한라산출장바베큐.kr` 입력
3. HTML 태그 방식 → `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`에 입력 → `pnpm deploy`
4. 사이트맵 제출: `sitemap.xml`

---

## ⑬ 비즈니스 정보 보강 (코드 변경 1줄)

`src/lib/constants.ts` 의 `CONTACT.address` 줄을 실제 사업자 주소로 교체:
```ts
address: '경기도 안양시 …',  // 실제 주소 입력
```
변경 후:
```
git add -A && git commit -m "chore: update business address" && pnpm deploy
```

이 한 줄로 푸터, JSON-LD `LocalBusiness`, 모든 위치가 자동 갱신됩니다.

---

## ⑭ 실제 사진 업로드 (Lighthouse·전환 둘 다 가장 큰 임팩트)

현재는 placeholder SVG 사용 중. `public/images/` 아래에 실제 사진 업로드:
- `public/images/hero/` — 메인 히어로 사진 1~2장
- `public/images/menu/` — 메뉴별 사진 (`menu-{id}.jpg` 권장)
- `public/images/company/chef.jpg` — 셰프 사진

업로드 후 `src/data/menu.ts`의 `imageSrc` 경로 갱신. 그리고 `pnpm deploy`.

---

## ⑮ 관리자 페이지 보호 (선택, 첫 문의 들어오기 전까지 미뤄도 됨)

`/admin/inquiry`는 누구나 URL을 알면 접근 가능합니다. 사장님만 접근하도록 Cloudflare Access로 보호:

1. https://one.dash.cloudflare.com → **Access → Applications → Add an application**
2. **Self-hosted** 선택
3. Application name: `Hanlasan Admin`
4. Application domain: `한라산출장바베큐.kr/admin/*`
5. **Identity providers**: One-time PIN 추가 (이메일 PIN 인증)
6. **Policies → Add a policy**:
   - Action: `Allow`
   - Include: Emails → `ohb4199@gmail.com` (관리할 본인 이메일 입력)
7. 저장
8. 다음 두 값을 `wrangler.toml`의 `[vars]` 섹션에 추가:
   ```toml
   ACCESS_TEAM_DOMAIN = "your-team.cloudflareaccess.com"
   ACCESS_AUD = "Application Audience tag 복사값"
   ```
   - `team_domain`은 **Access → Settings**의 Team domain.
   - `AUD`는 방금 만든 Application의 **Overview** 탭에 있는 Audience Tag.
9. `pnpm deploy` 재실행.

이제 `/admin/inquiry`에 들어가면 본인 이메일로 PIN이 발송됩니다.

---

## ⑯ 네이버 파워링크 캠페인 등록

1. https://searchad.naver.com → **광고 만들기 → 파워링크**
2. 캠페인 / 광고그룹 / 키워드 / 소재 4단계
3. **추천 키워드 그룹**:
   - 그룹 A (브랜드): `한라산출장바베큐`, `한라산바베큐`
   - 그룹 B (지역): `안양출장바베큐`, `수도권출장바베큐`, `전국출장케이터링`
   - 그룹 C (이벤트): `기업 출장 바베큐`, `워크샵 출장 케이터링`, `돌잔치 출장`
4. **광고 소재** 2~3종 A/B:
   - 소재1 (USP): "엄선한 직거래 식재료 / 셰프 직출장"
   - 소재2 (가격): "1인 55,000원~ 풀세트"
   - 소재3 (편의): "전화·문자 한 번이면 끝"
5. **랜딩 URL**: `https://한라산출장바베큐.kr/?utm_source=naver&utm_medium=cpc&utm_campaign=launch&utm_content={광고소재명}`
   - UTM은 본 사이트가 자동 캡처해 전화 클릭 등 전환 이벤트에 함께 기록합니다.
6. 첫 7일 일 1회 모니터링 → 키워드/소재 ROI 기준으로 정리
   - 봐야 할 지표: 노출수, 클릭률(CTR), 전화 클릭수(네이버 애널리틱스 이벤트)

---

## ⑰ 출시 후 30일 모니터링

| 항목 | 도구 | 빈도 |
|------|------|------|
| 페이지 색인 상태 | 네이버 서치어드바이저 / GSC | 주 1회 |
| 광고 효율 (CTR/CPC) | 네이버 광고관리 | 일 1회 |
| 전화·문자·이메일 전환 | 네이버 애널리틱스 이벤트 | 주 1회 |
| Worker 요청수·에러율 | Cloudflare 대시보드 → Workers & Pages → hanlasan-bbq → Metrics | 주 1회 |
| 페이지 속도 | Cloudflare Web Analytics (무료, 대시보드 활성화 필요) | 주 1회 |
| D1 사용량 | Cloudflare 대시보드 → D1 → hanlasan-bbq | 주 1회 |
| 신규 블로그 글 자동 갱신 | 갤러리 페이지 직접 확인 | 새 글 작성 시 |

Cloudflare Web Analytics 활성화: 대시보드 → **Analytics & Logs → Web Analytics → Add a site** → 도메인 입력 → 자동 추적 (별도 JS 삽입 불필요).

---

## ⑱ 알려진 미완 항목 (다음 단계로 미룰 수 있음)

- 모바일 햄버거 메뉴 포커스 트랩 (a11y, low priority)
- 갤러리 카드 실제 이미지 노출 (현재 emoji placeholder; thumbnailUrl은 RSS에서 이미 가져옴)
- 네이버 블로그 누적 글 표시 (현재 RSS 최근 ~10개; 더 많이 보여줘야 한다면 OpenAPI 또는 캐시 전략 추가)
- 카카오톡 채널 연동 (현재 NOT in scope, 필요 시 추가)
- Pretendard 폰트 self-hosting (현재 CDN; 매우 작은 성능 이득 있음)

---

## 도움이 필요하면

- 위 단계 중 막히는 부분 있으면 단계 번호와 에러 메시지 알려주시면 됩니다
- 코드 수정이 필요한 추가 요청 (메뉴 추가, 텍스트 변경, 디자인 조정)은 언제든 말씀해주세요

---

## 참고: 자주 쓰는 명령어

```
pnpm dev                    # 로컬 개발 서버
pnpm preview                # Cloudflare 런타임으로 로컬 테스트 (배포 직전 확인용)
pnpm deploy                 # 빌드 + Cloudflare 배포
pnpm db:generate:remote     # 프로덕션 D1에 마이그레이션 적용
npx wrangler tail           # 프로덕션 실시간 로그 확인 (에러 디버깅)
npx wrangler d1 execute hanlasan-bbq --remote --command "SELECT COUNT(*) FROM inquiries"
                            # 문의 건수 확인 등 임시 쿼리
```
