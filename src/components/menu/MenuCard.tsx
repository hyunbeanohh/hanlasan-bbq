import Image from 'next/image';
import type { MenuItem } from '@/types';
import { CATEGORY_LABELS } from '@/data/menu';
import { CONTACT } from '@/lib/constants';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const hasPhoto = item.imageSrc && item.imageSrc.startsWith('http');

  return (
    <article className="rounded-2xl overflow-hidden bg-surface border border-border hover:border-border-strong transition-colors flex flex-col md:flex-row">
      {/* Photo */}
      <div className="md:w-52 lg:w-64 aspect-[4/3] md:aspect-auto relative shrink-0 bg-surface-3">
        {hasPhoto ? (
          <Image
            src={item.imageSrc}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 256px"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-3">
            <span className="text-5xl" aria-hidden="true">🔥</span>
            <p className="text-fg-muted text-xs">사진 준비중</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block text-xs font-semibold text-brand bg-brand-soft px-2.5 py-0.5 rounded-full border border-brand/20">
              {CATEGORY_LABELS[item.categoryId] ?? item.categoryId}
            </span>
          </div>
          <h3 className="font-bold text-fg text-xl mb-2 leading-snug">{item.name}</h3>
          <p className="text-fg-muted text-sm leading-relaxed mb-4">{item.description}</p>

          {/* Price chip */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-block text-sm font-semibold text-brand bg-brand-soft border border-brand/20 px-3 py-1 rounded-full">
              {item.priceText}
            </span>
          </div>
        </div>

        {/* CTA */}
        <a
          href={CONTACT.phoneTel}
          className="self-start inline-flex items-center gap-1.5 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-brand-hover transition-colors"
          aria-label={`${item.name} — 전화 문의`}
        >
          상세보기 · 전화 문의
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
