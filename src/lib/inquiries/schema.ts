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
