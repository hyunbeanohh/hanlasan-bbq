import { type NextRequest } from 'next/server';
import { deleteInquiryAction } from '../actions';

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await deleteInquiryAction(Number(id));
  // deleteInquiryAction calls redirect('/inquiry'), which throws.
  // This return is unreachable but keeps TS happy.
  return new Response(null, { status: 303, headers: { Location: '/inquiry' } });
}
