import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';

const challengeSchema = z.object({ type: z.enum(['This differs from my visit', 'Outdated']), explanation: z.string().min(8).max(2000), evidenceAssetId: z.string().optional() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const parsed = await readJson(request, challengeSchema);
  if (parsed.response) return parsed.response;
  if (!request.headers.get('x-canigo-user')) return fail('Sign in to challenge a claim.', 401);
  const { id } = await params;
  return ok({ challenge: { id: crypto.randomUUID(), claimId: id, ...parsed.data, status: 'candidate_for_review', createdAt: new Date().toISOString() }, mode: 'demo', message: 'Challenge recorded separately from the current claim and sent for review.' }, { status: 201 });
}
