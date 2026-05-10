import type { MenuItem } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  signature: '시그니처',
  beef: '소고기',
  pork: '돼지고기',
  side: '사이드',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  signature: '⭐',
  beef: '🥩',
  pork: '🐖',
  side: '🌿',
};

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  return (
    <article className="rounded-xl overflow-hidden bg-white border border-warm-100 hover:shadow-lg transition-shadow flex flex-col">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-warm-100 flex flex-col items-center justify-center gap-2 shrink-0">
        <span className="text-5xl" aria-hidden="true">
          {CATEGORY_EMOJIS[item.categoryId] ?? '🔥'}
        </span>
        <p className="text-muted text-xs">사진 준비중</p>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block text-xs font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
            {CATEGORY_LABELS[item.categoryId] ?? item.categoryId}
          </span>
        </div>
        <h3 className="font-bold text-ink text-lg mb-2">{item.name}</h3>
        <p className="text-muted text-sm leading-relaxed flex-1 mb-4">{item.description}</p>
        <p className="text-brand font-bold text-base">{item.priceText}</p>
      </div>
    </article>
  );
}
