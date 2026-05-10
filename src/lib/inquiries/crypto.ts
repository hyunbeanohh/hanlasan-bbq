const enc = new TextEncoder();
const dec = new TextDecoder();
const IV_BYTES = 12;

function toB64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.byteLength; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function fromB64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importKey(keyB64: string): Promise<CryptoKey> {
  const raw = fromB64(keyB64);
  // Derive a 32-byte AES key via SHA-256 so any-length key material is accepted
  const hashBuf = await crypto.subtle.digest('SHA-256', raw);
  return crypto.subtle.importKey('raw', hashBuf, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function encryptPII(plaintext: string, keyB64: string): Promise<string> {
  const key = await importKey(keyB64);
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));
  const ctBytes = new Uint8Array(ct);
  const combined = new Uint8Array(iv.length + ctBytes.length);
  combined.set(iv, 0);
  combined.set(ctBytes, iv.length);
  return toB64(combined);
}

export async function decryptPII(cipherB64: string, keyB64: string): Promise<string> {
  const key = await importKey(keyB64);
  const combined = fromB64(cipherB64);
  if (combined.length < IV_BYTES + 16) throw new Error('ciphertext too short');
  const iv = combined.slice(0, IV_BYTES);
  const ct = combined.slice(IV_BYTES);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return dec.decode(pt);
}

export function generateKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return toB64(bytes);
}
