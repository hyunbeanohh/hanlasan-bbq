import Image from 'next/image';

const SIGNATURE_ITEMS = [
  {
    id: 'tong-dwaeji',
    name: '통돼지바베큐',
    description: '돼지를 통째로 구워내는 모습부터 눈길을 끄는 바베큐입니다. 현장에서 구워지는 과정을 함께 즐길 수 있어 여럿이 모인 자리에 볼거리를 더합니다. 행사 인원과 식사 구성을 고려해 통삼겹살 바베큐와 함께 준비하는 구성도 상담해 드립니다.',
    imageSrc: '/images/menu/tong-dwaeji-roast.png',
  },
  {
    id: 'tongsamgyeop',
    name: '통삼겹바베큐',
    description: '두툼한 통삼겹살을 참숯 가마에서 2시간 이상 천천히 익혀 기름을 빼고, 참나무 훈연 향을 입힌 바베큐입니다. 현장에서 먹기 좋은 두께로 직접 썰어 부드러운 식감과 고소한 맛을 즐기실 수 있도록 준비합니다. 동문회와 워크샵 등 여러 행사에서 선보여 온 한라산의 대표 메뉴입니다.',
    imageSrc: '/images/menu/tongsamgyeop-v2.jpg',
  },
  {
    id: 'haemul-modum',
    name: '해물모듬 바베큐',
    description: '신선한 전복과 새우에 두툼한 통삼겹살을 더해, 해산물과 고기를 함께 즐기는 바베큐입니다. 정성껏 손질한 재료를 참나무로 2시간 이상 천천히 훈연해 전복의 쫄깃함, 새우의 고소함, 통삼겹살의 촉촉한 육즙을 살렸습니다. 행사 현장에서 따뜻하게 준비해 드립니다.',
    imageSrc: '/images/menu/haemul-modum-grill.png',
  },
];

export default function SignatureMenu() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-fg">
            한라산 출장 바베큐의 대표 메뉴
          </h2>
        </div>

        {/* 3-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SIGNATURE_ITEMS.map((item) => (
            <article
              key={item.id}
              className="bg-surface border border-border rounded-2xl p-6 hover:border-border-strong transition-colors"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-5">
                <Image
                  src={item.imageSrc}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Text */}
              <h3 className="text-fg font-semibold text-xl mb-2">{item.name}</h3>
              <p className="text-fg-muted text-sm leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
