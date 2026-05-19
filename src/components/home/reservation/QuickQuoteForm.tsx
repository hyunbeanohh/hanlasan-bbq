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
          <span className="text-2xl text-emerald-600 leading-none" aria-hidden="true">
            ✓
          </span>
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
      <p className="text-xs font-bold tracking-wider uppercase text-brand">빠른 견적 요청 (1분)</p>

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
        <input type="checkbox" name="privacyConsent" value="on" required className="mt-0.5" />
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
