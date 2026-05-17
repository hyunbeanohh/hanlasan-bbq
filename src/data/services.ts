import type { ServiceFeature } from '@/types';

export const SERVICES: ServiceFeature[] = [
  {
    id: 'flame-grill',
    icon: '🔥',
    title: '직화구이의 풍미',
    description: '한우·흑돼지·해산물을 참나무 숯불로 직접 훈연·구이합니다. 화력과 불 조절까지 대표가 책임집니다.',
  },
  {
    id: 'anywhere',
    icon: '🚚',
    title: '전국 어디든 출장',
    description: '단체 행사, 가족 모임, 기업 워크샵까지 — 전국 어디든 한라산이 직접 찾아갑니다.',
  },
  {
    id: 'chef-care',
    icon: '👨‍🍳',
    title: '대표 직접 케어',
    description: '사전 메뉴 컨설팅부터 당일 세팅·조리·정리까지 대표가 처음부터 끝까지 함께합니다.',
  },
  {
    id: 'honest-ingredients',
    icon: '🌿',
    title: '재료 정직성',
    description: '엄선한 식재료만 사용합니다. 매일 아침 직접 손질해 신선도를 보장합니다.',
  },
];
