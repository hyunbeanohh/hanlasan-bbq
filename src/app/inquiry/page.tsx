import QuickQuoteForm from '@/components/home/reservation/QuickQuoteForm';
import { getEnv } from '@/lib/inquiries/cf';
import { CONTACT } from '@/lib/constants';
import Link from 'next/link';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { getDB } from '@/lib/inquiries/cf';
import Pagination from '@/components/inquiry/Pagination';
import { QUICK_QUOTE_AUTHOR, QUICK_QUOTE_DISPLAY_AUTHOR } from '@/lib/quick-quote/constants';

export const metadata = { title: '예약 문의' };
export const dynamic = 'force-dynamic';

const PER_PAGE = 10;

export default async function InquiryListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; menu?: string }>;
}) {
  const { page: pageParam, menu } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? '1') || 1);
  const repo = new InquiryRepository(getDB());
  const { items, total } = await repo.listPaginated(page, PER_PAGE);

  // 부모 글에만 번호 매김. 페이지 첫 부모 = total - (page-1)*PER_PAGE
  let runningParentIndex = 0;

  return (
    <div className="site-width pb-16">
      <header className="page-heading">
        <h1>행사에 맞는 견적을 받아보세요</h1>
        <p>메뉴와 식사 여부를 고르고, 행사 정보를 알려주세요.</p>
      </header>
      <section id="quote" className="quote-layout scroll-mt-28" aria-label="견적 상담">
        <QuickQuoteForm
          key={menu ?? 'new'}
          siteKey={getEnv().TURNSTILE_SITE_KEY ?? ''}
          initialMenu={menu}
        />
        <aside className="py-5">
          <h2 className="mb-5 text-xl font-bold">전화로 편하게 상담하세요</h2>
          <a href={CONTACT.phoneTel} className="text-3xl font-bold tracking-tight">
            {CONTACT.phone}
          </a>
          <p className="text-fg-muted mt-2">{CONTACT.businessHours}</p>
          <div className="border-border text-fg-soft mt-8 space-y-4 border-t pt-6">
            <p>기본 30명 이상부터 가능합니다. 적은 인원도 메뉴와 구성에 따라 상담해 주세요.</p>
            <p>행사 최소 1주일 전 예약해 주세요.</p>
            <p>전국 출장 가능 여부는 인원과 메뉴를 고려해 안내합니다.</p>
          </div>
        </aside>
      </section>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">문의 내역</h2>
        <Link
          href="/inquiry/new"
          className="bg-brand rounded-full px-4 py-2 text-sm font-semibold text-white"
        >
          일반 문의 작성
        </Link>
      </div>

      <table className="inquiry-table w-full border-collapse text-sm">
        <thead>
          <tr className="border-border text-fg-muted border-b">
            <th className="w-16 py-3 text-left">번호</th>
            <th className="py-3 text-left">제목</th>
            <th className="w-32 py-3 text-left">작성자</th>
            <th className="w-32 py-3 text-left">작성일</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="text-fg-muted py-10 text-center">
                아직 등록된 문의가 없습니다.
              </td>
            </tr>
          )}
          {items.map((item) => {
            const isReply = item.parentId !== null;
            const isQuickQuote = item.authorName === QUICK_QUOTE_AUTHOR;
            let displayNumber: number | string = '';
            if (!isReply) {
              const number = total - (page - 1) * PER_PAGE - runningParentIndex;
              runningParentIndex++;
              displayNumber = number;
            }
            return (
              <tr key={item.id} className="border-border border-b">
                <td className="text-fg-muted py-3">{displayNumber}</td>
                <td className="py-3">
                  {isReply ? (
                    <span className="text-fg-muted pl-6">↳ {item.title.replace(/^(?:\s*↳\s*)+/, '')}</span>
                  ) : isQuickQuote ? (
                    <span>
                      {item.title}
                      {item.isSecret && (
                        <span className="ml-1" aria-label="비밀글">
                          비공개
                        </span>
                      )}
                    </span>
                  ) : (
                    <Link href={`/inquiry/${item.id}`} className="hover:text-brand">
                      {item.title}
                      {item.isSecret && (
                        <span className="ml-1" aria-label="비밀글">
                          비공개
                        </span>
                      )}
                    </Link>
                  )}
                </td>
                <td className="text-fg-muted py-3">
                  {item.isAdmin
                    ? '관리자'
                    : isQuickQuote
                      ? QUICK_QUOTE_DISPLAY_AUTHOR
                      : item.authorName}
                </td>
                <td className="text-fg-muted py-3">{item.createdAt.slice(0, 10)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination current={page} total={total} perPage={PER_PAGE} basePath="/inquiry" />
    </div>
  );
}
