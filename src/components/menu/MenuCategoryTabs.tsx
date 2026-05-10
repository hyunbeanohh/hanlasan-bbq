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
      {/* Pill tab bar */}
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
              'px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-150',
              activeCategory === cat.id
                ? 'bg-brand text-white shadow-sm'
                : 'bg-cream text-ink-soft border border-warm-100 hover:border-brand hover:text-brand',
            ].join(' ')}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu list */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeCategory}`}
        tabIndex={0}
        aria-label={
          MENU_CATEGORIES.find((c) => c.id === activeCategory)?.name ?? '전체'
        }
      >
        {filteredItems.length > 0 ? (
          <div className="flex flex-col gap-6">
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
