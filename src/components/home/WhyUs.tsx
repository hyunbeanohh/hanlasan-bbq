const FEATURES = [
  {
    id: 'fresh',
    title: '신선한 재료',
    description: '매일 새벽 제주 직거래로 받은 식재료, 맛의 차이는 신선함에서 시작됩니다.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'chef',
    title: '전문 셰프',
    description: '12년 경력의 전문 셰프가 직접 출장하여 현장에서 직화로 구워드립니다.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
        <line x1="6" x2="18" y1="17" y2="17" />
      </svg>
    ),
  },
  {
    id: 'nationwide',
    title: '전국 출장',
    description: '제주 전역 어디든 출장합니다. 단체 행사·기업 워크샵·가족 모임 모두 가능합니다.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export default function WhyUs() {
  return (
    <section className="py-20 md:py-28 bg-surface-2">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-fg">
            왜 우리를 선택해야 할까요?
          </h2>
        </div>

        {/* 3-column icon feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center gap-5 p-8"
            >
              <div className="text-brand">{feature.icon}</div>
              <div>
                <h3 className="text-fg font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-fg-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
