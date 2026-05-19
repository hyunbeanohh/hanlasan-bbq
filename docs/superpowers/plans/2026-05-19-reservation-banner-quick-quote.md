# 예약 섹션 개편 + 1분 견적 폼 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈페이지 `ReservationBanner` 섹션을 신뢰 chip + 1분 견적 폼 + 3채널 카드 구조로 재구성하고, 폼 제출은 기존 `inquiries` 인프라(D1·Resend·Turnstile·rate limit)를 재사용하는 새 server action으로 처리한다.

**Architecture:** 폼 입력은 zod로 validate → 기존 RateLimiter/verifyTurnstile/encryptPII 재사용 → `InquiryRepository`에 새 `createQuickQuote` 메서드 추가하여 `password_hash=NULL`, `author_name='[빠른 견적]'`, `is_secret=1`로 저장 → 기존 `sendNewInquiryNotification`으로 알림. 게시판 목록은 새 `listPublicPaginated`로 빠른 견적 항목을 필터.

**Tech Stack:** Next.js 16 (App Router, Server Actions), React 19, zod, Cloudflare D1, Resend, Turnstile, vitest, Tailwind 4.

**Spec:** `docs/superpowers/specs/2026-05-19-reservation-banner-quick-quote-design.md`

---

## File Structure

**Create:**
- `src/lib/quick-quote/schema.ts` — zod schema + type for quick-quote input
- `src/lib/quick-quote/format.ts` — pure helpers: build title and content text from form input
- `src/lib/quick-quote/__tests__/schema.test.ts`
- `src/lib/quick-quote/__tests__/format.test.ts`
- `src/components/home/reservation/QuickQuoteForm.tsx` — client form (`'use client'`)
- `src/components/home/reservation/quick-quote-action.ts` — `'use server'` action wiring
- `src/components/home/reservation/TrustChips.tsx` — server, presentational
- `src/components/home/reservation/ContactChannels.tsx` — server, 3 channel cards
- `src/lib/inquiries/__tests__/repository-quick-quote.test.ts`

**Modify:**
- `src/lib/inquiries/repository.ts` — add `createQuickQuote()` and `listPublicPaginated()`
- `src/app/inquiry/page.tsx` — use `listPublicPaginated` instead of `listPaginated`
- `src/components/home/ReservationBanner.tsx` — rewrite to compose new pieces

---

## Task 1: Quick-Quote zod schema

**Files:**
- Create: `src/lib/quick-quote/schema.ts`
- Create: `src/lib/quick-quote/__tests__/schema.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/quick-quote/__tests__/schema.test.ts
import { describe, it, expect } from 'vitest';
import { quickQuoteSchema } from '../schema';

describe('quickQuoteSchema', () => {
  const valid = {
    headcount: '10',
    eventDate: '2030-06-01',
    location: '애월읍 곽지리',
    phone: '010-1234-5678',
    privacyConsent: 'on',
    turnstileToken: 'token-xyz',
  };

  it('accepts valid input and coerces headcount to number', () => {
    const r = quickQuoteSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.headcount).toBe(10);
  });

  it('rejects headcount below 1', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, headcount: '0' }).success).toBe(false);
  });

  it('rejects headcount above 200', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, headcount: '201' }).success).toBe(false);
  });

  it('rejects malformed date', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, eventDate: '2030/06/01' }).success).toBe(false);
  });

  it('rejects past dates', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, eventDate: '2000-01-01' }).success).toBe(false);
  });

  it('rejects short location', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, location: 'a' }).success).toBe(false);
  });

  it('rejects invalid phone format', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, phone: '01012345678' }).success).toBe(false);
  });

  it('requires privacyConsent', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, privacyConsent: undefined }).success).toBe(false);
  });

  it('requires turnstileToken', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, turnstileToken: '' }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/lib/quick-quote/__tests__/schema.test.ts`
Expected: FAIL — `Cannot find module '../schema'`

- [ ] **Step 3: Implement the schema**

```typescript
// src/lib/quick-quote/schema.ts
import { z } from 'zod';

const phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const quickQuoteSchema = z.object({
  headcount: z.coerce.number().int().min(1, '인원은 1명 이상').max(200, '인원은 200명 이하'),
  eventDate: z
    .string()
    .regex(dateRegex, '날짜 형식: YYYY-MM-DD')
    .refine(
      (s) => {
        const d = new Date(s + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d.getTime() >= today.getTime();
      },
      { message: '지난 날짜는 선택할 수 없습니다' },
    ),
  location: z.string().trim().min(2, '장소를 2자 이상 입력해주세요').max(80),
  phone: z.string().regex(phoneRegex, '연락처 형식: 010-0000-0000'),
  privacyConsent: z.literal('on', { error: '개인정보 동의가 필요합니다' }),
  turnstileToken: z.string().min(1, '자동가입방지 검증이 필요합니다'),
});

export type QuickQuoteInput = z.infer<typeof quickQuoteSchema>;
```

- [ ] **Step 4: Run test to verify pass**

Run: `npm test -- src/lib/quick-quote/__tests__/schema.test.ts`
Expected: PASS — all 9 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/quick-quote/schema.ts src/lib/quick-quote/__tests__/schema.test.ts
git commit -m "feat(quick-quote): add zod schema for 1-minute quote input"
```

---

## Task 2: Quick-Quote formatting helpers

Pure functions to build the `title` and `content` strings that will be stored in the `inquiries` row. Keeping them pure makes them easy to test.

**Files:**
- Create: `src/lib/quick-quote/format.ts`
- Create: `src/lib/quick-quote/__tests__/format.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/quick-quote/__tests__/format.test.ts
import { describe, it, expect } from 'vitest';
import { buildQuickQuoteTitle, buildQuickQuoteContent } from '../format';

describe('buildQuickQuoteTitle', () => {
  it('formats title with headcount, MM/DD, and location', () => {
    expect(
      buildQuickQuoteTitle({ headcount: 10, eventDate: '2030-06-01', location: '애월읍 곽지리' }),
    ).toBe('[빠른 견적] 10명 · 6/1 · 애월읍 곽지리');
  });

  it('trims location and clamps long locations', () => {
    const longLoc = 'a'.repeat(120);
    const title = buildQuickQuoteTitle({ headcount: 3, eventDate: '2030-12-25', location: longLoc });
    expect(title.startsWith('[빠른 견적] 3명 · 12/25 · ')).toBe(true);
    expect(title.length).toBeLessThanOrEqual(200);
  });
});

describe('buildQuickQuoteContent', () => {
  it('produces a readable multi-line summary', () => {
    const out = buildQuickQuoteContent({
      headcount: 10,
      eventDate: '2030-06-01',
      location: '애월읍 곽지리',
      phone: '010-1234-5678',
    });
    expect(out).toBe(
      '인원: 10명\n희망 날짜: 2030-06-01\n출장 장소: 애월읍 곽지리\n연락처: 010-1234-5678',
    );
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/lib/quick-quote/__tests__/format.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement formatters**

```typescript
// src/lib/quick-quote/format.ts
export interface QuickQuoteTitleInput {
  headcount: number;
  eventDate: string; // YYYY-MM-DD
  location: string;
}

export interface QuickQuoteContentInput extends QuickQuoteTitleInput {
  phone: string;
}

const TITLE_MAX = 200;

export function buildQuickQuoteTitle(input: QuickQuoteTitleInput): string {
  const [, month, day] = input.eventDate.split('-');
  const md = `${Number(month)}/${Number(day)}`;
  const prefix = `[빠른 견적] ${input.headcount}명 · ${md} · `;
  const room = TITLE_MAX - prefix.length;
  const loc = input.location.trim().slice(0, Math.max(0, room));
  return prefix + loc;
}

export function buildQuickQuoteContent(input: QuickQuoteContentInput): string {
  return [
    `인원: ${input.headcount}명`,
    `희망 날짜: ${input.eventDate}`,
    `출장 장소: ${input.location.trim()}`,
    `연락처: ${input.phone}`,
  ].join('\n');
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `npm test -- src/lib/quick-quote/__tests__/format.test.ts`
Expected: PASS — all 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/quick-quote/format.ts src/lib/quick-quote/__tests__/format.test.ts
git commit -m "feat(quick-quote): add title and content formatters"
```

---

## Task 3: InquiryRepository.createQuickQuote()

Add a method that saves a quick-quote row. Differs from `create()` by allowing NULL password fields.

**Files:**
- Modify: `src/lib/inquiries/repository.ts`
- Create: `src/lib/inquiries/__tests__/repository-quick-quote.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/inquiries/__tests__/repository-quick-quote.test.ts
import { describe, it, expect } from 'vitest';
import { InquiryRepository } from '../repository';

interface FakeRow {
  author_name: string;
  password_hash: string | null;
  password_salt: string | null;
  phone_enc: string;
  email_enc: string;
  title: string;
  content: string;
  is_secret: number;
  parent_id: number | null;
  is_admin: number;
}

class FakeDB {
  rows: FakeRow[] = [];
  prepare(sql: string) {
    const rows = this.rows;
    return {
      bind(...args: unknown[]) {
        return {
          async run() {
            if (sql.includes('INSERT INTO inquiries')) {
              // For quickQuote insert: parent_id, is_admin, author_name, password_hash,
              // password_salt, phone_enc, email_enc, title, content, is_secret, expires_at
              rows.push({
                parent_id: args[0] as number | null,
                is_admin: args[1] as number,
                author_name: args[2] as string,
                password_hash: args[3] as string | null,
                password_salt: args[4] as string | null,
                phone_enc: args[5] as string,
                email_enc: args[6] as string,
                title: args[7] as string,
                content: args[8] as string,
                is_secret: args[9] as number,
              });
              return { meta: { last_row_id: rows.length } };
            }
            return { meta: {} };
          },
        };
      },
    };
  }
}

describe('InquiryRepository.createQuickQuote', () => {
  it('inserts a row with NULL password fields and is_secret=1', async () => {
    const db = new FakeDB();
    const repo = new InquiryRepository(db as unknown as D1Database);
    const id = await repo.createQuickQuote({
      phoneEnc: 'enc:010-…',
      emailEnc: 'enc:',
      title: '[빠른 견적] 10명 · 6/1 · 애월읍',
      content: '인원: 10명\n…',
    });
    expect(id).toBe(1);
    expect(db.rows).toHaveLength(1);
    const row = db.rows[0];
    expect(row.author_name).toBe('[빠른 견적]');
    expect(row.password_hash).toBeNull();
    expect(row.password_salt).toBeNull();
    expect(row.is_secret).toBe(1);
    expect(row.parent_id).toBeNull();
    expect(row.is_admin).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/lib/inquiries/__tests__/repository-quick-quote.test.ts`
Expected: FAIL — `repo.createQuickQuote is not a function`.

- [ ] **Step 3: Add the method to InquiryRepository**

Add to `src/lib/inquiries/repository.ts` after the existing `create()` method:

```typescript
export interface CreateQuickQuoteParams {
  phoneEnc: string;
  emailEnc: string;
  title: string;
  content: string;
}

// (inside class InquiryRepository)
async createQuickQuote(p: CreateQuickQuoteParams): Promise<number> {
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .replace('T', ' ')
    .slice(0, 19);
  const result = await this.db
    .prepare(
      `INSERT INTO inquiries
       (parent_id, is_admin, author_name, password_hash, password_salt,
        phone_enc, email_enc, title, content, is_secret, expires_at)
       VALUES (NULL, 0, ?, NULL, NULL, ?, ?, ?, ?, 1, ?)`,
    )
    .bind('[빠른 견적]', p.phoneEnc, p.emailEnc, p.title, p.content, expiresAt)
    .run();
  return result.meta.last_row_id as number;
}
```

Also export the new interface at the top of the file (next to `CreateInquiryParams`).

- [ ] **Step 4: Run test to verify pass**

Run: `npm test -- src/lib/inquiries/__tests__/repository-quick-quote.test.ts`
Expected: PASS.

- [ ] **Step 5: Run full inquiry test suite to confirm no regression**

Run: `npm test -- src/lib/inquiries`
Expected: PASS — all existing inquiry tests still pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/inquiries/repository.ts src/lib/inquiries/__tests__/repository-quick-quote.test.ts
git commit -m "feat(inquiries): add createQuickQuote repository method"
```

---

## Task 4: InquiryRepository.listPublicPaginated()

Public board excludes quick-quote rows. Existing `listPaginated()` remains untouched so the admin view still sees everything.

**Files:**
- Modify: `src/lib/inquiries/repository.ts`
- Modify: `src/lib/inquiries/__tests__/repository-quick-quote.test.ts` (append)

- [ ] **Step 1: Append the failing test**

Append to `src/lib/inquiries/__tests__/repository-quick-quote.test.ts`:

```typescript
describe('InquiryRepository.listPublicPaginated', () => {
  it('SQL excludes rows whose author_name equals "[빠른 견적]"', async () => {
    let countSql = '';
    let listSql = '';
    const db = {
      prepare(sql: string) {
        if (sql.includes('COUNT')) countSql = sql;
        else if (sql.includes('SELECT *') && sql.includes('parent_id IS NULL')) listSql = sql;
        return {
          bind() {
            return {
              async first() {
                return { c: 0 };
              },
              async all() {
                return { results: [] };
              },
            };
          },
        };
      },
    };
    const repo = new InquiryRepository(db as unknown as D1Database);
    await repo.listPublicPaginated(1, 10);
    expect(countSql).toContain("author_name != '[빠른 견적]'");
    expect(listSql).toContain("author_name != '[빠른 견적]'");
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- src/lib/inquiries/__tests__/repository-quick-quote.test.ts`
Expected: FAIL — `repo.listPublicPaginated is not a function`.

- [ ] **Step 3: Implement the method**

Add to `src/lib/inquiries/repository.ts` after the existing `listPaginated()`:

```typescript
async listPublicPaginated(
  page: number,
  perPage: number,
): Promise<{ items: Inquiry[]; total: number }> {
  const offset = (page - 1) * perPage;
  const totalRow = await this.db
    .prepare(
      `SELECT COUNT(*) as c FROM inquiries
       WHERE parent_id IS NULL AND author_name != '[빠른 견적]'`,
    )
    .first<{ c: number }>();
  const total = totalRow?.c ?? 0;

  const parents = await this.db
    .prepare(
      `SELECT * FROM inquiries
       WHERE parent_id IS NULL AND author_name != '[빠른 견적]'
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    )
    .bind(perPage, offset)
    .all<InquiryRow>();
  const parentList = (parents.results ?? []).map(rowToInquiry);
  if (parentList.length === 0) return { items: [], total };

  const ids = parentList.map((p) => p.id);
  const placeholders = ids.map(() => '?').join(',');
  const replies = await this.db
    .prepare(
      `SELECT * FROM inquiries WHERE parent_id IN (${placeholders}) ORDER BY created_at ASC`,
    )
    .bind(...ids)
    .all<InquiryRow>();
  const replyList = (replies.results ?? []).map(rowToInquiry);

  const items: Inquiry[] = [];
  for (const parent of parentList) {
    items.push(parent);
    for (const r of replyList) if (r.parentId === parent.id) items.push(r);
  }
  return { items, total };
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `npm test -- src/lib/inquiries/__tests__/repository-quick-quote.test.ts`
Expected: PASS — both tests in the file pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/inquiries/repository.ts src/lib/inquiries/__tests__/repository-quick-quote.test.ts
git commit -m "feat(inquiries): add listPublicPaginated to filter quick-quote rows"
```

---

## Task 5: Wire /inquiry page to listPublicPaginated

The public board must not show quick-quote entries.

**Files:**
- Modify: `src/app/inquiry/page.tsx`

- [ ] **Step 1: Edit the page**

Change line in `src/app/inquiry/page.tsx`:

```diff
- const { items, total } = await repo.listPaginated(page, PER_PAGE);
+ const { items, total } = await repo.listPublicPaginated(page, PER_PAGE);
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit`
Expected: PASS — no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/inquiry/page.tsx
git commit -m "fix(inquiry): exclude quick-quote rows from public board"
```

---

## Task 6: createQuickQuoteAction server action

Server action that ties everything together. Reuses existing infra: `quickQuoteSchema`, `RateLimiter`, `verifyTurnstile`, `encryptPII`, `InquiryRepository.createQuickQuote`, `sendNewInquiryNotification`.

**Files:**
- Create: `src/components/home/reservation/quick-quote-action.ts`

- [ ] **Step 1: Implement the action**

```typescript
// src/components/home/reservation/quick-quote-action.ts
'use server';

import { headers } from 'next/headers';
import { quickQuoteSchema } from '@/lib/quick-quote/schema';
import { buildQuickQuoteTitle, buildQuickQuoteContent } from '@/lib/quick-quote/format';
import { encryptPII } from '@/lib/inquiries/crypto';
import { verifyTurnstile } from '@/lib/inquiries/turnstile';
import { RateLimiter } from '@/lib/inquiries/rate-limit';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { sendNewInquiryNotification } from '@/lib/inquiries/notify';
import { getDB, getEnv } from '@/lib/inquiries/cf';

export interface QuickQuoteFormState {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

const QUICK_QUOTE_DAILY_LIMIT = 15;

export async function createQuickQuoteAction(
  _prev: QuickQuoteFormState,
  formData: FormData,
): Promise<QuickQuoteFormState> {
  const env = getEnv();
  const raw = Object.fromEntries(formData);
  const parsed = quickQuoteSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join('.');
      (fieldErrors[path] ??= []).push(issue.message);
    }
    return { ok: false, message: '입력값을 확인해주세요', fieldErrors };
  }
  const input = parsed.data;

  const ip = (await headers()).get('cf-connecting-ip') ?? 'unknown';

  const limiter = new RateLimiter(getDB());
  const allowed = await limiter.check(ip, 'quick-quote', QUICK_QUOTE_DAILY_LIMIT, 86_400);
  if (!allowed) {
    return { ok: false, message: '오늘 견적 요청 한도를 초과했습니다. 전화로 문의해 주세요.' };
  }

  const turnstile = await verifyTurnstile(input.turnstileToken, env.TURNSTILE_SECRET, ip);
  if (!turnstile.success) {
    return { ok: false, message: '자동가입방지 검증에 실패했습니다. 다시 시도해 주세요.' };
  }

  const phoneEnc = await encryptPII(input.phone, env.PII_KEY);
  const emailEnc = await encryptPII('', env.PII_KEY);

  const title = buildQuickQuoteTitle({
    headcount: input.headcount,
    eventDate: input.eventDate,
    location: input.location,
  });
  const content = buildQuickQuoteContent({
    headcount: input.headcount,
    eventDate: input.eventDate,
    location: input.location,
    phone: input.phone,
  });

  const repo = new InquiryRepository(getDB());
  const id = await repo.createQuickQuote({ phoneEnc, emailEnc, title, content });

  try {
    await sendNewInquiryNotification(env, {
      id,
      authorName: '[빠른 견적]',
      title,
      content,
    });
  } catch (err) {
    console.error('quick-quote notification failed', err);
  }

  return { ok: true };
}
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/reservation/quick-quote-action.ts
git commit -m "feat(quick-quote): add createQuickQuoteAction server action"
```

---

## Task 7: TrustChips component

Server, presentational. Renders 3 chips on desktop, 2 on mobile.

**Files:**
- Create: `src/components/home/reservation/TrustChips.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/components/home/reservation/TrustChips.tsx
export default function TrustChips() {
  return (
    <ul
      className="flex flex-wrap gap-2 justify-start md:justify-center mb-4 md:mb-5 text-white/95 text-xs md:text-sm"
      aria-label="신뢰 정보"
    >
      <li className="inline-flex items-center gap-1.5 bg-white/14 px-3 py-1 rounded-full">
        <span aria-hidden="true">⚡</span>평일 10분 내 회신
      </li>
      <li className="inline-flex items-center gap-1.5 bg-white/14 px-3 py-1 rounded-full">
        <span aria-hidden="true">⭐</span>
        <span className="md:hidden">10년 경력</span>
        <span className="hidden md:inline">10년 이상 경력</span>
      </li>
      <li className="hidden md:inline-flex items-center gap-1.5 bg-white/14 px-3 py-1 rounded-full">
        <span aria-hidden="true">🏝</span>제주 전 지역 출장
      </li>
    </ul>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/home/reservation/TrustChips.tsx
git commit -m "feat(home): add TrustChips component"
```

---

## Task 8: ContactChannels component

Server, presentational. 3 channel cards (전화 white primary, 카톡 yellow, 이메일 ghost). Email card hidden on mobile. Kakao card hidden if `CONTACT.kakaoChannelUrl` is empty.

**Files:**
- Create: `src/components/home/reservation/ContactChannels.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/components/home/reservation/ContactChannels.tsx
'use client';

import { CONTACT } from '@/lib/constants';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';

export default function ContactChannels() {
  return (
    <div className="flex flex-col gap-2.5" aria-label="연락 채널">
      <p className="text-center text-[11px] tracking-widest uppercase text-white/65 hidden md:block">
        — 바로 통화·채팅 —
      </p>

      <a
        href={CONTACT.phoneTel}
        onClick={() => trackNaverEvent({ event: 'phone_click', source: 'quick_quote_section', ...getUtm() })}
        className="flex items-center gap-3 bg-white text-brand rounded-xl px-4 py-3.5 hover:brightness-95"
        aria-label={`전화 ${CONTACT.phone}`}
      >
        <span className="text-2xl leading-none w-9 text-center" aria-hidden="true">📞</span>
        <span className="flex-1">
          <span className="block text-[11px] font-semibold opacity-75">가장 빠름</span>
          <span className="block font-bold text-base leading-tight">{CONTACT.phone}</span>
          <span className="block text-[11px] opacity-70 mt-0.5 hidden md:block">통화 즉시 견적</span>
        </span>
      </a>

      {CONTACT.kakaoChannelUrl ? (
        <a
          href={CONTACT.kakaoChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackNaverEvent({ event: 'kakao_click', source: 'quick_quote_section', ...getUtm() })}
          className="flex items-center gap-3 bg-[#FEE500] text-[#181600] rounded-xl px-4 py-3.5 hover:brightness-95"
          aria-label="카카오톡 1:1 채팅"
        >
          <span className="text-2xl leading-none w-9 text-center" aria-hidden="true">💬</span>
          <span className="flex-1">
            <span className="block text-[11px] font-semibold opacity-75">카카오톡</span>
            <span className="block font-bold text-base leading-tight">1:1 채팅 상담</span>
            <span className="block text-[11px] opacity-70 mt-0.5 hidden md:block">평일 10분 내</span>
          </span>
        </a>
      ) : null}

      <a
        href={CONTACT.mailtoHref}
        onClick={() => trackNaverEvent({ event: 'email_click', source: 'quick_quote_section', ...getUtm() })}
        className="hidden md:flex items-center gap-3 bg-white/10 text-white border border-white/22 rounded-xl px-4 py-3.5 hover:bg-white/15"
        aria-label="이메일 문의"
      >
        <span className="text-2xl leading-none w-9 text-center" aria-hidden="true">✉</span>
        <span className="flex-1">
          <span className="block text-[11px] font-semibold opacity-75">이메일</span>
          <span className="block font-bold text-base leading-tight">상세 문의</span>
          <span className="block text-[11px] opacity-70 mt-0.5">영업일 24h 내</span>
        </span>
      </a>
    </div>
  );
}
```

Because this component fires analytics on click, it must be a client component (`'use client'`). Emoji icons are used inline; no SVG component dependency.

- [ ] **Step 2: Commit**

```bash
git add src/components/home/reservation/ContactChannels.tsx
git commit -m "feat(home): add ContactChannels component"
```

---

## Task 9: QuickQuoteForm client component

Client component. Uses `useActionState` to call the server action. On success, the form node is replaced by a success card in place. Inputs use Korean placeholders; errors render under each field.

**Files:**
- Create: `src/components/home/reservation/QuickQuoteForm.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/components/home/reservation/QuickQuoteForm.tsx
'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import TurnstileWidget from '@/components/inquiry/TurnstileWidget';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';
import {
  createQuickQuoteAction,
  type QuickQuoteFormState,
} from './quick-quote-action';

const INITIAL: QuickQuoteFormState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={() =>
        trackNaverEvent({ event: 'quick_quote_submit', ...getUtm() })
      }
      className="bg-brand text-white h-11 rounded-lg font-bold text-[0.98rem] mt-1 disabled:opacity-50"
    >
      {pending ? '전송 중…' : '견적 받기 →'}
    </button>
  );
}

interface Props {
  siteKey: string;
}

export default function QuickQuoteForm({ siteKey }: Props) {
  const [state, formAction] = useActionState(createQuickQuoteAction, INITIAL);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (state.ok) {
      trackNaverEvent({ event: 'quick_quote_success', ...getUtm() });
    }
  }, [state.ok]);

  if (state.ok) {
    return (
      <div
        className="bg-white text-neutral-900 rounded-xl p-5 shadow-md"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl text-emerald-600 leading-none" aria-hidden="true">✓</span>
          <div>
            <p className="font-bold text-emerald-900 mb-1">견적 요청 접수 완료</p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              평일 10분 내, 010-7332-4199에서 전화드릴게요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="bg-white text-neutral-900 rounded-xl p-5 shadow-md flex flex-col gap-3"
    >
      <p className="text-xs font-bold tracking-wider uppercase text-brand">
        빠른 견적 요청 (1분)
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        <Field
          label="인원"
          name="headcount"
          type="number"
          inputMode="numeric"
          placeholder="10"
          min={1}
          max={200}
          error={state.fieldErrors?.headcount}
          required
        />
        <Field
          label="희망 날짜"
          name="eventDate"
          type="date"
          error={state.fieldErrors?.eventDate}
          required
        />
      </div>

      <Field
        label="출장 장소"
        name="location"
        placeholder="예) 애월읍 곽지리"
        error={state.fieldErrors?.location}
        required
      />

      <Field
        label="연락처"
        name="phone"
        type="tel"
        placeholder="010-0000-0000"
        error={state.fieldErrors?.phone}
        required
      />

      <label className="flex items-start gap-2 text-xs text-neutral-600 mt-1">
        <input
          type="checkbox"
          name="privacyConsent"
          value="on"
          required
          className="mt-0.5"
        />
        <span>
          개인정보 수집·이용 동의 (필수){' '}
          <a href="/privacy" target="_blank" className="text-brand underline">
            자세히
          </a>
        </span>
      </label>
      {state.fieldErrors?.privacyConsent && (
        <p className="text-red-600 text-xs">{state.fieldErrors.privacyConsent[0]}</p>
      )}

      <input type="hidden" name="turnstileToken" value={token} />
      <TurnstileWidget siteKey={siteKey} onToken={setToken} />

      {state.message && !state.ok && (
        <p className="text-red-600 text-sm" aria-live="polite">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  error,
  inputMode,
  min,
  max,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string[];
  inputMode?: 'numeric' | 'text';
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[11px] font-bold text-neutral-500 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        min={min}
        max={max}
        className="w-full bg-neutral-50 border border-neutral-200 rounded-md h-10 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand"
      />
      {error && <p className="text-red-600 text-[11px] mt-1">{error[0]}</p>}
    </div>
  );
}
```

**Theme note**: the site uses a dark theme (`--color-fg = #f5f5f5`), so the white form card must explicitly use `text-neutral-900` for body and `text-neutral-500/600` for labels — using `text-fg` would render white-on-white. Input backgrounds and borders use Tailwind's neutral palette directly instead of the dark-theme tokens.

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/reservation/QuickQuoteForm.tsx
git commit -m "feat(home): add QuickQuoteForm client component"
```

---

## Task 10: Rewrite ReservationBanner to compose new pieces

Replace the entire body of `ReservationBanner.tsx`. Layout: trust chips → headline → sub copy → 2-column grid (form left, channels right) on desktop; single column on mobile.

**Files:**
- Modify: `src/components/home/ReservationBanner.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
// src/components/home/ReservationBanner.tsx
import TrustChips from './reservation/TrustChips';
import QuickQuoteForm from './reservation/QuickQuoteForm';
import ContactChannels from './reservation/ContactChannels';
import { getEnv } from '@/lib/inquiries/cf';

export default function ReservationBanner() {
  const siteKey = getEnv().TURNSTILE_SITE_KEY ?? '';

  return (
    <section id="contact" className="py-20 md:py-24 bg-brand">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <TrustChips />

        <h2 className="text-3xl md:text-4xl font-bold text-white text-left md:text-center leading-tight mb-3">
          1분이면 견적 도착
        </h2>
        <p className="text-white/85 text-base md:text-lg text-left md:text-center max-w-xl md:mx-auto mb-8 md:mb-10 leading-relaxed">
          인원·날짜·장소만 알려주시면 맞춤 메뉴와 가격을 빠르게 보내드려요.
          <span className="hidden md:inline"> 상담은 무료, 견적 후 부담 없이 결정하세요.</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4 lg:gap-5 items-start">
          <QuickQuoteForm siteKey={siteKey} />
          <ContactChannels />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS — Next.js build completes without errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/ReservationBanner.tsx
git commit -m "feat(home): redesign ReservationBanner with quick-quote form"
```

---

## Task 11: Full test suite + lint

Run the entire test suite and ESLint to catch any regression.

- [ ] **Step 1: Run all tests**

Run: `npm test`
Expected: PASS — all tests in `src/**/*.test.{ts,tsx}` pass.

- [ ] **Step 2: Run ESLint**

Run: `npm run lint`
Expected: PASS — no errors. If warnings appear in newly added files, fix them.

- [ ] **Step 3: Run type-check**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit any fixes (if needed)**

If tests/lint required fixes, commit them:

```bash
git add -A
git commit -m "chore: fix lint/type issues from quick-quote feature"
```

If nothing changed, skip this step.

---

## Task 12: Manual visual verification

Start the dev server and verify the redesigned section in a browser.

- [ ] **Step 1: Start dev server**

Run: `npm run dev`
Expected: Server starts on `http://localhost:3000`.

- [ ] **Step 2: Verify desktop layout**

Open `http://localhost:3000` in browser at viewport ≥ 1024px wide. Scroll to the reservation section. Confirm:

- 3 trust chips visible (`⚡ 평일 10분 내 회신`, `⭐ 10년 이상 경력`, `🏝 제주 전 지역 출장`)
- Headline "1분이면 견적 도착" centered
- Two columns: form on left (white card), 3 channel cards on right (white phone, yellow Kakao if configured, ghost email)
- Channel cards show response time ("통화 즉시 견적", "평일 10분 내", "영업일 24h 내")

- [ ] **Step 3: Verify mobile layout**

Open browser devtools, set viewport to 375px wide:

- 2 trust chips visible (지역 chip 숨김)
- Headline left-aligned
- Form full width
- Below form: phone card + Kakao card (if configured). Email card hidden.

- [ ] **Step 4: Submit a test quote**

In the form:
- 인원: 5
- 희망 날짜: any future date
- 출장 장소: 테스트 위치
- 연락처: 010-1234-5678
- Tick 개인정보 동의
- Solve Turnstile (auto-passes in dev with test key)
- Click 견적 받기

Expected:
- Form is replaced by success card: "✓ 견적 요청 접수 완료 / 평일 10분 내, 010-7332-4199에서 전화드릴게요."
- No page navigation occurred.
- Local D1 has a new row in `inquiries` with `author_name = '[빠른 견적]'`, `is_secret = 1`, `password_hash IS NULL`.
  - Verify: `npx wrangler d1 execute hanlasan-bbq --local --command "SELECT id, author_name, title, is_secret, password_hash FROM inquiries ORDER BY id DESC LIMIT 1"`
  - Expected: one row matching above.

- [ ] **Step 5: Verify /inquiry board excludes the row**

Navigate to `http://localhost:3000/inquiry`.
Expected: The test quote does **not** appear in the public list. (If it does, listPublicPaginated isn't being called.)

- [ ] **Step 6: Verify /admin/inquiry shows the row**

Navigate to `http://localhost:3000/admin/inquiry`.
Expected: Test quote is listed (admin still sees everything).

- [ ] **Step 7: Test validation errors**

Submit the form with:
- Empty 인원 → error message under field
- Past date → "지난 날짜는 선택할 수 없습니다"
- Phone format `01012345678` (no hyphens) → "연락처 형식: 010-0000-0000"
- Privacy unchecked → error

Each error must render under the respective field and the success card must not appear.

- [ ] **Step 8: Record findings**

If anything in steps 2-7 fails, file a follow-up issue. If everything passes, the feature is complete. No commit required unless fixes were needed.

---

## Notes for the implementer

- **Brand color**: `bg-brand` = `#ea580c` (orange), `text-brand` = same. Defined in `src/app/globals.css`.
- **Existing CTA components** (`CallButton`, `EmailButton`, `KakaoButton`) are still used in the header and mobile bar — do NOT delete them. The new components in `src/components/home/reservation/` replace them only inside `ReservationBanner`.
- **Turnstile in dev**: `TURNSTILE_SITE_KEY = "1x00000000000000000000AA"` (test key, always passes) — already in `wrangler.toml`. Real keys come from Cloudflare secrets in production.
- **Resend in dev**: emails are not actually sent if `RESEND_API_KEY` is a placeholder — the code logs and continues. The DB row is still created.
- **Kakao URL**: `CONTACT.kakaoChannelUrl` is currently `''`, so the Kakao channel card will be hidden until it's filled in. Filling it in is out of scope for this work.
- **Phone format**: spec mandates `010-0000-0000` (hyphenated). Plan does NOT add auto-formatting — user must enter hyphens. If real-world abandonment is observed, add formatting later.
- **No schema migration**: `migrations/0001_init.sql` is unchanged. `password_hash`/`password_salt` are already nullable; `email_enc` stores an encrypted empty string for quick quotes.
- **Analytics events implemented**: `quick_quote_submit` (button click), `quick_quote_success` (after `ok: true`), `phone_click`/`kakao_click`/`email_click` (with `source: 'quick_quote_section'` to distinguish from header/mobile-bar clicks). The spec also lists `quick_quote_view` (in-view tracking) — deferred to a follow-up because it requires IntersectionObserver wiring not justified by the rest of this work.
