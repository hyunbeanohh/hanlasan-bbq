import { forbidden, notFound } from 'next/navigation';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { decryptPII } from '@/lib/inquiries/crypto';
import { isAdminRequest } from '@/lib/inquiries/admin';
import { getDB, getEnv } from '@/lib/inquiries/cf';
import ReplyForm from './ReplyForm';

export const dynamic = 'force-dynamic';

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminRequest())) forbidden();
  const { id } = await params;
  const inquiryId = Number(id);
  const repo = new InquiryRepository(getDB());
  const inquiry = await repo.findById(inquiryId);
  if (!inquiry) notFound();
  const env = getEnv();
  const phone = inquiry.phoneEnc
    ? await decryptPII(inquiry.phoneEnc, env.PII_KEY).catch(() => '(복호화 실패)')
    : '';
  const email = inquiry.emailEnc
    ? await decryptPII(inquiry.emailEnc, env.PII_KEY).catch(() => '(복호화 실패)')
    : '';
  const replies = await repo.findRepliesOf(inquiryId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">{inquiry.title}</h1>
      <p className="text-fg-muted text-sm mt-1">
        {inquiry.authorName} · {phone} · {email} · {inquiry.createdAt.slice(0, 16)}
      </p>
      <article className="whitespace-pre-wrap py-6 leading-relaxed border-t border-border mt-4">
        {inquiry.content}
      </article>

      {replies.length > 0 && (
        <section className="mt-6 space-y-3">
          <h2 className="text-lg font-bold">기존 답변</h2>
          {replies.map((r) => (
            <div
              key={r.id}
              className="bg-surface p-4 rounded border border-border whitespace-pre-wrap"
            >
              {r.content}
            </div>
          ))}
        </section>
      )}

      <ReplyForm parentId={inquiryId} />

      <form
        action={`/admin/inquiry/${inquiryId}/delete`}
        method="POST"
        className="mt-10 pt-6 border-t border-border"
      >
        <button type="submit" className="border border-red-500 text-red-500 px-4 py-2 rounded text-sm">
          이 글 삭제
        </button>
      </form>
    </main>
  );
}
