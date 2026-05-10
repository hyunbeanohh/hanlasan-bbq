'use client';
import { CONTACT } from '@/lib/constants';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';

type Variant = 'primary' | 'ghost' | 'pill';

interface SmsButtonProps {
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[#f95e14] text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(230,81,0,0.3)]',
  ghost:
    'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black',
  pill:
    'bg-[#f95e14] text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(230,81,0,0.3)] text-sm px-4',
};

export default function SmsButton({ variant = 'ghost', className = '', children }: SmsButtonProps) {
  function onClick() {
    trackNaverEvent({ event: 'sms_click', ...getUtm() });
  }

  return (
    <a
      href={CONTACT.smsHref}
      onClick={onClick}
      aria-label={`문자 보내기: ${CONTACT.phone}`}
      className={[
        'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-widest',
        'h-12 px-8',
        'transition-all duration-300',
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
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {children ?? '문자 보내기'}
    </a>
  );
}
