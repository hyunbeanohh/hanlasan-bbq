# 관리자 답글 — 로컬 테스트 가능화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `next dev` 환경에서 관리자가 직접 `/admin/inquiry/<id>`에 진입해 답글을 작성하고, 손님 시점 `/inquiry/<id>`에서 답글이 보이는지 끝까지 검증할 수 있도록 두 개의 게이트(`forbidden()` API 플래그, 관리자 인증 우회)를 연다.

**Architecture:** 답글 로직(`replyAction`, `ReplyForm`, `createReply`)은 이미 존재하므로 비즈니스 코드 변경 없음. (a) `next.config.ts`에 `experimental.authInterrupts: true`를 추가해 `forbidden()` 사용 시 500을 없애고, (b) `isAdminRequest()` 첫 줄에 `NODE_ENV === 'development' && env.DEV_ADMIN_BYPASS === '1'` 이중 게이트 분기를 추가하며, (c) `.dev.vars`에 `DEV_ADMIN_BYPASS=1` 한 줄을 더해 로컬에서만 게이트를 켠다. 운영 빌드는 `NODE_ENV`가 `production`이고 `.dev.vars`가 번들되지 않으므로 우회 분기가 사실상 죽은 코드가 된다.

**Tech Stack:** Next.js 16 (App Router), `@opennextjs/cloudflare`, Cloudflare Access JWT(JWKS), Vitest(jsdom), Wrangler D1 local.

**참조 spec:** `docs/superpowers/specs/2026-05-27-admin-reply-local-testing-design.md`

---

## File Structure

| 파일 | 역할 | 변경 종류 |
|---|---|---|
| `next.config.ts` | Next.js 전역 설정 | Modify (+`experimental.authInterrupts: true`) |
| `src/lib/inquiries/admin.ts` | `isAdminRequest()` — CF Access JWT 검증 | Modify (함수 첫머리 우회 분기 +5줄) |
| `src/lib/inquiries/__tests__/admin.test.ts` | 우회 분기 단위 테스트 (신규) | Create |
| `.dev.vars` | 로컬 시크릿 (`.gitignore`됨) | Modify (커밋 안 됨) |

이외 파일/컴포넌트/DB 마이그레이션 변경 없음.

---

### Task 1: `forbidden()` 사용 가능하게 만들고 `/admin/inquiry`가 500이 아닌 403을 돌려주도록 정상화

이미 코드는 `next/navigation`의 `forbidden()`을 호출하지만 Next.js 16에서는 `experimental.authInterrupts` 플래그 없이는 런타임 에러가 난다(`src/app/admin/inquiry/page.tsx:16`). 플래그를 켜서 운영·로컬 양쪽의 500 응답을 403 forbidden 페이지로 정상화한다.

**Files:**
- Modify: `next.config.ts:6-7` (config 객체 첫 필드로 `experimental` 추가)

- [ ] **Step 1: 현재 동작 확인 (failing case 재현)**

dev 서버가 띄워져 있는지 확인하고 없으면 띄운다.

```bash
lsof -ti :3000 || (pnpm dev > /tmp/next-dev.log 2>&1 &) ; sleep 5
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin/inquiry
```

Expected: `500`. 그리고 `tail -30 /tmp/next-dev.log`에 다음 메시지가 보여야 한다.

```
Error: `forbidden()` is experimental and only allowed to be enabled when `experimental.authInterrupts` is enabled.
```

- [ ] **Step 2: `next.config.ts` 수정**

`const config: NextConfig = {` 바로 다음 줄에 `experimental` 필드를 추가한다.

기존:

```ts
const config: NextConfig = {
  trailingSlash: false,
  images: {
```

변경 후:

```ts
const config: NextConfig = {
  experimental: { authInterrupts: true },
  trailingSlash: false,
  images: {
```

- [ ] **Step 3: dev 서버 재시작**

`next.config.ts` 수정은 HMR로 자동 반영되지 않으므로 dev 서버를 다시 띄운다.

```bash
lsof -ti :3000 | xargs -r kill ; sleep 2
pnpm dev > /tmp/next-dev.log 2>&1 &
until curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -qE '^(200|3..)$'; do sleep 1; done
echo "ready"
```

Expected: `ready` 출력.

- [ ] **Step 4: 403 응답 확인 (현재 시점엔 관리자 우회가 없으므로 인증 실패 → 403이 정답)**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin/inquiry
```

Expected: `403`. 그리고 `tail -10 /tmp/next-dev.log`에 더 이상 `forbidden() is experimental` 에러가 보이지 않아야 한다.

- [ ] **Step 5: 빌드 회귀 방지를 위해 타입체크 한 번**

```bash
pnpm exec tsc --noEmit
```

Expected: 에러 없음 (`Exit 0`).

- [ ] **Step 6: 커밋**

```bash
git add next.config.ts
git commit -m "$(cat <<'EOF'
fix(admin): enable experimental.authInterrupts for forbidden()

/admin/inquiry was returning 500 because src/app/admin/inquiry/page.tsx
calls forbidden() from next/navigation, which Next.js 16 only allows
under the authInterrupts flag. Enable the flag so non-admin access
returns 403 instead of crashing.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `isAdminRequest()` 우회 분기 단위 테스트 (TDD failing test)

`isAdminRequest()`가 `NODE_ENV === 'development'`이고 `env.DEV_ADMIN_BYPASS === '1'`일 때만 `true`를 돌려주고, 둘 중 하나라도 충족 안 되면 기존 JWT 검증 경로로 떨어져 `false`를 돌려주는지 단위 테스트로 잠근다.

**Files:**
- Create: `src/lib/inquiries/__tests__/admin.test.ts`

- [ ] **Step 1: 테스트 파일 작성**

```ts
// src/lib/inquiries/__tests__/admin.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('next/headers', () => ({
  headers: async () => new Map<string, string>() as unknown as Headers,
}));

const getEnvMock = vi.fn();
vi.mock('../cf', () => ({
  getEnv: () => getEnvMock(),
}));

describe('isAdminRequest dev bypass', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.resetModules();
    getEnvMock.mockReset();
  });

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalNodeEnv,
      configurable: true,
    });
  });

  function setNodeEnv(value: string) {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value,
      configurable: true,
    });
  }

  it('returns true when NODE_ENV=development AND DEV_ADMIN_BYPASS=1', async () => {
    setNodeEnv('development');
    getEnvMock.mockReturnValue({
      ACCESS_TEAM_DOMAIN: '',
      ACCESS_AUD: '',
      DEV_ADMIN_BYPASS: '1',
    });
    const { isAdminRequest } = await import('../admin');
    expect(await isAdminRequest()).toBe(true);
  });

  it('returns false when NODE_ENV=development but DEV_ADMIN_BYPASS is missing', async () => {
    setNodeEnv('development');
    getEnvMock.mockReturnValue({
      ACCESS_TEAM_DOMAIN: '',
      ACCESS_AUD: '',
    });
    const { isAdminRequest } = await import('../admin');
    expect(await isAdminRequest()).toBe(false);
  });

  it('returns false when DEV_ADMIN_BYPASS=1 but NODE_ENV=production', async () => {
    setNodeEnv('production');
    getEnvMock.mockReturnValue({
      ACCESS_TEAM_DOMAIN: '',
      ACCESS_AUD: '',
      DEV_ADMIN_BYPASS: '1',
    });
    const { isAdminRequest } = await import('../admin');
    expect(await isAdminRequest()).toBe(false);
  });

  it('returns false when DEV_ADMIN_BYPASS is the wrong value (e.g. "0")', async () => {
    setNodeEnv('development');
    getEnvMock.mockReturnValue({
      ACCESS_TEAM_DOMAIN: '',
      ACCESS_AUD: '',
      DEV_ADMIN_BYPASS: '0',
    });
    const { isAdminRequest } = await import('../admin');
    expect(await isAdminRequest()).toBe(false);
  });
});
```

- [ ] **Step 2: 테스트 실행해서 실패 확인**

```bash
pnpm test -- src/lib/inquiries/__tests__/admin.test.ts
```

Expected: 첫 번째 케이스(`returns true when NODE_ENV=development AND DEV_ADMIN_BYPASS=1`)가 **FAIL**해야 한다. 현재 `admin.ts`엔 우회 분기가 없으므로 `ACCESS_TEAM_DOMAIN`이 빈 문자열이라 함수가 `false`를 돌려준다. 나머지 3개는 PASS(이미 false라).

만약 첫 케이스도 PASS로 나오면 mock이 잘못 걸렸다는 신호 — 멈추고 디버깅한다.

---

### Task 3: `isAdminRequest()`에 우회 분기 구현

**Files:**
- Modify: `src/lib/inquiries/admin.ts:43-46` (`isAdminRequest`의 `try` 블록 첫머리)

- [ ] **Step 1: 함수 첫 줄에 우회 분기 추가**

기존 (`src/lib/inquiries/admin.ts:43-46`):

```ts
export async function isAdminRequest(): Promise<boolean> {
  try {
    const env = getEnv();
    if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return false;
```

변경 후:

```ts
export async function isAdminRequest(): Promise<boolean> {
  try {
    const env = getEnv();
    if (
      process.env.NODE_ENV === 'development' &&
      (env as { DEV_ADMIN_BYPASS?: string }).DEV_ADMIN_BYPASS === '1'
    ) {
      return true;
    }
    if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return false;
```

다른 줄은 건드리지 않는다.

- [ ] **Step 2: 테스트 재실행해서 4개 모두 PASS 확인**

```bash
pnpm test -- src/lib/inquiries/__tests__/admin.test.ts
```

Expected: 4개 케이스 전부 PASS.

- [ ] **Step 3: 전체 테스트 회귀 확인**

```bash
pnpm test
```

Expected: 기존 테스트(crypto, password, rate-limit, repository-quick-quote, schema, session) 전부 PASS, 새 admin 테스트 4개 PASS. 실패 0건.

- [ ] **Step 4: 타입체크**

```bash
pnpm exec tsc --noEmit
```

Expected: 에러 없음 (`Exit 0`).

- [ ] **Step 5: 커밋**

```bash
git add src/lib/inquiries/admin.ts src/lib/inquiries/__tests__/admin.test.ts
git commit -m "$(cat <<'EOF'
feat(admin): dev-only bypass for isAdminRequest

Add a double-gated branch at the top of isAdminRequest(): when
NODE_ENV=development AND env.DEV_ADMIN_BYPASS=1, return true without
touching the Cloudflare Access JWT path. This unblocks /admin/inquiry
under next dev where no Access proxy sits in front. Production builds
inline NODE_ENV=production and .dev.vars never reaches the deploy
bundle, so the branch is dead in prod.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: `.dev.vars`에 우회 플래그 켜고 dev 서버에서 `/admin/inquiry` 200 확인

**Files:**
- Modify: `.dev.vars` (gitignored — 커밋 안 됨)

- [ ] **Step 1: `.dev.vars`가 gitignored인지 한 번 더 확인**

```bash
git check-ignore -v .dev.vars
```

Expected: `.gitignore:N:.dev.vars\t.dev.vars` 형태로 ignored 출력. 만약 출력이 비어 있으면 멈춘다 — 실수로 커밋될 수 있다.

- [ ] **Step 2: 플래그 추가**

```bash
printf '\nDEV_ADMIN_BYPASS=1\n' >> .dev.vars
tail -3 .dev.vars
```

Expected: 마지막 줄에 `DEV_ADMIN_BYPASS=1`.

- [ ] **Step 3: dev 서버 재시작 (`.dev.vars`는 시작 시점에만 읽힘)**

```bash
lsof -ti :3000 | xargs -r kill ; sleep 2
pnpm dev > /tmp/next-dev.log 2>&1 &
until curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -qE '^(200|3..)$'; do sleep 1; done
echo "ready"
```

Expected: `ready` 출력. `head -10 /tmp/next-dev.log`에 `Using secrets defined in .dev.vars` 문구 확인.

- [ ] **Step 4: 관리자 페이지 200 응답 확인**

```bash
curl -s -o /tmp/admin-list.html -w "%{http_code}\n" http://localhost:3000/admin/inquiry
```

Expected: `200`. (이전 Task 1 끝에선 403이었음.)

```bash
grep -oE '\[관리자\] 예약 문의|예약 문의' /tmp/admin-list.html | head -1
```

Expected: `[관리자] 예약 문의`.

---

### Task 5: 시드 데이터로 답글 등록 → 공개 페이지 노출까지 end-to-end 검증

**Files:**
- (코드 변경 없음 — 검증만)

- [ ] **Step 1: D1에 부모 문의 1건 직접 삽입 (Turnstile 우회용 시드)**

```bash
pnpm wrangler d1 execute hanlasan-bbq --local --command "INSERT INTO inquiries (parent_id, is_admin, author_name, password_hash, password_salt, phone_enc, email_enc, title, content, is_secret, expires_at) VALUES (NULL, 0, '테스트', 'x', 'x', 'x', 'x', '시드 문의', '본문 내용입니다', 0, '2027-05-27 00:00:00')"
```

Expected: `🚣 1 command executed successfully.` 그리고 결과에 `meta.last_row_id`로 새 id가 나옴 (예: 1).

```bash
pnpm wrangler d1 execute hanlasan-bbq --local --command "SELECT id, title, author_name, parent_id, is_admin FROM inquiries ORDER BY id DESC LIMIT 5"
```

Expected: 방금 넣은 `시드 문의` 행이 보임. **id 값을 메모해둔다 (이하 `<ID>`로 표기).**

- [ ] **Step 2: 공개 목록에서 시드 문의 보이는지 확인**

```bash
curl -s http://localhost:3000/inquiry | grep -oE '시드 문의' | head -1
```

Expected: `시드 문의` 한 줄 출력.

- [ ] **Step 3: 관리자 상세 진입 확인**

```bash
curl -s -o /tmp/admin-detail.html -w "%{http_code}\n" "http://localhost:3000/admin/inquiry/<ID>"
```

`<ID>`를 Step 1에서 메모한 값으로 치환한다.

Expected: `200`. 

```bash
grep -oE '답변 내용을 입력하세요|답글 등록' /tmp/admin-detail.html | sort -u
```

Expected: `답글 등록`과 `답변 내용을 입력하세요` 둘 다 매칭 (ReplyForm 렌더 확인).

- [ ] **Step 4: 답글 등록 (UI 흐름 시뮬레이션은 어려우므로 직접 D1 insert + 같은 SQL 효과 확인)**

답글 등록은 server action으로 form 제출이 필요하므로 가장 확실한 방법은 **브라우저에서 직접** `http://localhost:3000/admin/inquiry/<ID>`를 열어 textarea에 "테스트 답글"이라 적고 "답글 등록"을 클릭하는 것이다.

```bash
echo "브라우저에서 http://localhost:3000/admin/inquiry/<ID> 열어 답글 등록 후 다음 단계로"
```

확인 포인트:
- 폼 아래 `답글이 등록되었습니다.` 그린 메시지가 보여야 한다.
- 같은 페이지의 "기존 답변" 섹션에 방금 작성한 답글이 추가되어 있어야 한다.

- [ ] **Step 5: 공개 상세에서 답글 노출 확인**

```bash
curl -s -o /tmp/public-detail.html "http://localhost:3000/inquiry/<ID>"
grep -oE '답변|테스트 답글' /tmp/public-detail.html | sort -u
```

Expected: `답변`과 `테스트 답글` 둘 다 매칭.

- [ ] **Step 6: 공개 목록 카운트 회귀 확인 (답글은 부모 카운트에 영향 없음)**

```bash
curl -s http://localhost:3000/inquiry | grep -oE '시드 문의' | wc -l
```

Expected: 1 (목록에 한 번만 등장 — 답글은 부모로 안 잡힘).

- [ ] **Step 7: 우회 끄기 회귀 확인**

```bash
sed -i.bak '/^DEV_ADMIN_BYPASS=1$/d' .dev.vars && rm -f .dev.vars.bak
lsof -ti :3000 | xargs -r kill ; sleep 2
pnpm dev > /tmp/next-dev.log 2>&1 &
until curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -qE '^(200|3..)$'; do sleep 1; done
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin/inquiry
```

Expected: `403`. 우회 플래그가 정확히 켜졌을 때만 작동함을 확인.

마지막으로 본인이 계속 테스트할 거면 플래그를 다시 켜둔다.

```bash
printf '\nDEV_ADMIN_BYPASS=1\n' >> .dev.vars
lsof -ti :3000 | xargs -r kill ; sleep 2
pnpm dev > /tmp/next-dev.log 2>&1 &
```

- [ ] **Step 8: 시드 데이터 정리 (선택)**

테스트가 끝나면 시드 문의와 답글을 지운다.

```bash
pnpm wrangler d1 execute hanlasan-bbq --local --command "DELETE FROM inquiries WHERE title IN ('시드 문의', '↳ Re: 시드 문의')"
```

Expected: 2 rows 영향.

- [ ] **Step 9: 최종 빌드 무결성 확인**

운영 빌드에 우회 코드가 dead-code-stripping으로 사라지는지 spot check.

```bash
pnpm exec tsc --noEmit
```

Expected: 에러 없음.

(원하면 추가로 `pnpm preview` 후 `grep -r DEV_ADMIN_BYPASS .open-next` 실행 — 매칭 없거나 단순 문자열 외 사용처가 없어야 함. 시간 들기 때문에 선택사항.)

이 시점에 관리자 답글 기능이 로컬에서 end-to-end로 검증된 상태가 된다. 운영 코드/배포 동작은 변경 없음.
