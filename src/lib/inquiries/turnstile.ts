const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileResult {
  success: boolean;
  errors?: string[];
}

export async function verifyTurnstile(
  token: string,
  secret: string,
  ip?: string,
): Promise<TurnstileResult> {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);

  const res = await fetch(VERIFY_URL, { method: 'POST', body });
  if (!res.ok) return { success: false, errors: ['turnstile_http_error'] };
  const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
  return { success: data.success, errors: data['error-codes'] };
}
