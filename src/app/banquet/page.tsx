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
      <BreadcrumbJsonLd items={[{ name: '홈', path: '/' }, { name: '잔치 메뉴', path: '/banquet' }]} />

      {/* Page hero — dark, /menu와 동일 톤 */}
      <section className="relative overflow-hidden bg-surface-2 py-16 md:py-20 border-b border-border">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, #ea580c, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand font-semibold text-xs uppercase tracking-widest mb-3">
            BANQUET MENU
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-4 leading-tight">
            잔치 메뉴
          </h1>
          <p className="text-fg-soft text-lg max-w-2xl">
            돌잔치·환갑·회갑·집들이까지 — 한라산출장바베큐가 차려드리는 가정 행사용 잔치 음식 메뉴입니다.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-20 bg-bg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <BanquetMenuGrid />
        </div>
      </section>

      {/* 단체 옵션 · 부대 가격표 */}
      <section className="py-16 md:py-20 bg-surface border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-brand font-semibold text-xs uppercase tracking-widest mb-3">
            GROUP OPTIONS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-fg mb-3 leading-tight">
            단체 옵션 · 부대 가격표
          </h2>
          <p className="text-fg-soft mb-8">
            테이블·천막·생맥주·1Kg 단위 단체 구성 등 잔치 행사용 부대 가격입니다.
          </p>
          <BanquetOptionsTable />
          <p className="text-fg-soft text-sm mt-6">
            ※ 물가 변동이 있을 수 있습니다.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 bg-surface">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <p className="text-fg font-bold text-xl mb-2">
            원하시는 잔치 상차림이 따로 있으신가요?
          </p>
          <p className="text-fg-soft mb-8">
            인원수·구성·예산을 알려주시면 맞춤 잔치상을 제안해 드립니다.
          </p>
          <CallButton variant="primary">전화 문의</CallButton>
        </div>
      </section>
    </>
  );
}
