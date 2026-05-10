import { describe, it, expect } from 'vitest';
import { newInquirySchema, replySchema, editSchema } from '../schema';

describe('newInquirySchema', () => {
  const valid = {
    authorName: '홍길동',
    password: '1234',
    phone: '010-1234-5678',
    email: 'a@b.com',
    title: '문의드립니다',
    content: '내용입니다.',
    isSecret: 'on',
    privacyConsent: 'on',
    turnstileToken: 'xyz',
  };

  it('accepts valid input', () => {
    expect(newInquirySchema.safeParse(valid).success).toBe(true);
  });

  it('rejects empty author name', () => {
    expect(newInquirySchema.safeParse({ ...valid, authorName: '' }).success).toBe(false);
  });

  it('rejects too-short password', () => {
    expect(newInquirySchema.safeParse({ ...valid, password: '123' }).success).toBe(false);
  });

  it('rejects invalid phone format', () => {
    expect(newInquirySchema.safeParse({ ...valid, phone: 'abc' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(newInquirySchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });

  it('requires privacyConsent to be checked', () => {
    expect(newInquirySchema.safeParse({ ...valid, privacyConsent: undefined }).success).toBe(false);
  });

  it('requires title under 200 chars', () => {
    const long = 'a'.repeat(201);
    expect(newInquirySchema.safeParse({ ...valid, title: long }).success).toBe(false);
  });
});

describe('replySchema', () => {
  it('accepts content only', () => {
    expect(replySchema.safeParse({ content: '안녕하세요' }).success).toBe(true);
  });
  it('rejects empty content', () => {
    expect(replySchema.safeParse({ content: '' }).success).toBe(false);
  });
});

describe('editSchema', () => {
  it('accepts title and content', () => {
    expect(editSchema.safeParse({ title: 't', content: 'c' }).success).toBe(true);
  });
});
