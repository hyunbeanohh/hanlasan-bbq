import { BANQUET_ITEMS } from '@/data/banquet';
import BanquetMenuCard from './BanquetMenuCard';

export default function BanquetMenuGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {BANQUET_ITEMS.map((item, index) => (
        <BanquetMenuCard key={item.id} item={item} preload={index === 0} />
      ))}
    </div>
  );
}
