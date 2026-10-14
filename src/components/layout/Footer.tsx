import Link from 'next/link';
import { SITE, CONTACT, NAVER } from '@/lib/constants';
export default function Footer() {
  return (
    <footer className="bg-surface-2 border-border mt-8 border-t">
      <div className="site-width py-12">
        <div className="grid gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="mb-5 text-xl font-bold">한라산 출장 바베큐</p>
            <nav aria-label="하단 메뉴" className="mb-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {[
                ['/company', '회사소개'],
                ['/menu', '출장 바베큐 메뉴'],
                ['/banquet', '잔치 메뉴'],
                ['/gallery', '행사 기록'],
                ['/inquiry', '예약문의'],
                ['/privacy', '개인정보처리방침'],
              ].map(([href, label]) => (
                <Link href={href} key={href} className="hover:text-brand">
                  {label}
                </Link>
              ))}
            </nav>
            <div className="text-fg-muted space-y-2 text-sm">
              <p>사업자등록번호 {CONTACT.businessNumber}</p>
              <a className="block" href={CONTACT.mailtoHref}>
                {CONTACT.email}
              </a>
              <a
                className="inline-block underline underline-offset-4"
                href={NAVER.blogHomeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                네이버 블로그 ↗
              </a>
            </div>
          </div>
          <div>
            <p className="text-fg-soft mb-2 text-sm">출장 바베큐 상담</p>
            <a href={CONTACT.phoneTel} className="text-3xl font-bold">
              {CONTACT.phone}
            </a>
            <p className="text-fg-muted mt-2 text-sm">{CONTACT.businessHours}</p>
          </div>
        </div>
        <p className="text-fg-muted border-border mt-8 border-t pt-5 text-xs">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
