import { NextResponse, type NextRequest } from 'next/server';
import { buildCanonical } from '@/lib/seo/canonical';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const canonical = buildCanonical(req.nextUrl.pathname);
  res.headers.set('Link', `<${canonical}>; rel="canonical"`);
  return res;
}

export const config = { matcher: ['/((?!_next|api|.*\\..*).*)'] };
