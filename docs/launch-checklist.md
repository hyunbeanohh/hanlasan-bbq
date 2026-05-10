# 한라산출장바베큐 런칭 체크리스트 (Phase 6)

코드는 모두 완성되어 GitHub `main`에 푸시되어 있습니다 (29 커밋).
이 문서는 사장님 직접 진행하셔야 하는 외부 서비스 연동·등록 작업입니다.
**위→아래 순서대로** 진행하시면 됩니다.

---

## ① Vercel 배포 + 도메인 연결 (예상 15~30분)

1. https://vercel.com → **Add New… → Project**
2. **Import Git Repository** → `hyunbeanohh/hanlasan-bbq` 선택
3. Framework: **Next.js** 자동 감지 → **Deploy** 클릭
4. 배포 완료(약 2분) 후 임시 URL(예: `hanlasan-bbq.vercel.app`)에서 동작 확인
5. **Settings → Domains** 에서 두 도메인 추가:
   - `한라산출장바베큐.kr`  ← 클릭하면 punycode `xn--…`로 자동 변환됨
   - `출장바베큐.kr`
   - 각 도메인의 `www.` 서브도메인도 함께 추가 (자동 redirect)
6. **Cloudflare DNS** (두 도메인 모두 Cloudflare에서 관리 중인 경우):
   - Vercel이 안내한 A 레코드 / CNAME 값을 그대로 등록
   - 프록시 상태는 **DNS only (회색 구름)** 로 설정 (Vercel이 자체 SSL 발급해야 함)
7. SSL 발급 대기 (5~10분) 후 검증:
   ```
   curl -sI https://한라산출장바베큐.kr | head -5
   curl -sI https://출장바베큐.kr | head -5
   ```
   둘 다 `HTTP/2 200` + `link: <https://xn--…/>; rel="canonical"` 헤더가 보이면 OK.

---

## ② 환경변수 설정 (Vercel 대시보드)

Vercel 프로젝트 → **Settings → Environment Variables** 에서 추가:

| 키 | 값 | 환경 |
|----|------|------|
| `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` | (③에서 발급) | Production, Preview |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | (선택, ⑤에서 발급) | Production, Preview |
| `NEXT_PUBLIC_NAVER_ANALYTICS_ID` | (④에서 발급) | Production |

추가 후 **Deployments → 최근 배포 → ⋯ → Redeploy** 한 번 눌러야 적용됩니다.

---

## ③ 네이버 서치어드바이저 등록 (필수)

1. https://searchadvisor.naver.com → 로그인 → **사이트 관리 → 사이트 추가**
2. URL 입력: `https://한라산출장바베큐.kr` 와 `https://출장바베큐.kr` **각각 별도로 등록**
3. 소유 확인 → **HTML 태그** 방식 선택 → 메타 태그의 `content="..."` 값 복사
4. 위 ②번 표의 `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` 에 그 값을 붙여넣고 Vercel Redeploy
5. 다시 서치어드바이저로 돌아와 **소유 확인** 클릭
6. 확인 완료 후 **요청 → 사이트맵 제출** 에 `https://한라산출장바베큐.kr/sitemap.xml` 입력
7. 서치어드바이저 → **요청 → 웹페이지 수집 요청** 으로 4개 URL 직접 수집 요청:
   - `/` `/company` `/menu` `/gallery`

---

## ④ 네이버 애널리틱스 (선택이지만 강력 권장)

1. https://analytics.naver.com → 로그인 → **사이트 추가**
2. URL: `https://한라산출장바베큐.kr`
3. 추적 코드 ID(`s_xxxxxxxxx` 형태)를 복사
4. ②번 표의 `NEXT_PUBLIC_NAVER_ANALYTICS_ID`에 입력 → Redeploy
5. 24시간 후 데이터 수집 확인. 전화/문자/이메일 클릭이 자동 이벤트로 기록됩니다.

---

## ⑤ Google Search Console 등록 (선택)

네이버가 주력이지만, 지도/검색 일부에 구글도 영향. 5분 작업.

1. https://search.google.com/search-console → 속성 추가 → **URL 접두어**
2. `https://한라산출장바베큐.kr` 입력
3. HTML 태그 방식 → `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`에 입력 → Redeploy
4. 사이트맵 제출: `sitemap.xml`

---

## ⑥ 비즈니스 정보 보강 (코드 변경 1줄)

`src/lib/constants.ts` 의 `CONTACT.address` 줄을 실제 사업자 주소로 교체:
```ts
address: '제주특별자치도 제주시 …',  // 실제 주소 입력
```
변경 후 `git commit -am "chore: update business address"` → push → Vercel 자동 배포.

이 한 줄로 푸터, JSON-LD `LocalBusiness`, 모든 위치가 자동 갱신됩니다.

---

## ⑦ 실제 사진 업로드 (Lighthouse·전환 둘 다 가장 큰 임팩트)

현재는 placeholder SVG 사용 중. `public/images/` 아래에 실제 사진 업로드:
- `public/images/hero/` — 메인 히어로 사진 1~2장
- `public/images/menu/` — 메뉴별 사진 (`menu-{id}.jpg` 권장)
- `public/images/company/chef.jpg` — 셰프 사진

업로드 후 `src/data/menu.ts`의 `imageSrc` 경로 갱신.

---

## ⑧ 네이버 파워링크 캠페인 등록

1. https://searchad.naver.com → **광고 만들기 → 파워링크**
2. 캠페인 / 광고그룹 / 키워드 / 소재 4단계
3. **추천 키워드 그룹**:
   - 그룹 A (브랜드): `한라산출장바베큐`, `한라산바베큐`
   - 그룹 B (지역): `제주출장바베큐`, `제주바베큐출장`, `제주케이터링`
   - 그룹 C (이벤트): `기업 출장 바베큐`, `워크샵 출장 케이터링`, `돌잔치 출장`
4. **광고 소재** 2~3종 A/B:
   - 소재1 (USP): "제주 직거래 식재료 / 셰프 직출장"
   - 소재2 (가격): "1인 55,000원~ 풀세트"
   - 소재3 (편의): "전화·문자 한 번이면 끝"
5. **랜딩 URL**: `https://한라산출장바베큐.kr/?utm_source=naver&utm_medium=cpc&utm_campaign=launch&utm_content={광고소재명}`
   - UTM은 본 사이트가 자동 캡처해 전화 클릭 등 전환 이벤트에 함께 기록합니다.
6. 첫 7일 일 1회 모니터링 → 키워드/소재 ROI 기준으로 정리
   - 봐야 할 지표: 노출수, 클릭률(CTR), 전화 클릭수(네이버 애널리틱스 이벤트)

---

## ⑨ 출시 후 30일 모니터링

| 항목 | 도구 | 빈도 |
|------|------|------|
| 페이지 색인 상태 | 네이버 서치어드바이저 / GSC | 주 1회 |
| 광고 효율 (CTR/CPC) | 네이버 광고관리 | 일 1회 |
| 전화·문자·이메일 전환 | 네이버 애널리틱스 이벤트 | 주 1회 |
| 페이지 속도 | Vercel Analytics + Speed Insights | 주 1회 |
| 신규 블로그 글 자동 갱신 | 갤러리 페이지 직접 확인 | 새 글 작성 시 |

---

## ⑩ 알려진 미완 항목 (다음 단계로 미룰 수 있음)

- 모바일 햄버거 메뉴 포커스 트랩 (a11y, low priority)
- 갤러리 카드 실제 이미지 노출 (현재 emoji placeholder; thumbnailUrl은 RSS에서 이미 가져옴)
- 네이버 블로그 누적 글 표시 (현재 RSS 최근 ~10개; 더 많이 보여줘야 한다면 OpenAPI 또는 캐시 전략 추가)
- 카카오톡 채널 연동 (현재 NOT in scope, 필요 시 추가)
- Pretendard 폰트 self-hosting (현재 CDN; 매우 작은 성능 이득 있음)

---

## 도움이 필요하면

- 위 단계 중 막히는 부분 있으면 단계 번호와 에러 메시지 알려주시면 됩니다
- 코드 수정이 필요한 추가 요청 (메뉴 추가, 텍스트 변경, 디자인 조정)은 언제든 말씀해주세요
