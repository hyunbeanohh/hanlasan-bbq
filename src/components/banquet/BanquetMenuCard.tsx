import Image from 'next/image';
import type { BanquetMenuItem } from '@/types';

interface BanquetMenuCardProps {
  item: BanquetMenuItem;
  preload?: boolean;
}

export default function BanquetMenuCard({ item, preload = false }: BanquetMenuCardProps) {
  return (
    <article className="group relative aspect-square overflow-hidden rounded-2xl bg-surface-3 border border-border">
      {item.imageSrc ? (
        <Image
          src={item.imageSrc}
          alt={item.name}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 384px"
          fetchPriority={preload ? 'high' : undefined}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-3">
          <span className="text-5xl" aria-hidden="true">🎉</span>
          <p className="text-fg-muted text-xs">사진 준비중</p>
        </div>
      )}
    </article>
  );
}
