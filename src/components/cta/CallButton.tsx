'use client';
import { CONTACT } from '@/lib/constants';
import { trackNaverEvent } from '@/lib/analytics/naver';
import { getUtm } from '@/lib/analytics/utm';

type Variant = 'primary' | 'ghost' | 'pill';

interface CallButtonProps {
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-dark active:bg-brand-dark',
  ghost:
    'bg-transparent text-brand border border-brand hover:bg-brand hover:text-white active:bg-brand-dark active:text-white',
  pill:
    'bg-brand text-white hover:bg-brand-dark active:bg-brand-dark text-sm px-4',
};

export default function CallButton({ variant = 'primary', className = '', children }: CallButtonProps) {
  function onClick() {
    trackNaverEvent({ event: 'phone_click', ...getUtm() });
  }

  return (
    <a
      href={CONTACT.phoneTel}
      onClick={onClick}
      aria-label={`전화 연결: ${CONTACT.phone}`}
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
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
      {children ?? `전화 ${CONTACT.phone}`}
    </a>
  );
}
