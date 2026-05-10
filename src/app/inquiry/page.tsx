import Link from 'next/link';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { getDB } from '@/lib/inquiries/cf';
import Pagination from '@/components/inquiry/Pagination';

export const metadata = { title: '예약 문의 | 한라산출장바베큐' };
export const dynamic = 'force-dynamic';

const PER_PAGE = 10;

export default async function InquiryListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? '1') || 1);
  const repo = new InquiryRepository(getDB());
  const { items, total } = await repo.listPaginated(page, PER_PAGE);

  // 부모 글에만 번호 매김. 페이지 첫 부모 = total - (page-1)*PER_PAGE
  let runningParentIndex = 0;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">예약 문의</h1>
        <Link
          href="/inquiry/new"
          className="bg-brand text-white px-4 py-2 rounded-full text-sm font-semibold"
        >
          글쓰기
        </Link>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-fg-muted">
            <th className="py-3 text-left w-16">번호</th>
            <th className="py-3 text-left">제목</th>
            <th className="py-3 text-left w-32">작성자</th>
            <th className="py-3 text-left w-32">작성일</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="py-10 text-center text-fg-muted">
                아직 등록된 문의가 없습니다.
              </td>
            </tr>
          )}
          {items.map((item) => {
            const isReply = item.parentId !== null;
            let displayNumber: number | string = '';
            if (!isReply) {
              const number = total - (page - 1) * PER_PAGE - runningParentIndex;
              runningParentIndex++;
              displayNumber = number;
            }
            return (
              <tr key={item.id} className="border-b border-border">
                <td className="py-3 text-fg-muted">{displayNumber}</td>
                <td className="py-3">
                  {isReply ? (
                    <span className="pl-6 text-fg-muted">↳ {item.title}</span>
                  ) : (
                    <Link href={`/inquiry/${item.id}`} className="hover:text-brand">
                      {item.title}
                      {item.isSecret && <span className="ml-1" aria-label="비밀글">🔒</span>}
                    </Link>
                  )}
                </td>
                <td className="py-3 text-fg-muted">{item.isAdmin ? '관리자' : item.authorName}</td>
                <td className="py-3 text-fg-muted">{item.createdAt.slice(0, 10)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination current={page} total={total} perPage={PER_PAGE} basePath="/inquiry" />
    </main>
  );
}
