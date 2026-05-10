'use client';

import { useState } from 'react';
import { MENU_CATEGORIES, MENU_ITEMS } from '@/data/menu';
import MenuCard from './MenuCard';

export default function MenuCategoryTabs() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredItems =
    activeCategory === 'all'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.categoryId === activeCategory);

  return (
    <div>
      {/* Tab bar — Stitch filter style */}
      <div
        className="flex gap-3 flex-wrap mb-12 justify-center"
        role="tablist"
        aria-label="메뉴 카테고리"
      >
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            aria-controls={`tabpanel-${cat.id}`}
            onClick={() => setActiveCategory(cat.id)}
            className={[
              'px-8 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-200',
              activeCategory === cat.id
                ? 'bg-[#f95e14] text-white border border-[#f95e14]'
                : 'border border-white/20 text-white/60 hover:border-[#f95e14] hover:text-white',
            ].join(' ')}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeCategory}`}
        tabIndex={0}
        aria-label={
          MENU_CATEGORIES.find((c) => c.id === activeCategory)?.name ?? '전체'
        }
      >
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, i) => (
              <MenuCard key={item.id} item={item} featured={i === 0 && activeCategory === 'all'} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-500">
            <span className="material-symbols-outlined text-6xl block mb-4 text-zinc-700">
              restaurant_menu
            </span>
            <p className="text-lg">해당 카테고리의 메뉴가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
