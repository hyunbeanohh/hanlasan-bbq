import Image from 'next/image';
import type { BanquetMenuItem } from '@/types';
export default function BanquetMenuCard({
  item,
  preload = false,
}: {
  item: BanquetMenuItem;
  preload?: boolean;
}) {
  return (
    <article>
      <div className="bg-surface-2 relative aspect-[4/3] overflow-hidden rounded-xl">
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width:767px) 50vw, 400px"
            preload={preload}
          />
        ) : (
          <p className="text-fg-muted p-6">사진 준비중</p>
        )}
      </div>
      <div className="pt-4 pb-5">
        <h2 className="text-xl font-bold">{item.name}</h2>
        <div className="mt-2 flex flex-wrap justify-between gap-2">
          <p className="text-fg-muted text-sm">{item.portion}</p>
          <p className="font-semibold">{item.price}</p>
        </div>
      </div>
    </article>
  );
}
