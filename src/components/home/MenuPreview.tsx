import Link from 'next/link';
import { MENU_ITEMS, CATEGORY_LABELS } from '@/data/menu';

export default function MenuPreview() {
  const previewItems = MENU_ITEMS.slice(0, 4);

  return (
    <section className="py-[120px] bg-[#121414]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-3 block">
              MENU
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-white uppercase leading-tight border-l-4 border-[#f95e14] pl-6"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              대표 메뉴
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-[#ffb59a] font-bold uppercase tracking-widest text-sm hover:text-white transition-colors shrink-0"
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
          {previewItems.map((item, i) => (
            <div
              key={item.id}
              className="bg-[#1e2020] border border-white/5 hover:border-[#f95e14] transition-colors duration-500 overflow-hidden flex flex-col group"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex flex-col items-center justify-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `radial-gradient(ellipse at 50% 70%, rgba(249,94,20,${i % 2 === 0 ? '0.25' : '0.15'}) 0%, transparent 70%)`,
                  }}
                />
                {i === 0 && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-[#f95e14] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      시그니처
                    </span>
                  </div>
                )}
                <p className="text-zinc-600 text-xs text-center px-4 relative z-10">
                  [사진 준비중]
                </p>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[#f95e14] text-xs font-bold uppercase tracking-widest mb-2">
                  {CATEGORY_LABELS[item.categoryId]}
                </span>
                <h3
                  className="text-white font-bold text-lg mb-2 leading-tight"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  {item.name}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-4">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-white font-bold text-base">{item.priceText}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
