import Link from 'next/link';
import { SITE, CONTACT, NAVER } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 w-full py-20 px-6 md:px-12 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="space-y-6">
          <div
            className="text-xl font-black text-white uppercase tracking-tighter"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            {SITE.name}
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
            {SITE.description}
          </p>
          <div className="space-y-1 text-zinc-600 text-xs">
            <p>사업자등록번호: {CONTACT.businessNumber}</p>
            <p>영업시간: {CONTACT.businessHours}</p>
            <p>{CONTACT.address}</p>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">
              서비스
            </h4>
            <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-sm">
              메인
            </Link>
            <Link href="/company" className="text-zinc-500 hover:text-white transition-colors text-sm">
              회사소개
            </Link>
            <Link href="/menu" className="text-zinc-500 hover:text-white transition-colors text-sm">
              메뉴소개
            </Link>
            <Link href="/gallery" className="text-zinc-500 hover:text-white transition-colors text-sm">
              갤러리
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">
              연락처
            </h4>
            <a
              href={CONTACT.phoneTel}
              className="text-zinc-500 hover:text-white transition-colors text-sm"
              aria-label={`전화: ${CONTACT.phone}`}
            >
              {CONTACT.phone}
            </a>
            <a
              href={CONTACT.mailtoHref}
              className="text-zinc-500 hover:text-white transition-colors text-sm break-all"
              aria-label={`이메일: ${CONTACT.email}`}
            >
              {CONTACT.email}
            </a>
            <a
              href={NAVER.blogHomeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors text-sm inline-flex items-center gap-1"
            >
              네이버 블로그
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
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
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">
            출장 문의
          </h4>
          <p className="text-zinc-500 text-sm leading-relaxed">
            날짜·장소·인원을 알려주시면 빠르게 견적을 안내해 드립니다.
          </p>
          <a
            href={CONTACT.phoneTel}
            className="inline-flex items-center justify-center gap-2 bg-[#f95e14] text-white px-6 py-3 font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform duration-300 hover:shadow-[0_0_15px_rgba(230,81,0,0.3)] w-fit"
            aria-label={`전화 문의: ${CONTACT.phone}`}
          >
            지금 전화 문의
          </a>
          <a
            href={CONTACT.smsHref}
            className="text-zinc-500 hover:text-white transition-colors text-sm"
            aria-label={`문자 문의: ${CONTACT.phone}`}
          >
            문자로 문의하기 →
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-zinc-600 text-xs tracking-normal uppercase">
          © {year} {SITE.name}. All rights reserved.
        </p>
        <div className="flex gap-6 text-zinc-600 text-xs uppercase tracking-widest">
          <span>제주특별자치도</span>
          <span>HALLASAN BBQ</span>
        </div>
      </div>
    </footer>
  );
}
