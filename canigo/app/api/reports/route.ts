import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';
import { prisma } from '@/lib/prisma';

const reportSchema = z.object({ contributionId: z.string().min(1), reason: z.enum(['spam', 'wrong venue', 'manipulated image', 'harassment', 'privacy issue', 'outdated']), explanation: z.string().max(2000).optional() });

export async function POST(request: Request) {
  const parsed = await readJson(request, reportSchema);
  if (parsed.response) return parsed.response;
  if (!request.headers.get('x-canigo-user')) return fail('Sign in to report content.', 401);
  const user = request.headers.get('x-canigo-user')!;
  try {
    await prisma.userProfile.upsert({ where: { id: user }, update: {}, create: { id: user, name: user } });
    const report = await prisma.report.create({ data: { contributionId: parsed.data.contributionId, reporterId: user, reason: parsed.data.reason, explanation: parsed.data.explanation } });
    return ok({ report, mode: 'prisma', message: 'Report queued for human moderation; it is not automatic proof of abuse.' }, { status: 201 });
  } catch { return fail('Could not save report. Confirm the contribution exists and database setup is complete.', 503); }
}
