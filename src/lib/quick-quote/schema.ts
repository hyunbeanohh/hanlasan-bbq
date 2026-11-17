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

export const quickQuoteSchema = z
  .object({
    menus: z
      .array(z.enum(QUICK_QUOTE_MENUS, { error: '메뉴를 확인해주세요' }))
      .min(1, '바베큐 메뉴를 하나 이상 선택해주세요')
      .max(3)
      .transform((menus) => [...new Set(menus)]),
    meal: z.enum(QUICK_QUOTE_MEALS, { error: '식사 포함 여부를 선택해주세요' }),
    headcount: z.coerce.number().int().min(1, '인원은 1명 이상').max(1000, '인원은 1000명 이하'),
    /** 빈 문자열이면 '날짜 미정' (그때는 dateUndecided + eventPeriod 필수) */
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
    /** '아직 미정'을 고르면 'on' */
    dateUndecided: z.literal('on').optional(),
    /** 날짜 미정일 때 대략 시기 (예: 12월 중순) */
    eventPeriod: z.string().trim().max(40, '40자 이하로 입력해주세요').default(''),
    /** 필수. 시/군 정도의 지역 */
    location: z
      .string({ error: '지역을 입력해주세요 (예: 경기 안산)' })
      .trim()
      .min(2, '지역을 입력해주세요 (예: 경기 안산)')
      .max(80, '지역은 80자 이하로 입력해주세요'),
    phone: z.preprocess(
      normalizePhone,
      z
        .string()
        .regex(/^01[016789]-\d{3,4}-\d{4}$/, '휴대폰 번호를 확인해주세요 (예: 01012345678)'),
    ),
    email: z
      .literal('')
      .or(z.string().email('올바른 이메일 주소를 입력해주세요').max(120))
      .default(''),
    privacyConsent: z.literal('on', { error: '개인정보 동의가 필요합니다' }),
    turnstileToken: z.string().min(1, '자동가입방지 검증이 필요합니다'),
  })
  .superRefine((data, ctx) => {
    if (data.dateUndecided === 'on') {
      if (data.eventPeriod.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['eventPeriod'],
          message: '대략적인 시기를 적어주세요 (예: 12월 중순)',
        });
      }
    } else if (!data.eventDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['eventDate'],
        message: "희망 날짜를 고르거나 '아직 미정'을 선택해주세요",
      });
    }
  });

export type QuickQuoteInput = z.infer<typeof quickQuoteSchema>;
