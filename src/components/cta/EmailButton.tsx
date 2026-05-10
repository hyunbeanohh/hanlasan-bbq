'use client';

import { CONTACT } from '@/lib/constants';

type Variant = 'primary' | 'ghost' | 'pill';

interface EmailButtonProps {
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

export default function EmailButton({ variant = 'ghost', className = '', children }: EmailButtonProps) {
  return (
    <a
      href={CONTACT.mailtoHref}
      aria-label={`이메일 문의: ${CONTACT.email}`}
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
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
      {children ?? '이메일 문의'}
    </a>
  );
}
