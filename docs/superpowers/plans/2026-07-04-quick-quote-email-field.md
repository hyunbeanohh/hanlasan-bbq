# 빠른 견적 이메일 선택 입력 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 메인 페이지 빠른 견적 폼의 연락처 아래에 선택 입력 이메일 필드를 추가하고, 입력값을 암호화 저장 + 문의 내용에 포함한다.

**Architecture:** zod 스키마에 빈 문자열 허용 이메일 필드를 추가하고, 서버 액션이 기존 `emailEnc` 자리(현재 빈 문자열 암호화)에 실제 입력값을 넣는다. 문의 내용(content)은 이메일이 있을 때만 한 줄 추가되어 하위 호환된다. DB 스키마 변경 없음.

**Tech Stack:** Next.js 16 (App Router, server actions), zod v4, vitest, Tailwind.

## Global Constraints

- 이메일은 **선택 입력**: 빈 문자열(`''`)은 항상 통과해야 한다.
- 값이 있으면 이메일 형식 검증 + 최대 120자 (기존 `src/lib/inquiries/schema.ts:9`와 동일 기준).
- 에러 메시지: `올바른 이메일 주소를 입력해주세요` (기존 문의 폼과 동일 문구).
- content 출력: 이메일이 비어 있으면 기존과 **완전히 동일한 4줄** 출력이어야 한다(하위 호환).
- 테스트 러너: `npx vitest run <파일>` (package.json의 `test` 스크립트는 `vitest run --passWithNoTests`).

---

### Task 1: 스키마에 email 필드 추가

**Files:**
- Modify: `src/lib/quick-quote/schema.ts`
- Test: `src/lib/quick-quote/__tests__/schema.test.ts`

**Interfaces:**
- Produces: `quickQuoteSchema`의 파싱 결과 `data.email: string` — 키가 없거나 빈 값이면 `''`, 값이 있으면 검증된 이메일. Task 3의 서버 액션이 `input.email`로 소비한다.

- [ ] **Step 1: 실패하는 테스트 작성**

`src/lib/quick-quote/__tests__/schema.test.ts`의 `describe('quickQuoteSchema', ...)` 블록 끝(`requires turnstileToken` 테스트 뒤)에 추가:

```ts
  it('accepts a valid email', () => {
    const r = quickQuoteSchema.safeParse({ ...valid, email: 'guest@naver.com' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe('guest@naver.com');
  });

  it('accepts empty email (optional field)', () => {
    const r = quickQuoteSchema.safeParse({ ...valid, email: '' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe('');
  });

  it('defaults email to empty string when key is missing', () => {
    const r = quickQuoteSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe('');
  });

  it('rejects malformed email', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects email over 120 chars', () => {
    const long = 'a'.repeat(115) + '@b.com';
    expect(quickQuoteSchema.safeParse({ ...valid, email: long }).success).toBe(false);
  });
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npx vitest run src/lib/quick-quote/__tests__/schema.test.ts`
Expected: FAIL — `accepts a valid email`, `defaults email to empty string...` 등에서 `r.data.email`이 `undefined` (스키마에 email 필드 없음)

- [ ] **Step 3: 최소 구현**

`src/lib/quick-quote/schema.ts`에서 `phone` 라인 아래에 추가:

```ts
  phone: z.string().regex(phoneRegex, '연락처 형식: 010-0000-0000'),
  email: z
    .literal('')
    .or(z.string().email('올바른 이메일 주소를 입력해주세요').max(120))
    .default(''),
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/lib/quick-quote/__tests__/schema.test.ts`
Expected: PASS (기존 10개 + 신규 5개 모두)

- [ ] **Step 5: Commit**

```bash
git add src/lib/quick-quote/schema.ts src/lib/quick-quote/__tests__/schema.test.ts
git commit -m "feat(quick-quote): 스키마에 선택 입력 이메일 필드 추가"
```

---

### Task 2: content 포맷에 이메일 줄 추가

**Files:**
- Modify: `src/lib/quick-quote/format.ts`
- Test: `src/lib/quick-quote/__tests__/format.test.ts`

**Interfaces:**
- Produces: `QuickQuoteContentInput`에 `email?: string` 추가. `buildQuickQuoteContent`는 `email`이 truthy일 때만 마지막에 `이메일: <값>` 줄을 붙인다. Task 3의 서버 액션이 호출한다.

- [ ] **Step 1: 실패하는 테스트 작성**

`src/lib/quick-quote/__tests__/format.test.ts`의 `describe('buildQuickQuoteContent', ...)` 블록에 추가:

```ts
  it('appends email line when email is provided', () => {
    const out = buildQuickQuoteContent({
      headcount: 10,
      eventDate: '2030-06-01',
      location: '애월읍 곽지리',
      phone: '010-1234-5678',
      email: 'guest@naver.com',
    });
    expect(out).toBe(
      '인원: 10명\n희망 날짜: 2030-06-01\n출장 장소: 애월읍 곽지리\n연락처: 010-1234-5678\n이메일: guest@naver.com',
    );
  });

  it('omits email line when email is empty', () => {
    const out = buildQuickQuoteContent({
      headcount: 10,
      eventDate: '2030-06-01',
      location: '애월읍 곽지리',
      phone: '010-1234-5678',
      email: '',
    });
    expect(out).toBe(
      '인원: 10명\n희망 날짜: 2030-06-01\n출장 장소: 애월읍 곽지리\n연락처: 010-1234-5678',
    );
  });
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `npx vitest run src/lib/quick-quote/__tests__/format.test.ts`
Expected: FAIL — `appends email line...`에서 출력에 `이메일:` 줄 없음 (기존 `omits...` 케이스와 기존 테스트는 통과)

- [ ] **Step 3: 최소 구현**

`src/lib/quick-quote/format.ts` 수정:

```ts
export interface QuickQuoteContentInput extends QuickQuoteTitleInput {
  phone: string;
  email?: string;
}
```

```ts
export function buildQuickQuoteContent(input: QuickQuoteContentInput): string {
  const lines = [
    `인원: ${input.headcount}명`,
    `희망 날짜: ${input.eventDate}`,
    `출장 장소: ${input.location.trim()}`,
    `연락처: ${input.phone}`,
  ];
  if (input.email) lines.push(`이메일: ${input.email}`);
  return lines.join('\n');
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/lib/quick-quote/__tests__/format.test.ts`
Expected: PASS (기존 3개 + 신규 2개)

- [ ] **Step 5: Commit**

```bash
git add src/lib/quick-quote/format.ts src/lib/quick-quote/__tests__/format.test.ts
git commit -m "feat(quick-quote): 문의 내용에 이메일 줄 조건부 추가"
```

---

### Task 3: 서버 액션 연결 + 폼 UI 필드 추가

**Files:**
- Modify: `src/components/home/reservation/quick-quote-action.ts:53,60-65`
- Modify: `src/components/home/reservation/QuickQuoteForm.tsx` (연락처 Field 아래)

**Interfaces:**
- Consumes: Task 1의 `input.email: string`, Task 2의 `buildQuickQuoteContent({ ..., email })`.
- Produces: 사용자에게 보이는 폼 필드. 저장 구조 변경 없음.

- [ ] **Step 1: 서버 액션 수정**

`src/components/home/reservation/quick-quote-action.ts`에서:

```ts
  const phoneEnc = await encryptPII(input.phone, env.PII_KEY);
  const emailEnc = await encryptPII(input.email, env.PII_KEY);
```

(기존 `await encryptPII('', env.PII_KEY)`를 교체)

```ts
  const content = buildQuickQuoteContent({
    headcount: input.headcount,
    eventDate: input.eventDate,
    location: input.location,
    phone: input.phone,
    email: input.email,
  });
```

- [ ] **Step 2: 폼 UI 필드 추가**

`src/components/home/reservation/QuickQuoteForm.tsx`에서 연락처 `<Field ... name="phone" ... />` 바로 아래에 추가 (`required` 없음):

```tsx
      <Field
        label="이메일 (선택)"
        name="email"
        type="email"
        placeholder="example@naver.com"
        error={state.fieldErrors?.email}
      />
```

- [ ] **Step 3: 전체 테스트 + 린트 + 빌드 확인**

Run: `npm test && npx tsc --noEmit && npm run lint`
Expected: 테스트 전부 PASS, 타입 에러 0, 린트 에러 0

(프로젝트에 `lint` 스크립트가 없으면 `npm test && npx tsc --noEmit`만 수행)

- [ ] **Step 4: Commit**

```bash
git add src/components/home/reservation/quick-quote-action.ts src/components/home/reservation/QuickQuoteForm.tsx
git commit -m "feat(quick-quote): 빠른 견적 폼에 이메일 선택 입력 추가"
```
