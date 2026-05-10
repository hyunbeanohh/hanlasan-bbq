import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import CompanyHero from '@/components/company/CompanyHero';
import ChefStory from '@/components/company/ChefStory';
import Differentiators from '@/components/company/Differentiators';
import ProcessSteps from '@/components/company/ProcessSteps';
import CallButton from '@/components/cta/CallButton';
import SmsButton from '@/components/cta/SmsButton';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';

export const metadata: Metadata = pageMetadata({
  title: '회사소개',
  description:
    '한라산출장바베큐 회사소개. 제주 출신 셰프의 12년 노하우, 직거래 식재료, 셰프 직출장으로 완성하는 프리미엄 출장 바베큐 케이터링.',
  path: '/company',
});

export default function CompanyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: '홈', path: '/' }, { name: '회사소개', path: '/company' }]} />
      <CompanyHero />
      <ChefStory />
      <Differentiators />
      <ProcessSteps />

      {/* Page-level CTA */}
      <section className="py-[120px] bg-[#0c0f0f] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(249,94,20,0.4) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-2xl mx-auto px-6 md:px-12 text-center relative z-10">
          <span className="font-bold text-[#f95e14] uppercase tracking-widest text-sm mb-6 block">
            CONTACT US
          </span>
          <h2
            className="text-3xl md:text-4xl font-black text-white uppercase mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            지금 문의해보세요
          </h2>
          <p className="text-zinc-400 text-lg mb-10">
            어떤 자리든 한라산출장바베큐가 함께합니다. 먼저 연락주세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <CallButton variant="primary">전화 문의하기</CallButton>
            <SmsButton variant="ghost">문자 문의하기</SmsButton>
          </div>
        </div>
      </section>
    </>
  );
}
