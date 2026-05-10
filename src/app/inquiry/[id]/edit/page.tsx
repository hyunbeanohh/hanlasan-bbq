import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { verifyToken, COOKIE_NAME } from '@/lib/inquiries/session';
import { isAdminRequest } from '@/lib/inquiries/admin';
import { getDB, getEnv } from '@/lib/inquiries/cf';
import EditForm from './EditForm';

export const dynamic = 'force-dynamic';

export default async function EditInquiryPage({
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

  const admin = await isAdminRequest();
  let owner = false;
  if (!admin) {
    const cookie = (await cookies()).get(COOKIE_NAME(inquiryId))?.value;
    if (cookie) {
      const payload = await verifyToken(cookie, getEnv().SESSION_SECRET);
      if (payload?.inquiryId === inquiryId) owner = true;
    }
  }
  if (!admin && !owner) redirect(`/inquiry/${inquiryId}`);

  return (
    <main className="px-4 py-10">
      <h1 className="text-xl font-bold text-center">예약 문의 수정</h1>
      <EditForm
        inquiryId={inquiryId}
        initialTitle={inquiry.title}
        initialContent={inquiry.content}
      />
    </main>
  );
}
