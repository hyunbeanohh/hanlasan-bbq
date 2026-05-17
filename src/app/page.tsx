import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import Hero from '@/components/home/Hero';
import SignatureMenu from '@/components/home/SignatureMenu';
import WhyUs from '@/components/home/WhyUs';
import Testimonials from '@/components/home/Testimonials';
import ReservationBanner from '@/components/home/ReservationBanner';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: '전국 출장바베큐 케이터링',
  description:
    '정직한 직화로 함께하는 한라산출장바베큐. 전국 어디든 대표가 직접 찾아가는 프리미엄 직화구이 출장 케이터링. 기업·가족·동호회 모임까지 한 자리로.',
  path: '/',
});

export default async function HomePage() {
  return (
    <>
      <Hero />
      <SignatureMenu />
      <WhyUs />
      <Testimonials />
      <ReservationBanner />
    </>
  );
}
