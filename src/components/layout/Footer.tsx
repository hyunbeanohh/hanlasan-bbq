import Link from 'next/link';
import { SITE, CONTACT, NAVER } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-warm-100 text-ink-soft text-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Column 1: 회사 소개 */}
          <div>
            <p className="text-ink font-bold text-base mb-4">회사 소개</p>
            <ul className="space-y-2">
              <li>사업자명: {SITE.name}</li>
              <li>사업자번호: {CONTACT.businessNumber}</li>
              <li>주소: {CONTACT.address}</li>
              <li>영업시간: {CONTACT.businessHours}</li>
            </ul>
          </div>

          {/* Column 2: 콘텐츠 */}
          <div>
            <p className="text-ink font-bold text-base mb-4">콘텐츠</p>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="hover:text-brand transition-colors">
                  메뉴
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-brand transition-colors">
                  갤러리
                </Link>
              </li>
              <li>
                <Link href="/company" className="hover:text-brand transition-colors">
                  회사소개
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: 소셜 미디어 */}
          <div>
            <p className="text-ink font-bold text-base mb-4">소셜 미디어</p>
            <ul className="space-y-2">
              <li>
                <a
                  href={NAVER.blogHomeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-brand transition-colors"
                >
                  네이버 블로그
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
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
              </li>
              <li className="text-muted">Instagram (준비중)</li>
              <li className="text-muted">YouTube (준비중)</li>
            </ul>
          </div>

          {/* Column 4: 한라산 출장바베큐 contact */}
          <div>
            <p className="text-ink font-bold text-base mb-4">한라산 출장바베큐</p>
            <ul className="space-y-2">
              <li>
                전화:{' '}
                <a
                  href={CONTACT.phoneTel}
                  className="hover:text-brand transition-colors font-medium"
                  aria-label={`전화 연결: ${CONTACT.phone}`}
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                이메일:{' '}
                <a
                  href={CONTACT.mailtoHref}
                  className="hover:text-brand transition-colors break-all"
                  aria-label={`이메일: ${CONTACT.email}`}
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="pt-2">
                <a
                  href={CONTACT.phoneTel}
                  className="inline-flex items-center justify-center bg-brand text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-brand-dark transition-colors"
                >
                  전화 문의
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom row */}
        <div className="border-t border-warm-200 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-muted text-xs">
            © {year} {SITE.name}. All rights reserved. 사업자번호: {CONTACT.businessNumber}
          </p>
          <nav className="flex gap-4 text-muted text-xs" aria-label="푸터 링크">
            <Link href="/" className="hover:text-ink transition-colors">메인</Link>
            <Link href="/company" className="hover:text-ink transition-colors">회사소개</Link>
            <Link href="/menu" className="hover:text-ink transition-colors">메뉴</Link>
            <Link href="/gallery" className="hover:text-ink transition-colors">갤러리</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
