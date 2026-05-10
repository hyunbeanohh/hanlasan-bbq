import { describe, it, expect } from 'vitest';
import { RateLimiter } from '../rate-limit';

class FakeDB {
  rows = new Map<string, { attempts: number; window_end: string }>();
  prepare(sql: string) {
    const self = this;
    return {
      bind(...args: unknown[]) {
        return {
          async first<T>() {
            if (sql.includes('SELECT')) {
              const key = `${args[0]}|${args[1]}`;
              const r = self.rows.get(key);
              return (r as unknown) as T | null;
            }
            return null;
          },
          async run() {
            if (sql.includes('INSERT')) {
              const key = `${args[0]}|${args[1]}`;
              self.rows.set(key, { attempts: args[2] as number, window_end: args[3] as string });
            } else if (sql.includes('UPDATE')) {
              const key = `${args[1]}|${args[2]}`;
              const r = self.rows.get(key);
              if (r) r.attempts = args[0] as number;
            } else if (sql.includes('DELETE')) {
              const key = `${args[0]}|${args[1]}`;
              self.rows.delete(key);
            }
            return { meta: { changes: 1 } };
          },
        };
      },
    };
  }
}

describe('RateLimiter', () => {
  it('allows up to limit attempts within window', async () => {
    const rl = new RateLimiter(new FakeDB() as unknown as D1Database);
    for (let i = 0; i < 5; i++) {
      const ok = await rl.check('1.1.1.1', 'verify', 5, 3600);
      expect(ok).toBe(true);
    }
  });

  it('blocks after limit reached', async () => {
    const rl = new RateLimiter(new FakeDB() as unknown as D1Database);
    for (let i = 0; i < 5; i++) await rl.check('1.1.1.1', 'verify', 5, 3600);
    const blocked = await rl.check('1.1.1.1', 'verify', 5, 3600);
    expect(blocked).toBe(false);
  });

  it('resets after window expires', async () => {
    const rl = new RateLimiter(new FakeDB() as unknown as D1Database);
    for (let i = 0; i < 5; i++) await rl.check('1.1.1.1', 'verify', 5, -1);
    const after = await rl.check('1.1.1.1', 'verify', 5, 3600);
    expect(after).toBe(true);
  });
});
