'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import TurnstileWidget from '@/components/inquiry/TurnstileWidget';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';
import DatePickerField from './DatePickerField';
import { QUICK_QUOTE_MENUS, QUICK_QUOTE_MEALS } from '@/lib/quick-quote/constants';
import { createQuickQuoteAction, type QuickQuoteFormState } from './quick-quote-action';

const INITIAL: QuickQuoteFormState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={() => trackNaverEvent({ event: 'quick_quote_submit', ...getUtm() })}
      className="bg-brand mt-1 h-11 rounded-lg text-[0.98rem] font-bold text-white disabled:opacity-50"
    >
      {pending ? '전송 중…' : '이 구성으로 견적 요청하기 →'}
    </button>
  );
}

interface Props {
  siteKey: string;
  initialMenu?: string;
}

export default function QuickQuoteForm({ siteKey, initialMenu }: Props) {
  const [state, formAction] = useActionState(createQuickQuoteAction, INITIAL);
  const [token, setToken] = useState('');
  const [menus, setMenus] = useState<string[]>(
    initialMenu && QUICK_QUOTE_MENUS.some((menu) => menu === initialMenu) ? [initialMenu] : [],
  );
  const [meal, setMeal] = useState('');

  useEffect(() => {
    if (state.ok) {
      trackNaverEvent({ event: 'quick_quote_success', ...getUtm() });
    }
  }, [state.ok]);

  if (state.ok) {
    return (
      <div
        className="rounded-xl bg-white p-5 text-neutral-900 shadow-md"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none text-emerald-600" aria-hidden="true">
            ✓
          </span>
          <div>
            <p className="mb-1 font-bold text-emerald-900">견적 요청 접수 완료</p>
            <p className="text-sm leading-relaxed text-neutral-600">
              행사 정보를 확인한 후 010-7332-4199에서 연락드리겠습니다.
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
      className="border-border flex flex-col gap-3 rounded-xl border bg-white p-5 text-neutral-900 sm:p-8"
    >
      <div className="mb-1">
        <p className="text-brand mb-2 text-xs font-bold tracking-wider">빠른 견적 요청</p>
        <p className="mb-1 text-xl font-bold tracking-tight">우리 행사에 맞는 견적 받기</p>
        <p className="text-xs text-neutral-500">원하는 메뉴와 행사 정보를 알려주세요.</p>
      </div>

      <fieldset className="min-w-0">
        <legend className="mb-2 text-sm font-bold">
          어떤 바베큐를 원하시나요?
          <span className="mt-1 block text-xs font-normal text-neutral-500">
            필수 · 여러 개 선택 가능
          </span>
        </legend>
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
          {QUICK_QUOTE_MENUS.map((menu, index) => (
            <label
              key={menu}
              className="has-checked:border-brand has-focus-visible:ring-brand flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-3 text-sm font-semibold has-checked:bg-orange-50 has-focus-visible:ring-2"
            >
              <input
                type="checkbox"
                name="menus"
                value={menu}
                checked={menus.includes(menu)}
                required={index === 0 && menus.length === 0}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setMenus((current) =>
                    QUICK_QUOTE_MENUS.filter((item) =>
                      item === menu ? checked : current.includes(item),
                    ),
                  );
                }}
                aria-invalid={!!state.fieldErrors?.menus}
                aria-describedby={state.fieldErrors?.menus ? 'quote-menus-error' : undefined}
                className="accent-brand size-4 shrink-0"
              />
              <span>{menu}</span>
            </label>
          ))}
        </div>
        {state.fieldErrors?.menus && (
          <p id="quote-menus-error" role="alert" className="mt-1 text-xs text-red-600">
            {state.fieldErrors.menus[0]}
          </p>
        )}
      </fieldset>

      <fieldset className="mt-1 min-w-0">
        <legend className="mb-2 text-sm font-bold">
          식사도 함께 준비해 드릴까요?
          <span className="mt-1 block text-xs font-normal text-neutral-500">필수 · 하나 선택</span>
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_QUOTE_MEALS.map((option, index) => (
            <label
              key={option}
              className="has-checked:border-brand has-focus-visible:ring-brand flex min-h-12 cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 px-3 py-3 text-sm font-semibold has-checked:bg-orange-50 has-focus-visible:ring-2"
            >
              <input
                type="radio"
                name="meal"
                value={option}
                required
                checked={meal === option}
                onChange={() => setMeal(option)}
                className="accent-brand size-4 shrink-0"
                aria-describedby={state.fieldErrors?.meal ? 'quote-meal-error' : undefined}
              />
              {index === 0 ? '네, 식사 포함' : '아니요, 미포함'}
            </label>
          ))}
        </div>
        {state.fieldErrors?.meal && (
          <p id="quote-meal-error" role="alert" className="mt-1 text-xs text-red-600">
            {state.fieldErrors.meal[0]}
          </p>
        )}
      </fieldset>

      <fieldset
        disabled={!menus.length || !meal}
        className={menus.length > 0 && meal ? 'contents' : 'hidden'}
      >
        <div className="mt-1 grid grid-cols-2 gap-2.5 border-t border-neutral-200 pt-4">
          <Field
            label="인원"
            name="headcount"
            type="number"
            inputMode="numeric"
            placeholder="예) 30"
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

        <label className="mt-1 flex items-start gap-2 text-xs text-neutral-600">
          <input type="checkbox" name="privacyConsent" value="on" required className="mt-0.5" />
          <span>
            개인정보 수집·이용 동의 (필수){' '}
            <a href="/privacy" target="_blank" className="text-brand underline">
              자세히
            </a>
          </span>
        </label>
        {state.fieldErrors?.privacyConsent && (
          <p className="text-xs text-red-600">{state.fieldErrors.privacyConsent[0]}</p>
        )}
      </fieldset>
      {(!menus.length || !meal) && (
        <p className="text-fg-muted py-4 text-sm">
          메뉴와 식사 여부를 선택하면 행사 정보 입력란이 나타납니다.
        </p>
      )}
      <input type="hidden" name="turnstileToken" value={token} />
      <TurnstileWidget siteKey={siteKey} onToken={setToken} />

      {state.message && !state.ok && (
        <p className="text-sm text-red-600" aria-live="polite">
          {state.message}
        </p>
      )}

      <div
        className="rounded-lg bg-neutral-50 px-3 py-2.5 text-xs leading-relaxed"
        aria-live="polite"
      >
        <p className="mb-1 font-bold">선택한 구성</p>
        <p className="text-neutral-600">
          {menus.length ? menus.join(' + ') : '메뉴 미선택'} · {meal || '식사 유무 미선택'}
        </p>
      </div>
      {menus.length > 0 && meal && <SubmitButton />}
      <p className="text-center text-xs text-neutral-500">
        메뉴·인원·장소 확인 후 견적을 안내해 드립니다.
      </p>
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
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-neutral-500">
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
        className="focus:border-brand h-10 w-full [appearance:textfield] rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
      />
      {error && <p className="mt-1 text-[11px] text-red-600">{error[0]}</p>}
    </div>
  );
}
