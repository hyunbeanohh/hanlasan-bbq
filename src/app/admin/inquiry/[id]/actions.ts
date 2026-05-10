'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { replySchema } from '@/lib/inquiries/schema';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { isAdminRequest } from '@/lib/inquiries/admin';
import { encryptPII } from '@/lib/inquiries/crypto';
import { getDB, getEnv } from '@/lib/inquiries/cf';

export interface ReplyState {
  ok: boolean;
  message?: string;
}

export async function replyAction(
  parentId: number,
  _prev: ReplyState,
  formData: FormData,
): Promise<ReplyState> {
  if (!(await isAdminRequest())) return { ok: false, message: 'unauthorized' };
  const parsed = replySchema.safeParse({ content: formData.get('content') });
  if (!parsed.success) return { ok: false, message: '내용을 입력해주세요.' };

  const env = getEnv();
  const repo = new InquiryRepository(getDB());
  const parent = await repo.findById(parentId);
  if (!parent) return { ok: false, message: '원글이 없습니다.' };

  const empty = await encryptPII('', env.PII_KEY);
  await repo.createReply({
    parentId,
    authorName: '관리자',
    phoneEnc: empty,
    emailEnc: empty,
    title: `↳ Re: ${parent.title}`,
    content: parsed.data.content,
  });
  revalidatePath('/inquiry');
  revalidatePath(`/inquiry/${parentId}`);
  revalidatePath(`/admin/inquiry/${parentId}`);
  return { ok: true };
}

export async function adminDeleteAction(inquiryId: number): Promise<void> {
  if (!(await isAdminRequest())) throw new Error('unauthorized');
  const repo = new InquiryRepository(getDB());
  await repo.delete(inquiryId);
  redirect('/admin/inquiry');
}
