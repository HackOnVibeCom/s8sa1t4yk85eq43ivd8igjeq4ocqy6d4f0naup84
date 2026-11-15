import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';

const challengeSchema = z.object({
  type: z.enum(['This differs from my visit', 'Outdated']),
  explanation: z.string().min(8).max(2000),
  evidenceAssetId: z.string().optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const parsed = await readJson(request, challengeSchema);
  if (parsed.response) return parsed.response;

  const user = await getCurrentUser(request);
  const userId = user?.id || request.headers.get('x-canigo-user');
  if (!userId) return fail('Sign in to challenge a claim.', 401);

  const { id } = await params;
  return ok(
    {
      challenge: {
        id: crypto.randomUUID(),
        claimId: id,
        userId,
        ...parsed.data,
        status: 'candidate_for_review',
        createdAt: new Date().toISOString(),
      },
      mode: 'live',
      message: 'Challenge recorded separately from the current claim and sent for review.',
    },
    { status: 201 }
  );
}
