const FEATURES = [
  {
    id: 'chef',
    metric: '10년',
    metricLabel: '그릴 앞에서',
    title: '대표가 직접 굽습니다',
    description:
      '10년째 같은 자리입니다. 매일 새벽 직접 손질한 재료만 쓰고, 불 조절까지 대표가 책임집니다.',
  },
  {
    id: 'reply',
    metric: '10분',
    metricLabel: '평일 회신',
    title: '견적을 오래 기다리지 않습니다',
    description:
      '날짜·장소·인원만 알려주시면 가능 여부와 견적을 바로 안내해 드립니다.',
  },
  {
    id: 'nationwide',
    metric: '전국',
    metricLabel: '출장 지역',
    title: '장비를 싣고 어디든 갑니다',
    description:
      '단체 행사, 기업 워크샵, 가족 모임까지. 그릴과 세팅 일체를 챙겨 현장으로 갑니다.',
  },
];

export default function WhyUs() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-fg">
            왜 우리를 선택해야 할까요?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
          {FEATURES.map((feature) => (
            <div key={feature.id} className="border-t border-border-strong pt-5">
              <p className="flex items-baseline gap-2">
                <span className="text-brand text-4xl md:text-[2.6rem] font-bold leading-none tabular-nums tracking-tight">
                  {feature.metric}
                </span>
                <span className="text-fg-muted text-xs font-medium">{feature.metricLabel}</span>
              </p>
              <h3 className="text-fg font-bold text-base mt-5 mb-2">{feature.title}</h3>
              <p className="text-fg-muted text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
