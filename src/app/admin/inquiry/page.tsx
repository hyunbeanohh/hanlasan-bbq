import Link from 'next/link';
import { forbidden } from 'next/navigation';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { isAdminRequest } from '@/lib/inquiries/admin';
import { getDB } from '@/lib/inquiries/cf';

export const dynamic = 'force-dynamic';

const PER_PAGE = 30;

export default async function AdminInquiryListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  if (!(await isAdminRequest())) forbidden();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? '1') || 1);
  const repo = new InquiryRepository(getDB());
  const { items } = await repo.listPaginated(page, PER_PAGE);
  const parents = items.filter((i) => i.parentId === null);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">[관리자] 예약 문의</h1>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 text-left w-16">번호</th>
            <th className="py-2 text-left">제목</th>
            <th className="py-2 text-left w-32">작성자</th>
            <th className="py-2 text-left w-32">작성일</th>
            <th className="py-2 text-left w-20">답변</th>
          </tr>
        </thead>
        <tbody>
          {parents.map((p) => {
            const hasReply = items.some((i) => i.parentId === p.id);
            return (
              <tr key={p.id} className="border-b border-border">
                <td className="py-2">{p.id}</td>
                <td className="py-2">
                  <Link href={`/admin/inquiry/${p.id}`} className="hover:text-brand">
                    {p.title} {p.isSecret && '🔒'}
                  </Link>
                </td>
                <td className="py-2 text-fg-muted">{p.authorName}</td>
                <td className="py-2 text-fg-muted">{p.createdAt.slice(0, 10)}</td>
                <td className="py-2">{hasReply ? '✓' : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
