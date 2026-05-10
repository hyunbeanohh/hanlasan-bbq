'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { editSchema } from '@/lib/inquiries/schema';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { verifyToken, COOKIE_NAME } from '@/lib/inquiries/session';
import { isAdminRequest } from '@/lib/inquiries/admin';
import { getDB, getEnv } from '@/lib/inquiries/cf';

export interface EditState {
  ok: boolean;
  message?: string;
}

async function authorize(inquiryId: number): Promise<'admin' | 'owner' | null> {
  if (await isAdminRequest()) return 'admin';
  const cookie = (await cookies()).get(COOKIE_NAME(inquiryId))?.value;
  if (!cookie) return null;
  const payload = await verifyToken(cookie, getEnv().SESSION_SECRET);
  return payload?.inquiryId === inquiryId ? 'owner' : null;
}

export async function updateInquiryAction(
  inquiryId: number,
  _prev: EditState,
  formData: FormData,
): Promise<EditState> {
  const auth = await authorize(inquiryId);
  if (!auth) return { ok: false, message: '권한이 없습니다.' };

  const parsed = editSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: '입력값을 확인해주세요.' };

  const repo = new InquiryRepository(getDB());
  const existing = await repo.findById(inquiryId);
  if (!existing || existing.isAdmin) return { ok: false, message: '글을 찾을 수 없습니다.' };

  await repo.update(inquiryId, parsed.data);
  redirect(`/inquiry/${inquiryId}`);
}

export async function deleteInquiryAction(inquiryId: number): Promise<void> {
  const auth = await authorize(inquiryId);
  if (!auth) throw new Error('unauthorized');

  const repo = new InquiryRepository(getDB());
  await repo.delete(inquiryId);
  redirect('/inquiry');
}
