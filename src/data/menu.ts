import type { MenuItem, MenuCategory } from '@/types';

export const CATEGORY_LABELS: Record<MenuItem['categoryId'], string> = {
  signature: '시그니처',
  beef: '소고기',
  pork: '돼지고기',
  side: '사이드',
};

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'all', name: '전체' },
  { id: 'signature', name: '시그니처' },
  { id: 'beef', name: '소고기' },
  { id: 'pork', name: '돼지고기' },
  { id: 'side', name: '사이드' },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'sig-tong-dwaeji',
    categoryId: 'signature',
    name: '통돼지바베큐',
    priceText: '1인 55,000원~',
    description: '제주 흑돼지를 통째로 직화에 구워 겉은 바삭, 속은 촉촉하게 즐기는 시그니처 메뉴입니다.',
    imageSrc: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&fm=jpg',
  },
  {
    id: 'sig-hoonje-ori',
    categoryId: 'signature',
    name: '훈제오리',
    priceText: '1인 45,000원~',
    description: '참나무 훈연향이 깊게 밴 오리, 부드러운 육질과 풍부한 풍미를 한 번에 느낄 수 있습니다.',
    imageSrc: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800&q=80&fm=jpg',
  },
  {
    id: 'sig-haemul-modum',
    categoryId: 'signature',
    name: '해물모듬',
    priceText: '1인 50,000원~',
    description: '제주 청정 해역에서 갓 잡은 해산물을 직화로 구워내는 풍성한 모듬 플래터입니다.',
    imageSrc: 'https://images.unsplash.com/photo-1551888419-7b7a520fe0ca?w=800&q=80&fm=jpg',
  },
  {
    id: 'sig-jeju-set',
    categoryId: 'signature',
    name: '제주 한라산 풀 코스',
    priceText: '1인 65,000원~',
    description: '흑돼지·한우·해산물·계절채소 풀 세트. 한라산의 정수를 담은 프리미엄 코스.',
    imageSrc: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=800&q=80&fm=jpg',
  },
  {
    id: 'sig-flame-set',
    categoryId: 'signature',
    name: '플레임 시그니처',
    priceText: '1인 55,000원~',
    description: '직화구이 메인 + 사이드 5종. 불향 가득한 한라산 대표 세트.',
    imageSrc: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=800&q=80&fm=jpg',
  },
  {
    id: 'beef-galbi',
    categoryId: 'beef',
    name: '한우 갈빗살',
    priceText: '100g 18,000원',
    description: '1++ 등급 갈빗살 통구이. 결 따라 썰어 드리는 진한 육즙의 한우.',
    imageSrc: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80&fm=jpg',
  },
  {
    id: 'beef-anshim',
    categoryId: 'beef',
    name: '한우 안심 스테이크',
    priceText: '200g 38,000원',
    description: '미디엄으로 직화 마감한 부드러운 안심. 셰프의 불 조절이 만드는 완벽한 굽기.',
    imageSrc: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80&fm=jpg',
  },
  {
    id: 'pork-jeju',
    categoryId: 'pork',
    name: '제주 흑돼지 오겹살',
    priceText: '200g 28,000원',
    description: '두툼하게 썰어 숯불로 직화하는 제주 흑돼지 오겹. 껍데기까지 바삭하게.',
    imageSrc: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=800&q=80&fm=jpg',
  },
  {
    id: 'pork-mokshim',
    categoryId: 'pork',
    name: '제주 흑돼지 목살',
    priceText: '200g 25,000원',
    description: '결 따라 굽는 부드러운 목살. 지방과 살코기의 황금 비율.',
    imageSrc: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80&fm=jpg',
  },
  {
    id: 'side-corn',
    categoryId: 'side',
    name: '구운 옥수수',
    priceText: '12,000원',
    description: '버터와 허브로 마무리하는 직화 구운 옥수수. 달콤하고 고소한 풍미.',
    imageSrc: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80&fm=jpg',
  },
  {
    id: 'side-mushroom',
    categoryId: 'side',
    name: '모듬 버섯구이',
    priceText: '15,000원',
    description: '제주 표고·새송이·느타리 모둠 버섯 직화구이. 육즙과 함께 즐기는 최고의 궁합.',
    imageSrc: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80&fm=jpg',
  },
];
