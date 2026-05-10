import type { ServiceFeature } from '@/types';

export const SERVICES: ServiceFeature[] = [
  {
    id: 'flame-grill',
    icon: '🔥',
    title: '직화구이의 풍미',
    description: '제주 흑돼지·한우·해산물을 숯불로 직접 구워 드립니다. 화력과 불 조절까지 셰프가 책임집니다.',
  },
  {
    id: 'anywhere',
    icon: '🚚',
    title: '어디든 출장',
    description: '제주 전역은 물론 단체 행사, 가족 모임, 기업 워크샵 어디든 한라산이 직접 찾아갑니다.',
  },
  {
    id: 'chef-care',
    icon: '👨‍🍳',
    title: '셰프 케어',
    description: '사전 메뉴 컨설팅부터 당일 세팅·조리·정리까지 전담 셰프가 처음부터 끝까지 함께합니다.',
  },
  {
    id: 'honest-ingredients',
    icon: '🌿',
    title: '재료 정직성',
    description: '제주 현지 직거래 식재료만 사용합니다. 매일 아침 직접 손질해 신선도를 보장합니다.',
  },
];
