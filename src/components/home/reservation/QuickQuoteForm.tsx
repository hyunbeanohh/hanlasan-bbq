'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import TurnstileWidget from '@/components/inquiry/TurnstileWidget';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';
import DatePickerField from './DatePickerField';
import { QUICK_QUOTE_MENUS, QUICK_QUOTE_MEALS } from '@/lib/quick-quote/constants';
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
      {pending ? '전송 중…' : '이 구성으로 견적 요청하기 →'}
    </button>
  );
}

interface Props {
  siteKey: string;
}

export default function QuickQuoteForm({ siteKey }: Props) {
  const [state, formAction] = useActionState(createQuickQuoteAction, INITIAL);
  const [token, setToken] = useState('');
  const [menus, setMenus] = useState<string[]>([]);
  const [meal, setMeal] = useState('');

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
      aria-label="빠른 견적 요청"
      className="bg-white text-neutral-900 rounded-xl p-5 shadow-md flex flex-col gap-3"
    >
      <div className="mb-1">
        <p className="text-xs font-bold tracking-wider text-brand mb-2">빠른 견적 요청</p>
        <p className="text-xl font-bold tracking-tight mb-1">우리 행사에 맞는 견적 받기</p>
        <p className="text-xs text-neutral-500">원하는 메뉴와 행사 정보를 알려주세요.</p>
      </div>

      <fieldset className="min-w-0">
        <legend className="text-sm font-bold mb-2">
          어떤 바베큐를 원하시나요?
          <span className="block text-xs font-normal text-neutral-500 mt-1">필수 · 여러 개 선택 가능</span>
        </legend>
        <div className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-2">
          {QUICK_QUOTE_MENUS.map((menu, index) => (
            <label key={menu} className="flex items-center gap-2 min-h-12 rounded-lg border border-neutral-200 px-3 py-3 text-xs font-semibold cursor-pointer has-checked:border-brand has-checked:bg-orange-50 has-focus-visible:ring-2 has-focus-visible:ring-brand">
              <input
                type="checkbox"
                name="menus"
                value={menu}
                checked={menus.includes(menu)}
                required={index === 0 && menus.length === 0}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setMenus((current) => QUICK_QUOTE_MENUS.filter((item) => item === menu ? checked : current.includes(item)));
                }}
                aria-invalid={!!state.fieldErrors?.menus}
                aria-describedby={state.fieldErrors?.menus ? 'quote-menus-error' : undefined}
                className="size-4 shrink-0 accent-brand"
              />
              <span>{menu}</span>
            </label>
          ))}
        </div>
        {state.fieldErrors?.menus && <p id="quote-menus-error" role="alert" className="text-red-600 text-xs mt-1">{state.fieldErrors.menus[0]}</p>}
      </fieldset>

      <fieldset className="min-w-0 mt-1">
        <legend className="text-sm font-bold mb-2">
          식사도 함께 준비해 드릴까요?
          <span className="block text-xs font-normal text-neutral-500 mt-1">필수 · 하나 선택</span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_QUOTE_MEALS.map((option, index) => (
            <label key={option} className="flex items-center gap-2 min-h-12 rounded-lg border border-neutral-200 px-3 py-3 text-sm font-semibold cursor-pointer has-checked:border-brand has-checked:bg-orange-50 has-focus-visible:ring-2 has-focus-visible:ring-brand">
              <input type="radio" name="meal" value={option} required checked={meal === option} onChange={() => setMeal(option)} className="size-4 shrink-0 accent-brand" aria-describedby={state.fieldErrors?.meal ? 'quote-meal-error' : undefined} />
              {index === 0 ? '네, 식사 포함' : '아니요, 미포함'}
            </label>
          ))}
        </div>
        {state.fieldErrors?.meal && <p id="quote-meal-error" role="alert" className="text-red-600 text-xs mt-1">{state.fieldErrors.meal[0]}</p>}
      </fieldset>

      <div className="grid grid-cols-2 gap-2.5 border-t border-neutral-200 pt-4 mt-1">
        <Field
          label="인원"
          name="headcount"
          type="number"
          inputMode="numeric"
          placeholder="10"
          min={1}
          max={1000}
          error={state.fieldErrors?.headcount}
          required
        />
        <DatePickerField
          label="희망 날짜"
          name="eventDate"
          error={state.fieldErrors?.eventDate}
          required
        />
      </div>

      <Field
        label="출장 장소"
        name="location"
        placeholder="예) 서울 강남구 역삼동"
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

      <Field
        label="이메일 (선택)"
        name="email"
        type="email"
        placeholder="example@naver.com"
        error={state.fieldErrors?.email}
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

      <div className="rounded-lg bg-neutral-50 px-3 py-2.5 text-xs leading-relaxed" aria-live="polite">
        <p className="font-bold mb-1">선택한 구성</p>
        <p className="text-neutral-600">{menus.length ? menus.join(' + ') : '메뉴 미선택'} · {meal || '식사 유무 미선택'}</p>
      </div>
      <SubmitButton />
      <p className="text-xs text-center text-neutral-500">메뉴·인원·장소 확인 후 견적을 안내해 드립니다.</p>
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
        className="w-full bg-neutral-50 border border-neutral-200 rounded-md h-10 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:m-0"
      />
      {error && <p className="text-red-600 text-[11px] mt-1">{error[0]}</p>}
    </div>
  );
}
