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
    description: '두툼한 통삼겹살을 참숯 가마에서 2시간 이상 천천히 익혀 기름을 빼고, 참나무 훈연 향을 입힌 바베큐입니다. 현장에서 먹기 좋은 두께로 직접 썰어 부드러운 식감과 고소한 맛을 즐기실 수 있도록 준비합니다. 동문회와 워크샵 등 여러 행사에서 선보여 온 한라산의 대표 메뉴입니다.',
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
    description: '돼지를 통째로 구워내는 모습부터 눈길을 끄는 바베큐입니다. 현장에서 구워지는 과정을 함께 즐길 수 있어 여럿이 모인 자리에 볼거리를 더합니다. 행사 인원과 식사 구성을 고려해 통삼겹살 바베큐와 함께 준비하는 구성도 상담해 드립니다.',
    imageSrc: '/images/menu/tong-dwaeji-roast.png',
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
    description: '신선한 전복과 새우에 두툼한 통삼겹살을 더해, 해산물과 고기를 함께 즐기는 바베큐입니다. 정성껏 손질한 재료를 참나무로 2시간 이상 천천히 훈연해 전복의 쫄깃함, 새우의 고소함, 통삼겹살의 촉촉한 육즙을 살렸습니다. 행사 현장에서 따뜻하게 준비해 드립니다.',
    imageSrc: '/images/menu/haemul-modum-grill.png',
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
