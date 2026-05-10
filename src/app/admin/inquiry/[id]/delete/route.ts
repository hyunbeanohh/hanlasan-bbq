import { type NextRequest } from 'next/server';
import { adminDeleteAction } from '../actions';

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await adminDeleteAction(Number(id));
  return new Response(null, { status: 303, headers: { Location: '/admin/inquiry' } });
}
