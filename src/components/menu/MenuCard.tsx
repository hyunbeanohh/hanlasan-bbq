import type { MenuItem } from '@/types';
import { CATEGORY_LABELS } from '@/data/menu';
import { CONTACT } from '@/lib/constants';

const CATEGORY_EMOJIS: Record<string, string> = {
  signature: '🥩',
  beef: '🥩',
  pork: '🔥',
  side: '🌿',
};

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  return (
    <article className="rounded-xl overflow-hidden bg-white border border-warm-100 hover:shadow-lg transition-shadow flex flex-col md:flex-row">
      {/* Photo placeholder */}
      <div className="md:w-48 lg:w-56 aspect-[4/3] md:aspect-auto bg-gradient-to-br from-warm-200 via-warm-100 to-warm-50 flex flex-col items-center justify-center gap-2 shrink-0">
        <span className="text-5xl" aria-hidden="true">
          {CATEGORY_EMOJIS[item.categoryId] ?? '🔥'}
        </span>
        <p className="text-muted text-xs">사진 준비중</p>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block text-xs font-semibold text-brand bg-brand-soft px-2.5 py-0.5 rounded-full">
              {CATEGORY_LABELS[item.categoryId] ?? item.categoryId}
            </span>
          </div>
          <h3 className="font-bold text-ink text-xl mb-2 leading-snug">{item.name}</h3>
          <p className="text-muted text-sm leading-relaxed mb-4">{item.description}</p>

          {/* Price chip */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-block text-sm font-semibold text-brand bg-brand-soft border border-brand/20 px-3 py-1 rounded-full">
              {item.priceText}
            </span>
          </div>
        </div>

        {/* CTA */}
        <a
          href={CONTACT.phoneTel}
          className="self-start inline-flex items-center gap-1.5 bg-brand text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-brand-dark transition-colors"
          aria-label={`${item.name} — 전화 문의`}
        >
          전화 문의
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
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
        </a>
      </div>
    </article>
  );
}
