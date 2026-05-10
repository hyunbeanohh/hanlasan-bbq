import Link from 'next/link';
import { SITE, CONTACT, NAVER } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream/80 text-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p className="text-brand font-bold text-lg mb-2">{SITE.name}</p>
            <p className="text-cream/60 leading-relaxed">{SITE.description}</p>
          </div>

          {/* Business info */}
          <div className="space-y-2">
            <p className="text-cream font-semibold mb-3">사업자 정보</p>
            <p>사업자등록번호: {CONTACT.businessNumber}</p>
            <p>주소: {CONTACT.address}</p>
            <p>영업시간: {CONTACT.businessHours}</p>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <p className="text-cream font-semibold mb-3">연락처</p>
            <p>
              전화:{' '}
              <a
                href={CONTACT.phoneTel}
                className="hover:text-brand transition-colors"
                aria-label={`전화 연결: ${CONTACT.phone}`}
              >
                {CONTACT.phone}
              </a>
            </p>
            <p>
              이메일:{' '}
              <a
                href={CONTACT.mailtoHref}
                className="hover:text-brand transition-colors break-all"
                aria-label={`이메일: ${CONTACT.email}`}
              >
                {CONTACT.email}
              </a>
            </p>
            <p>
              <a
                href={NAVER.blogHomeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-brand transition-colors"
              >
                네이버 블로그
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-cream/40">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <nav className="flex gap-4 text-cream/40" aria-label="푸터 링크">
            <Link href="/" className="hover:text-cream/70 transition-colors">메인</Link>
            <Link href="/company" className="hover:text-cream/70 transition-colors">회사소개</Link>
            <Link href="/menu" className="hover:text-cream/70 transition-colors">메뉴</Link>
            <Link href="/gallery" className="hover:text-cream/70 transition-colors">갤러리</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
