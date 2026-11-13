import type { FaqItem } from '@/data/faq';

/** 접고 펼치는 자주 묻는 질문 목록 (홈과 같은 모양). */
export default function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div>
      {items.map(([q, a]) => (
        <details key={q} className="border-border group border-b py-5">
          <summary className="flex cursor-pointer justify-between gap-4 font-semibold">
            {q}
            <span aria-hidden="true" className="group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="text-fg-soft pt-4 leading-7">{a}</p>
        </details>
      ))}
    </div>
  );
}
