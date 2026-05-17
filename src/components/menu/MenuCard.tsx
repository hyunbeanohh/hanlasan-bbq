import Image from 'next/image';
import type { MenuItem, PricingTier } from '@/types';
import { CATEGORY_LABELS } from '@/data/menu';
import { CONTACT } from '@/lib/constants';

interface MenuCardProps {
  item: MenuItem;
}

function PricingTable({ tiers }: { tiers: PricingTier[] }) {
  const composition = tiers.find((t) => t.contents)?.contents;

  return (
    <>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-border">
          {tiers.map((tier) => (
            <tr key={tier.range}>
              <td className="py-2.5 text-fg font-medium whitespace-nowrap">
                {tier.range}
              </td>
              <td className="py-2.5 text-right text-brand font-bold tabular-nums whitespace-nowrap">
                {tier.price}
              </td>
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

export default function MenuCard({ item }: MenuCardProps) {
  const hasPhoto = Boolean(item.imageSrc);
  const hasTiers = Boolean(item.pricingTiers && item.pricingTiers.length > 0);

  return (
    <article className="rounded-2xl overflow-hidden bg-surface border border-border hover:border-border-strong transition-colors flex flex-col md:flex-row">
      {/* Photo */}
      <div className="md:w-52 lg:w-64 aspect-[4/3] md:aspect-auto relative shrink-0 bg-surface-3">
        {hasPhoto ? (
          <Image
            src={item.imageSrc}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 256px"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-3">
            <span className="text-5xl" aria-hidden="true">🔥</span>
            <p className="text-fg-muted text-xs">사진 준비중</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-5">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block text-xs font-semibold text-brand bg-brand-soft px-2.5 py-0.5 rounded-full border border-brand/20">
              {CATEGORY_LABELS[item.categoryId] ?? item.categoryId}
            </span>
          </div>
          <h3 className="font-bold text-fg text-xl mb-2 leading-snug">{item.name}</h3>
          <p className="text-fg-muted text-sm leading-relaxed mb-4">{item.description}</p>

          {/* Price chip */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-block text-sm font-semibold text-brand bg-brand-soft border border-brand/20 px-3 py-1 rounded-full">
              {item.priceText}
            </span>
          </div>
        </div>

        {/* Pricing — desktop always shown, mobile collapsed */}
        {hasTiers && item.pricingTiers && (
          <>
            <details className="md:hidden group border-y border-border">
              <summary className="cursor-pointer list-none flex items-center justify-between py-3 text-sm font-semibold text-brand">
                <span>인원별 가격 보기</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-open:rotate-180"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="pb-3">
                <PricingTable tiers={item.pricingTiers} />
              </div>
            </details>

            <div className="hidden md:block">
              <p className="text-fg-muted text-xs font-semibold uppercase tracking-wider mb-2">
                인원별 가격
              </p>
              <PricingTable tiers={item.pricingTiers} />
            </div>
          </>
        )}

        {item.consultationOnly && !hasTiers && (
          <p className="text-fg-soft text-sm leading-relaxed">
            인원수·구성에 맞춰 전화로 견적을 안내해 드립니다.
          </p>
        )}

        {/* CTA */}
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
    </article>
  );
}
