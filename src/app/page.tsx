import Image from 'next/image';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import Hero from '@/components/home/Hero';
import SignatureMenu from '@/components/home/SignatureMenu';
import WhyUs from '@/components/home/WhyUs';
import Testimonials from '@/components/home/Testimonials';
import ReservationBanner from '@/components/home/ReservationBanner';

export const revalidate = 3600;

const homeTitle = '전국 출장 바베큐 · 통돼지·통삼겹살·해물 | 한라산출장바베큐';

export const metadata: Metadata = {
  ...pageMetadata({
    title: homeTitle,
    description:
      '한라산출장바베큐가 전국 기업 행사·동문회·가족 모임에 찾아갑니다. 통돼지, 통삼겹살, 해물바베큐와 식사 포함 여부를 선택하고 행사 인원·날짜·장소에 맞는 견적을 문의하세요.',
    path: '/',
  }),
  title: { absolute: homeTitle },
};

export default async function HomePage() {
  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1558030006-450675393462?w=1920&q=80&fm=jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Hero />
      <SignatureMenu />
      <WhyUs />
      <Testimonials />
      <ReservationBanner />
    </>
  );
}
