import { describe, it, expect } from 'vitest';
import { InquiryRepository } from '../repository';

interface FakeRow {
  author_name: string;
  password_hash: string | null;
  password_salt: string | null;
  phone_enc: string;
  email_enc: string;
  title: string;
  content: string;
  is_secret: number;
  parent_id: number | null;
  is_admin: number;
}

class FakeDB {
  rows: FakeRow[] = [];
  prepare(sql: string) {
    const rows = this.rows;
    return {
      bind(...args: unknown[]) {
        return {
          async run() {
            if (sql.includes('INSERT INTO inquiries')) {
              rows.push({
                author_name: args[0] as string,
                phone_enc: args[1] as string,
                email_enc: args[2] as string,
                title: args[3] as string,
                content: args[4] as string,
                password_hash: null,
                password_salt: null,
                is_secret: 1,
                parent_id: null,
                is_admin: 0,
              });
              return { meta: { last_row_id: rows.length } };
            }
            return { meta: {} };
          },
        };
      },
    };
  }
}

describe('InquiryRepository.createQuickQuote', () => {
  it('inserts a row with NULL password fields and is_secret=1', async () => {
    const db = new FakeDB();
    const repo = new InquiryRepository(db as unknown as D1Database);
    const id = await repo.createQuickQuote({
      phoneEnc: 'enc:010-…',
      emailEnc: 'enc:',
      title: '[빠른 견적] 10명 · 6/1 · 애월읍',
      content: '인원: 10명\n…',
    });
    expect(id).toBe(1);
    expect(db.rows).toHaveLength(1);
    const row = db.rows[0];
    expect(row.author_name).toBe('[빠른 견적]');
    expect(row.password_hash).toBeNull();
    expect(row.password_salt).toBeNull();
    expect(row.is_secret).toBe(1);
    expect(row.parent_id).toBeNull();
    expect(row.is_admin).toBe(0);
  });
});
