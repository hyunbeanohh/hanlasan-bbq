import { NextResponse, type NextRequest } from 'next/server';

const CANONICAL_HOST = 'xn--oi2b40g9l97kpyk0jjr0ee5l.kr';

const NON_CANONICAL_HOSTS = new Set([
  '출장바베큐.kr',
  'www.출장바베큐.kr',
  'xn--9g3b2j55zr3f7ud.kr',
  'www.xn--9g3b2j55zr3f7ud.kr',
  'www.한라산출장바베큐.kr',
  'www.xn--oi2b40g9l97kpyk0jjr0ee5l.kr',
]);

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase() ?? '';
  if (!NON_CANONICAL_HOSTS.has(host)) return NextResponse.next();

  const target = new URL(request.nextUrl.toString());
  target.host = CANONICAL_HOST;
  target.protocol = 'https:';
  target.port = '';
  return NextResponse.redirect(target, 301);
}

export const config = {
  matcher: ['/((?!_next/|api/).*)'],
};
