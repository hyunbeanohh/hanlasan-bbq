import Image from 'next/image';

const SIGNATURE_ITEMS = [
  {
    id: 'tong-dwaeji',
    name: '통돼지바베큐',
    description: '제주 흑돼지를 통째로 직화에 구워 겉은 바삭, 속은 촉촉하게 즐기는 시그니처 메뉴입니다.',
    imageSrc: 'https://images.unsplash.com/photo-1722290171775-3e417486279f?w=800&q=80&fm=jpg',
  },
  {
    id: 'tongsamgyeop',
    name: '통삼겹바베큐',
    description: '두툼한 통삼겹살을 장작 훈연으로 천천히 구워 겉은 바삭, 속은 촉촉한 육즙과 깊은 풍미를 살린 시그니처 메뉴입니다.',
    imageSrc: '/images/menu/tongsamgyeop-v2.jpg',
  },
  {
    id: 'haemul-modum',
    name: '해물모듬',
    description: '제주 청정 해역에서 갓 잡은 해산물을 직화로 구워내는 풍성한 모듬 플래터입니다.',
    imageSrc: '/images/menu/haemul-modum.jpg',
  },
];

export default function SignatureMenu() {
  return (
    <section className="py-20 md:py-28 bg-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-fg">
            우리의 대표 메뉴
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
