'use client';

import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import 'react-day-picker/style.css';

interface Props {
  name: string;
  label: string;
  required?: boolean;
  error?: string[];
  /** true면 날짜를 비우고 선택을 막는다 ('아직 미정') */
  disabled?: boolean;
  /** 제출 실패 후 다시 채울 값 (YYYY-MM-DD) */
  defaultValue?: string;
}

function parseYMD(s?: string): Date | undefined {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined;
  const d = new Date(s + 'T00:00:00');
  return isNaN(d.getTime()) ? undefined : d;
}

function formatYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function DatePickerField({
  name,
  label,
  required,
  error,
  disabled,
  defaultValue,
}: Props) {
  const [date, setDate] = useState<Date | undefined>(() => parseYMD(defaultValue));
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label htmlFor={name} className="block text-[11px] font-bold text-neutral-500 mb-1">
          {label}
        </label>
      )}
      <button
        id={name}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="w-full bg-neutral-50 border border-neutral-200 rounded-md h-10 px-3 text-sm text-left focus:outline-none focus:border-brand flex items-center justify-between gap-2 disabled:opacity-50"
      >
        <span className={date && !disabled ? 'text-neutral-900' : 'text-neutral-500'}>
          {disabled ? '날짜 미정' : date ? formatYMD(date) : '날짜 고르기'}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className="text-neutral-500"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>
      <input
        type="hidden"
        name={name}
        value={date && !disabled ? formatYMD(date) : ''}
        required={required && !disabled}
      />
      {open && !disabled && (
        <div
          role="dialog"
          aria-label="날짜 선택"
          className="absolute z-50 mt-1 bg-white border border-neutral-200 rounded-lg shadow-xl p-2 left-0"
        >
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              if (d) setOpen(false);
            }}
            disabled={{ before: today }}
            locale={ko}
            weekStartsOn={0}
            classNames={{
              today: 'rdp-today text-brand',
              selected: 'rdp-selected bg-brand! text-white! rounded-full',
            }}
          />
        </div>
      )}
      {error && <p className="text-red-600 text-[11px] mt-1">{error[0]}</p>}
    </div>
  );
}
