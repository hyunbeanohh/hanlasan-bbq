import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { isAdminRequest } from '@/lib/inquiries/admin';
import { verifyToken, COOKIE_NAME } from '@/lib/inquiries/session';
import { getDB, getEnv } from '@/lib/inquiries/cf';
import PasswordPrompt from './PasswordPrompt';

export const dynamic = 'force-dynamic';

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiryId = Number(id);
  if (!Number.isInteger(inquiryId)) notFound();

  const repo = new InquiryRepository(getDB());
  const inquiry = await repo.findById(inquiryId);
  if (!inquiry || inquiry.isAdmin) notFound();

  const isAdmin = await isAdminRequest();

  // Determine owner status by checking the per-inquiry HMAC cookie
  let isOwner = false;
  const cookieRaw = (await cookies()).get(COOKIE_NAME(inquiryId))?.value;
  if (cookieRaw && !isAdmin) {
    const payload = await verifyToken(cookieRaw, getEnv().SESSION_SECRET);
    if (payload?.inquiryId === inquiryId) isOwner = true;
  }

  // If secret and not authorized, gate the page behind PasswordPrompt
  if (inquiry.isSecret && !isAdmin && !isOwner) {
    return (
      <main className="mx-auto max-w-6xl px-4">
        <PasswordPrompt inquiryId={inquiryId} />
      </main>
    );
  }

  const replies = await repo.findRepliesOf(inquiryId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="border-b border-border pb-4 mb-4">
        <h1 className="text-2xl font-bold">{inquiry.title}</h1>
        <p className="text-fg-muted text-sm mt-1">
          {inquiry.authorName} · {inquiry.createdAt.slice(0, 16)}
          {inquiry.isSecret && ' · 🔒 비밀글'}
        </p>
      </div>

      <article className="whitespace-pre-wrap py-6 leading-relaxed">{inquiry.content}</article>

      {(isOwner || isAdmin) && (
        <div className="flex gap-2 py-4 border-t border-border">
          <Link
            href={`/inquiry/${inquiry.id}/edit`}
            className="border border-border px-4 py-2 rounded text-sm"
          >
            수정
          </Link>
          <form action={`/inquiry/${inquiry.id}/edit/delete`} method="POST">
            <button
              type="submit"
              className="border border-red-500 text-red-500 px-4 py-2 rounded text-sm"
            >
              삭제
            </button>
          </form>
        </div>
      )}

      {replies.length > 0 && (
        <section className="mt-10 space-y-4">
          <h2 className="text-lg font-bold">답변</h2>
          {replies.map((r) => (
            <div key={r.id} className="bg-surface p-4 rounded border border-border">
              <p className="text-fg-muted text-sm mb-2">관리자 · {r.createdAt.slice(0, 16)}</p>
              <article className="whitespace-pre-wrap leading-relaxed">{r.content}</article>
            </div>
          ))}
        </section>
      )}

      <div className="pt-8">
        <Link href="/inquiry" className="text-sm text-fg-muted hover:text-brand">
          ← 목록으로
        </Link>
      </div>
    </main>
  );
}
