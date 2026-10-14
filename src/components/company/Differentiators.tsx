const facts = [
  ['대표 직접 조리', '상담한 구성을 현장에서 직접 준비합니다.'],
  ['최소 2시간 전 도착', '바베큐 준비와 자리 세팅을 진행합니다.'],
  ['전국 출장 상담', '지역 제한 없이 인원과 메뉴를 고려해 안내합니다.'],
];
export default function Differentiators() {
  return (
    <section className="site-width border-border border-y py-10">
      <div className="grid gap-8 md:grid-cols-3">
        {facts.map(([title, description]) => (
          <div key={title}>
            <h2 className="mb-3 text-xl font-bold">{title}</h2>
            <p className="text-fg-soft">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
