import { describe, it, expect } from 'vitest';
import { encryptPII, decryptPII, generateKey } from '../crypto';

// 32 bytes of 0x61 ('a') base64-encoded
const TEST_KEY = 'YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWE=';

describe('crypto', () => {
  it('encrypts and decrypts a string round-trip', async () => {
    const cipher = await encryptPII('010-1234-5678', TEST_KEY);
    expect(cipher).not.toEqual('010-1234-5678');
    const plain = await decryptPII(cipher, TEST_KEY);
    expect(plain).toEqual('010-1234-5678');
  });

  it('produces different ciphertext for same plaintext (random IV)', async () => {
    const a = await encryptPII('test@example.com', TEST_KEY);
    const b = await encryptPII('test@example.com', TEST_KEY);
    expect(a).not.toEqual(b);
  });

  it('throws on tampered ciphertext', async () => {
    const cipher = await encryptPII('hello', TEST_KEY);
    const tampered = cipher.slice(0, -2) + 'AA';
    await expect(decryptPII(tampered, TEST_KEY)).rejects.toThrow();
  });

  it('throws on wrong key', async () => {
    const cipher = await encryptPII('hello', TEST_KEY);
    const otherKey = 'YmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmI=';
    await expect(decryptPII(cipher, otherKey)).rejects.toThrow();
  });

  it('generateKey returns valid 32-byte base64', () => {
    const key = generateKey();
    const buf = Buffer.from(key, 'base64');
    expect(buf.length).toBe(32);
  });
});
