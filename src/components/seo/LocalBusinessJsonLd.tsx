import { CONTACT, SITE } from '@/lib/constants';

export default function LocalBusinessJsonLd() {
  // Korean display origin is fine inside JSON-LD (UTF-8 JSON, not HTTP header)
  const url = SITE.canonicalOriginDisplay;

  const data = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'FoodEstablishment'],
    '@id': `${url}#business`,
    name: SITE.name,
    alternateName: SITE.nameEn,
    url,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    description: SITE.description,
    image: `${url}/images/og/default.svg`,
    priceRange: '₩₩',
    servesCuisine: ['Korean BBQ', 'Catering'],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KR',
      addressRegion: '경기도',
      streetAddress: CONTACT.address,
    },
    areaServed: [
      { '@type': 'Country', name: '대한민국' },
      { '@type': 'AdministrativeArea', name: '수도권' },
      { '@type': 'City', name: '군포시' },
      { '@type': 'City', name: '안양시' },
      { '@type': 'City', name: '서울특별시' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    sameAs: [`https://blog.naver.com/ohnamsoo3822`],
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
