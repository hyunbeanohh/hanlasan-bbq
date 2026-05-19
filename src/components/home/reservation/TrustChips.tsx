export default function TrustChips() {
  return (
    <ul
      className="flex flex-wrap gap-2 justify-start md:justify-center mb-4 md:mb-5 text-white/95 text-xs md:text-sm"
      aria-label="신뢰 정보"
    >
      <li className="inline-flex items-center gap-1.5 bg-white/14 px-3 py-1 rounded-full">
        <span aria-hidden="true">⚡</span>평일 10분 내 회신
      </li>
      <li className="inline-flex items-center gap-1.5 bg-white/14 px-3 py-1 rounded-full">
        <span aria-hidden="true">⭐</span>
        <span className="md:hidden">10년 경력</span>
        <span className="hidden md:inline">10년 이상 경력</span>
      </li>
      <li className="hidden md:inline-flex items-center gap-1.5 bg-white/14 px-3 py-1 rounded-full">
        <span aria-hidden="true">🏝</span>제주 전 지역 출장
      </li>
    </ul>
  );
}
