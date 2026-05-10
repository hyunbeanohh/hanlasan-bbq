import { headers } from 'next/headers';

/**
 * Cloudflare Access는 Cf-Access-Jwt-Assertion 헤더로 JWT를 전달.
 * MVP에서는 헤더 존재 여부로 통과 처리하고, Unit 7에서 JWT 검증 보강.
 */
export async function isAdminRequest(): Promise<boolean> {
  const h = await headers();
  return Boolean(h.get('cf-access-jwt-assertion'));
}
