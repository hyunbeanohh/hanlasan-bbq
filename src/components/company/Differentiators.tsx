import { DIFFERENTIATORS } from '@/data/company';

export default function Differentiators() {
  return (
    <section className="py-20 md:py-24 bg-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-fg mb-3">
            이렇게 일합니다
          </h2>
          <p className="text-fg-muted text-lg">
            형용사보다 숫자로 말씀드리는 편이 빠르겠습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {DIFFERENTIATORS.map((item) => (
            <div key={item.id} className="border-t border-border-strong pt-5">
              <p className="flex items-baseline gap-2">
                <span className="text-brand text-4xl md:text-[2.6rem] font-bold leading-none tabular-nums tracking-tight">
                  {item.metric}
                </span>
                <span className="text-fg-muted text-xs font-medium">{item.metricLabel}</span>
              </p>
              <h3 className="text-fg font-bold text-base mt-5 mb-2">{item.title}</h3>
              <p className="text-fg-muted text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
