# 관리자 답글 — 로컬 테스트 가능화 (설계)

작성일: 2026-05-27
대상: 한라산출장바베큐 사이트 (`/Users/devbean/Desktop/한라산출장바베큐`)

---

## 1. 배경

관리자 답글 기능 자체는 이미 코드로 완성되어 있다.

- `src/lib/inquiries/repository.ts` — `createReply()`, `findRepliesOf()`
- `src/app/admin/inquiry/page.tsx` — 관리자 문의 목록
- `src/app/admin/inquiry/[id]/page.tsx` — 관리자 상세 + `ReplyForm`
- `src/app/admin/inquiry/[id]/ReplyForm.tsx` — 답글 입력 폼
- `src/app/admin/inquiry/[id]/actions.ts` — `replyAction` (서버 액션, `revalidatePath` 포함)
- `src/app/inquiry/[id]/page.tsx:77-87` — 공개 상세에 답글 자동 노출

그러나 `next dev` 환경에서는 두 가지 이유로 위 기능을 직접 검증할 수 없다.

1. `/admin/inquiry`가 **500 에러**로 응답한다. 코드가 `next/navigation`의 `forbidden()`을 사용하는데, Next.js 16에서 이 API는 `experimental.authInterrupts` 플래그가 켜졌을 때만 허용된다. 현재 `next.config.ts`에는 해당 플래그가 없다. 운영에서도 비관리자 진입 시 동일하게 500이 난다.
2. 관리자 인증(`isAdminRequest()`)이 Cloudflare Access가 발급한 `cf-access-jwt-assertion` 헤더 + JWKS 검증을 요구한다. 운영 도메인은 CF Access가 앞단에서 토큰을 붙여주지만, 로컬 `next dev` 앞에는 Access가 없으므로 토큰 자체가 존재하지 않는다.

## 2. 목적

`next dev` (localhost:3000)에서 다음 경로를 끝까지 수동 검증할 수 있게 한다.

1. 손님이 `/inquiry/new`로 문의 작성
2. 관리자가 `/admin/inquiry`에서 목록 확인, `/admin/inquiry/<id>`에서 상세 진입, 답글 등록
3. 손님이 `/inquiry/<id>`에서 답글 확인

운영 동작은 **변경하지 않는다.**

## 3. 비목표 (Out of scope)

- Turnstile dev 우회: 신규 문의 작성 시 `[Cloudflare Turnstile] Error: 110200`가 콘솔에 보이는 건 별도 이슈로 두고 이번 spec에선 다루지 않는다. 본 spec의 검증은 D1에 직접 시드해서도 가능하므로 차단 요소가 아니다.
- 답글 자체의 수정/삭제 UI: 현재 관리자 페이지의 "이 글 삭제"는 부모 글 전체 삭제이며, 답글 단건 수정/삭제 UI는 추후 spec.
- 공개 상세 `/inquiry/[id]`에 관리자 인라인 답글 폼을 박는 것: 이번엔 `/admin/inquiry/[id]` 경유 방식만 검증한다.
- 신규 컴포넌트, 신규 DB 마이그레이션 없음.

## 4. 설계

### 4.1 `forbidden()` 활성화

`next.config.ts`에 `experimental.authInterrupts: true`를 추가한다.

```ts
const config: NextConfig = {
  experimental: { authInterrupts: true },
  trailingSlash: false,
  // ...기존 그대로
};
```

이 변경의 효과는 두 가지다.
- 로컬에서 `/admin/inquiry`가 500 대신 정상 200/403 응답을 돌려준다.
- 운영에서도 동일하게 정상화된다 (비관리자가 어쩌다 직접 호출하더라도 500이 아닌 403 forbidden 페이지를 받음).

### 4.2 로컬 한정 관리자 우회 게이트

`src/lib/inquiries/admin.ts`의 `isAdminRequest()` 본문 맨 앞에 짧은 우회 분기를 추가한다.

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
    // 기존 JWT 검증 로직 그대로 (env.ACCESS_TEAM_DOMAIN, env.ACCESS_AUD ...)
    ...
  } catch (err) {
    ...
  }
}
```

**왜 이 게이트가 운영을 위험에 빠뜨리지 않는가**

- `process.env.NODE_ENV === 'development'`는 `next dev`에서만 참이다. `next build` 산출물(=배포 빌드)에서는 `'production'`으로 인라인되므로 가지가 **죽은 코드로 제거**된다.
- `env.DEV_ADMIN_BYPASS`는 `.dev.vars`에서만 주입된다. `.dev.vars`는 `wrangler` 배포 산출물에 포함되지 않으며, 운영 시크릿은 Cloudflare 대시보드 또는 `wrangler secret put`로만 들어간다. 따라서 운영에서 `env.DEV_ADMIN_BYPASS`는 `undefined`.
- 두 조건 중 하나만 깨져도 우회되지 않는다(이중 게이트).

### 4.3 `.dev.vars`에 플래그 추가

```
DEV_ADMIN_BYPASS=1
```

`.dev.vars`는 이미 `.gitignore`에 포함되어 있어 커밋되지 않는다(확인: `.gitignore`에 `.dev.vars` 라인 존재).

### 4.4 변경 파일 요약

| 파일 | 변경 | 라인 수(예상) |
|---|---|---|
| `next.config.ts` | `experimental: { authInterrupts: true }` 한 줄 | +1 |
| `src/lib/inquiries/admin.ts` | `isAdminRequest()` 첫 분기 추가 | +5 |
| `.dev.vars` | `DEV_ADMIN_BYPASS=1` 한 줄 (gitignored) | +1 (커밋 안 됨) |

새 파일/새 컴포넌트/새 마이그레이션 없음. 답글 비즈니스 로직은 손대지 않는다.

## 5. 검증 계획 (수동)

`next dev` 재시작 후 (`.dev.vars` 재로딩) 다음 순서로 확인한다.

1. **공개 목록 정상**: `GET /inquiry` → 200, "아직 등록된 문의가 없습니다" 또는 기존 글 목록.
2. **관리자 목록 진입**: `GET /admin/inquiry` → **200** (이전엔 500). 헤더에 빈 목록 또는 글이 보임.
3. **관리자 상세 + 답글 등록**:
   - 시드 데이터가 없으면 다음 SQL로 부모 글 1건을 D1에 직접 삽입한다 (Turnstile 우회):
     ```sql
     INSERT INTO inquiries
       (parent_id, is_admin, author_name, password_hash, password_salt,
        phone_enc, email_enc, title, content, is_secret, expires_at)
     VALUES
       (NULL, 0, '테스트', 'x', 'x', 'x', 'x', '시드 문의', '본문', 0,
        '2027-05-27 00:00:00');
     ```
     실행: `pnpm wrangler d1 execute hanlasan-bbq --local --command "<위 SQL>"`
   - `/admin/inquiry`에서 해당 글 클릭 → `/admin/inquiry/<id>` 진입 → 답글 폼에 내용 입력 → "답글 등록" → "답글이 등록되었습니다" 그린 메시지.
4. **공개 상세에 답글 노출**: `GET /inquiry/<id>` 새로고침 → 본문 아래 "답변" 섹션에 방금 작성한 답글 표시.
5. **회귀 1 — 우회 끄기**: `.dev.vars`에서 `DEV_ADMIN_BYPASS=1`을 주석/삭제 후 `next dev` 재시작 → `/admin/inquiry`는 다시 forbidden(403). 우회는 정확히 플래그가 켜졌을 때만 작동함을 확인.
6. **회귀 2 — 공개 목록 카운트**: 답글은 부모가 아니므로 `/inquiry` 목록의 총 카운트가 늘어나지 않아야 한다. 페이지네이션의 글 번호도 그대로.

## 6. 보안 고려

- `experimental.authInterrupts`는 Next.js 자체 기능 플래그이며 보안 결정과 무관하다. 켜는 효과는 `forbidden()`/`unauthorized()` API의 사용 허용뿐.
- 운영 빌드에서 우회 분기가 dead code로 제거되는지 확인하는 가장 확실한 방법은 `pnpm preview` 또는 `pnpm deploy` 출력에서 `DEV_ADMIN_BYPASS` 문자열이 번들에 남는지 검증하는 것이다. (이번 spec에선 수동 spot check 권장: `pnpm preview` 후 `grep -r DEV_ADMIN_BYPASS .open-next` 실행. 매칭 없어야 정상.)
- `.dev.vars`의 새 줄(`DEV_ADMIN_BYPASS=1`)이 실수로 커밋되지 않도록 `.gitignore` 상태를 변경 직후 한 번 더 확인한다.

## 7. 롤백 계획

- 우회만 끄기: `.dev.vars`에서 한 줄 제거 후 `next dev` 재시작.
- `forbidden()` 플래그도 되돌리기: `next.config.ts`에서 `experimental.authInterrupts` 제거 후 커밋 revert. 단 이 경우 `/admin/inquiry`가 다시 500을 낼 수 있으므로 권장하지 않는다.
- `admin.ts` 분기 제거: 단일 커밋 revert로 충분.

## 8. 영향받는 운영 동작

- `/admin/inquiry`에 비관리자(=CF Access 토큰 없음)가 직접 접근할 때의 응답이 **500 → 403**으로 바뀐다. 이는 의도된 정상화이며 사용자 경험 개선이다.
- 그 외 모든 운영 경로는 변동 없음.
