'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
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
        <p className="mb-2">
          <a href="/privacy" target="_blank" className="text-brand underline">자세히 보기</a>
        </p>
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
        <Link href="/inquiry" className="border border-border px-6 py-2.5 rounded-full text-sm">취소</Link>
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
