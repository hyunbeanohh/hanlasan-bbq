import type { MenuItem } from '@/types';
import { CATEGORY_LABELS } from '@/data/menu';

const CHECK_FEATURES: Record<string, string[]> = {
  'sig-jeju-set': ['흑돼지·한우·해산물 풀 세트', '프리미엄 코스', '30인 이상'],
  'sig-flame-set': ['직화구이 메인', '사이드 5종', '15인 이상'],
  'beef-galbi': ['1++ 등급 갈빗살', '통구이 제공', '진한 육즙'],
  'beef-anshim': ['직화 마감', '미디엄 굽기', '부드러운 안심'],
  'pork-jeju': ['제주 흑돼지', '두툼 직화', '껍데기까지 바삭'],
  'pork-mokshim': ['제주 흑돼지', '결 따라 구이', '목살 황금 비율'],
  'side-corn': ['버터 허브', '직화 구이', '달콤 고소'],
  'side-mushroom': ['제주 표고·새송이', '직화구이', '최고의 궁합'],
};

interface MenuCardProps {
  item: MenuItem;
  featured?: boolean;
}

export default function MenuCard({ item, featured = false }: MenuCardProps) {
  const features = CHECK_FEATURES[item.id] ?? [];

  return (
    <article className="bg-[#1e2020] border border-white/5 hover:border-[#f95e14] transition-colors duration-500 overflow-hidden flex flex-col group">
      {/* Image placeholder */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
        <div
          className="absolute inset-0 opacity-25 group-hover:opacity-40 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(ellipse at 50% 80%, rgba(249,94,20,0.4) 0%, transparent 70%)',
          }}
        />
        {featured && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#f95e14] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
              시그니처
            </span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 text-zinc-600 text-xs">[사진 준비중]</div>
      </div>

      {/* Content */}
      <div className="p-8 flex-grow flex flex-col">
        <h3
          className="text-white font-bold text-xl mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-headline)' }}
        >
          {item.name}
        </h3>

        {features.length > 0 && (
          <ul className="space-y-2 mb-6 flex-1">
            {features.map((feat) => (
              <li key={feat} className="flex items-center gap-3 text-[#e3bfb2] text-sm">
                <span className="material-symbols-outlined text-[#ffb59a] text-sm">check_circle</span>
                {feat}
              </li>
            ))}
          </ul>
        )}

        {!features.length && (
          <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-6">{item.description}</p>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-headline)' }}>
            {item.priceText}
          </span>
          <span className="text-[#f95e14] text-xs font-bold uppercase tracking-widest">
            {CATEGORY_LABELS[item.categoryId]}
          </span>
        </div>
      </div>
    </article>
  );
}
