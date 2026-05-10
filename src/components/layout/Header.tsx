'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CONTACT } from '@/lib/constants';

const NAV_LINKS = [
  { href: '/', label: '메인' },
  { href: '/company', label: '회사소개' },
  { href: '/menu', label: '메뉴' },
  { href: '/gallery', label: '갤러리' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-warm-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — space between 한라산 and 출장바베큐 matching Variant 2 */}
          <Link
            href="/"
            className="text-lg font-bold text-ink tracking-tight shrink-0 hover:text-brand transition-colors"
          >
            한라산 출장바베큐
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="주요 메뉴">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={[
                  'text-sm font-medium transition-colors duration-150',
                  pathname === link.href
                    ? 'text-brand'
                    : 'text-ink-soft hover:text-brand',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA — 예약하기 orange pill */}
          <div className="hidden md:flex items-center">
            <a
              href={CONTACT.phoneTel}
              className="inline-flex items-center justify-center bg-brand text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-brand-dark active:bg-brand-dark transition-colors duration-150"
            >
              예약하기
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-ink hover:bg-warm-100 transition-colors"
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu sheet */}
      {mobileOpen && (
        <div className="md:hidden border-t border-warm-100 bg-cream">
          <nav className="flex flex-col py-2" aria-label="모바일 메뉴">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
                className={[
                  'px-6 py-3 text-base font-medium transition-colors duration-150',
                  pathname === link.href
                    ? 'text-brand bg-warm-100'
                    : 'text-ink hover:text-brand hover:bg-warm-100',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-6 py-3">
              <a
                href={CONTACT.phoneTel}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-brand text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-brand-dark transition-colors"
              >
                예약하기
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
