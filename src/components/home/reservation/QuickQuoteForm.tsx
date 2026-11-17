'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
import { trackGoogleConversion, trackQuoteEvent } from '@/lib/analytics/google';
import { useFormStatus } from 'react-dom';
import TurnstileWidget from '@/components/inquiry/TurnstileWidget';
import { trackNaverConversion, trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';
import DatePickerField from './DatePickerField';
import { QUICK_QUOTE_MENUS, QUICK_QUOTE_MEALS } from '@/lib/quick-quote/constants';
import { CONTACT } from '@/lib/constants';
import { createQuickQuoteAction, type QuickQuoteFormState } from './quick-quote-action';

const INITIAL: QuickQuoteFormState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand mt-1 h-12 rounded-lg text-[0.98rem] font-bold text-white disabled:opacity-50"
    >
      {pending ? '전송 중…' : '견적 요청하기'}
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
  const [dateMissing, setDateMissing] = useState(false);
  const reportedSuccess = useRef(false);
  const [verifyFailed, setVerifyFailed] = useState(false);
  // 보안 확인 토큰이 오기 전에 제출을 누른 경우, 토큰이 오면 자동으로 다시 제출한다.
  const [waitingToken, setWaitingToken] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const v = state.values ?? {};

  useEffect(() => {
    if (!waitingToken) return;
    if (token) {
      setWaitingToken(false);
      formRef.current?.requestSubmit();
      return;
    }
    // 15초 안에 보안 확인이 끝나지 않으면 전화·문자 안내로 넘긴다.
    const timer = setTimeout(() => {
      setWaitingToken(false);
      setVerifyFailed(true);
      trackQuoteEvent('quote_submit_error', 'verify');
    }, 15000);
    return () => clearTimeout(timer);
  }, [waitingToken, token]);

  useEffect(() => {
    if (state.ok && !reportedSuccess.current) {
      reportedSuccess.current = true;
      trackGoogleConversion('generate_lead');
      trackNaverEvent({ event: 'quick_quote_success', ...getUtm() });
      trackNaverConversion('lead');
    }
  }, [state.ok]);

  // 서버에서 막힌 경우 이유를 기록한다 (입력 오류 칸 이름, 보안 확인, 한도).
  useEffect(() => {
    if (!state.ok && state.errorReason) {
      trackQuoteEvent(
        'quote_submit_error',
        state.errorReason,
        state.fieldErrors ? Object.keys(state.fieldErrors).join(',') : undefined,
      );
    }
  }, [state]);

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
      ref={formRef}
      action={formAction}
      onSubmit={(event) => {
        const form = event.currentTarget;
        // 날짜 칸은 버튼(id)과 숨은 입력(name)이 같은 이름이라 FormData로 실제 값을 읽는다.
        const dateValue = new FormData(form).get('eventDate');
        if (!dateValue) {
          event.preventDefault();
          setDateMissing(true);
          trackQuoteEvent('quote_submit_error', 'field', 'eventDate');
          return;
        }
        setDateMissing(false);
        if (siteKey && !token && !verifyFailed) {
          // 보안 확인이 아직 끝나지 않았다. 토큰이 오면 위 effect가 다시 제출한다.
          event.preventDefault();
          setWaitingToken(true);
          return;
        }
        trackQuoteEvent('quote_submit');
        trackNaverEvent({ event: 'quick_quote_submit', ...getUtm() });
      }}
      onInvalidCapture={(event) => {
        // 브라우저 기본 검사(필수 칸 비움 등)에 걸린 경우도 기록한다. 칸 이름만 보낸다.
        const name = (event.target as HTMLInputElement).name;
        trackQuoteEvent('quote_submit_error', 'field', name || undefined);
      }}
      aria-label="빠른 견적 요청"
      className="border-border flex flex-col gap-3 rounded-xl border bg-white p-5 text-neutral-900 sm:p-8"
    >
      <div className="mb-1">
        <p className="mb-1 text-xl font-bold tracking-tight">우리 행사에 맞는 견적 받기</p>
        <p className="text-xs text-neutral-500">
          메뉴, 인원, 날짜, 지역을 알려주시면 확인 후 연락드립니다.
        </p>
      </div>

      <ContactAlternatives />

      <fieldset className="min-w-0">
        <legend className="mb-2 flex w-full justify-between text-sm font-bold">
          <span>어떤 바베큐를 원하시나요?</span>
          <span className="text-brand text-xs font-semibold">필수, 여러 개 선택 가능</span>
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
        <legend className="mb-2 flex w-full justify-between text-sm font-bold">
          <span>식사도 함께 준비해 드릴까요?</span>
          <span className="text-brand text-xs font-semibold">필수</span>
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

      <div className="mt-1 grid grid-cols-2 gap-2.5 border-t border-neutral-200 pt-4">
        <Field
          label="인원"
          name="headcount"
          type="number"
          inputMode="numeric"
          placeholder="예) 40"
          min={1}
          max={1000}
          defaultValue={v.headcount}
          error={state.fieldErrors?.headcount}
          required
        />
        <Field
          label="연락처"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01012345678"
          defaultValue={v.phone}
          error={state.fieldErrors?.phone}
          required
        />
      </div>

      <div>
        <div className="mb-1 flex justify-between text-sm font-semibold text-neutral-600">
          <span>희망 날짜</span>
          <span className="text-brand text-xs">필수</span>
        </div>
        <DatePickerField
          label=""
          name="eventDate"
          required
          defaultValue={v.eventDate}
          error={
            state.fieldErrors?.eventDate ?? (dateMissing ? ['희망 날짜를 골라주세요'] : undefined)
          }
        />
      </div>

      <Field
        label="지역"
        name="location"
        placeholder="예) 경기 안산, 대부도"
        defaultValue={v.location}
        error={state.fieldErrors?.location}
        required
      />

      <Field
        label="이메일"
        name="email"
        type="email"
        placeholder="example@naver.com"
        defaultValue={v.email}
        error={state.fieldErrors?.email}
      />

      <label className="mt-1 flex items-start gap-2 text-xs text-neutral-600">
        <input type="checkbox" name="privacyConsent" value="on" required className="mt-0.5" />
        <span>
          개인정보 수집·이용 동의 (필수){' '}
          <a href="/privacy" target="_blank" className="text-brand underline">
            개인정보처리방침 보기
          </a>
        </span>
      </label>
      {state.fieldErrors?.privacyConsent && (
        <p className="text-xs text-red-600">{state.fieldErrors.privacyConsent[0]}</p>
      )}

      <input type="hidden" name="turnstileToken" value={token} />
      <TurnstileWidget
        siteKey={siteKey}
        lazy
        onToken={(value) => {
          setToken(value);
          if (value) setVerifyFailed(false);
        }}
        onError={() => {
          setWaitingToken(false);
          setVerifyFailed(true);
          trackQuoteEvent('quote_submit_error', 'verify');
        }}
      />
      {waitingToken && !verifyFailed && (
        <p className="text-sm text-neutral-600" aria-live="polite">
          보안 확인 중입니다. 끝나면 자동으로 접수됩니다.
        </p>
      )}
      {verifyFailed && (
        <ContactAlternatives message="보안 확인이 원활하지 않습니다. 전화나 문자로 바로 문의해 주세요." />
      )}

      {state.message && !state.ok && (
        <p className="text-sm text-red-600" aria-live="polite">
          {state.message}
        </p>
      )}
      {state.message && !state.ok && !state.fieldErrors && !verifyFailed && (
        <ContactAlternatives message="접수가 어려우면 전화나 문자로 바로 문의해 주세요." />
      )}

      <SubmitButton />
      <p className="text-center text-xs text-neutral-500">
        메뉴와 인원을 확인한 후 견적을 안내해 드립니다.
      </p>
    </form>
  );
}

function ContactAlternatives({ message }: { message?: string }) {
  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-3">
      <p className="mb-2 text-sm font-semibold text-neutral-800">
        {message ?? '전화나 문자가 더 편하신가요? 바로 상담해 드립니다.'}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <a
          href={CONTACT.phoneTel}
          className="bg-brand flex min-h-11 flex-col items-center justify-center rounded-lg px-3 py-1.5 text-sm font-bold text-white"
        >
          <span>전화 상담</span>
          <span className="text-xs font-semibold whitespace-nowrap opacity-90">
            {CONTACT.phone}
          </span>
        </a>
        <a
          href={CONTACT.smsHref}
          className="border-brand text-brand flex min-h-11 items-center justify-center rounded-lg border bg-white px-3 text-sm font-bold"
        >
          문자로 문의하기
        </a>
      </div>
    </div>
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
  defaultValue,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string[];
  inputMode?: 'numeric' | 'text' | 'tel';
  min?: number;
  max?: number;
  defaultValue?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 flex justify-between text-sm font-semibold text-neutral-600"
      >
        <span>{label}</span>
        <span className={required ? 'text-brand text-xs' : 'text-xs font-normal text-neutral-400'}>
          {required ? '필수' : '선택'}
        </span>
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
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className="focus:border-brand h-10 w-full [appearance:textfield] rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
      />
      {error && <p className="mt-1 text-[11px] text-red-600">{error[0]}</p>}
    </div>
  );
}
