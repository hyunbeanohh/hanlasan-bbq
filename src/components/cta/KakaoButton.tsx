'use client';
import { CONTACT } from '@/lib/constants';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';

type Variant = 'primary' | 'ghost' | 'pill' | 'dark-on-brand' | 'kakao';

interface KakaoButtonProps {
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-hover active:bg-brand-hover',
  ghost:
    'bg-transparent text-brand border border-brand hover:bg-brand hover:text-white active:bg-brand-hover active:text-white',
  pill:
    'bg-brand text-white hover:bg-brand-hover active:bg-brand-hover text-sm px-4',
  'dark-on-brand':
    'bg-white/15 text-white border border-white/30 hover:bg-white/25 active:bg-white/30',
  kakao:
    'bg-[#FEE500] text-[#181600] hover:bg-[#FADA0A] active:bg-[#FADA0A]',
};

export default function KakaoButton({ variant = 'kakao', className = '', children }: KakaoButtonProps) {
  if (!CONTACT.kakaoChannelUrl) return null;

  function onClick() {
    trackNaverEvent({ event: 'kakao_click', ...getUtm() });
  }

  return (
    <a
      href={CONTACT.kakaoChannelUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label="카카오톡 1:1 문의"
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold',
        'h-12 px-6 md:h-14 md:px-8',
        'transition-colors duration-150',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 3C6.48 3 2 6.58 2 11c0 2.78 1.78 5.23 4.47 6.67-.2.71-.74 2.62-.85 3.03 0 0-.01.11.06.15.07.04.16.01.16.01.22-.03 2.46-1.61 3.43-2.31.9.13 1.81.2 2.73.2 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
      </svg>
      {children ?? '카카오톡 문의'}
    </a>
  );
}
