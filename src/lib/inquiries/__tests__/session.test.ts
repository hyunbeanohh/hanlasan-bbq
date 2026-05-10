import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from '../session';

const SECRET = 'YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWE=';

describe('session token', () => {
  it('signs and verifies a token round-trip', async () => {
    const token = await signToken({ inquiryId: 42 }, SECRET, 60);
    const payload = await verifyToken(token, SECRET);
    expect(payload?.inquiryId).toBe(42);
  });

  it('rejects expired token', async () => {
    const token = await signToken({ inquiryId: 42 }, SECRET, -1);
    const payload = await verifyToken(token, SECRET);
    expect(payload).toBeNull();
  });

  it('rejects tampered token', async () => {
    const token = await signToken({ inquiryId: 42 }, SECRET, 60);
    const tampered = token.slice(0, -2) + 'AA';
    const payload = await verifyToken(tampered, SECRET);
    expect(payload).toBeNull();
  });

  it('rejects wrong secret', async () => {
    const token = await signToken({ inquiryId: 42 }, SECRET, 60);
    const payload = await verifyToken(token, 'YmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmI=');
    expect(payload).toBeNull();
  });
});
