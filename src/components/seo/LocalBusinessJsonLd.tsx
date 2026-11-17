import { CONTACT, SITE } from '@/lib/constants';

export default function LocalBusinessJsonLd() {
  // Korean display origin is fine inside JSON-LD (UTF-8 JSON, not HTTP header)
  const url = SITE.canonicalOriginDisplay;

  const data = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'FoodEstablishment'],
    '@id': `${url}#business`,
    name: SITE.name,
    // 사업자등록증·구글·카카오 지도에 등록된 상호도 같은 업체로 묶이도록 함께 적는다.
    alternateName: [SITE.nameEn, '한라산통돼지출장바베큐'],
    url,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    description: SITE.description,
    image: [`${url}/opengraph-image.jpg`, `${url}/images/menu/tongsamgyeop-v2.jpg`],
    logo: `${url}/images/logo.png`,
    priceRange: '₩₩',
    servesCuisine: ['Korean BBQ', 'Catering'],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KR',
      addressRegion: '경기도',
      addressLocality: '안양시 만안구',
      streetAddress: '박달로578번길 36, 1층',
    },
    // 전국 출장. 실제 견적·행사가 있었던 지역을 함께 적는다.
    areaServed: [
      { '@type': 'Country', name: '대한민국' },
      ...[
        '서울특별시',
        '경기도',
        '인천광역시',
        '안양시',
        '안산시',
        '대부도',
        '의정부시',
        '대전광역시',
        '경주시',
        '부안군',
        '원주시',
      ].map((name) => ({ '@type': 'AdministrativeArea', name })),
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    // 지도 등록 정보. 같은 업체로 묶이도록 지도 주소를 함께 적는다.
    hasMap: 'https://maps.google.com/?cid=4153469789500803710',
    sameAs: [
      'https://blog.naver.com/ohnamsoo3822',
      'https://map.naver.com/p/entry/place/1682876082',
      'https://place.map.kakao.com/1758764126',
      'https://maps.google.com/?cid=4153469789500803710',
    ],
    paymentAccepted: ['Cash', 'CreditCard', 'BankTransfer'],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify produces safe JSON; React's auto-escape handles HTML safety
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
