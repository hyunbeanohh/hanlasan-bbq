import type { MenuItem } from '@/types';

export const CATEGORY_LABELS: Record<MenuItem['categoryId'], string> = {
  signature: '시그니처',
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'sig-tongsamgyeop',
    categoryId: 'signature',
    name: '통삼겹바베큐',
    priceText: '40인분 700,000원~',
    description: '두툼한 통삼겹살을 장작 훈연으로 천천히 구워 겉은 바삭, 속은 촉촉한 육즙과 깊은 풍미를 살린 시그니처 메뉴입니다.',
    imageSrc: '/images/menu/tongsamgyeop-v2.jpg',
    priceColumns: ['수입산', '국내산'],
    pricingTiers: [
      { range: '40인분', price: '700,000원', priceAlt: '900,000원' },
      { range: '50인분', price: '800,000원', priceAlt: '1,050,000원' },
      { range: '60인분', price: '900,000원', priceAlt: '1,200,000원' },
      { range: '70인분', price: '1,000,000원', priceAlt: '1,350,000원' },
      { range: '80인분', price: '1,100,000원', priceAlt: '1,500,000원' },
      { range: '90인분', price: '1,200,000원', priceAlt: '1,650,000원' },
      { range: '100인분', price: '1,300,000원', priceAlt: '1,800,000원' },
    ],
  },
  {
    id: 'sig-tong-dwaeji',
    categoryId: 'signature',
    name: '통돼지바베큐',
    priceText: '40인분 800,000원~',
    description: '엄선한 흑돼지를 통째로 직화에 구워 겉은 바삭, 속은 촉촉하게 즐기는 시그니처 메뉴입니다.',
    imageSrc: '/images/menu/tong-dwaeji.jpg',
    pricingTiers: [
      { range: '40인분', price: '800,000원' },
      { range: '50인분', price: '850,000원' },
      { range: '60인분', price: '880,000원' },
      { range: '70인분', price: '910,000원' },
      { range: '80인분', price: '940,000원' },
      { range: '90인분', price: '970,000원' },
      { range: '100인분', price: '1,000,000원' },
    ],
  },
  {
    id: 'sig-haemul-modum',
    categoryId: 'signature',
    name: '해물모듬 바베큐',
    priceText: '40인분 1,000,000원~',
    description: '엄선한 해산물을 직화로 구워내는 풍성한 모듬 플래터입니다.',
    imageSrc: '/images/menu/haemul-modum.jpg',
    pricingTiers: [
      { range: '40인분', price: '1,000,000원' },
      { range: '50인분', price: '1,250,000원' },
      { range: '60인분', price: '1,500,000원' },
      { range: '70인분', price: '1,750,000원' },
      { range: '80인분', price: '2,000,000원' },
      { range: '90인분', price: '2,250,000원' },
      { range: '100인분', price: '2,500,000원' },
    ],
  },
  {
    id: 'sig-hunje-ori',
    categoryId: 'signature',
    name: '훈제오리',
    priceText: '가격 문의',
    description: '훈향 가득한 잘 숙성된 오리요리! 모두의 마음을 여는 또 다른 별미입니다.',
    imageSrc: '/images/menu/hunje-ori-v2.jpg',
    consultationOnly: true,
  },
];
