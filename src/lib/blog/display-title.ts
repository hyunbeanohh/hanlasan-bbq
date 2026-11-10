/**
 * 네이버 블로그 행사 후기 제목을 홈페이지 표시용으로 짧게 정리한다.
 * 예) "[출장바베큐/통돼지바베큐] 김포대학교에 행사를 다녀왔습니다." -> "김포대학교 행사"
 * 규칙에 맞지 않는 제목은 앞쪽 [태그]만 떼고, 결과가 비정상적으로 짧으면 원래 제목을 돌려준다.
 */
export function shortenBlogTitle(title: string): string {
  const original = title.trim();
  let s = original.replace(/^(\s*\[[^\]]*\]\s*)+/, '');
  s = s.replace(/^오랜만에 인사드립니다\.\s*/, '');
  s = s.replace(/\s*\.\s*$/, '').trim();
  s = s.replace(/\s*후기$/, '');
  s = s.replace(/(에|에서)?\s*(열리는\s*)?(행사를|행사에)\s*다녀왔습니다$/, ' 행사');
  s = s.replace(/에\s+([^\s]+)\s+행사$/, ' $1 행사');
  s = s.replace(/에서 열리는\s+/, ' ');
  s = s.replace(/(\S)에\s+(?=\S+\s+모임\s+행사$)/, '$1 ');
  s = s.replace(/\s+행사\s+행사$/, ' 행사');
  s = s.replace(/에 있는\s+/, ' ').replace(/에 위치한\s+/, ' ');
  s = s.replace(/\s{2,}/g, ' ').trim();
  if (s.replace(/\s*행사$/, '').length < 2) return original;
  return s;
}
