'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE, CONTACT } from '@/lib/constants';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';

const NAV_LINKS = [
  { href: '/company', label: '회사소개' },
  { href: '/menu', label: '메뉴' },
  { href: '/gallery', label: '갤러리' },
  { href: '/', label: '메인' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  function handleCTAClick() {
    trackNaverEvent({ event: 'phone_click', ...getUtm() });
  }

  return (
    <header className="bg-zinc-950/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-white/10 shadow-2xl">
      <nav className="flex justify-between items-center px-6 md:px-12 py-5 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-white uppercase"
          style={{ fontFamily: 'var(--font-headline)' }}
        >
          {SITE.name}
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center" aria-label="주요 메뉴">
          {NAV_LINKS.slice(0, 3).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={[
                'text-sm font-bold uppercase tracking-widest transition-colors duration-150',
                pathname === link.href
                  ? 'text-[#f95e14] border-b-2 border-[#f95e14] pb-1'
                  : 'text-white/70 hover:text-white',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href={CONTACT.phoneTel}
          onClick={handleCTAClick}
          aria-label={`전화 문의: ${CONTACT.phone}`}
          className="hidden md:inline-flex items-center gap-2 bg-[#f95e14] text-white px-8 py-3 font-bold uppercase tracking-widest hover:scale-105 transition-transform duration-300 hover:shadow-[0_0_15px_rgba(230,81,0,0.3)]"
        >
          지금 문의
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-white hover:text-[#f95e14] transition-colors"
          aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
              width="24"
              height="24"
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
      </nav>

      {/* Mobile menu sheet */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-zinc-950">
          <nav className="flex flex-col py-2" aria-label="모바일 메뉴">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
                className={[
                  'px-6 py-4 text-sm font-bold uppercase tracking-widest transition-colors duration-150',
                  pathname === link.href
                    ? 'text-[#f95e14]'
                    : 'text-white/70 hover:text-white',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={CONTACT.phoneTel}
              onClick={handleCTAClick}
              aria-label={`전화 문의: ${CONTACT.phone}`}
              className="mx-6 my-3 flex items-center justify-center gap-2 bg-[#f95e14] text-white px-8 py-3 font-bold uppercase tracking-widest"
            >
              지금 문의
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
