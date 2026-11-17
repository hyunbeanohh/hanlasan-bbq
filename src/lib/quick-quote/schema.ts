import { z } from 'zod';
import { QUICK_QUOTE_MENUS, QUICK_QUOTE_MEALS } from './constants';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

/** 01012345678, 010 1234 5678, 010-1234-5678 등을 010-1234-5678 형태로 맞춘다. */
export function normalizePhone(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  const digits = value.replace(/\D/g, '');
  if (!/^01[016789]\d{7,8}$/.test(digits)) return value.trim();
  return digits.length === 10
    ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
    : `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export const quickQuoteSchema = z.object({
  menus: z
    .array(z.enum(QUICK_QUOTE_MENUS, { error: '메뉴를 확인해주세요' }))
    .min(1, '바베큐 메뉴를 하나 이상 선택해주세요')
    .max(3)
    .transform((menus) => [...new Set(menus)]),
  meal: z.enum(QUICK_QUOTE_MEALS, { error: '식사 포함 여부를 선택해주세요' }),
  headcount: z.coerce.number().int().min(1, '인원은 1명 이상').max(1000, '인원은 1000명 이하'),
  /** 빈 문자열이면 '날짜 미정' */
  eventDate: z
    .literal('')
    .or(
      z
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
    )
    .default(''),
  /** 선택. 시/군 정도의 지역 */
  location: z.string().trim().max(80, '지역은 80자 이하로 입력해주세요').default(''),
  phone: z.preprocess(
    normalizePhone,
    z.string().regex(/^01[016789]-\d{3,4}-\d{4}$/, '휴대폰 번호를 확인해주세요 (예: 01012345678)'),
  ),
  email: z
    .literal('')
    .or(z.string().email('올바른 이메일 주소를 입력해주세요').max(120))
    .default(''),
  privacyConsent: z.literal('on', { error: '개인정보 동의가 필요합니다' }),
  turnstileToken: z.string().min(1, '자동가입방지 검증이 필요합니다'),
});

export type QuickQuoteInput = z.infer<typeof quickQuoteSchema>;
