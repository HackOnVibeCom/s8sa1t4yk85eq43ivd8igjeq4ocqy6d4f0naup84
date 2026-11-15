import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const reactionSchema = z.object({
  type: z.enum(['Helpful', 'I observed this too', 'This differs from my visit', 'Outdated', 'Report']),
  note: z.string().max(1000).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const parsed = await readJson(request, reactionSchema);
  if (parsed.response) return parsed.response;

  const user = await getCurrentUser(request);
  const userId = user?.id || request.headers.get('x-canigo-user');
  if (!userId) return fail('Sign in to react to a contribution.', 401);

  const { id } = await params;
  try {
    await prisma.userProfile.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: user?.name || userId },
    });
    const reaction = await prisma.reaction.upsert({
      where: { contributionId_userId: { contributionId: id, userId } },
      update: { type: parsed.data.type, note: parsed.data.note },
      create: { contributionId: id, userId, type: parsed.data.type, note: parsed.data.note },
    });
    return ok({ reaction, trustImpact: parsed.data.type === 'Helpful' ? 'usefulness_only' : 'requires_independent_review', mode: 'prisma' }, { status: 201 });
  } catch (error) {
    console.error('Reaction error:', error);
    return fail('Could not save reaction. Confirm the contribution exists and the database is initialized.', 503);
  }
}
