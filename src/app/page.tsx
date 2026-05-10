import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/metadata';
import { fetchNaverBlogRss } from '@/lib/blog/naver-rss';
import { NAVER } from '@/lib/constants';
import Hero from '@/components/home/Hero';
import ServiceFeatures from '@/components/home/ServiceFeatures';
import MenuPreview from '@/components/home/MenuPreview';
import GalleryPreview from '@/components/home/GalleryPreview';
import ProcessSection from '@/components/home/ProcessSection';
import FinalCTA from '@/components/home/FinalCTA';

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: '제주 출장바베큐 케이터링',
  description:
    '제주 직거래 식재료, 셰프 직출장, 한라산출장바베큐. 기업·가족·동호회 어디든 찾아가는 프리미엄 직화구이 출장 케이터링 서비스.',
  path: '/',
});

export default async function HomePage() {
  const posts = await fetchNaverBlogRss(NAVER.blogId).catch(() => []);

  return (
    <>
      <Hero />
      <ServiceFeatures />
      <MenuPreview />
      <GalleryPreview posts={posts.slice(0, 3)} />
      <ProcessSection />
      <FinalCTA />
    </>
  );
}
