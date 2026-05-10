export const SITE = {
  canonicalHost: '한라산출장바베큐.kr',
  canonicalOrigin: 'https://한라산출장바베큐.kr',
  altHosts: ['출장바베큐.kr'] as const,
  name: '한라산출장바베큐',
  nameEn: 'Hallasan BBQ Catering',
  description: '제주에서 시작하는 프리미엄 출장 바베큐 케이터링',
} as const;

export const CONTACT = {
  phone: '010-7332-4199',
  phoneTel: 'tel:01073324199',
  smsHref: 'sms:01073324199?body=' + encodeURIComponent('출장바베큐 문의드립니다.'),
  email: 'ohnamsoo3822@naver.com',
  mailtoHref: 'mailto:ohnamsoo3822@naver.com?subject=' + encodeURIComponent('출장바베큐 문의'),
  // TODO: 사업자 주소 입력 필요
  address: '제주특별자치도 (주소 추가 예정)',
  businessHours: '매일 09:00 ~ 20:00',
  businessNumber: '435-06-00964',
} as const;

export const NAVER = {
  blogId: 'ohnamsoo3822',
  blogRssUrl: 'https://rss.blog.naver.com/ohnamsoo3822.xml',
  blogHomeUrl: 'https://blog.naver.com/ohnamsoo3822',
  // Filled in Phase 3/5 by the user; safe to leave empty for now.
  searchAdvisorVerification: '',
  analyticsId: '',
} as const;
