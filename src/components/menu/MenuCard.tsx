import Image from 'next/image';
import type { MenuItem, PricingTier } from '@/types';
import { CATEGORY_LABELS } from '@/data/menu';
import { CONTACT } from '@/lib/constants';

interface MenuCardProps {
  item: MenuItem;
  preload?: boolean;
  defaultOpen?: boolean;
}

function PricingTable({
  tiers,
  columns,
}: {
  tiers: PricingTier[];
  columns?: readonly [string, string];
}) {
  const composition = tiers.find((t) => t.contents)?.contents;
  const twoColumn = Boolean(columns);

  return (
    <>
      <table className="w-full text-sm">
        {columns && (
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 text-left text-fg-muted text-xs font-semibold">
                인원
              </th>
              <th
                scope="col"
                className="py-2 pl-3 text-right text-fg-muted text-xs font-semibold whitespace-nowrap"
              >
                {columns[0]}
              </th>
              <th
                scope="col"
                className="py-2 pl-3 text-right text-fg-muted text-xs font-semibold whitespace-nowrap"
              >
                {columns[1]}
              </th>
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-border">
          {tiers.map((tier) => (
            <tr key={tier.range}>
              <td className="py-2.5 text-white font-medium whitespace-nowrap">
                {tier.range}
              </td>
              <td className="py-2.5 pl-3 text-right text-brand font-bold tabular-nums whitespace-nowrap">
                {tier.price}
              </td>
              {twoColumn && (
                <td className="py-2.5 pl-3 text-right text-brand font-bold tabular-nums whitespace-nowrap">
                  {tier.priceAlt ?? '-'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {composition && (
        <p className="mt-3 text-fg-soft text-xs leading-relaxed">
          <span className="text-fg-muted">구성: </span>
          {composition}
        </p>
      )}
      <p className="mt-2 text-fg-muted text-xs leading-relaxed">
        * 장소·구성에 따라 변동될 수 있습니다.
      </p>
    </>
  );
}

export default function MenuCard({ item, preload = false, defaultOpen = false }: MenuCardProps) {
  const hasPhoto = Boolean(item.imageSrc);
  const hasTiers = Boolean(item.pricingTiers && item.pricingTiers.length > 0);

  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl overflow-hidden bg-surface border border-border hover:border-border-strong transition-colors"
    >
      <summary
        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 cursor-pointer select-none"
        aria-label={`${item.name} 펼치기/접기`}
      >
        {/* Thumbnail */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-surface-3 shrink-0">
          {hasPhoto ? (
            <Image
              src={item.imageSrc}
              alt=""
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xl" aria-hidden="true">
              🔥
            </div>
          )}
        </div>

        {/* Badge + name */}
        <div className="flex-1 min-w-0">
          <span className="inline-block text-[10px] sm:text-xs font-semibold text-brand bg-brand-soft px-2 py-0.5 rounded-full border border-brand/20 mb-1">
            {CATEGORY_LABELS[item.categoryId] ?? item.categoryId}
          </span>
          <h3 className="font-bold text-fg text-base sm:text-lg leading-snug truncate">
            {item.name}
          </h3>
        </div>

        {/* Price (start) */}
        <span className="text-brand font-bold text-sm sm:text-base whitespace-nowrap">
          {item.priceText}
        </span>

        {/* Chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-fg-muted shrink-0 transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>

      <div className="border-t border-border grid md:grid-cols-[1.3fr_1fr] gap-5 md:gap-6 p-4 sm:p-5 md:p-6">
        {/* Image */}
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-surface-3">
          {hasPhoto ? (
            <Image
              src={item.imageSrc}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 520px"
              preload={preload}
              fetchPriority={preload ? 'high' : undefined}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="text-5xl" aria-hidden="true">🔥</span>
              <p className="text-fg-muted text-xs">사진 준비중</p>
            </div>
          )}
        </div>

        {/* Description + pricing + CTA */}
        <div className="flex flex-col gap-4">
          <p className="text-fg-muted text-sm leading-relaxed">{item.description}</p>

          {hasTiers && item.pricingTiers && (
            <div>
              <p className="text-fg-muted text-xs font-semibold uppercase tracking-wider mb-2">
                인원별 가격
              </p>
              <PricingTable tiers={item.pricingTiers} columns={item.priceColumns} />
            </div>
          )}

          {item.consultationOnly && !hasTiers && (
            <p className="text-fg-soft text-sm leading-relaxed">
              인원수·구성에 맞춰 전화로 견적을 안내해 드립니다.
            </p>
          )}

          <a
            href={CONTACT.phoneTel}
            className="self-start inline-flex items-center gap-2 bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-brand-hover transition-colors"
            aria-label={`${item.name} 전화 견적 문의`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {item.consultationOnly ? '전화 상담' : '전화 견적 문의'}
          </a>
        </div>
      </div>
    </details>
  );
}
