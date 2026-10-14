'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/company', label: '회사소개' },
  { href: '/menu', label: '출장 바베큐 메뉴' },
  { href: '/banquet', label: '잔치 메뉴' },
  { href: '/gallery', label: '행사 기록' },
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
        'bg-bg/85 border-border sticky top-0 z-50 border-b backdrop-blur-md',
        'transition-transform duration-300 ease-in-out will-change-transform',
        showHeader ? 'translate-y-0' : '-translate-y-full',
      ].join(' ')}
    >
      <div className="site-width">
        <div className="flex min-h-24 items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-fg hover:text-brand flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight transition-colors"
          >
            <Image
              src="/images/logo.png"
              alt=""
              width={36}
              height={36}
              priority
              className="h-9 w-9 object-contain"
            />
            <span>
              한라산 출장 바베큐
              <span className="text-fg-muted mt-1 block text-[11px] font-normal sm:text-xs">
                대표 직접 조리 · 기업 행사 · 동문회 · 가족 모임 · 전국 출장 상담
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="주요 메뉴">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={[
                  'hover:text-brand text-sm font-medium transition-colors duration-150',
                  pathname === link.href ? 'text-brand' : 'text-fg-soft',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="text-fg-soft hover:bg-surface-3 rounded-lg p-2 transition-colors lg:hidden"
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
        <div className="border-border bg-surface border-t lg:hidden">
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
                className="bg-brand hover:bg-brand-hover block w-full rounded-full px-6 py-2.5 text-center text-sm font-semibold text-white transition-colors"
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
