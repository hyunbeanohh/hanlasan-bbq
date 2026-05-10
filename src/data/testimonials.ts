export type Testimonial = {
  id: string;
  rating: number;
  quote: string;
  name: string;
  role: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    rating: 5,
    quote: '회사 워크샵에서 30명 출장 진행했는데 셰프님이 직접 와주셔서 모든 분들이 만족했습니다. 흑돼지가 정말 인상적이었어요.',
    name: '김민준',
    role: '기업 워크샵 / 30인',
  },
  {
    id: 't2',
    rating: 5,
    quote: '가족 모임에서 이용했는데 사전 상담부터 정리까지 완벽했습니다. 다음 행사도 무조건 한라산 출장바베큐로 갑니다.',
    name: '이서연',
    role: '가족 모임 / 12인',
  },
  {
    id: 't3',
    rating: 5,
    quote: '돌잔치 출장 케이터링으로 부탁드렸는데 음식 퀄리티는 물론 세팅과 정리까지 흠잡을 데가 없었습니다.',
    name: '박지훈',
    role: '돌잔치 / 50인',
  },
];
