import { describe, it, expect } from 'vitest';
import { buildInquiryEmailText } from '../notify';

describe('buildInquiryEmailText', () => {
  it('본문이 200자를 넘어도 잘리지 않고 전체가 포함된다', () => {
    const content = '가'.repeat(500);
    const text = buildInquiryEmailText(
      { id: 1, authorName: '홍길동', title: '문의합니다', content },
      'https://site/admin/inquiry/1',
    );
    expect(text).toContain(content);
    expect(text).not.toContain('…');
  });

  it('작성자·제목·본문·관리자 링크를 모두 포함한다', () => {
    const text = buildInquiryEmailText(
      { id: 7, authorName: '김철수', title: '예약 문의', content: '안녕하세요 예약하고 싶습니다' },
      'https://site/admin/inquiry/7',
    );
    expect(text).toContain('김철수');
    expect(text).toContain('예약 문의');
    expect(text).toContain('안녕하세요 예약하고 싶습니다');
    expect(text).toContain('https://site/admin/inquiry/7');
  });
});
