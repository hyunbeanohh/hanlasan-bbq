import Image from 'next/image';
import type { BanquetMenuItem } from '@/types';

interface BanquetMenuCardProps {
  item: BanquetMenuItem;
  preload?: boolean;
}

export default function BanquetMenuCard({ item, preload = false }: BanquetMenuCardProps) {
  const hasPhoto = Boolean(item.imageSrc);

  return (
    <article className="group relative aspect-square overflow-hidden rounded-2xl bg-surface-3 border border-border">
      {hasPhoto ? (
        <Image
          src={item.imageSrc as string}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 384px"
          preload={preload}
          fetchPriority={preload ? 'high' : undefined}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-3">
          <span className="text-5xl" aria-hidden="true">🎉</span>
          <p className="text-fg-muted text-xs">사진 준비중</p>
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 md:p-4"
        aria-hidden="false"
      >
        <p className="text-white text-sm md:text-base font-semibold leading-snug">
          <span>{item.name}</span>
          <span className="text-white/80 ml-1.5 text-xs md:text-sm font-normal">{item.portion}</span>
        </p>
        <p className="text-brand text-sm md:text-base font-bold tabular-nums leading-snug mt-0.5">
          {item.price}
        </p>
      </div>
    </article>
  );
}
