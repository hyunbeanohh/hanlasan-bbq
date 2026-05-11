import type { MenuItem } from '@/types';

export const CATEGORY_LABELS: Record<MenuItem['categoryId'], string> = {
  signature: '시그니처',
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'sig-tong-dwaeji',
    categoryId: 'signature',
    name: '통돼지바베큐',
    priceText: '1인 55,000원~',
    description: '제주 흑돼지를 통째로 직화에 구워 겉은 바삭, 속은 촉촉하게 즐기는 시그니처 메뉴입니다.',
    imageSrc: 'https://images.unsplash.com/photo-1722290171775-3e417486279f?w=800&q=80&fm=jpg',
  },
  {
    id: 'sig-tongsamgyeop',
    categoryId: 'signature',
    name: '통삼겹바베큐',
    priceText: '1인 45,000원~',
    description: '두툼한 통삼겹살을 장작 훈연으로 천천히 구워 겉은 바삭, 속은 촉촉한 육즙과 깊은 풍미를 살린 시그니처 메뉴입니다.',
    imageSrc: '/images/menu/tongsamgyeop-v2.jpg',
  },
  {
    id: 'sig-haemul-modum',
    categoryId: 'signature',
    name: '해물모듬',
    priceText: '1인 50,000원~',
    description: '제주 청정 해역에서 갓 잡은 해산물을 직화로 구워내는 풍성한 모듬 플래터입니다.',
    imageSrc: '/images/menu/haemul-modum.jpg',
  },
  {
    id: 'sig-hunje-ori',
    categoryId: 'signature',
    name: '훈제오리',
    priceText: '가격 문의',
    description: '훈향 가득한 잘 숙성된 오리요리! 모두의 마음을 여는 또 다른 별미입니다.',
    imageSrc: '/images/menu/hunje-ori-v2.jpg',
  },
];
