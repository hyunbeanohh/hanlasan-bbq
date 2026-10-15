import Image from 'next/image';
import { CHEF } from '@/data/company';
export default function ChefStory() {
  return (
    <section className="site-width page-content">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image
            src={CHEF.imageSrc}
            alt="한라산 출장 바베큐 대표"
            fill
            className="object-cover"
            sizes="(max-width:767px) 100vw, 580px"
            priority
          />
        </div>
        <div>
          <p className="text-brand mb-3 font-semibold">대표 인사말</p>
          <h2 className="mb-6 text-3xl font-bold">반갑습니다. 한라산 출장 바베큐 대표입니다.</h2>
          <div className="text-fg-soft space-y-5 leading-8">
            <p>
              일손을 돕는 마음으로 시작한 바베큐가, 손님들의 즐거운 표정을 보며 오래 이어갈 일이
              되었습니다.
            </p>
            <p>
              메뉴 상담부터 행사 당일 준비까지 직접 살핍니다. 기업 행사, 동문회, 가족 모임에 맞는
              음식과 구성을 함께 정하고 현장에서 바베큐를 준비합니다.
            </p>
            <p>
              군포 산본동에서 30년간 테니스를 지도하며 쌓아온 성실함으로, 한 자리 한 자리 정성을
              다하겠습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
