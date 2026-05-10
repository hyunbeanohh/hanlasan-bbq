import Link from 'next/link';
import { SITE, CONTACT, NAVER } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="bg-bg border-t border-border text-fg-muted text-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

            {/* Column 1: 출장바베큐 상담 */}
            <div>
              <p className="text-fg font-bold text-base mb-4">출장바베큐 상담</p>
              <ul className="space-y-2">
                <li>
                  Tel:{' '}
                  <a
                    href={CONTACT.phoneTel}
                    className="hover:text-brand transition-colors font-medium"
                    aria-label={`전화 연결: ${CONTACT.phone}`}
                  >
                    {CONTACT.phone}
                  </a>
                </li>
                <li>사업자번호: {CONTACT.businessNumber}</li>
                <li>영업: {CONTACT.businessHours}</li>
              </ul>
            </div>

            {/* Column 2: 회사소개 */}
            <div>
              <p className="text-fg font-bold text-base mb-4">회사소개</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/company" className="hover:text-brand transition-colors">
                    회사소개
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="hover:text-brand transition-colors">
                    메뉴소개
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="hover:text-brand transition-colors">
                    예약문의
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: 행사 */}
            <div>
              <p className="text-fg font-bold text-base mb-4">행사</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/menu" className="hover:text-brand transition-colors">
                    메뉴소개
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-brand transition-colors">
                    행사갤러리
                  </Link>
                </li>
                <li>
                  <Link href="/#contact" className="hover:text-brand transition-colors">
                    예약문의
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: 상담 문의 */}
            <div>
              <p className="text-fg font-bold text-base mb-4">상담 문의</p>
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
                <li>
                  <a
                    href={CONTACT.mailtoHref}
                    className="hover:text-brand transition-colors break-all"
                  >
                    {CONTACT.email}
                  </a>
                </li>
                <li className="text-fg-muted">카카오톡 상담 (준비중)</li>
              </ul>
            </div>

          </div>

          {/* Bottom row */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="text-fg-muted text-xs">
              © {year} {SITE.name}. All rights reserved. 사업자번호: {CONTACT.businessNumber}
            </p>
            <nav className="flex gap-4 text-fg-muted text-xs" aria-label="푸터 링크">
              <Link href="/" className="hover:text-fg transition-colors">메인</Link>
              <Link href="/company" className="hover:text-fg transition-colors">회사소개</Link>
              <Link href="/menu" className="hover:text-fg transition-colors">메뉴</Link>
              <Link href="/gallery" className="hover:text-fg transition-colors">갤러리</Link>
            </nav>
          </div>
        </div>
      </footer>

      {/* Kakao floating button */}
      <div className="fixed bottom-20 right-4 z-40 md:bottom-6">
        <span
          className="inline-flex items-center gap-1.5 bg-[#fee500] text-[#3a1d1d] text-xs font-bold px-4 py-2.5 rounded-full shadow-lg cursor-default select-none"
          aria-label="카카오톡 상담 (준비중)"
          title="카카오톡 상담 — 준비중"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 3C6.477 3 2 6.806 2 11.5c0 2.998 1.776 5.644 4.462 7.264L5.5 22l4.09-2.116C10.28 20.086 11.127 20.2 12 20.2c5.523 0 10-3.806 10-8.5S17.523 3 12 3z" />
          </svg>
          카카오톡 상담
        </span>
      </div>
    </>
  );
}
