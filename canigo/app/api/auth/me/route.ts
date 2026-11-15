import { fail, ok } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return fail('Not authenticated', 401);
  }

  // Include user stats
  const contributionsCount = await prisma.contribution.count({
    where: { contributorId: user.id },
  });
  const reactionsCount = await prisma.reaction.count({
    where: { userId: user.id },
  });

  return ok({
    user,
    stats: {
      contributionsCount,
      reactionsCount,
    },
  });
}
