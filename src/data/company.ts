import type { ProcessStep, Differentiator } from '@/types';

export const STORY = {
  headline: '제주의 맛을 어디서든, 직화로 완성합니다',
  body: [
    '한라산출장바베큐는 제주의 신선한 식재료를 직접 가져와 어디서든 즐길 수 있는 직화구이 경험을 만듭니다. 제주 현지 농가·어가와 직거래하여 당일 손질한 재료만 사용하며, 중간 유통 없이 신선함 그대로 식탁에 올립니다.',
    '기업 워크샵, 가족 나들이, 동호회 모임 등 다양한 자리에서 함께해 온 한라산출장바베큐는 단순한 케이터링을 넘어 특별한 순간을 완성하는 파트너입니다. 셰프가 직접 현장으로 찾아가 세팅부터 조리·정리까지 전부 책임집니다.',
  ],
};

export const CHEF = {
  name: '김한라 셰프',
  role: '총괄 셰프 · 대표',
  summary:
    '호텔 그릴 레스토랑 12년 경력의 김한라 셰프는 제주 출신으로 섬의 식재료에 누구보다 정통합니다. 대형 호텔 연회팀에서 쌓은 대규모 케이터링 경험과 직화 조리 전문 기술을 바탕으로, 행사 규모에 상관없이 한결같은 품질을 제공합니다.',
  detail:
    '2018년 한라산출장바베큐를 창업한 이후 수백 건의 출장 행사를 직접 진행하며 제주를 대표하는 출장 바베큐 브랜드로 성장시켰습니다. "재료가 정직하면 불이 답을 만든다"는 철학으로, 오늘도 현장에서 직접 불을 피웁니다.',
  imageSrc: '/images/hero/placeholder.svg',
};

export const DIFFERENTIATORS: Differentiator[] = [
  {
    id: 'direct-jeju',
    icon: '🌊',
    title: '제주 직거래 식재료',
    description: '중간 유통 없이 제주 현지 농가·어가에서 당일 직거래한 신선한 재료만 사용합니다.',
  },
  {
    id: 'chef-onsite',
    icon: '👨‍🍳',
    title: '셰프 직출장',
    description: '대행사나 아르바이트가 아닌, 담당 셰프가 직접 현장에 출장합니다. 품질이 달라집니다.',
  },
  {
    id: 'full-setup',
    icon: '🏕️',
    title: '풀 세팅 서비스',
    description: '그릴·식기·테이블웨어·불 피우기까지 모든 장비와 세팅을 저희가 준비합니다.',
  },
  {
    id: 'cleanup',
    icon: '✨',
    title: '사후 정리까지 완벽하게',
    description: '행사가 끝난 후 잔반 처리·그릴 정리·쓰레기 수거까지 현장을 깨끗이 마무리합니다.',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: '전화·문자 상담',
    description: '날짜, 장소, 인원을 알려주시면 빠르게 견적과 가능 여부를 안내해 드립니다.',
  },
  {
    step: 2,
    title: '메뉴·인원 확정',
    description: '예산과 취향에 맞는 메뉴를 컨설팅하고, 최종 인원과 구성을 확정합니다.',
  },
  {
    step: 3,
    title: '당일 세팅 · 직화 조리',
    description: '셰프가 현장에 도착해 그릴 세팅부터 직화 조리까지 처음부터 끝까지 함께합니다.',
  },
  {
    step: 4,
    title: '정리 · 뒷처리 완료',
    description: '식사가 끝나면 잔반·그릴·식기를 모두 정리하고 현장을 원래대로 복원합니다.',
  },
];
