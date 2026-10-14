import PageHeading from '@/components/layout/PageHeading';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import BanquetMenuGrid from '@/components/banquet/BanquetMenuGrid';
import BanquetOptionsTable from '@/components/banquet/BanquetOptionsTable';
import CallButton from '@/components/cta/CallButton';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = pageMetadata({
  title: '잔치 메뉴',
  description:
    '한라산출장바베큐 잔치 메뉴 안내 — 잡채·전·무침·찌개·김치까지, 돌잔치·환갑·회갑·집들이 등 가정 행사용 출장 음식 메뉴를 한자리에서 확인하세요.',
  path: '/banquet',
});

export default function BanquetPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '홈', path: '/' },
          { name: '잔치 메뉴', path: '/banquet' },
        ]}
      />

      {/* Page hero — dark, /menu와 동일 톤 */}
      <PageHeading
        title="잔치 메뉴"
        description="바베큐와 함께 나누기 좋은 음식. 행사 인원과 취향에 맞춰 준비합니다."
      />

      {/* Grid */}
      <section className="page-content">
        <div className="site-width">
          <BanquetMenuGrid />
        </div>
      </section>

      {/* 단체 옵션 · 부대 가격표 */}
      <section className="bg-bg border-border border-t py-12">
        <div className="site-width">
          <p className="text-brand mb-3 text-xs font-semibold tracking-widest uppercase">
            GROUP OPTIONS
          </p>
          <h2 className="text-fg mb-3 text-3xl leading-tight font-bold md:text-4xl">
            단체 옵션 · 부대 가격표
          </h2>
          <p className="text-fg-soft mb-8">
            테이블·천막·생맥주·1Kg 단위 단체 구성 등 잔치 행사용 부대 가격입니다.
          </p>
          <BanquetOptionsTable />
          <p className="text-fg-soft mt-6 text-sm">※ 물가 변동이 있을 수 있습니다.</p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-surface py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-fg mb-2 text-xl font-bold">원하시는 잔치 상차림이 따로 있으신가요?</p>
          <p className="text-fg-soft mb-8">
            인원수·구성·예산을 알려주시면 맞춤 잔치상을 제안해 드립니다.
          </p>
          <CallButton variant="primary">전화 문의</CallButton>
        </div>
      </section>
    </>
  );
}
