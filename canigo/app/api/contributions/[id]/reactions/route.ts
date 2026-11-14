import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';
import { prisma } from '@/lib/prisma';

const reactionSchema = z.object({ type: z.enum(['Helpful', 'I observed this too', 'This differs from my visit', 'Outdated', 'Report']), note: z.string().max(1000).optional() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const parsed = await readJson(request, reactionSchema);
  if (parsed.response) return parsed.response;
  const user = request.headers.get('x-canigo-user');
  if (!user) return fail('Sign in to react to a contribution.', 401);
  const { id } = await params;
  try {
    await prisma.userProfile.upsert({ where: { id: user }, update: {}, create: { id: user, name: user } });
    const reaction = await prisma.reaction.upsert({ where: { contributionId_userId: { contributionId: id, userId: user } }, update: { type: parsed.data.type, note: parsed.data.note }, create: { contributionId: id, userId: user, type: parsed.data.type, note: parsed.data.note } });
    return ok({ reaction, trustImpact: parsed.data.type === 'Helpful' ? 'usefulness_only' : 'requires_independent_review', mode: 'prisma' }, { status: 201 });
  } catch { return fail('Could not save reaction. Confirm the contribution exists and the database is initialized.', 503); }
}
