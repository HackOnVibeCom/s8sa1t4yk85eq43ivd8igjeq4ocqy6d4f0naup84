import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const reportSchema = z.object({
  contributionId: z.string().min(1),
  reason: z.enum(['spam', 'wrong venue', 'manipulated image', 'harassment', 'privacy issue', 'outdated']),
  explanation: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  const parsed = await readJson(request, reportSchema);
  if (parsed.response) return parsed.response;

  const user = await getCurrentUser(request);
  const userId = user?.id || request.headers.get('x-canigo-user');
  if (!userId) return fail('Sign in to report content.', 401);

  try {
    await prisma.userProfile.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: user?.name || userId },
    });
    const report = await prisma.report.create({
      data: {
        contributionId: parsed.data.contributionId,
        reporterId: userId,
        reason: parsed.data.reason,
        explanation: parsed.data.explanation,
      },
    });
    return ok({ report, mode: 'prisma', message: 'Report queued for human moderation.' }, { status: 201 });
  } catch (error) {
    console.error('Report error:', error);
    return fail('Could not save report. Confirm the contribution exists and database setup is complete.', 503);
  }
}
