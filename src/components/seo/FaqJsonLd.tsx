import type { FaqItem } from '@/data/faq';

/** FAQPage 구조화 데이터. 화면에 보이는 질문과 같은 내용만 넣는다. */
export default function FaqJsonLd({ items }: { items: readonly FaqItem[] }) {
  if (items.length === 0) return null;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
