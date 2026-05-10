import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../password';

describe('password', () => {
  it('hashes a password and produces a salt', async () => {
    const result = await hashPassword('secret123');
    expect(result.hash).toMatch(/^[A-Za-z0-9+/=]+$/);
    expect(result.salt).toMatch(/^[A-Za-z0-9+/=]+$/);
    expect(result.hash).not.toEqual(result.salt);
  });

  it('produces different hashes for the same password (different salts)', async () => {
    const a = await hashPassword('secret123');
    const b = await hashPassword('secret123');
    expect(a.hash).not.toEqual(b.hash);
  });

  it('verifies correct password', async () => {
    const { hash, salt } = await hashPassword('secret123');
    expect(await verifyPassword('secret123', hash, salt)).toBe(true);
  });

  it('rejects incorrect password', async () => {
    const { hash, salt } = await hashPassword('secret123');
    expect(await verifyPassword('wrong', hash, salt)).toBe(false);
  });

  it('uses constant-time comparison', async () => {
    const { hash, salt } = await hashPassword('secret123');
    expect(await verifyPassword('a', hash, salt)).toBe(false);
    expect(await verifyPassword('secret123_extra_long_input', hash, salt)).toBe(false);
  });
});
