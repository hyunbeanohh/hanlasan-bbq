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

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-[80px]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950 z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black z-0">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 70%, rgba(249,94,20,0.35) 0%, transparent 70%)',
            }}
          />
        </div>
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-6 block">
            불과 전통으로 만든 요리
          </span>
          <h1
            className="text-5xl md:text-7xl font-black text-white mb-6 uppercase leading-tight"
            style={{ fontFamily: 'var(--font-headline)', letterSpacing: '-0.02em' }}
          >
            직화구이 메뉴
          </h1>
          <p className="text-[#e3bfb2] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            제주 직거래 한우·흑돼지·해산물을 숯불로 직접 구워 드립니다.
            모든 재료는 당일 아침 직접 손질한 신선한 식재료입니다.
          </p>
        </div>
      </section>

      {/* Menu grid */}
      <section className="py-[120px] bg-[#121414]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <MenuCategoryTabs />
        </div>
      </section>

      {/* CTA section — Stitch pattern */}
      <section className="py-[120px] bg-[#1a1c1c]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-zinc-900 border border-white/5 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2
                className="text-3xl md:text-4xl font-black text-white uppercase mb-4 leading-tight"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                행사를 계획 중이신가요?
              </h2>
              <p className="text-[#e3bfb2] text-lg">
                가격은 인원·구성에 따라 달라집니다.
                정확한 견적은 인원수, 장소, 원하시는 구성을 알려주시면 빠르게 안내드립니다.
              </p>
            </div>
            <CallButton variant="primary" className="shrink-0">
              전화 문의하기
            </CallButton>
          </div>
        </div>
      </section>
    </>
  );
}
