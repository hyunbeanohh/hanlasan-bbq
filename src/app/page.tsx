import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import Hero from '@/components/home/Hero';
import SignatureMenu from '@/components/home/SignatureMenu';
import WhyUs from '@/components/home/WhyUs';
import Testimonials from '@/components/home/Testimonials';
import ReservationBanner from '@/components/home/ReservationBanner';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: '제주 출장바베큐 케이터링',
  description:
    '제주 직거래 식재료, 셰프 직출장, 한라산출장바베큐. 기업·가족·동호회 어디든 찾아가는 프리미엄 직화구이 출장 케이터링 서비스.',
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
