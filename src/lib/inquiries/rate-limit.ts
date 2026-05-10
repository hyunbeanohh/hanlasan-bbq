/// <reference types="@cloudflare/workers-types" />

export class RateLimiter {
  constructor(private db: D1Database) {}

  async check(ip: string, bucket: string, limit: number, windowSeconds: number): Promise<boolean> {
    const now = new Date();
    const existing = await this.db
      .prepare(`SELECT attempts, window_end FROM rate_limits WHERE ip = ? AND bucket = ?`)
      .bind(ip, bucket)
      .first<{ attempts: number; window_end: string }>();

    if (!existing || new Date(existing.window_end) <= now) {
      const windowEnd = new Date(now.getTime() + windowSeconds * 1000).toISOString();
      await this.db.prepare(`DELETE FROM rate_limits WHERE ip = ? AND bucket = ?`).bind(ip, bucket).run();
      await this.db
        .prepare(`INSERT INTO rate_limits (ip, bucket, attempts, window_end) VALUES (?, ?, ?, ?)`)
        .bind(ip, bucket, 1, windowEnd)
        .run();
      return true;
    }

    if (existing.attempts >= limit) return false;

    await this.db
      .prepare(`UPDATE rate_limits SET attempts = ? WHERE ip = ? AND bucket = ?`)
      .bind(existing.attempts + 1, ip, bucket)
      .run();
    return true;
  }
}
