import { headers } from 'next/headers';
import { getEnv } from './cf';

interface JWK {
  kid: string;
  kty: string;
  use: string;
  n: string;
  e: string;
}

let cachedKeys: { fetched: number; keys: JWK[] } | null = null;
const CACHE_MS = 5 * 60 * 1000;

async function getJWKS(teamDomain: string): Promise<JWK[]> {
  const now = Date.now();
  if (cachedKeys && now - cachedKeys.fetched < CACHE_MS) return cachedKeys.keys;
  const res = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error('failed to fetch JWKS');
  const data = (await res.json()) as { keys: JWK[] };
  cachedKeys = { fetched: now, keys: data.keys };
  return data.keys;
}

function b64urlDecode(s: string): Uint8Array<ArrayBuffer> {
  const padded = s.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importRSAKey(jwk: JWK): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
}

export async function isAdminRequest(): Promise<boolean> {
  try {
    const env = getEnv();
    if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return false;

    const h = await headers();
    const token = h.get('cf-access-jwt-assertion');
    if (!token) return false;

    const [headerB64, payloadB64, sigB64] = token.split('.');
    if (!headerB64 || !payloadB64 || !sigB64) return false;

    const header = JSON.parse(new TextDecoder().decode(b64urlDecode(headerB64))) as {
      kid: string;
      alg: string;
    };
    if (header.alg !== 'RS256') return false;

    const keys = await getJWKS(env.ACCESS_TEAM_DOMAIN);
    const jwk = keys.find((k) => k.kid === header.kid);
    if (!jwk) return false;

    const cryptoKey = await importRSAKey(jwk);
    const signed = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      b64urlDecode(sigB64),
      signed,
    );
    if (!valid) return false;

    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(payloadB64))) as {
      aud: string | string[];
      exp: number;
      iss: string;
    };
    const audMatches = Array.isArray(payload.aud)
      ? payload.aud.includes(env.ACCESS_AUD)
      : payload.aud === env.ACCESS_AUD;
    if (!audMatches) return false;
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (!payload.iss.includes(env.ACCESS_TEAM_DOMAIN)) return false;

    return true;
  } catch (err) {
    console.error('isAdminRequest error', err);
    return false;
  }
}
