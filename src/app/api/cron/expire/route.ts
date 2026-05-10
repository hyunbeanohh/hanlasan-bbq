import { type NextRequest } from 'next/server';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { getDB, getEnv } from '@/lib/inquiries/cf';

export async function POST(req: NextRequest) {
  const env = getEnv();
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return new Response('forbidden', { status: 403 });
  }
  const repo = new InquiryRepository(getDB());
  const removed = await repo.deleteExpired(new Date());
  return Response.json({ removed });
}
