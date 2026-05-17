'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CONTACT } from '@/lib/constants';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';

const NAV_LINKS = [
  { href: '/company', label: '회사소개' },
  { href: '/menu', label: '메뉴소개' },
  { href: '/gallery', label: '행사갤러리' },
  { href: '/inquiry', label: '예약 문의' },
];

const HIDE_THRESHOLD = 80;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let ticking = false;

    const update = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;

      if (current <= HIDE_THRESHOLD) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
      } else if (delta < -4) {
        setHidden(false);
      }

      lastScrollY.current = current;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showHeader = !hidden || mobileOpen;

  return (
    <header
      className={[
        'sticky top-0 z-50 bg-bg/85 backdrop-blur-md border-b border-border',
        'transition-transform duration-300 ease-in-out will-change-transform',
        showHeader ? 'translate-y-0' : '-translate-y-full',
      ].join(' ')}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center text-lg font-bold text-fg tracking-tight shrink-0 hover:text-brand transition-colors"
          >
            한라산 출장 바베큐
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="주요 메뉴">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={[
                  'text-sm font-medium transition-colors duration-150 hover:text-brand',
                  pathname === link.href
                    ? 'text-brand'
                    : 'text-fg-soft',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={CONTACT.phoneTel}
              onClick={() => trackNaverEvent({ event: 'phone_click', ...getUtm() })}
              aria-label={`전화 연결: ${CONTACT.phone}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg hover:text-brand transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="tabular-nums">{CONTACT.phone}</span>
            </a>
            {CONTACT.kakaoChannelUrl && (
              <a
                href={CONTACT.kakaoChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackNaverEvent({ event: 'kakao_click', ...getUtm() })}
                aria-label="카카오톡 1:1 문의"
                className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-[#FEE500] text-[#181600] hover:bg-[#FADA0A] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.78 1.78 5.23 4.47 6.67-.2.71-.74 2.62-.85 3.03 0 0-.01.11.06.15.07.04.16.01.16.01.22-.03 2.46-1.61 3.43-2.31.9.13 1.81.2 2.73.2 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
                </svg>
              </a>
            )}
            <Link
              href="/inquiry"
              className="inline-flex items-center justify-center bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-brand-hover active:bg-brand-hover transition-colors duration-150"
            >
              예약문의
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-fg-soft hover:bg-surface-3 transition-colors"
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
        <div className="md:hidden border-t border-border bg-surface">
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
                    ? 'text-brand bg-surface-3'
                    : 'text-fg-soft hover:text-brand hover:bg-surface-3',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-6 py-3">
              <Link
                href="/inquiry"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-brand text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-brand-hover transition-colors"
              >
                예약문의
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
