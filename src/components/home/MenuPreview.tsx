import Link from 'next/link';
import { MENU_ITEMS, CATEGORY_LABELS } from '@/data/menu';

const CATEGORY_EMOJIS: Record<string, string> = {
  signature: '🥩',
  beef: '🥩',
  pork: '🔥',
  side: '🌿',
};

export default function MenuPreview() {
  const previewItems = MENU_ITEMS.slice(0, 4);

  return (
    <section className="py-20 md:py-24 bg-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header — centered, Variant 2 style */}
        <div className="text-center mb-12">
          <p className="text-brand text-xs font-semibold uppercase tracking-widest mb-3">
            POPULAR MENU
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            인기 메뉴
          </h2>
          <div className="w-10 h-0.5 bg-brand mx-auto" aria-hidden="true" />
        </div>

        {/* 4-column card grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {previewItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden bg-white border border-warm-100 hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Photo placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-warm-200 via-warm-100 to-warm-50 flex flex-col items-center justify-center gap-2 shrink-0">
                <span className="text-4xl" aria-hidden="true">
                  {CATEGORY_EMOJIS[item.categoryId] ?? '🔥'}
                </span>
                <p className="text-muted text-xs">사진 준비중</p>
              </div>
              {/* Card content */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-1">
                  {CATEGORY_LABELS[item.categoryId]}
                </p>
                <h3 className="font-bold text-ink text-sm mb-1 leading-snug">{item.name}</h3>
                <p className="text-muted text-xs leading-relaxed mb-3 flex-1 line-clamp-2">
                  {item.description}
                </p>
                <p className="text-brand font-bold text-sm">{item.priceText}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA link */}
        <div className="text-center mt-10">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm hover:underline"
          >
            전체 메뉴 보기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
