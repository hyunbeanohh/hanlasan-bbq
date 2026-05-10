import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import MenuCategoryTabs from '@/components/menu/MenuCategoryTabs';
import CallButton from '@/components/cta/CallButton';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = pageMetadata({
  title: '메뉴소개',
  description:
    '한라산출장바베큐 메뉴 안내. 시그니처 코스, 한우, 제주 흑돼지, 사이드까지 — 제주 직거래 식재료로 만드는 프리미엄 출장 바베큐 메뉴.',
  path: '/menu',
});

export default function MenuPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: '홈', path: '/' }, { name: '메뉴', path: '/menu' }]} />
      {/* Page header */}
      <section className="py-16 md:py-20 bg-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand font-semibold text-sm uppercase tracking-widest mb-4">
            메뉴소개
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4 leading-tight">
            직화구이 메뉴
          </h1>
          <p className="text-cream/60 text-lg max-w-2xl">
            제주 직거래 한우·흑돼지·해산물을 숯불로 직접 구워 드립니다.
            모든 재료는 당일 아침 직접 손질한 신선한 식재료입니다.
          </p>
        </div>
      </section>

      {/* Menu tabs + grid */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <MenuCategoryTabs />
        </div>
      </section>

      {/* CTA note */}
      <section className="py-14 bg-warm-100">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <p className="text-ink font-bold text-xl mb-2">
            가격은 인원·구성에 따라 달라집니다
          </p>
          <p className="text-muted mb-8">
            정확한 견적은 인원수, 장소, 원하시는 구성을 알려주시면 빠르게 안내드립니다.
          </p>
          <CallButton variant="primary" />
        </div>
      </section>
    </>
  );
}
