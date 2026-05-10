import { CONTACT } from '@/lib/constants';

type Variant = 'primary' | 'ghost' | 'pill';

interface SmsButtonProps {
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

export default function SmsButton({ variant = 'ghost', className = '', children }: SmsButtonProps) {
  return (
    <a
      href={CONTACT.smsHref}
      aria-label={`문자 보내기: ${CONTACT.phone}`}
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
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {children ?? '문자 보내기'}
    </a>
  );
}
