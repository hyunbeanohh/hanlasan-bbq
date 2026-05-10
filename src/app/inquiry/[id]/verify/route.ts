import { NextResponse, type NextRequest } from 'next/server';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { verifyPassword } from '@/lib/inquiries/password';
import { signToken, COOKIE_NAME } from '@/lib/inquiries/session';
import { RateLimiter } from '@/lib/inquiries/rate-limit';
import { getDB, getEnv } from '@/lib/inquiries/cf';

const TTL_SECONDS = 30 * 60;

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const inquiryId = Number(id);
  if (!Number.isInteger(inquiryId)) {
    return NextResponse.json({ message: 'invalid id' }, { status: 400 });
  }

  const ip = req.headers.get('cf-connecting-ip') ?? 'unknown';
  const limiter = new RateLimiter(getDB());
  const allowed = await limiter.check(ip, `verify:${inquiryId}`, 5, 3600);
  if (!allowed) {
    return NextResponse.json(
      { message: '시도 횟수를 초과했습니다. 1시간 후 다시 시도해주세요.' },
      { status: 429 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (!body.password) {
    return NextResponse.json({ message: '비밀번호가 필요합니다.' }, { status: 400 });
  }

  const repo = new InquiryRepository(getDB());
  const inquiry = await repo.findById(inquiryId);
  if (!inquiry || inquiry.isAdmin || !inquiry.passwordHash || !inquiry.passwordSalt) {
    return NextResponse.json({ message: '확인할 수 없습니다.' }, { status: 404 });
  }

  const ok = await verifyPassword(body.password, inquiry.passwordHash, inquiry.passwordSalt);
  if (!ok) {
    return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const env = getEnv();
  const token = await signToken({ inquiryId }, env.SESSION_SECRET, TTL_SECONDS);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME(inquiryId), token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: `/inquiry/${inquiryId}`,
    maxAge: TTL_SECONDS,
  });
  return res;
}
