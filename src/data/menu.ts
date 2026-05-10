import type { MenuItem, MenuCategory } from '@/types';

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'all', name: '전체' },
  { id: 'signature', name: '시그니처' },
  { id: 'beef', name: '소고기' },
  { id: 'pork', name: '돼지고기' },
  { id: 'side', name: '사이드' },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'sig-jeju-set',
    categoryId: 'signature',
    name: '제주 한라산 풀 코스',
    priceText: '1인 65,000원~',
    description: '흑돼지·한우·해산물·계절채소 풀 세트. 한라산의 정수를 담은 프리미엄 코스.',
    imageSrc: '/images/menu/placeholder.svg',
  },
  {
    id: 'sig-flame-set',
    categoryId: 'signature',
    name: '플레임 시그니처',
    priceText: '1인 55,000원~',
    description: '직화구이 메인 + 사이드 5종. 불향 가득한 한라산 대표 세트.',
    imageSrc: '/images/menu/placeholder.svg',
  },
  {
    id: 'beef-galbi',
    categoryId: 'beef',
    name: '한우 갈빗살',
    priceText: '100g 18,000원',
    description: '1++ 등급 갈빗살 통구이. 결 따라 썰어 드리는 진한 육즙의 한우.',
    imageSrc: '/images/menu/placeholder.svg',
  },
  {
    id: 'beef-anshim',
    categoryId: 'beef',
    name: '한우 안심 스테이크',
    priceText: '200g 38,000원',
    description: '미디엄으로 직화 마감한 부드러운 안심. 셰프의 불 조절이 만드는 완벽한 굽기.',
    imageSrc: '/images/menu/placeholder.svg',
  },
  {
    id: 'pork-jeju',
    categoryId: 'pork',
    name: '제주 흑돼지 오겹살',
    priceText: '200g 28,000원',
    description: '두툼하게 썰어 숯불로 직화하는 제주 흑돼지 오겹. 껍데기까지 바삭하게.',
    imageSrc: '/images/menu/placeholder.svg',
  },
  {
    id: 'pork-mokshim',
    categoryId: 'pork',
    name: '제주 흑돼지 목살',
    priceText: '200g 25,000원',
    description: '결 따라 굽는 부드러운 목살. 지방과 살코기의 황금 비율.',
    imageSrc: '/images/menu/placeholder.svg',
  },
  {
    id: 'side-corn',
    categoryId: 'side',
    name: '구운 옥수수',
    priceText: '12,000원',
    description: '버터와 허브로 마무리하는 직화 구운 옥수수. 달콤하고 고소한 풍미.',
    imageSrc: '/images/menu/placeholder.svg',
  },
  {
    id: 'side-mushroom',
    categoryId: 'side',
    name: '모듬 버섯구이',
    priceText: '15,000원',
    description: '제주 표고·새송이·느타리 모둠 버섯 직화구이. 육즙과 함께 즐기는 최고의 궁합.',
    imageSrc: '/images/menu/placeholder.svg',
  },
];
