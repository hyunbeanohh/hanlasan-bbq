export type Testimonial = {
  id: string;
  rating: 5;
  quote: string;
  name: string;
  role: string;
  blogUrl: string;
};

const BLOG_HOME = 'https://blog.naver.com/ohnamsoo3822';

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    rating: 5,
    quote:
      '제주 가족 여행 마지막 밤 펜션에서 진행했어요. 셰프님이 직접 흑돼지를 구워주시는데 향이 정말 좋았고, 아이들도 너무 좋아했습니다.',
    name: '고객1',
    role: '가족 모임 · 10인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't2',
    rating: 5,
    quote:
      '회사 워크샵 30명 출장. 셰프님이 직접 와주셔서 모든 분들이 만족했습니다. 흑돼지 퀄리티가 인상적이었어요.',
    name: '고객2',
    role: '기업 워크샵 · 30인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't3',
    rating: 5,
    quote:
      '돌잔치 출장 케이터링으로 부탁드렸는데 음식 퀄리티는 물론 세팅과 정리까지 흠잡을 데가 없었습니다.',
    name: '고객3',
    role: '돌잔치 · 50인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't4',
    rating: 5,
    quote:
      '동호회 야외 모임에서 진행했는데 셰프님이 분위기까지 살려주셔서 모두 즐겁게 즐겼습니다.',
    name: '고객4',
    role: '동호회 · 25인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't5',
    rating: 5,
    quote:
      '제주 펜션 가족 모임. 사전 상담부터 정리까지 완벽했고 음식도 기대 이상이었습니다.',
    name: '고객5',
    role: '가족 모임 · 12인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't6',
    rating: 5,
    quote:
      '바닷가 펜션에서 진행한 친구 모임. 해산물 조합이 신선했고 셰프님 친절하셨어요.',
    name: '고객6',
    role: '친구 모임 · 8인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't7',
    rating: 5,
    quote:
      '생일 파티 출장. 메뉴 구성도 풍성하고 사진 찍기 좋게 세팅해 주셔서 너무 만족스러웠습니다.',
    name: '고객7',
    role: '생일 파티 · 15인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't8',
    rating: 5,
    quote:
      '결혼 기념일에 부모님 모시고 진행. 직화 향과 셰프님 응대 모두 최고였습니다.',
    name: '고객8',
    role: '가족 모임 · 6인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't9',
    rating: 5,
    quote:
      '회사 팀 회식. 식재료 신선도와 양 모두 만족스러웠고 정리도 깔끔했습니다.',
    name: '고객9',
    role: '기업 회식 · 18인',
    blogUrl: BLOG_HOME,
  },
  {
    id: 't10',
    rating: 5,
    quote:
      '제주 출장 일정 중 바베큐. 일정 조율부터 음식까지 모든 면에서 추천할 만합니다.',
    name: '고객10',
    role: '기업 출장 · 20인',
    blogUrl: BLOG_HOME,
  },
];
