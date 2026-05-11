import { MENU_ITEMS } from '@/data/menu';
import MenuCard from './MenuCard';

export default function MenuCategoryTabs() {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-fg text-center mb-10">
        한라산 출장 바베큐 시그니처 메뉴
      </h2>

      <div className="flex flex-col gap-6">
        {MENU_ITEMS.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
