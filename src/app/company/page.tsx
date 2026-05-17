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
    '한라산출장바베큐 회사소개. 한 길을 걸어온 30년 외길의 집중력과 정직한 직화로 완성하는 출장 바베큐 케이터링. 대표가 직접 현장에 찾아갑니다.',
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
      <section className="py-16 bg-surface">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-fg mb-3">지금 문의해보세요</h2>
          <p className="text-fg-soft mb-8">
            어떤 자리든 한라산출장바베큐가 함께합니다. 먼저 연락주세요.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <CallButton variant="primary" />
            <SmsButton variant="ghost" />
          </div>
        </div>
      </section>
    </>
  );
}
