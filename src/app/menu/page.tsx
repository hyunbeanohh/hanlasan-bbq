import PageHeading from '@/components/layout/PageHeading';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import MenuCategoryTabs from '@/components/menu/MenuCategoryTabs';
import CallButton from '@/components/cta/CallButton';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = pageMetadata({
  title: '메뉴소개',
  description:
    '한라산출장바베큐 메뉴 안내. 통돼지, 통삼겹살, 해물, 훈제오리까지 — 참나무 숯불 훈연으로 완성하는 프리미엄 출장 바베큐 메뉴.',
  path: '/menu',
});

export default function MenuPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '홈', path: '/' },
          { name: '메뉴', path: '/menu' },
        ]}
      />

      {/* Page hero — dark */}
      <PageHeading
        title="출장 바베큐 메뉴"
        description="통돼지부터 통삼겹살, 해물까지. 메뉴와 인원별 구성을 살펴보세요."
      />

      {/* Category tabs + menu list */}
      <section className="page-content">
        <div className="site-width">
          <MenuCategoryTabs />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-surface py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-fg mb-2 text-xl font-bold">찾으시는 메뉴가 없으신가요?</p>
          <p className="text-fg-soft mb-8">
            인원수·장소·예산을 알려주시면 맞춤 메뉴를 제안해 드립니다.
          </p>
          <CallButton variant="primary">전화 문의</CallButton>
        </div>
      </section>
    </>
  );
}
