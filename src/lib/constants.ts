const _displayOrigin = 'https://한라산출장바베큐.kr';
const _aceOrigin = new URL(_displayOrigin).origin; // → https://xn--... (ASCII)
const _aceHost = new URL(_displayOrigin).hostname;

export const SITE = {
  // Display forms (Korean) — use in HTML <link>, OG tags, user-visible UI
  canonicalHostDisplay: '한라산출장바베큐.kr',
  canonicalOriginDisplay: _displayOrigin,
  // ASCII-compatible (punycode) forms — use in HTTP headers, sitemap, robots, JSON-LD
  canonicalHost: _aceHost,
  canonicalOrigin: _aceOrigin,
  altHosts: ['출장바베큐.kr'] as const,
  name: '한라산출장바베큐',
  nameEn: 'Hallasan BBQ Catering',
  description: '정직한 직화로 함께하는 전국 출장 바베큐 케이터링',
} as const;

export const CONTACT = {
  phone: '010-7332-4199',
  phoneTel: 'tel:01073324199',
  smsHref: 'sms:01073324199?body=' + encodeURIComponent('출장바베큐 문의드립니다.'),
  email: 'ohnamsoo3822@naver.com',
  mailtoHref: 'mailto:ohnamsoo3822@naver.com?subject=' + encodeURIComponent('출장바베큐 문의'),
  // 카카오톡 채널 1:1 채팅 URL — 예: 'https://pf.kakao.com/_xxxxx/chat'. 빈 문자열이면 카카오톡 CTA는 숨겨집니다.
  kakaoChannelUrl: '',
  // TODO: 사업자 주소 입력 필요
  address: '경기도 군포시 (상세 주소 추가 예정)',
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
