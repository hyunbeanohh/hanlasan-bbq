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
            <tr className="border-border border-b">
              <th scope="col" className="text-fg-muted py-2 text-left text-xs font-semibold">
                인원
              </th>
              <th
                scope="col"
                className="text-fg-muted py-2 pl-3 text-right text-xs font-semibold whitespace-nowrap"
              >
                {columns[0]}
              </th>
              <th
                scope="col"
                className="text-fg-muted py-2 pl-3 text-right text-xs font-semibold whitespace-nowrap"
              >
                {columns[1]}
              </th>
            </tr>
          </thead>
        )}
        <tbody className="divide-border divide-y">
          {tiers.map((tier) => (
            <tr key={tier.range}>
              <td className="text-fg py-2.5 font-medium whitespace-nowrap">{tier.range}</td>
              <td className="text-brand py-2.5 pl-3 text-right font-bold whitespace-nowrap tabular-nums">
                {tier.price}
              </td>
              {twoColumn && (
                <td className="text-brand py-2.5 pl-3 text-right font-bold whitespace-nowrap tabular-nums">
                  {tier.priceAlt ?? '-'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {composition && (
        <p className="text-fg-soft mt-3 text-xs leading-relaxed">
          <span className="text-fg-muted">구성: </span>
          {composition}
        </p>
      )}
      <p className="text-fg-muted mt-2 text-xs leading-relaxed">
        * 장소·구성에 따라 변동될 수 있습니다.
      </p>
    </>
  );
}

export default function MenuCard({ item, preload = false }: MenuCardProps) {
  return (
    <article className="menu-entry" id={item.id}>
      <div className="menu-photo">
        <Image
          src={item.imageSrc}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width:767px) 100vw, 580px"
          preload={preload}
        />
      </div>
      <div>
        <p className="text-brand mb-2 text-sm font-semibold">{CATEGORY_LABELS[item.categoryId]}</p>
        <h2 className="mb-4 text-3xl font-bold">{item.name}</h2>
        <p className="text-fg-soft mb-6">{item.description}</p>
        {item.pricingTiers?.length ? (
          <PricingTable tiers={item.pricingTiers} columns={item.priceColumns} />
        ) : (
          <p className="text-fg-soft py-6">인원과 구성에 맞춰 전화로 견적을 안내합니다.</p>
        )}
        <a
          href={
            item.consultationOnly
              ? CONTACT.phoneTel
              : `/inquiry?menu=${encodeURIComponent(item.id === 'sig-tongsamgyeop' ? '통삼겹살 바베큐' : item.id === 'sig-haemul-modum' ? '해물바베큐' : item.name)}#quote`
          }
          className="bg-brand mt-6 inline-flex rounded-lg px-5 py-3 font-semibold text-white"
        >
          {item.consultationOnly ? '전화 상담하기' : '이 메뉴로 견적 문의'}
        </a>
      </div>
    </article>
  );
}
