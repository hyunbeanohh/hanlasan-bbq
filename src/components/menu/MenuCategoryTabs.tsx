import { MENU_ITEMS } from '@/data/menu';
import MenuCard from './MenuCard';

export default function MenuCategoryTabs() {
  return (
    <div>
      <div className="flex flex-col gap-0">
        {MENU_ITEMS.map((item, index) => (
          <MenuCard key={item.id} item={item} preload={index === 0} defaultOpen />
        ))}
      </div>
    </div>
  );
}
