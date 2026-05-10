import Link from 'next/link';
import { MENU_ITEMS, CATEGORY_LABELS } from '@/data/menu';

export default function MenuPreview() {
  const previewItems = MENU_ITEMS.slice(0, 4);

  return (
    <section className="py-20 md:py-24 bg-cream">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
              대표 메뉴
            </h2>
            <p className="text-muted text-lg">
              제주 직거래 재료로 만드는 시그니처 직화 메뉴
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1 text-brand font-semibold hover:underline shrink-0"
          >
            전체 메뉴 보기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden bg-white border border-warm-100 hover:shadow-md transition-shadow"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-warm-100 flex items-center justify-center">
                <span className="text-5xl" aria-hidden="true">🔥</span>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-1">
                  {CATEGORY_LABELS[item.categoryId]}
                </p>
                <h3 className="font-bold text-ink mb-1">{item.name}</h3>
                <p className="text-muted text-sm leading-relaxed mb-3">{item.description}</p>
                <p className="text-brand font-bold text-sm">{item.priceText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
