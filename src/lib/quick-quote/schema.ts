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
