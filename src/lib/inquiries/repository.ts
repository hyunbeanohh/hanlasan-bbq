/// <reference types="@cloudflare/workers-types" />
import type { Inquiry, InquiryRow } from './types';
import { rowToInquiry } from './types';

export interface CreateInquiryParams {
  authorName: string;
  passwordHash: string;
  passwordSalt: string;
  phoneEnc: string;
  emailEnc: string;
  title: string;
  content: string;
  isSecret: boolean;
}

export interface CreateReplyParams {
  parentId: number;
  authorName: string;
  phoneEnc: string;
  emailEnc: string;
  title: string;
  content: string;
}

export class InquiryRepository {
  constructor(private db: D1Database) {}

  async create(p: CreateInquiryParams): Promise<number> {
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19);
    const result = await this.db
      .prepare(
        `INSERT INTO inquiries
         (parent_id, is_admin, author_name, password_hash, password_salt,
          phone_enc, email_enc, title, content, is_secret, expires_at)
         VALUES (NULL, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        p.authorName,
        p.passwordHash,
        p.passwordSalt,
        p.phoneEnc,
        p.emailEnc,
        p.title,
        p.content,
        p.isSecret ? 1 : 0,
        expiresAt,
      )
      .run();
    return result.meta.last_row_id as number;
  }

  async createReply(p: CreateReplyParams): Promise<number> {
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19);
    const result = await this.db
      .prepare(
        `INSERT INTO inquiries
         (parent_id, is_admin, author_name, phone_enc, email_enc, title, content, expires_at)
         VALUES (?, 1, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(p.parentId, p.authorName, p.phoneEnc, p.emailEnc, p.title, p.content, expiresAt)
      .run();
    return result.meta.last_row_id as number;
  }

  async findById(id: number): Promise<Inquiry | null> {
    const row = await this.db
      .prepare(`SELECT * FROM inquiries WHERE id = ?`)
      .bind(id)
      .first<InquiryRow>();
    return row ? rowToInquiry(row) : null;
  }

  async findRepliesOf(parentId: number): Promise<Inquiry[]> {
    const result = await this.db
      .prepare(`SELECT * FROM inquiries WHERE parent_id = ? ORDER BY created_at ASC`)
      .bind(parentId)
      .all<InquiryRow>();
    return (result.results ?? []).map(rowToInquiry);
  }

  async listPaginated(page: number, perPage: number): Promise<{ items: Inquiry[]; total: number }> {
    const offset = (page - 1) * perPage;
    const totalRow = await this.db
      .prepare(`SELECT COUNT(*) as c FROM inquiries WHERE parent_id IS NULL`)
      .first<{ c: number }>();
    const total = totalRow?.c ?? 0;

    const parents = await this.db
      .prepare(
        `SELECT * FROM inquiries WHERE parent_id IS NULL
         ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      )
      .bind(perPage, offset)
      .all<InquiryRow>();
    const parentList = (parents.results ?? []).map(rowToInquiry);
    if (parentList.length === 0) return { items: [], total };

    const ids = parentList.map((p) => p.id);
    const placeholders = ids.map(() => '?').join(',');
    const replies = await this.db
      .prepare(
        `SELECT * FROM inquiries WHERE parent_id IN (${placeholders}) ORDER BY created_at ASC`,
      )
      .bind(...ids)
      .all<InquiryRow>();
    const replyList = (replies.results ?? []).map(rowToInquiry);

    const items: Inquiry[] = [];
    for (const parent of parentList) {
      items.push(parent);
      for (const r of replyList) if (r.parentId === parent.id) items.push(r);
    }
    return { items, total };
  }

  async update(id: number, fields: { title: string; content: string }): Promise<void> {
    await this.db
      .prepare(
        `UPDATE inquiries SET title = ?, content = ?, updated_at = datetime('now') WHERE id = ?`,
      )
      .bind(fields.title, fields.content, id)
      .run();
  }

  async delete(id: number): Promise<void> {
    await this.db.prepare(`DELETE FROM inquiries WHERE id = ?`).bind(id).run();
  }

  async deleteExpired(now: Date): Promise<number> {
    const nowIso = now.toISOString().replace('T', ' ').slice(0, 19);
    const result = await this.db
      .prepare(`DELETE FROM inquiries WHERE expires_at < ?`)
      .bind(nowIso)
      .run();
    return result.meta.changes ?? 0;
  }
}
