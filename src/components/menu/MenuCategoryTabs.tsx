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
      {/* Tab bar */}
      <div
        className="flex gap-2 flex-wrap mb-10"
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
              'px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-150',
              activeCategory === cat.id
                ? 'bg-brand text-white'
                : 'bg-white text-ink border border-warm-100 hover:border-brand hover:text-brand',
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
        aria-label={
          MENU_CATEGORIES.find((c) => c.id === activeCategory)?.name ?? '전체'
        }
      >
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted">
            <p className="text-4xl mb-4" aria-hidden="true">🍽️</p>
            <p>해당 카테고리의 메뉴가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
