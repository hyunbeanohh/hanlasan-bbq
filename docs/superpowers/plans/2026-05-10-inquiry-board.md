# 예약 문의 게시판 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 손님이 비밀번호로 보호되는 예약 문의 글을 작성하고, 사장님이 답글로 응대하는 게시판을 한라산출장바베큐 사이트에 추가한다. 운영 비용 0원으로 Cloudflare D1 + Pages + Access + Turnstile + Resend 스택으로 구현한다.

**Architecture:** Next.js 16 App Router + Server Actions로 손님 측 기능 구현, `/admin/*` 경로는 Cloudflare Access로 보호. 데이터는 Cloudflare D1 (SQLite at edge)에 저장하고, 손님 비밀번호는 PBKDF2, 개인정보(전화·이메일)는 AES-GCM으로 암호화. 새 문의는 Resend로 사장님 두 이메일에 알림. 보관기간 1년 후 Cloudflare Cron Trigger로 자동 삭제.

**Tech Stack:** Next.js 16 + React 19, TypeScript, Tailwind v4, `@opennextjs/cloudflare`, Cloudflare D1/Pages/Access/Turnstile/Cron, Resend, Web Crypto API, Zod, Vitest

**Spec:** `docs/superpowers/specs/2026-05-10-inquiry-board-design.md`

---

## Pre-Implementation Notes (Important)

### Next.js 16 차이점
- `middleware.ts` → `proxy.ts` (기존 `src/middleware.ts` 마이그레이션 필요)
- 동적 라우트 params는 **Promise** — 반드시 `await params`
- Server Actions, App Router는 동일하게 동작
- React 19 hooks: `useActionState`, `useFormStatus` 사용

### 비-git 환경 처리
프로젝트 루트가 git 저장소가 아닐 경우, **Task 0**에서 `git init`을 실행한 후 진행한다. 그 외 모든 commit 단계는 표준 git 워크플로우로 진행.

### 한글 도메인 운영
모든 Cloudflare/Resend 등록 단계에서는 Punycode 형태(`xn--910br3lvy4eq...`)로 입력해야 할 수 있다. 변환 도구: `node -e "console.log(new URL('https://한라산출장바베큐.kr').hostname)"`.

### 작업 분리 (수동 vs 코드)
다음은 **사용자(사장님)가 직접 Cloudflare/Resend/가비아 대시보드에서 수행하는 단계**이며 본 plan에서 코드로 구현하지 않는다:
1. Cloudflare 계정 생성 / Pages 프로젝트 만들기
2. 가비아에서 도메인 NS를 Cloudflare로 변경
3. Resend 가입 및 도메인 인증 (DNS 레코드 4개)
4. Cloudflare Access 정책 설정 (`/admin/*` 경로)

이 단계는 **Task 26**에 운영 체크리스트로 정리한다.

---

## File Structure

### 신규 파일
```
wrangler.toml                              # Cloudflare Workers/Pages 설정
open-next.config.ts                        # OpenNext Cloudflare 어댑터 설정
.dev.vars.example                          # 로컬 환경변수 템플릿
migrations/0001_init.sql                   # D1 스키마

src/lib/inquiries/
  types.ts                                 # 도메인 타입
  schema.ts                                # Zod 입력 검증
  password.ts                              # PBKDF2 해시/검증
  crypto.ts                                # AES-GCM PII 암호화
  repository.ts                            # D1 CRUD
  rate-limit.ts                            # IP 기반 카운터
  turnstile.ts                             # Cloudflare Turnstile 검증
  notify.ts                                # Resend 발송
  session.ts                               # 글 단위 인증 쿠키 (HMAC)
  admin.ts                                 # Cloudflare Access JWT 검증
  cron.ts                                  # 만료 글 삭제 핸들러
  cf.ts                                    # getRequestContext 래퍼

src/lib/inquiries/__tests__/
  password.test.ts
  crypto.test.ts
  schema.test.ts
  rate-limit.test.ts
  session.test.ts

src/app/inquiry/
  page.tsx                                 # 목록
  new/page.tsx                             # 작성 폼 (Client Component)
  new/actions.ts                           # 작성 Server Action
  [id]/page.tsx                            # 상세
  [id]/PasswordPrompt.tsx                  # 비밀번호 입력 클라이언트 컴포넌트
  [id]/verify/route.ts                     # 비번 검증 → 쿠키 발급
  [id]/edit/page.tsx                       # 수정 폼
  [id]/edit/actions.ts                     # 수정/삭제 Server Action

src/app/admin/inquiry/
  page.tsx                                 # 관리자 목록
  [id]/page.tsx                            # 관리자 상세 + 답글 폼
  [id]/actions.ts                          # 답글 작성, 강제 삭제

src/app/privacy/page.tsx                   # 개인정보처리방침

src/components/inquiry/
  InquiryRow.tsx                           # 목록 행
  Pagination.tsx                           # 숫자 페이지네이션
  TurnstileWidget.tsx                      # Cloudflare Turnstile 위젯

src/proxy.ts                               # 기존 middleware.ts 마이그레이션
```

### 수정 파일
- `package.json` (deps 추가)
- `next.config.ts` (CSP에 Turnstile 도메인 추가)
- `src/components/layout/Header.tsx` (NAV_LINKS의 `/#contact` → `/inquiry`)
- `src/components/layout/Footer.tsx` (`/#contact` → `/inquiry`)
- `src/lib/constants.ts` (필요한 경우)

### 삭제 파일
- `src/middleware.ts` (proxy.ts로 마이그레이션 후)

---

## Phase 0 — 프로젝트 부트스트랩

### Task 0: Git 초기화 및 의존성 추가

**Files:**
- Modify: `package.json`
- Create: `.gitignore` (없을 경우)

- [ ] **Step 1: Git 저장소 확인 및 초기화 (필요 시)**

```bash
cd /Users/devbean/Desktop/한라산출장바베큐
git rev-parse --git-dir 2>/dev/null || git init
git status
```

기대: 저장소가 없으면 초기화되고 변경 가능한 상태가 보인다.

- [ ] **Step 2: 의존성 설치**

```bash
pnpm add zod resend
pnpm add -D wrangler @opennextjs/cloudflare @cloudflare/workers-types miniflare
```

기대: 모든 패키지가 설치되고 `pnpm-lock.yaml`이 갱신된다.

- [ ] **Step 3: package.json 스크립트 추가**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "test": "vitest run --passWithNoTests",
  "test:watch": "vitest",
  "format": "prettier --write .",
  "preview": "opennextjs-cloudflare build && wrangler pages dev .open-next/dist",
  "deploy": "opennextjs-cloudflare build && wrangler pages deploy .open-next/dist",
  "db:generate": "wrangler d1 execute hanlasan-bbq --local --file=migrations/0001_init.sql",
  "db:generate:remote": "wrangler d1 execute hanlasan-bbq --remote --file=migrations/0001_init.sql",
  "cf-typegen": "wrangler types --env-interface CloudflareEnv ./cloudflare-env.d.ts"
}
```

- [ ] **Step 4: 커밋**

```bash
git add package.json pnpm-lock.yaml .gitignore
git commit -m "chore: add Cloudflare adapter and Resend dependencies for inquiry board"
```

---

### Task 1: Cloudflare 어댑터 설정

**Files:**
- Create: `wrangler.toml`
- Create: `open-next.config.ts`
- Create: `.dev.vars.example`
- Create: `cloudflare-env.d.ts` (자동 생성)
- Modify: `next.config.ts`

- [ ] **Step 1: `wrangler.toml` 작성**

```toml
name = "hanlasan-bbq"
compatibility_date = "2025-12-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".open-next/dist"

[[d1_databases]]
binding = "DB"
database_name = "hanlasan-bbq"
database_id = "REPLACE_WITH_REAL_ID_FROM_WRANGLER_OUTPUT"

[triggers]
crons = ["0 18 * * *"]   # 매일 KST 03:00 (UTC 18:00)에 만료 글 삭제

[vars]
SITE_URL = "https://한라산출장바베큐.kr"
NOTIFY_EMAILS = "ohnamsoo3822@naver.com,ohb4199@gmail.com"
SENDER_EMAIL = "noreply@한라산출장바베큐.kr"
TURNSTILE_SITE_KEY = ""    # 대시보드 등록 후 채움
```

- [ ] **Step 2: `open-next.config.ts` 작성**

```ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({});
```

- [ ] **Step 3: `.dev.vars.example` 작성**

```
PII_KEY=base64-encoded-32-bytes-here
RESEND_API_KEY=re_xxxxx
TURNSTILE_SECRET=0x0000000000000000000000000000000000000000
SESSION_SECRET=base64-encoded-32-bytes-here
ACCESS_TEAM_DOMAIN=yourteam.cloudflareaccess.com
ACCESS_AUD=replace-with-application-aud
```

- [ ] **Step 4: `next.config.ts` CSP에 Turnstile/Resend 추가**

`next.config.ts`의 `Content-Security-Policy` 줄에서 다음을 변경:

```diff
- "script-src 'self' 'unsafe-inline' https://wcs.naver.net",
+ "script-src 'self' 'unsafe-inline' https://wcs.naver.net https://challenges.cloudflare.com",
- "frame-src https://map.naver.com https://m.map.naver.com",
+ "frame-src https://map.naver.com https://m.map.naver.com https://challenges.cloudflare.com",
- "connect-src 'self' https://rss.blog.naver.com https://vitals.vercel-insights.com https://wcs.naver.net",
+ "connect-src 'self' https://rss.blog.naver.com https://vitals.vercel-insights.com https://wcs.naver.net https://challenges.cloudflare.com",
```

- [ ] **Step 5: 타입 생성 명령 실행 테스트**

```bash
pnpm cf-typegen
```

기대: `cloudflare-env.d.ts`가 생성되고 `CloudflareEnv` 인터페이스에 `DB`, `SITE_URL` 등이 포함됨.

- [ ] **Step 6: 시크릿 타입 보강 (`cloudflare-env.d.ts`에 누락된 secret 타입 추가)**

`wrangler types`는 `[vars]`만 자동 생성하므로, secrets는 별도 `src/types/env.d.ts`로 보강:

```ts
// src/types/env.d.ts
declare global {
  interface CloudflareEnv {
    PII_KEY: string;
    SESSION_SECRET: string;
    RESEND_API_KEY: string;
    TURNSTILE_SECRET: string;
    CRON_SECRET: string;
    ACCESS_TEAM_DOMAIN: string;
    ACCESS_AUD: string;
  }
}
export {};
```

- [ ] **Step 7: 커밋**

```bash
git add wrangler.toml open-next.config.ts .dev.vars.example cloudflare-env.d.ts next.config.ts src/types/env.d.ts
git commit -m "feat(infra): configure Cloudflare adapter, D1 binding, cron trigger"
```

---

### Task 2: D1 스키마 마이그레이션

**Files:**
- Create: `migrations/0001_init.sql`

- [ ] **Step 1: 마이그레이션 SQL 작성**

```sql
-- migrations/0001_init.sql

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
  bucket      TEXT NOT NULL,
  attempts    INTEGER NOT NULL DEFAULT 0,
  window_end  TEXT NOT NULL,
  PRIMARY KEY (ip, bucket)
);
```

- [ ] **Step 2: 로컬 D1 생성 및 적용**

```bash
pnpm wrangler d1 create hanlasan-bbq
```

기대: 출력에 `database_id = "..."` 가 표시됨. 이 값을 복사해 `wrangler.toml`의 `database_id` 자리에 붙여넣고 커밋한다.

```bash
pnpm db:generate
```

기대: "✅ Successfully executed 1 SQL statement" 출력.

- [ ] **Step 3: 스키마 검증**

```bash
pnpm wrangler d1 execute hanlasan-bbq --local --command="SELECT name FROM sqlite_master WHERE type='table'"
```

기대: `inquiries`, `rate_limits` 두 테이블이 출력된다.

- [ ] **Step 4: 커밋**

```bash
git add migrations/ wrangler.toml
git commit -m "feat(db): create inquiries and rate_limits schema"
```

---

## Phase 1 — 도메인 라이브러리 (TDD)

### Task 3: 비밀번호 해시 모듈 (PBKDF2)

**Files:**
- Create: `src/lib/inquiries/password.ts`
- Test: `src/lib/inquiries/__tests__/password.test.ts`

- [ ] **Step 1: 실패 테스트 작성**

```ts
// src/lib/inquiries/__tests__/password.test.ts
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../password';

describe('password', () => {
  it('hashes a password and produces a salt', async () => {
    const result = await hashPassword('secret123');
    expect(result.hash).toMatch(/^[A-Za-z0-9+/=]+$/);
    expect(result.salt).toMatch(/^[A-Za-z0-9+/=]+$/);
    expect(result.hash).not.toEqual(result.salt);
  });

  it('produces different hashes for the same password (different salts)', async () => {
    const a = await hashPassword('secret123');
    const b = await hashPassword('secret123');
    expect(a.hash).not.toEqual(b.hash);
  });

  it('verifies correct password', async () => {
    const { hash, salt } = await hashPassword('secret123');
    expect(await verifyPassword('secret123', hash, salt)).toBe(true);
  });

  it('rejects incorrect password', async () => {
    const { hash, salt } = await hashPassword('secret123');
    expect(await verifyPassword('wrong', hash, salt)).toBe(false);
  });

  it('uses constant-time comparison', async () => {
    const { hash, salt } = await hashPassword('secret123');
    // 단순 검증: 다른 길이 비번도 false 반환
    expect(await verifyPassword('a', hash, salt)).toBe(false);
    expect(await verifyPassword('secret123_extra_long_input', hash, salt)).toBe(false);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pnpm test src/lib/inquiries/__tests__/password.test.ts
```

기대: FAIL — 모듈이 없음.

- [ ] **Step 3: 구현**

```ts
// src/lib/inquiries/password.ts
const ITERATIONS = 100_000;
const HASH_BITS = 256;
const SALT_BYTES = 16;

const enc = new TextEncoder();

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pbkdf2(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    key,
    HASH_BITS,
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await pbkdf2(password, salt);
  return { hash: toBase64(hash), salt: toBase64(salt) };
}

export async function verifyPassword(
  password: string,
  expectedHashB64: string,
  saltB64: string,
): Promise<boolean> {
  const expected = fromBase64(expectedHashB64);
  const actual = await pbkdf2(password, fromBase64(saltB64));
  if (expected.length !== actual.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ actual[i];
  return diff === 0;
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pnpm test src/lib/inquiries/__tests__/password.test.ts
```

기대: 5/5 passed.

- [ ] **Step 5: 커밋**

```bash
git add src/lib/inquiries/password.ts src/lib/inquiries/__tests__/password.test.ts
git commit -m "feat(inquiry): add PBKDF2 password hashing for customer posts"
```

---

### Task 4: PII 암호화 모듈 (AES-GCM)

**Files:**
- Create: `src/lib/inquiries/crypto.ts`
- Test: `src/lib/inquiries/__tests__/crypto.test.ts`

- [ ] **Step 1: 실패 테스트 작성**

```ts
// src/lib/inquiries/__tests__/crypto.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { encryptPII, decryptPII, generateKey } from '../crypto';

const TEST_KEY = 'YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWE=';

describe('crypto', () => {
  it('encrypts and decrypts a string round-trip', async () => {
    const cipher = await encryptPII('010-1234-5678', TEST_KEY);
    expect(cipher).not.toEqual('010-1234-5678');
    const plain = await decryptPII(cipher, TEST_KEY);
    expect(plain).toEqual('010-1234-5678');
  });

  it('produces different ciphertext for same plaintext (random IV)', async () => {
    const a = await encryptPII('test@example.com', TEST_KEY);
    const b = await encryptPII('test@example.com', TEST_KEY);
    expect(a).not.toEqual(b);
  });

  it('throws on tampered ciphertext', async () => {
    const cipher = await encryptPII('hello', TEST_KEY);
    const tampered = cipher.slice(0, -2) + 'AA';
    await expect(decryptPII(tampered, TEST_KEY)).rejects.toThrow();
  });

  it('throws on wrong key', async () => {
    const cipher = await encryptPII('hello', TEST_KEY);
    const otherKey = 'YmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmI=';
    await expect(decryptPII(cipher, otherKey)).rejects.toThrow();
  });

  it('generateKey returns valid 32-byte base64', () => {
    const key = generateKey();
    const buf = Buffer.from(key, 'base64');
    expect(buf.length).toBe(32);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pnpm test src/lib/inquiries/__tests__/crypto.test.ts
```

기대: FAIL — 모듈이 없음.

- [ ] **Step 3: 구현**

```ts
// src/lib/inquiries/crypto.ts
const enc = new TextEncoder();
const dec = new TextDecoder();
const IV_BYTES = 12;

function toB64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.byteLength; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function fromB64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importKey(keyB64: string): Promise<CryptoKey> {
  const raw = fromB64(keyB64);
  if (raw.length !== 32) throw new Error('PII_KEY must be 32 bytes (base64)');
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function encryptPII(plaintext: string, keyB64: string): Promise<string> {
  const key = await importKey(keyB64);
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));
  const ctBytes = new Uint8Array(ct);
  const combined = new Uint8Array(iv.length + ctBytes.length);
  combined.set(iv, 0);
  combined.set(ctBytes, iv.length);
  return toB64(combined);
}

export async function decryptPII(cipherB64: string, keyB64: string): Promise<string> {
  const key = await importKey(keyB64);
  const combined = fromB64(cipherB64);
  if (combined.length < IV_BYTES + 16) throw new Error('ciphertext too short');
  const iv = combined.slice(0, IV_BYTES);
  const ct = combined.slice(IV_BYTES);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return dec.decode(pt);
}

export function generateKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return toB64(bytes);
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pnpm test src/lib/inquiries/__tests__/crypto.test.ts
```

기대: 5/5 passed.

- [ ] **Step 5: 커밋**

```bash
git add src/lib/inquiries/crypto.ts src/lib/inquiries/__tests__/crypto.test.ts
git commit -m "feat(inquiry): add AES-GCM encryption for phone and email PII"
```

---

### Task 5: Zod 스키마 + 타입

**Files:**
- Create: `src/lib/inquiries/types.ts`
- Create: `src/lib/inquiries/schema.ts`
- Test: `src/lib/inquiries/__tests__/schema.test.ts`

- [ ] **Step 1: 타입 정의**

```ts
// src/lib/inquiries/types.ts
export interface Inquiry {
  id: number;
  parentId: number | null;
  isAdmin: boolean;
  authorName: string;
  passwordHash: string | null;
  passwordSalt: string | null;
  phoneEnc: string;
  emailEnc: string;
  title: string;
  content: string;
  isSecret: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface InquiryRow {
  id: number;
  parent_id: number | null;
  is_admin: number;
  author_name: string;
  password_hash: string | null;
  password_salt: string | null;
  phone_enc: string;
  email_enc: string;
  title: string;
  content: string;
  is_secret: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export function rowToInquiry(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    parentId: row.parent_id,
    isAdmin: row.is_admin === 1,
    authorName: row.author_name,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    phoneEnc: row.phone_enc,
    emailEnc: row.email_enc,
    title: row.title,
    content: row.content,
    isSecret: row.is_secret === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
  };
}
```

- [ ] **Step 2: 실패 테스트**

```ts
// src/lib/inquiries/__tests__/schema.test.ts
import { describe, it, expect } from 'vitest';
import { newInquirySchema, replySchema, editSchema } from '../schema';

describe('newInquirySchema', () => {
  const valid = {
    authorName: '홍길동',
    password: '1234',
    phone: '010-1234-5678',
    email: 'a@b.com',
    title: '문의드립니다',
    content: '내용입니다.',
    isSecret: 'on',
    privacyConsent: 'on',
    turnstileToken: 'xyz',
  };

  it('accepts valid input', () => {
    expect(newInquirySchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty author name', () => {
    expect(newInquirySchema.safeParse({ ...valid, authorName: '' }).success).toBe(false);
  });

  it('rejects too-short password', () => {
    expect(newInquirySchema.safeParse({ ...valid, password: '123' }).success).toBe(false);
  });

  it('rejects invalid phone format', () => {
    expect(newInquirySchema.safeParse({ ...valid, phone: 'abc' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(newInquirySchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });

  it('requires privacyConsent to be checked', () => {
    expect(newInquirySchema.safeParse({ ...valid, privacyConsent: undefined }).success).toBe(false);
  });

  it('requires title under 200 chars', () => {
    const long = 'a'.repeat(201);
    expect(newInquirySchema.safeParse({ ...valid, title: long }).success).toBe(false);
  });
});

describe('replySchema', () => {
  it('accepts content only', () => {
    expect(replySchema.safeParse({ content: '안녕하세요' }).success).toBe(true);
  });
  it('rejects empty content', () => {
    expect(replySchema.safeParse({ content: '' }).success).toBe(false);
  });
});

describe('editSchema', () => {
  it('accepts title and content', () => {
    expect(editSchema.safeParse({ title: 't', content: 'c' }).success).toBe(true);
  });
});
```

- [ ] **Step 3: 테스트 실패 확인**

```bash
pnpm test src/lib/inquiries/__tests__/schema.test.ts
```

기대: FAIL.

- [ ] **Step 4: 구현**

```ts
// src/lib/inquiries/schema.ts
import { z } from 'zod';

const phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;

export const newInquirySchema = z.object({
  authorName: z.string().trim().min(1, '이름을 입력해주세요').max(50),
  password: z.string().min(4, '비밀번호는 4자 이상').max(64),
  phone: z.string().regex(phoneRegex, '연락처 형식: 010-0000-0000'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요').max(120),
  title: z.string().trim().min(1, '제목을 입력해주세요').max(200),
  content: z.string().trim().min(1, '내용을 입력해주세요').max(5000),
  isSecret: z.string().optional(),
  privacyConsent: z.literal('on', { errorMap: () => ({ message: '개인정보 동의가 필요합니다' }) }),
  turnstileToken: z.string().min(1, '자동가입방지 검증이 필요합니다'),
});

export type NewInquiryInput = z.infer<typeof newInquirySchema>;

export const verifyPasswordSchema = z.object({
  password: z.string().min(1).max(64),
});

export const editSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(5000),
});

export const replySchema = z.object({
  content: z.string().trim().min(1).max(5000),
});
```

- [ ] **Step 5: 테스트 통과 확인**

```bash
pnpm test src/lib/inquiries/__tests__/schema.test.ts
```

기대: 11/11 passed.

- [ ] **Step 6: 커밋**

```bash
git add src/lib/inquiries/types.ts src/lib/inquiries/schema.ts src/lib/inquiries/__tests__/schema.test.ts
git commit -m "feat(inquiry): add domain types and zod input schemas"
```

---

### Task 6: D1 Repository

**Files:**
- Create: `src/lib/inquiries/cf.ts`
- Create: `src/lib/inquiries/repository.ts`

- [ ] **Step 1: Cloudflare context 헬퍼**

```ts
// src/lib/inquiries/cf.ts
import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env;
}

export function getDB(): D1Database {
  return getEnv().DB;
}
```

- [ ] **Step 2: Repository 구현 (실제 D1 통합 테스트는 Phase 8의 수동 검증으로 진행)**

```ts
// src/lib/inquiries/repository.ts
import type { Inquiry, InquiryRow } from './types';
import { rowToInquiry } from './types';

export interface CreateInquiryParams {
  authorName: string;
  passwordHash: string;
  passwordSalt: string;
  phoneEnc: string;
  emailEnc: string;
  title: string;
  content: string;
  isSecret: boolean;
}

export interface CreateReplyParams {
  parentId: number;
  authorName: string;          // 보통 '관리자'
  phoneEnc: string;            // 더미 값(빈 암호문) 허용 — 실제론 빈 문자열 암호화
  emailEnc: string;
  title: string;               // 보통 '↳ Re: <원글 제목>'
  content: string;
}

export class InquiryRepository {
  constructor(private db: D1Database) {}

  async create(p: CreateInquiryParams): Promise<number> {
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19);
    const result = await this.db
      .prepare(
        `INSERT INTO inquiries
         (parent_id, is_admin, author_name, password_hash, password_salt,
          phone_enc, email_enc, title, content, is_secret, expires_at)
         VALUES (NULL, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        p.authorName,
        p.passwordHash,
        p.passwordSalt,
        p.phoneEnc,
        p.emailEnc,
        p.title,
        p.content,
        p.isSecret ? 1 : 0,
        expiresAt,
      )
      .run();
    return result.meta.last_row_id as number;
  }

  async createReply(p: CreateReplyParams): Promise<number> {
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19);
    const result = await this.db
      .prepare(
        `INSERT INTO inquiries
         (parent_id, is_admin, author_name, phone_enc, email_enc, title, content, expires_at)
         VALUES (?, 1, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(p.parentId, p.authorName, p.phoneEnc, p.emailEnc, p.title, p.content, expiresAt)
      .run();
    return result.meta.last_row_id as number;
  }

  async findById(id: number): Promise<Inquiry | null> {
    const row = await this.db
      .prepare(`SELECT * FROM inquiries WHERE id = ?`)
      .bind(id)
      .first<InquiryRow>();
    return row ? rowToInquiry(row) : null;
  }

  async findRepliesOf(parentId: number): Promise<Inquiry[]> {
    const result = await this.db
      .prepare(`SELECT * FROM inquiries WHERE parent_id = ? ORDER BY created_at ASC`)
      .bind(parentId)
      .all<InquiryRow>();
    return (result.results ?? []).map(rowToInquiry);
  }

  async listPaginated(page: number, perPage: number): Promise<{ items: Inquiry[]; total: number }> {
    const offset = (page - 1) * perPage;
    // 원글만 페이지네이션의 단위로 카운트
    const totalRow = await this.db
      .prepare(`SELECT COUNT(*) as c FROM inquiries WHERE parent_id IS NULL`)
      .first<{ c: number }>();
    const total = totalRow?.c ?? 0;

    const parents = await this.db
      .prepare(
        `SELECT * FROM inquiries WHERE parent_id IS NULL
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

    // 부모 다음에 답글 인터리브
    const items: Inquiry[] = [];
    for (const parent of parentList) {
      items.push(parent);
      for (const r of replyList) if (r.parentId === parent.id) items.push(r);
    }
    return { items, total };
  }

  async update(id: number, fields: { title: string; content: string }): Promise<void> {
    await this.db
      .prepare(
        `UPDATE inquiries SET title = ?, content = ?, updated_at = datetime('now') WHERE id = ?`,
      )
      .bind(fields.title, fields.content, id)
      .run();
  }

  async delete(id: number): Promise<void> {
    await this.db.prepare(`DELETE FROM inquiries WHERE id = ?`).bind(id).run();
  }

  async deleteExpired(now: Date): Promise<number> {
    const nowIso = now.toISOString().replace('T', ' ').slice(0, 19);
    const result = await this.db
      .prepare(`DELETE FROM inquiries WHERE expires_at < ?`)
      .bind(nowIso)
      .run();
    return result.meta.changes ?? 0;
  }
}
```

- [ ] **Step 3: 빌드 확인 (타입 컴파일)**

```bash
pnpm tsc --noEmit
```

기대: 컴파일 에러 없음.

- [ ] **Step 4: 커밋**

```bash
git add src/lib/inquiries/cf.ts src/lib/inquiries/repository.ts
git commit -m "feat(inquiry): add D1 repository for inquiries CRUD"
```

---

### Task 7: 레이트 리밋

**Files:**
- Create: `src/lib/inquiries/rate-limit.ts`
- Test: `src/lib/inquiries/__tests__/rate-limit.test.ts`

- [ ] **Step 1: 실패 테스트 (인메모리 모킹)**

```ts
// src/lib/inquiries/__tests__/rate-limit.test.ts
import { describe, it, expect } from 'vitest';
import { RateLimiter } from '../rate-limit';

class FakeDB {
  rows = new Map<string, { attempts: number; window_end: string }>();
  prepare(sql: string) {
    const self = this;
    return {
      bind(...args: unknown[]) {
        return {
          async first<T>() {
            if (sql.includes('SELECT')) {
              const key = `${args[0]}|${args[1]}`;
              const r = self.rows.get(key);
              return (r as unknown) as T | null;
            }
            return null;
          },
          async run() {
            if (sql.includes('INSERT')) {
              const key = `${args[0]}|${args[1]}`;
              self.rows.set(key, { attempts: args[2] as number, window_end: args[3] as string });
            } else if (sql.includes('UPDATE')) {
              const key = `${args[1]}|${args[2]}`;
              const r = self.rows.get(key);
              if (r) r.attempts = args[0] as number;
            } else if (sql.includes('DELETE')) {
              const key = `${args[0]}|${args[1]}`;
              self.rows.delete(key);
            }
            return { meta: { changes: 1 } };
          },
        };
      },
    };
  }
}

describe('RateLimiter', () => {
  it('allows up to limit attempts within window', async () => {
    const rl = new RateLimiter(new FakeDB() as unknown as D1Database);
    for (let i = 0; i < 5; i++) {
      const ok = await rl.check('1.1.1.1', 'verify', 5, 3600);
      expect(ok).toBe(true);
    }
  });

  it('blocks after limit reached', async () => {
    const rl = new RateLimiter(new FakeDB() as unknown as D1Database);
    for (let i = 0; i < 5; i++) await rl.check('1.1.1.1', 'verify', 5, 3600);
    const blocked = await rl.check('1.1.1.1', 'verify', 5, 3600);
    expect(blocked).toBe(false);
  });

  it('resets after window expires', async () => {
    const rl = new RateLimiter(new FakeDB() as unknown as D1Database);
    for (let i = 0; i < 5; i++) await rl.check('1.1.1.1', 'verify', 5, -1);
    const after = await rl.check('1.1.1.1', 'verify', 5, 3600);
    expect(after).toBe(true);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pnpm test src/lib/inquiries/__tests__/rate-limit.test.ts
```

기대: FAIL.

- [ ] **Step 3: 구현**

```ts
// src/lib/inquiries/rate-limit.ts
export class RateLimiter {
  constructor(private db: D1Database) {}

  /**
   * @param ip 요청 IP
   * @param bucket 'post' | 'verify' 등 식별자
   * @param limit 윈도우 내 허용 횟수
   * @param windowSeconds 윈도우 길이 (초). 음수면 즉시 만료된 것으로 처리.
   * @returns true = 허용, false = 차단
   */
  async check(ip: string, bucket: string, limit: number, windowSeconds: number): Promise<boolean> {
    const now = new Date();
    const existing = await this.db
      .prepare(`SELECT attempts, window_end FROM rate_limits WHERE ip = ? AND bucket = ?`)
      .bind(ip, bucket)
      .first<{ attempts: number; window_end: string }>();

    if (!existing || new Date(existing.window_end) <= now) {
      const windowEnd = new Date(now.getTime() + windowSeconds * 1000)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19);
      // upsert
      await this.db.prepare(`DELETE FROM rate_limits WHERE ip = ? AND bucket = ?`).bind(ip, bucket).run();
      await this.db
        .prepare(`INSERT INTO rate_limits (ip, bucket, attempts, window_end) VALUES (?, ?, ?, ?)`)
        .bind(ip, bucket, 1, windowEnd)
        .run();
      return true;
    }

    if (existing.attempts >= limit) return false;

    await this.db
      .prepare(`UPDATE rate_limits SET attempts = ? WHERE ip = ? AND bucket = ?`)
      .bind(existing.attempts + 1, ip, bucket)
      .run();
    return true;
  }
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pnpm test src/lib/inquiries/__tests__/rate-limit.test.ts
```

기대: 3/3 passed.

- [ ] **Step 5: 커밋**

```bash
git add src/lib/inquiries/rate-limit.ts src/lib/inquiries/__tests__/rate-limit.test.ts
git commit -m "feat(inquiry): add IP-based rate limiter using D1 rate_limits table"
```

---

### Task 8: Turnstile 검증

**Files:**
- Create: `src/lib/inquiries/turnstile.ts`

- [ ] **Step 1: 구현 (외부 API 호출이라 단위 테스트 대신 통합 단계에서 검증)**

```ts
// src/lib/inquiries/turnstile.ts
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileResult {
  success: boolean;
  errors?: string[];
}

export async function verifyTurnstile(
  token: string,
  secret: string,
  ip?: string,
): Promise<TurnstileResult> {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);

  const res = await fetch(VERIFY_URL, { method: 'POST', body });
  if (!res.ok) return { success: false, errors: ['turnstile_http_error'] };
  const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
  return { success: data.success, errors: data['error-codes'] };
}
```

- [ ] **Step 2: 빌드 확인**

```bash
pnpm tsc --noEmit
```

기대: 타입 에러 없음.

- [ ] **Step 3: 커밋**

```bash
git add src/lib/inquiries/turnstile.ts
git commit -m "feat(inquiry): add Cloudflare Turnstile server-side verification"
```

---

### Task 9: 글-단위 인증 세션 (HMAC 쿠키)

**Files:**
- Create: `src/lib/inquiries/session.ts`
- Test: `src/lib/inquiries/__tests__/session.test.ts`

비밀글/본인 글 수정·삭제는 비번 검증 1회 → 30분간 해당 글에 한해 인증 상태 유지. 서명된 쿠키로 처리.

- [ ] **Step 1: 실패 테스트**

```ts
// src/lib/inquiries/__tests__/session.test.ts
import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from '../session';

const SECRET = 'YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWE=';

describe('session token', () => {
  it('signs and verifies a token round-trip', async () => {
    const token = await signToken({ inquiryId: 42 }, SECRET, 60);
    const payload = await verifyToken(token, SECRET);
    expect(payload?.inquiryId).toBe(42);
  });

  it('rejects expired token', async () => {
    const token = await signToken({ inquiryId: 42 }, SECRET, -1);
    const payload = await verifyToken(token, SECRET);
    expect(payload).toBeNull();
  });

  it('rejects tampered token', async () => {
    const token = await signToken({ inquiryId: 42 }, SECRET, 60);
    const tampered = token.slice(0, -2) + 'AA';
    const payload = await verifyToken(tampered, SECRET);
    expect(payload).toBeNull();
  });

  it('rejects wrong secret', async () => {
    const token = await signToken({ inquiryId: 42 }, SECRET, 60);
    const payload = await verifyToken(token, 'YmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmI=');
    expect(payload).toBeNull();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pnpm test src/lib/inquiries/__tests__/session.test.ts
```

- [ ] **Step 3: 구현**

```ts
// src/lib/inquiries/session.ts
const enc = new TextEncoder();
const dec = new TextDecoder();

function toB64Url(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.byteLength; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function fromB64Url(s: string): Uint8Array {
  const padded = s.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importHmac(secretB64: string): Promise<CryptoKey> {
  const bin = atob(secretB64);
  const raw = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) raw[i] = bin.charCodeAt(i);
  return crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export interface InquirySessionPayload {
  inquiryId: number;
  exp: number; // unix seconds
}

export async function signToken(
  data: { inquiryId: number },
  secretB64: string,
  ttlSeconds: number,
): Promise<string> {
  const payload: InquirySessionPayload = {
    inquiryId: data.inquiryId,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const body = toB64Url(enc.encode(JSON.stringify(payload)));
  const key = await importHmac(secretB64);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body));
  return `${body}.${toB64Url(new Uint8Array(sig))}`;
}

export async function verifyToken(token: string, secretB64: string): Promise<InquirySessionPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sigB64] = parts;
  const key = await importHmac(secretB64);
  const ok = await crypto.subtle.verify('HMAC', key, fromB64Url(sigB64), enc.encode(body));
  if (!ok) return null;
  try {
    const payload = JSON.parse(dec.decode(fromB64Url(body))) as InquirySessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const COOKIE_NAME = (id: number) => `inquiry_auth_${id}`;
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pnpm test src/lib/inquiries/__tests__/session.test.ts
```

기대: 4/4 passed.

- [ ] **Step 5: 커밋**

```bash
git add src/lib/inquiries/session.ts src/lib/inquiries/__tests__/session.test.ts
git commit -m "feat(inquiry): add HMAC-signed per-post auth session tokens"
```

---

## Phase 2 — 손님 측 작성 흐름

### Task 10: 헤더/푸터 내비 변경

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Header NAV_LINKS 변경**

`src/components/layout/Header.tsx` 8~13행:

```diff
const NAV_LINKS = [
  { href: '/company', label: '회사소개' },
  { href: '/menu', label: '메뉴소개' },
  { href: '/gallery', label: '행사갤러리' },
- { href: '/#contact', label: '예약문의' },
+ { href: '/inquiry', label: '예약 문의' },
];
```

- [ ] **Step 2: Footer 링크 변경**

`src/components/layout/Footer.tsx`에서 두 군데 `/#contact`를 `/inquiry`로 변경.

```bash
grep -n '/#contact' src/components/layout/Footer.tsx
```

각 라인에서 `href="/#contact"` → `href="/inquiry"`로 수정.

- [ ] **Step 3: 빌드 확인**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: 커밋**

```bash
git add src/components/layout/Header.tsx src/components/layout/Footer.tsx
git commit -m "feat(nav): replace #contact anchor with /inquiry link in header and footer"
```

---

### Task 11: Turnstile 위젯 컴포넌트

**Files:**
- Create: `src/components/inquiry/TurnstileWidget.tsx`

- [ ] **Step 1: 구현**

```tsx
// src/components/inquiry/TurnstileWidget.tsx
'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (selector: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

interface Props {
  siteKey: string;
  onToken: (token: string) => void;
}

export default function TurnstileWidget({ siteKey, onToken }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    const SCRIPT_ID = 'cf-turnstile-script';
    function render() {
      if (!window.turnstile || !ref.current) return;
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token: string) => onToken(token),
        'error-callback': () => onToken(''),
        'expired-callback': () => onToken(''),
        theme: 'light',
        language: 'ko',
      });
    }
    if (document.getElementById(SCRIPT_ID)) {
      render();
    } else {
      const s = document.createElement('script');
      s.id = SCRIPT_ID;
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.head.appendChild(s);
    }
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    };
  }, [siteKey, onToken]);

  return <div ref={ref} />;
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/inquiry/TurnstileWidget.tsx
git commit -m "feat(inquiry): add Cloudflare Turnstile widget component"
```

---

### Task 12: 작성 폼 페이지 + Server Action

**Files:**
- Create: `src/app/inquiry/new/page.tsx`
- Create: `src/app/inquiry/new/actions.ts`
- Create: `src/app/inquiry/new/InquiryForm.tsx`

- [ ] **Step 1: Server Action 작성**

```ts
// src/app/inquiry/new/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { newInquirySchema } from '@/lib/inquiries/schema';
import { hashPassword } from '@/lib/inquiries/password';
import { encryptPII } from '@/lib/inquiries/crypto';
import { verifyTurnstile } from '@/lib/inquiries/turnstile';
import { RateLimiter } from '@/lib/inquiries/rate-limit';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { sendNewInquiryNotification } from '@/lib/inquiries/notify';
import { getDB, getEnv } from '@/lib/inquiries/cf';

export interface FormState {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createInquiryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const env = getEnv();
  const raw = Object.fromEntries(formData);
  const parsed = newInquirySchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: '입력값을 확인해주세요', fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const input = parsed.data;

  const ip = (await headers()).get('cf-connecting-ip') ?? 'unknown';
  const limiter = new RateLimiter(getDB());
  const allowed = await limiter.check(ip, 'post', 10, 86_400);
  if (!allowed) return { ok: false, message: '하루 작성 횟수(10건)를 초과했습니다.' };

  const turnstile = await verifyTurnstile(input.turnstileToken, env.TURNSTILE_SECRET, ip);
  if (!turnstile.success) return { ok: false, message: '자동가입방지 검증에 실패했습니다. 다시 시도해주세요.' };

  const pwd = await hashPassword(input.password);
  const phoneEnc = await encryptPII(input.phone, env.PII_KEY);
  const emailEnc = await encryptPII(input.email, env.PII_KEY);

  const repo = new InquiryRepository(getDB());
  const id = await repo.create({
    authorName: input.authorName,
    passwordHash: pwd.hash,
    passwordSalt: pwd.salt,
    phoneEnc,
    emailEnc,
    title: input.title,
    content: input.content,
    isSecret: input.isSecret === 'on',
  });

  // 이메일 알림 — 실패해도 글 등록은 성공
  try {
    await sendNewInquiryNotification(env, { id, authorName: input.authorName, title: input.title, content: input.content });
  } catch (err) {
    console.error('notification failed', err);
  }

  redirect(`/inquiry/${id}?created=1`);
}
```

- [ ] **Step 2: Client 폼 컴포넌트**

```tsx
// src/app/inquiry/new/InquiryForm.tsx
'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import TurnstileWidget from '@/components/inquiry/TurnstileWidget';
import { createInquiryAction, type FormState } from './actions';

const INITIAL: FormState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand text-white px-6 py-2.5 rounded-full text-sm font-semibold disabled:opacity-50"
    >
      {pending ? '등록 중…' : '등록'}
    </button>
  );
}

export default function InquiryForm({ siteKey }: { siteKey: string }) {
  const [state, formAction] = useActionState(createInquiryAction, INITIAL);
  const [token, setToken] = useState('');

  return (
    <form action={formAction} className="space-y-4 max-w-2xl mx-auto py-10">
      <Field label="고객명" name="authorName" error={state.fieldErrors?.authorName} required />
      <Field label="비밀번호" name="password" type="password" error={state.fieldErrors?.password} required />
      <Field label="연락처" name="phone" placeholder="010-0000-0000" error={state.fieldErrors?.phone} required />
      <Field label="이메일" name="email" type="email" error={state.fieldErrors?.email} required />
      <Field label="제목" name="title" error={state.fieldErrors?.title} required />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isSecret" /> 비밀글 (체크 시 작성자와 관리자만 본문 읽기 가능)
      </label>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="content">내용 *</label>
        <textarea
          id="content"
          name="content"
          required
          rows={10}
          className="w-full border border-border rounded p-3 text-sm"
        />
        {state.fieldErrors?.content && <p className="text-red-600 text-xs mt-1">{state.fieldErrors.content[0]}</p>}
      </div>

      <fieldset className="border border-border p-4 text-sm">
        <legend className="px-2 font-medium">개인정보 수집 및 이용 동의 (필수)</legend>
        <p className="mb-2">수집 항목: 고객명, 연락처, 이메일 / 목적: 상담·답변 / 보유기간: 1년</p>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="privacyConsent" value="on" required /> 위 내용에 동의합니다
        </label>
        {state.fieldErrors?.privacyConsent && (
          <p className="text-red-600 text-xs mt-1">{state.fieldErrors.privacyConsent[0]}</p>
        )}
      </fieldset>

      <input type="hidden" name="turnstileToken" value={token} />
      <TurnstileWidget siteKey={siteKey} onToken={setToken} />

      {state.message && !state.ok && <p className="text-red-600 text-sm" aria-live="polite">{state.message}</p>}

      <div className="flex justify-center gap-2 pt-4">
        <SubmitButton />
        <a href="/inquiry" className="border border-border px-6 py-2.5 rounded-full text-sm">취소</a>
      </div>
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}{required && ' *'}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-border rounded p-2 text-sm"
      />
      {error && <p className="text-red-600 text-xs mt-1">{error[0]}</p>}
    </div>
  );
}
```

- [ ] **Step 3: Page (Server Component)**

```tsx
// src/app/inquiry/new/page.tsx
import { getEnv } from '@/lib/inquiries/cf';
import InquiryForm from './InquiryForm';

export const metadata = { title: '예약 문의 작성 | 한라산출장바베큐' };

export default function NewInquiryPage() {
  const siteKey = getEnv().TURNSTILE_SITE_KEY ?? '';
  return (
    <main className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-center pt-10 pb-6">예약 문의 작성</h1>
      <InquiryForm siteKey={siteKey} />
    </main>
  );
}
```

- [ ] **Step 4: 빌드 확인**

```bash
pnpm tsc --noEmit
```

기대: notify 모듈 미존재 에러. 다음 Task에서 구현하므로 임시 stub으로 통과시키거나 Task 13을 먼저 진행.

> 진행 순서 메모: Task 13 (notify)을 먼저 끝내거나, `notify.ts`를 빈 stub(`export async function sendNewInquiryNotification() {}`)으로 만든 뒤 Task 13에서 채운다.

- [ ] **Step 5: 커밋**

```bash
git add src/app/inquiry/new
git commit -m "feat(inquiry): add new inquiry form page with server action and Turnstile"
```

---

### Task 13: Resend 이메일 알림

**Files:**
- Create: `src/lib/inquiries/notify.ts`

- [ ] **Step 1: 구현**

```ts
// src/lib/inquiries/notify.ts
import { Resend } from 'resend';

interface NewInquiryEmail {
  id: number;
  authorName: string;
  title: string;
  content: string;
}

export async function sendNewInquiryNotification(env: CloudflareEnv, payload: NewInquiryEmail): Promise<void> {
  const recipients = env.NOTIFY_EMAILS.split(',').map((s) => s.trim()).filter(Boolean);
  if (recipients.length === 0) return;

  const resend = new Resend(env.RESEND_API_KEY);
  const adminUrl = `${env.SITE_URL}/admin/inquiry/${payload.id}`;
  const preview = payload.content.length > 200 ? payload.content.slice(0, 200) + '…' : payload.content;

  await resend.emails.send({
    from: env.SENDER_EMAIL,
    to: recipients,
    subject: `[한라산출장바베큐] 새 예약 문의 — ${payload.title}`,
    text:
      `새로운 예약 문의가 등록되었습니다.\n\n` +
      `작성자: ${payload.authorName}\n` +
      `제목: ${payload.title}\n\n` +
      `내용 미리보기:\n${preview}\n\n` +
      `관리자 페이지: ${adminUrl}`,
  });
}
```

- [ ] **Step 2: 빌드 확인**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 3: 커밋**

```bash
git add src/lib/inquiries/notify.ts
git commit -m "feat(inquiry): send Resend email notification on new inquiry"
```

---

## Phase 3 — 손님 측 읽기 흐름

### Task 14: 목록 페이지 + 페이지네이션

**Files:**
- Create: `src/app/inquiry/page.tsx`
- Create: `src/components/inquiry/Pagination.tsx`

- [ ] **Step 1: Pagination 컴포넌트**

```tsx
// src/components/inquiry/Pagination.tsx
import Link from 'next/link';

interface Props {
  current: number;
  total: number;
  perPage: number;
  basePath: string;
}

export default function Pagination({ current, total, perPage, basePath }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(current - 4, totalPages - 9));
  const end = Math.min(totalPages, start + 9);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const link = (p: number) => `${basePath}?page=${p}`;

  return (
    <nav className="flex justify-center gap-1 py-8" aria-label="페이지네이션">
      {current > 1 && (
        <Link href={link(current - 1)} className="px-3 py-1 border border-border rounded text-sm">«</Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={link(p)}
          aria-current={p === current ? 'page' : undefined}
          className={`px-3 py-1 border border-border rounded text-sm ${p === current ? 'bg-brand text-white' : ''}`}
        >
          {p}
        </Link>
      ))}
      {current < totalPages && (
        <Link href={link(current + 1)} className="px-3 py-1 border border-border rounded text-sm">»</Link>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: 목록 페이지**

```tsx
// src/app/inquiry/page.tsx
import Link from 'next/link';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { getDB } from '@/lib/inquiries/cf';
import Pagination from '@/components/inquiry/Pagination';

export const metadata = { title: '예약 문의 | 한라산출장바베큐' };
export const dynamic = 'force-dynamic';

const PER_PAGE = 10;

export default async function InquiryListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? '1') || 1);
  const repo = new InquiryRepository(getDB());
  const { items, total } = await repo.listPaginated(page, PER_PAGE);

  // 표시 번호: 최신순 1번 → DESC. 단순화로 total - offset - index 사용
  // 부모/답글 인터리브된 items에서 부모만 번호 매김
  const startNo = total - (page - 1) * PER_PAGE;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">예약 문의</h1>
        <Link href="/inquiry/new" className="bg-brand text-white px-4 py-2 rounded-full text-sm font-semibold">
          글쓰기
        </Link>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-fg-muted">
            <th className="py-3 text-left w-16">번호</th>
            <th className="py-3 text-left">제목</th>
            <th className="py-3 text-left w-32">작성자</th>
            <th className="py-3 text-left w-32">작성일</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={4} className="py-10 text-center text-fg-muted">아직 등록된 문의가 없습니다.</td></tr>
          )}
          {items.map((item) => {
            const isReply = item.parentId !== null;
            const number = isReply ? '' : startNo - items.slice(0, items.indexOf(item)).filter((i) => i.parentId === null).length;
            return (
              <tr key={item.id} className="border-b border-border">
                <td className="py-3 text-fg-muted">{number}</td>
                <td className="py-3">
                  {isReply ? (
                    <span className="pl-6 text-fg-muted">↳ {item.title}</span>
                  ) : (
                    <Link href={`/inquiry/${item.id}`} className="hover:text-brand">
                      {item.title}
                      {item.isSecret && <span className="ml-1" aria-label="비밀글">🔒</span>}
                    </Link>
                  )}
                </td>
                <td className="py-3 text-fg-muted">{item.isAdmin ? '관리자' : item.authorName}</td>
                <td className="py-3 text-fg-muted">{item.createdAt.slice(0, 10)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination current={page} total={total} perPage={PER_PAGE} basePath="/inquiry" />
    </main>
  );
}
```

> 메모: 위 `number` 계산 로직은 인덱스 기반으로 단순화한 것이며, 답글이 섞인 배열에서 부모 글 번호를 매기는 방식이다. 정확성을 위해 작성 시점에 한 번 더 확인할 것.

- [ ] **Step 3: 빌드 확인**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: 커밋**

```bash
git add src/app/inquiry/page.tsx src/components/inquiry/Pagination.tsx
git commit -m "feat(inquiry): add list page with pagination and reply indentation"
```

---

### Task 15: 상세 페이지 + 비밀글 비번 검증

**Files:**
- Create: `src/app/inquiry/[id]/page.tsx`
- Create: `src/app/inquiry/[id]/PasswordPrompt.tsx`
- Create: `src/app/inquiry/[id]/verify/route.ts`
- Create: `src/lib/inquiries/admin.ts` (stub for now, 자세한 구현은 Task 18)

- [ ] **Step 1: Admin stub**

```ts
// src/lib/inquiries/admin.ts
import { headers } from 'next/headers';

/**
 * Cloudflare Access는 Cf-Access-Jwt-Assertion 헤더로 JWT를 전달.
 * MVP에서는 헤더 존재 여부로 통과 처리하고, Task 18에서 JWT 검증 보강.
 */
export async function isAdminRequest(): Promise<boolean> {
  const h = await headers();
  return Boolean(h.get('cf-access-jwt-assertion'));
}
```

- [ ] **Step 2: PasswordPrompt 컴포넌트**

```tsx
// src/app/inquiry/[id]/PasswordPrompt.tsx
'use client';

import { useState } from 'react';

export default function PasswordPrompt({ inquiryId }: { inquiryId: number }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch(`/inquiry/${inquiryId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (res.ok) location.reload();
    else {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      setError(data.message ?? '비밀번호가 올바르지 않습니다.');
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto py-20 space-y-4 text-center">
      <p className="text-fg-muted text-sm">비밀글입니다. 작성 시 입력한 비밀번호를 입력해주세요.</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-border rounded p-2 text-sm"
        required
      />
      {error && <p className="text-red-600 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="bg-brand text-white px-6 py-2 rounded-full text-sm font-semibold disabled:opacity-50"
      >
        {pending ? '확인 중…' : '확인'}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Verify route handler**

```ts
// src/app/inquiry/[id]/verify/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { verifyPassword } from '@/lib/inquiries/password';
import { signToken, COOKIE_NAME } from '@/lib/inquiries/session';
import { RateLimiter } from '@/lib/inquiries/rate-limit';
import { getDB, getEnv } from '@/lib/inquiries/cf';

const TTL_SECONDS = 30 * 60;

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const inquiryId = Number(id);
  if (!Number.isInteger(inquiryId)) return NextResponse.json({ message: 'invalid id' }, { status: 400 });

  const ip = req.headers.get('cf-connecting-ip') ?? 'unknown';
  const limiter = new RateLimiter(getDB());
  const allowed = await limiter.check(ip, `verify:${inquiryId}`, 5, 3600);
  if (!allowed) return NextResponse.json({ message: '시도 횟수를 초과했습니다. 1시간 후 다시 시도해주세요.' }, { status: 429 });

  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (!body.password) return NextResponse.json({ message: '비밀번호가 필요합니다.' }, { status: 400 });

  const repo = new InquiryRepository(getDB());
  const inquiry = await repo.findById(inquiryId);
  if (!inquiry || inquiry.isAdmin || !inquiry.passwordHash || !inquiry.passwordSalt) {
    return NextResponse.json({ message: '확인할 수 없습니다.' }, { status: 404 });
  }

  const ok = await verifyPassword(body.password, inquiry.passwordHash, inquiry.passwordSalt);
  if (!ok) return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });

  const env = getEnv();
  const token = await signToken({ inquiryId }, env.SESSION_SECRET, TTL_SECONDS);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME(inquiryId), token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: `/inquiry/${inquiryId}`,
    maxAge: TTL_SECONDS,
  });
  return res;
}
```

- [ ] **Step 4: 상세 페이지**

```tsx
// src/app/inquiry/[id]/page.tsx
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { isAdminRequest } from '@/lib/inquiries/admin';
import { verifyToken, COOKIE_NAME } from '@/lib/inquiries/session';
import { getDB, getEnv } from '@/lib/inquiries/cf';
import PasswordPrompt from './PasswordPrompt';

export const dynamic = 'force-dynamic';

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiryId = Number(id);
  if (!Number.isInteger(inquiryId)) notFound();

  const repo = new InquiryRepository(getDB());
  const inquiry = await repo.findById(inquiryId);
  if (!inquiry || inquiry.isAdmin) notFound();

  const isAdmin = await isAdminRequest();
  let isOwner = false;
  if (!isAdmin && inquiry.isSecret) {
    const cookie = (await cookies()).get(COOKIE_NAME(inquiryId))?.value;
    if (cookie) {
      const env = getEnv();
      const payload = await verifyToken(cookie, env.SESSION_SECRET);
      if (payload?.inquiryId === inquiryId) isOwner = true;
    }
    if (!isOwner) {
      return (
        <main className="mx-auto max-w-6xl px-4">
          <PasswordPrompt inquiryId={inquiryId} />
        </main>
      );
    }
  }

  // 본인 글이거나 비밀글 인증 통과 시 owner 권한
  const cookieRaw = (await cookies()).get(COOKIE_NAME(inquiryId))?.value;
  if (cookieRaw && !isAdmin) {
    const payload = await verifyToken(cookieRaw, getEnv().SESSION_SECRET);
    if (payload?.inquiryId === inquiryId) isOwner = true;
  }

  const replies = await repo.findRepliesOf(inquiryId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="border-b border-border pb-4 mb-4">
        <h1 className="text-2xl font-bold">{inquiry.title}</h1>
        <p className="text-fg-muted text-sm mt-1">
          {inquiry.authorName} · {inquiry.createdAt.slice(0, 16)}
          {inquiry.isSecret && ' · 🔒 비밀글'}
        </p>
      </div>

      <article className="whitespace-pre-wrap py-6 leading-relaxed">{inquiry.content}</article>

      {(isOwner || isAdmin) && (
        <div className="flex gap-2 py-4 border-t border-border">
          <Link href={`/inquiry/${inquiry.id}/edit`} className="border border-border px-4 py-2 rounded text-sm">
            수정
          </Link>
          <form action={`/inquiry/${inquiry.id}/edit`} method="POST">
            <input type="hidden" name="_action" value="delete" />
            <button type="submit" className="border border-red-500 text-red-500 px-4 py-2 rounded text-sm">
              삭제
            </button>
          </form>
        </div>
      )}

      {replies.length > 0 && (
        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-bold">답변</h2>
          {replies.map((r) => (
            <div key={r.id} className="bg-surface p-4 rounded border border-border">
              <p className="text-fg-muted text-sm mb-2">관리자 · {r.createdAt.slice(0, 16)}</p>
              <article className="whitespace-pre-wrap leading-relaxed">{r.content}</article>
            </div>
          ))}
        </section>
      )}

      <div className="pt-8">
        <Link href="/inquiry" className="text-sm text-fg-muted hover:text-brand">← 목록으로</Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: 빌드 확인 + 커밋**

```bash
pnpm tsc --noEmit
git add src/app/inquiry/[id] src/lib/inquiries/admin.ts
git commit -m "feat(inquiry): add detail page with secret-post password verification"
```

---

## Phase 4 — 본인 글 수정 / 삭제

### Task 16: 수정 폼 + Server Action

**Files:**
- Create: `src/app/inquiry/[id]/edit/page.tsx`
- Create: `src/app/inquiry/[id]/edit/actions.ts`
- Create: `src/app/inquiry/[id]/edit/EditForm.tsx`

- [ ] **Step 1: Server Action**

```ts
// src/app/inquiry/[id]/edit/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { editSchema } from '@/lib/inquiries/schema';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { verifyToken, COOKIE_NAME } from '@/lib/inquiries/session';
import { isAdminRequest } from '@/lib/inquiries/admin';
import { getDB, getEnv } from '@/lib/inquiries/cf';

export interface EditState {
  ok: boolean;
  message?: string;
}

async function authorize(inquiryId: number): Promise<'admin' | 'owner' | null> {
  if (await isAdminRequest()) return 'admin';
  const cookie = (await cookies()).get(COOKIE_NAME(inquiryId))?.value;
  if (!cookie) return null;
  const payload = await verifyToken(cookie, getEnv().SESSION_SECRET);
  return payload?.inquiryId === inquiryId ? 'owner' : null;
}

export async function updateInquiryAction(
  inquiryId: number,
  _prev: EditState,
  formData: FormData,
): Promise<EditState> {
  const auth = await authorize(inquiryId);
  if (!auth) return { ok: false, message: '권한이 없습니다.' };

  const parsed = editSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: '입력값을 확인해주세요.' };

  const repo = new InquiryRepository(getDB());
  const existing = await repo.findById(inquiryId);
  if (!existing || existing.isAdmin) return { ok: false, message: '글을 찾을 수 없습니다.' };

  await repo.update(inquiryId, parsed.data);
  redirect(`/inquiry/${inquiryId}`);
}

export async function deleteInquiryAction(inquiryId: number): Promise<void> {
  const auth = await authorize(inquiryId);
  if (!auth) throw new Error('unauthorized');

  const repo = new InquiryRepository(getDB());
  await repo.delete(inquiryId);
  redirect('/inquiry');
}
```

- [ ] **Step 2: EditForm**

```tsx
// src/app/inquiry/[id]/edit/EditForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateInquiryAction, type EditState } from './actions';

const INITIAL: EditState = { ok: false };

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-brand text-white px-6 py-2 rounded-full text-sm">
      {pending ? '저장 중…' : '저장'}
    </button>
  );
}

export default function EditForm({
  inquiryId,
  initialTitle,
  initialContent,
}: {
  inquiryId: number;
  initialTitle: string;
  initialContent: string;
}) {
  const action = updateInquiryAction.bind(null, inquiryId);
  const [state, formAction] = useActionState(action, INITIAL);

  return (
    <form action={formAction} className="space-y-4 max-w-2xl mx-auto py-10">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">제목 *</label>
        <input id="title" name="title" defaultValue={initialTitle} required className="w-full border border-border rounded p-2 text-sm" />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">내용 *</label>
        <textarea
          id="content"
          name="content"
          defaultValue={initialContent}
          required
          rows={10}
          className="w-full border border-border rounded p-3 text-sm"
        />
      </div>
      {state.message && !state.ok && <p className="text-red-600 text-sm">{state.message}</p>}
      <div className="flex justify-center gap-2">
        <SubmitBtn />
        <a href={`/inquiry/${inquiryId}`} className="border border-border px-6 py-2 rounded-full text-sm">취소</a>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Edit page + DELETE 처리 라우트**

수정 페이지는 owner/admin 검증 후 EditForm 표시. 삭제는 같은 디렉터리의 라우트로 처리한다.

```tsx
// src/app/inquiry/[id]/edit/page.tsx
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { verifyToken, COOKIE_NAME } from '@/lib/inquiries/session';
import { isAdminRequest } from '@/lib/inquiries/admin';
import { getDB, getEnv } from '@/lib/inquiries/cf';
import EditForm from './EditForm';

export const dynamic = 'force-dynamic';

export default async function EditInquiryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiryId = Number(id);
  if (!Number.isInteger(inquiryId)) notFound();

  const repo = new InquiryRepository(getDB());
  const inquiry = await repo.findById(inquiryId);
  if (!inquiry || inquiry.isAdmin) notFound();

  const admin = await isAdminRequest();
  let owner = false;
  if (!admin) {
    const cookie = (await cookies()).get(COOKIE_NAME(inquiryId))?.value;
    if (cookie) {
      const payload = await verifyToken(cookie, getEnv().SESSION_SECRET);
      if (payload?.inquiryId === inquiryId) owner = true;
    }
  }
  if (!admin && !owner) redirect(`/inquiry/${inquiryId}`);

  return (
    <main className="px-4 py-10">
      <h1 className="text-xl font-bold text-center">예약 문의 수정</h1>
      <EditForm inquiryId={inquiryId} initialTitle={inquiry.title} initialContent={inquiry.content} />
    </main>
  );
}
```

- [ ] **Step 4: DELETE 폼 처리 — 별도 route**

`src/app/inquiry/[id]/edit/delete/route.ts`:

```ts
import { type NextRequest } from 'next/server';
import { deleteInquiryAction } from '../actions';

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await deleteInquiryAction(Number(id));
  return new Response(null, { status: 303, headers: { Location: '/inquiry' } });
}
```

상세 페이지 삭제 폼의 `action`을 `/inquiry/{id}/edit/delete`로 변경한다 (Task 15에서 설정한 `action={`/inquiry/${inquiry.id}/edit`}` → `/inquiry/${inquiry.id}/edit/delete`).

- [ ] **Step 5: 빌드 + 커밋**

```bash
pnpm tsc --noEmit
git add src/app/inquiry/[id]/edit src/app/inquiry/[id]/page.tsx
git commit -m "feat(inquiry): add owner edit and delete with auth cookie"
```

---

## Phase 5 — 관리자

### Task 17: Cloudflare Access JWT 검증 강화

**Files:**
- Modify: `src/lib/inquiries/admin.ts`

- [ ] **Step 1: JWT 검증 구현**

`Cf-Access-Jwt-Assertion` 헤더의 JWT를 Access의 JWKS로 검증. Cloudflare Access JWKS 엔드포인트는 `https://<team-name>.cloudflareaccess.com/cdn-cgi/access/certs`.

```ts
// src/lib/inquiries/admin.ts
import { headers } from 'next/headers';
import { getEnv } from './cf';

interface JWK {
  kid: string;
  kty: string;
  use: string;
  n: string;
  e: string;
}

let cachedKeys: { fetched: number; keys: JWK[] } | null = null;
const CACHE_MS = 5 * 60 * 1000;

async function getJWKS(teamDomain: string): Promise<JWK[]> {
  const now = Date.now();
  if (cachedKeys && now - cachedKeys.fetched < CACHE_MS) return cachedKeys.keys;
  const res = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error('failed to fetch JWKS');
  const data = (await res.json()) as { keys: JWK[] };
  cachedKeys = { fetched: now, keys: data.keys };
  return data.keys;
}

function b64urlDecode(s: string): Uint8Array {
  const padded = s.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importRSAKey(jwk: JWK): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
}

export async function isAdminRequest(): Promise<boolean> {
  try {
    const env = getEnv();
    if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return false;

    const h = await headers();
    const token = h.get('cf-access-jwt-assertion');
    if (!token) return false;

    const [headerB64, payloadB64, sigB64] = token.split('.');
    if (!headerB64 || !payloadB64 || !sigB64) return false;

    const header = JSON.parse(new TextDecoder().decode(b64urlDecode(headerB64))) as { kid: string; alg: string };
    if (header.alg !== 'RS256') return false;

    const keys = await getJWKS(env.ACCESS_TEAM_DOMAIN);
    const jwk = keys.find((k) => k.kid === header.kid);
    if (!jwk) return false;

    const cryptoKey = await importRSAKey(jwk);
    const signed = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, b64urlDecode(sigB64), signed);
    if (!valid) return false;

    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(payloadB64))) as {
      aud: string | string[];
      exp: number;
      iss: string;
    };
    const audMatches = Array.isArray(payload.aud) ? payload.aud.includes(env.ACCESS_AUD) : payload.aud === env.ACCESS_AUD;
    if (!audMatches) return false;
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (!payload.iss.includes(env.ACCESS_TEAM_DOMAIN)) return false;

    return true;
  } catch (err) {
    console.error('isAdminRequest error', err);
    return false;
  }
}
```

- [ ] **Step 2: 빌드 확인**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 3: 커밋**

```bash
git add src/lib/inquiries/admin.ts
git commit -m "feat(inquiry): verify Cloudflare Access JWT with team JWKS"
```

---

### Task 18: 관리자 목록 + 상세 + 답글

**Files:**
- Create: `src/app/admin/inquiry/page.tsx`
- Create: `src/app/admin/inquiry/[id]/page.tsx`
- Create: `src/app/admin/inquiry/[id]/actions.ts`
- Create: `src/app/admin/inquiry/[id]/ReplyForm.tsx`

- [ ] **Step 1: Admin 목록**

```tsx
// src/app/admin/inquiry/page.tsx
import Link from 'next/link';
import { forbidden } from 'next/navigation';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { isAdminRequest } from '@/lib/inquiries/admin';
import { getDB } from '@/lib/inquiries/cf';

export const dynamic = 'force-dynamic';

const PER_PAGE = 30;

export default async function AdminInquiryListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  if (!(await isAdminRequest())) forbidden();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? '1') || 1);
  const repo = new InquiryRepository(getDB());
  const { items } = await repo.listPaginated(page, PER_PAGE);
  const parents = items.filter((i) => i.parentId === null);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">[관리자] 예약 문의</h1>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 text-left w-16">번호</th>
            <th className="py-2 text-left">제목</th>
            <th className="py-2 text-left w-32">작성자</th>
            <th className="py-2 text-left w-32">작성일</th>
            <th className="py-2 text-left w-20">답변</th>
          </tr>
        </thead>
        <tbody>
          {parents.map((p) => {
            const hasReply = items.some((i) => i.parentId === p.id);
            return (
              <tr key={p.id} className="border-b border-border">
                <td className="py-2">{p.id}</td>
                <td className="py-2">
                  <Link href={`/admin/inquiry/${p.id}`} className="hover:text-brand">
                    {p.title} {p.isSecret && '🔒'}
                  </Link>
                </td>
                <td className="py-2 text-fg-muted">{p.authorName}</td>
                <td className="py-2 text-fg-muted">{p.createdAt.slice(0, 10)}</td>
                <td className="py-2">{hasReply ? '✓' : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
```

- [ ] **Step 2: Admin 상세 + 답글 폼**

```ts
// src/app/admin/inquiry/[id]/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { replySchema } from '@/lib/inquiries/schema';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { isAdminRequest } from '@/lib/inquiries/admin';
import { encryptPII } from '@/lib/inquiries/crypto';
import { getDB, getEnv } from '@/lib/inquiries/cf';

export async function replyAction(parentId: number, _prev: unknown, formData: FormData) {
  if (!(await isAdminRequest())) return { ok: false, message: 'unauthorized' };
  const parsed = replySchema.safeParse({ content: formData.get('content') });
  if (!parsed.success) return { ok: false, message: '내용을 입력해주세요.' };

  const env = getEnv();
  const repo = new InquiryRepository(getDB());
  const parent = await repo.findById(parentId);
  if (!parent) return { ok: false, message: '원글이 없습니다.' };

  const empty = await encryptPII('', env.PII_KEY);
  await repo.createReply({
    parentId,
    authorName: '관리자',
    phoneEnc: empty,
    emailEnc: empty,
    title: `↳ Re: ${parent.title}`,
    content: parsed.data.content,
  });
  revalidatePath('/inquiry');
  revalidatePath(`/inquiry/${parentId}`);
  revalidatePath(`/admin/inquiry/${parentId}`);
  return { ok: true };
}

export async function adminDeleteAction(inquiryId: number): Promise<void> {
  if (!(await isAdminRequest())) throw new Error('unauthorized');
  const repo = new InquiryRepository(getDB());
  await repo.delete(inquiryId);
  redirect('/admin/inquiry');
}
```

```tsx
// src/app/admin/inquiry/[id]/ReplyForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { replyAction } from './actions';

function Btn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-brand text-white px-6 py-2 rounded-full text-sm">
      {pending ? '등록 중…' : '답글 등록'}
    </button>
  );
}

export default function ReplyForm({ parentId }: { parentId: number }) {
  const action = replyAction.bind(null, parentId);
  const [state, formAction] = useActionState(action, { ok: false });
  return (
    <form action={formAction} className="space-y-3 mt-6">
      <textarea
        name="content"
        required
        rows={6}
        className="w-full border border-border rounded p-3 text-sm"
        placeholder="답변 내용을 입력하세요"
      />
      {state && 'message' in state && !state.ok && (
        <p className="text-red-600 text-xs">{state.message as string}</p>
      )}
      {state.ok && <p className="text-green-700 text-xs">답글이 등록되었습니다.</p>}
      <Btn />
    </form>
  );
}
```

```tsx
// src/app/admin/inquiry/[id]/page.tsx
import { forbidden, notFound } from 'next/navigation';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { decryptPII } from '@/lib/inquiries/crypto';
import { isAdminRequest } from '@/lib/inquiries/admin';
import { getDB, getEnv } from '@/lib/inquiries/cf';
import ReplyForm from './ReplyForm';

export const dynamic = 'force-dynamic';

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminRequest())) forbidden();
  const { id } = await params;
  const inquiryId = Number(id);
  const repo = new InquiryRepository(getDB());
  const inquiry = await repo.findById(inquiryId);
  if (!inquiry) notFound();
  const env = getEnv();
  const phone = inquiry.phoneEnc ? await decryptPII(inquiry.phoneEnc, env.PII_KEY).catch(() => '(복호화 실패)') : '';
  const email = inquiry.emailEnc ? await decryptPII(inquiry.emailEnc, env.PII_KEY).catch(() => '(복호화 실패)') : '';
  const replies = await repo.findRepliesOf(inquiryId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">{inquiry.title}</h1>
      <p className="text-fg-muted text-sm mt-1">
        {inquiry.authorName} · {phone} · {email} · {inquiry.createdAt.slice(0, 16)}
      </p>
      <article className="whitespace-pre-wrap py-6 leading-relaxed border-t border-border mt-4">
        {inquiry.content}
      </article>

      {replies.length > 0 && (
        <section className="mt-6 space-y-3">
          <h2 className="text-lg font-bold">기존 답변</h2>
          {replies.map((r) => (
            <div key={r.id} className="bg-surface p-4 rounded border border-border whitespace-pre-wrap">
              {r.content}
            </div>
          ))}
        </section>
      )}

      <ReplyForm parentId={inquiryId} />

      <form action={`/admin/inquiry/${inquiryId}/delete`} method="POST" className="mt-10 pt-6 border-t border-border">
        <button type="submit" className="border border-red-500 text-red-500 px-4 py-2 rounded text-sm">
          이 글 삭제
        </button>
      </form>
    </main>
  );
}
```

- [ ] **Step 3: Admin delete route**

```ts
// src/app/admin/inquiry/[id]/delete/route.ts
import { type NextRequest } from 'next/server';
import { adminDeleteAction } from '../actions';

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await adminDeleteAction(Number(id));
  return new Response(null, { status: 303, headers: { Location: '/admin/inquiry' } });
}
```

- [ ] **Step 4: 빌드 + 커밋**

```bash
pnpm tsc --noEmit
git add src/app/admin
git commit -m "feat(inquiry): add admin list, detail, reply, and delete routes"
```

---

## Phase 6 — 만료 글 자동 삭제 (Cron)

### Task 19: Cron handler

**Files:**
- Create: `src/lib/inquiries/cron.ts`
- Modify: `open-next.config.ts` (cron handler 등록)

OpenNext Cloudflare 어댑터의 cron 등록 방식 확인 필요. 간단한 우회: Cloudflare Workers의 별도 worker를 만들지 말고, Next.js의 route handler에 secret 기반 GET을 두고 Cloudflare Cron Trigger가 호출하게 한다.

- [ ] **Step 1: Cron route handler**

```ts
// src/app/api/cron/expire/route.ts
import { type NextRequest } from 'next/server';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { getDB, getEnv } from '@/lib/inquiries/cf';

export async function POST(req: NextRequest) {
  const env = getEnv();
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return new Response('forbidden', { status: 403 });
  }
  const repo = new InquiryRepository(getDB());
  const removed = await repo.deleteExpired(new Date());
  return Response.json({ removed });
}
```

- [ ] **Step 2: wrangler.toml에 CRON_SECRET 환경변수 추가 (Secret로)**

`.dev.vars.example`에 추가:

```
CRON_SECRET=replace-with-random-32-char-string
```

`wrangler.toml`의 `[triggers]`는 그대로 두고, Cron이 호출할 fetch는 별도 Worker에서 작성한다 — 또는 Cloudflare Schedules의 HTTP 호출 기능을 사용한다.

> **간단한 대안 (Phase 8 운영 단계)**: Cloudflare Workers Cron Trigger 대신, **Cloudflare Workers 워커**를 별도로 두지 않고 외부 Cron(예: cron-job.org 무료)을 사용한다. 이는 Phase 8 운영 체크리스트에 명시.

- [ ] **Step 3: 빌드 + 커밋**

```bash
pnpm tsc --noEmit
git add src/app/api/cron/expire/route.ts .dev.vars.example
git commit -m "feat(inquiry): add scheduled deletion endpoint for expired inquiries"
```

---

## Phase 7 — 부가 작업

### Task 20: 개인정보처리방침 페이지

**Files:**
- Create: `src/app/privacy/page.tsx`

- [ ] **Step 1: 페이지 작성**

```tsx
// src/app/privacy/page.tsx
export const metadata = { title: '개인정보처리방침 | 한라산출장바베큐' };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-6">개인정보처리방침</h1>
      <p className="mb-6">
        한라산출장바베큐(이하 “회사”)는 「개인정보보호법」을 준수하여 다음과 같이 개인정보를 처리합니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">1. 수집하는 개인정보 항목</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>예약 문의 시: 고객명, 연락처, 이메일, 문의내용</li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-2">2. 수집·이용 목적</h2>
      <p className="mb-4">예약 상담 및 답변 응대 목적으로만 사용합니다.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">3. 보유 및 이용기간</h2>
      <p className="mb-4">상담 완료 후 1년간 보관 후 자동 파기됩니다.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">4. 제3자 제공</h2>
      <p className="mb-4">
        회사는 수집한 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의거한 경우는 예외입니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">5. 보호조치</h2>
      <p className="mb-4">
        전화번호와 이메일은 AES-256 암호화하여 저장합니다. 비밀번호는 PBKDF2 해시로 저장합니다.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">6. 정보주체 권리</h2>
      <p className="mb-4">본인 글 작성 시 입력한 비밀번호로 직접 수정·삭제하실 수 있습니다.</p>

      <h2 className="text-lg font-bold mt-6 mb-2">7. 문의처</h2>
      <p>이메일: ohnamsoo3822@naver.com</p>
    </main>
  );
}
```

- [ ] **Step 2: 작성 폼에서 `/privacy` 링크 추가** — Task 12의 `InquiryForm.tsx`에서 개인정보 동의 fieldset 텍스트에 다음을 추가:

```diff
<p className="mb-2">수집 항목: 고객명, 연락처, 이메일 / 목적: 상담·답변 / 보유기간: 1년</p>
+<p className="mb-2"><a href="/privacy" target="_blank" className="text-brand underline">자세히 보기</a></p>
```

- [ ] **Step 3: 커밋**

```bash
git add src/app/privacy src/app/inquiry/new/InquiryForm.tsx
git commit -m "feat(privacy): add privacy policy page and link from inquiry form"
```

---

### Task 21: middleware → proxy 마이그레이션

**Files:**
- Create: `src/proxy.ts`
- Delete: `src/middleware.ts`

- [ ] **Step 1: 코드모드로 마이그레이션 (옵션)**

```bash
npx @next/codemod@canary middleware-to-proxy .
```

또는 수동으로:

- [ ] **Step 2: `src/proxy.ts` 작성**

```ts
// src/proxy.ts
import { NextResponse, type NextRequest } from 'next/server';
import { buildCanonical } from '@/lib/seo/canonical';

export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const canonical = buildCanonical(req.nextUrl.pathname);
  res.headers.set('Link', `<${canonical}>; rel="canonical"`);
  return res;
}

export const config = { matcher: ['/((?!_next|api|.*\\..*).*)'] };
```

- [ ] **Step 3: 기존 middleware.ts 삭제**

```bash
rm src/middleware.ts
```

- [ ] **Step 4: 빌드 + 커밋**

```bash
pnpm tsc --noEmit
git add src/proxy.ts
git rm src/middleware.ts
git commit -m "refactor: rename middleware to proxy for Next.js 16 compatibility"
```

---

## Phase 8 — 검증 및 배포 준비

### Task 22: 통합 빌드 확인

- [ ] **Step 1: 모든 테스트 실행**

```bash
pnpm test
```

기대: 모든 단위 테스트 통과.

- [ ] **Step 2: 타입 체크**

```bash
pnpm tsc --noEmit
```

기대: 에러 없음.

- [ ] **Step 3: ESLint**

```bash
pnpm lint
```

기대: 에러 없음(경고는 허용).

- [ ] **Step 4: 프로덕션 빌드**

```bash
pnpm build
```

기대: Next.js 빌드 성공.

- [ ] **Step 5: OpenNext 빌드**

```bash
pnpm preview
```

기대: 로컬에서 `wrangler pages dev`가 시작되고 `http://localhost:8788`에서 사이트가 뜬다.

---

### Task 23: 로컬 E2E 스모크 테스트

- [ ] **Step 1: 로컬 D1에 시드 데이터 없이 빈 상태로 시작**

```bash
pnpm db:generate
```

- [ ] **Step 2: 로컬에서 다음 시나리오 수동 검증**

`pnpm preview` 띄운 상태에서 브라우저로 검증:

1. `/inquiry` → 빈 목록 + "글쓰기" 버튼 노출
2. `/inquiry/new` → 폼 노출, Turnstile 위젯 표시
3. 폼 작성 후 등록 → `/inquiry/{id}?created=1` 리다이렉트
4. `/inquiry` → 새 글 노출, 작성자명·날짜 정상
5. 비밀글로 등록 → 다른 시크릿 창에서 열면 비번 프롬프트
6. 올바른 비번 입력 → 본문 노출, 쿠키 발급
7. 잘못된 비번 5회 시도 → 잠금 메시지
8. 본인 인증 후 수정/삭제 동작
9. 헤더 "예약 문의" 클릭 → `/inquiry` 이동

- [ ] **Step 3: 발견된 버그가 있으면 수정 후 커밋**

---

### Task 24: 운영 시크릿 생성 및 등록 (수동, 사용자가 수행)

**작성자(사용자)가 직접 수행하는 단계.** 본 plan에서는 절차만 제공한다.

- [ ] **Step 1: PII_KEY 생성**

```bash
node -e "console.log(crypto.randomBytes(32).toString('base64'))"
```

복사해두기.

- [ ] **Step 2: SESSION_SECRET 생성** (위와 동일 방법)

- [ ] **Step 3: CRON_SECRET 생성**

```bash
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

- [ ] **Step 4: Cloudflare Pages 프로젝트 생성**

Cloudflare 대시보드 → Workers & Pages → Create → Pages → Connect to Git (또는 직접 업로드).

- [ ] **Step 5: Secret 등록 (Pages 프로젝트 설정)**

```bash
pnpm wrangler pages secret put PII_KEY --project-name=hanlasan-bbq
pnpm wrangler pages secret put SESSION_SECRET --project-name=hanlasan-bbq
pnpm wrangler pages secret put RESEND_API_KEY --project-name=hanlasan-bbq
pnpm wrangler pages secret put TURNSTILE_SECRET --project-name=hanlasan-bbq
pnpm wrangler pages secret put CRON_SECRET --project-name=hanlasan-bbq
```

(각 명령 실행 시 위에서 생성한 값 입력)

- [ ] **Step 6: D1 원격 마이그레이션**

```bash
pnpm db:generate:remote
```

- [ ] **Step 7: 첫 배포**

```bash
pnpm deploy
```

---

### Task 25: 도메인·DNS·이메일 인증 설정 (수동)

**모두 사용자가 대시보드에서 수행.** 코드 작업 없음.

- [ ] **Step 1: 가비아 → Cloudflare DNS 이전**

1. Cloudflare 대시보드 → Add a Site → `한라산출장바베큐.kr` 입력 (Punycode 자동 변환됨)
2. Free 플랜 선택
3. 안내된 네임서버 2개 복사 (예: `arnold.ns.cloudflare.com`)
4. 가비아 콘솔 → 도메인 관리 → 네임서버 변경 → 위 2개 입력 + 저장
5. 같은 절차로 `출장바베큐.kr`도 추가

전파에 수십 분~24시간 소요. Cloudflare 대시보드에서 활성화 확인.

- [ ] **Step 2: Cloudflare Pages에 커스텀 도메인 연결**

Pages 프로젝트 → Custom Domains → `한라산출장바베큐.kr` 추가. 자동 SSL.
`출장바베큐.kr`은 Cloudflare DNS 페이지에서 `한라산출장바베큐.kr`으로 301 리디렉트 룰 추가 (Bulk Redirects 또는 Workers).

- [ ] **Step 3: Resend 도메인 인증**

1. Resend.com 가입
2. Domains → Add Domain → `한라산출장바베큐.kr`
3. 안내된 SPF, DKIM, DMARC, verification TXT 레코드 4개를 Cloudflare DNS에 추가
4. Resend에서 Verify → 모두 ✓ 확인
5. Resend API Key 발급 → 위 Task 24의 `RESEND_API_KEY` 시크릿에 등록

- [ ] **Step 4: Turnstile 위젯 등록**

1. Cloudflare 대시보드 → Turnstile → Add site → `한라산출장바베큐.kr` 입력
2. Site Key, Secret Key 발급
3. Site Key는 `wrangler.toml`의 `[vars] TURNSTILE_SITE_KEY` 값으로 설정 후 재배포
4. Secret Key는 `TURNSTILE_SECRET` 시크릿으로 등록

- [ ] **Step 5: Cloudflare Access 정책 생성**

1. Zero Trust 대시보드 → Access → Applications → Add → Self-hosted
2. Application name: "Hanlasan BBQ Admin"
3. Application domain: `한라산출장바베큐.kr/admin/*`
4. Identity provider: One-time PIN (이메일 OTP)
5. Policy: Allow if email is in `ohnamsoo3822@naver.com,ohb4199@gmail.com`
6. Application AUD 값을 `ACCESS_AUD` 환경변수로 등록 (`wrangler pages secret put ACCESS_AUD`)
7. Team Domain (`yourteam.cloudflareaccess.com`)을 `ACCESS_TEAM_DOMAIN` 환경변수로 등록

- [ ] **Step 6: Cron Trigger 외부 호출 설정**

옵션 A — cron-job.org 등 무료 외부 서비스:
- URL: `https://한라산출장바베큐.kr/api/cron/expire`
- Method: POST
- Header: `Authorization: Bearer <CRON_SECRET 값>`
- Schedule: `0 18 * * *` (UTC) — 한국시간 03:00

옵션 B — Cloudflare Workers Cron으로 직접 호출:
별도 Worker(`crons-trigger.ts`)를 만들고 `scheduled()` 핸들러에서 같은 URL을 fetch.

---

### Task 26: 운영 검증

- [ ] **Step 1: 실제 도메인에서 종단 검증**

`https://한라산출장바베큐.kr/inquiry` 에서 다음을 확인:
1. 글 작성 → 등록 성공
2. `ohnamsoo3822@naver.com`, `ohb4199@gmail.com` 둘 다 알림 메일 수신
3. 수신 메일 내 어드민 링크 클릭 → Cloudflare Access OTP 화면
4. 이메일로 OTP 받아 입력 → 어드민 페이지 진입
5. 답글 작성 → 손님 페이지에서 답글 노출 확인
6. 비밀글, 본인 수정·삭제 흐름 재확인
7. cron-job.org에서 1회 수동 트리거 → 응답 200, `{ removed: 0 }`

- [ ] **Step 2: 발견된 운영 이슈 메모**

`docs/launch-checklist.md` 또는 새 issue 파일에 기록.

- [ ] **Step 3: 최종 커밋 (필요 시) 후 작업 완료 표시**

```bash
git add docs/launch-checklist.md
git commit -m "docs: add inquiry board launch checklist"
```

---

## 작업 완료 정의 (DoD)

다음을 모두 만족하면 본 MVP가 완료된 것으로 간주한다:

- ✅ `pnpm test`, `pnpm tsc --noEmit`, `pnpm lint`, `pnpm build` 모두 통과
- ✅ `https://한라산출장바베큐.kr/inquiry` 에서 글 작성·목록·상세·비밀글 비번 검증·본인 수정·삭제 모두 작동
- ✅ 새 문의 시 두 이메일에 알림 도달 (스팸함 아님)
- ✅ 사장님이 Cloudflare Access OTP로 어드민 진입하여 답글 작성 가능
- ✅ Turnstile이 작성 폼에 노출되고 검증 통과
- ✅ Cron이 1년 만료 글 삭제 (수동 트리거로 검증)
- ✅ 헤더에 "예약 문의" 메뉴 노출
- ✅ `/privacy` 페이지 노출 및 폼에서 링크
- ✅ middleware → proxy 마이그레이션 완료

---

## 향후 작업 (별도 plan)

- 첨부파일 업로드 (Cloudflare R2)
- 관리자 답글 시 손님에게 이메일 알림 (PII 복호화 후 발송)
- 카카오 알림톡
- 검색·카테고리 필터
- 자동 스팸 필터 학습
