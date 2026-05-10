const enc = new TextEncoder();
const dec = new TextDecoder();

function toB64Url(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.byteLength; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function fromB64Url(s: string): Uint8Array {
  const padded = s.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (s.length % 4)) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importHmac(secretB64: string): Promise<CryptoKey> {
  const bin = atob(secretB64);
  const raw = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) raw[i] = bin.charCodeAt(i);
  return crypto.subtle.importKey(
    'raw',
    raw.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export interface InquirySessionPayload {
  inquiryId: number;
  exp: number;
}

export async function signToken(
  data: { inquiryId: number },
  secretB64: string,
  ttlSeconds: number,
): Promise<string> {
  const payload: InquirySessionPayload = {
    inquiryId: data.inquiryId,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const body = toB64Url(enc.encode(JSON.stringify(payload)));
  const key = await importHmac(secretB64);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body));
  return `${body}.${toB64Url(new Uint8Array(sig))}`;
}

export async function verifyToken(
  token: string,
  secretB64: string,
): Promise<InquirySessionPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sigB64] = parts;
  const key = await importHmac(secretB64);
  const ok = await crypto.subtle.verify(
    'HMAC',
    key,
    fromB64Url(sigB64).buffer as ArrayBuffer,
    enc.encode(body),
  );
  if (!ok) return null;
  try {
    const payload = JSON.parse(dec.decode(fromB64Url(body))) as InquirySessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const COOKIE_NAME = (id: number) => `inquiry_auth_${id}`;
