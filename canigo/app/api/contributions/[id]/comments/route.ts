import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const commentSchema = z.object({
  body: z.string().min(2).max(2000),
  parentId: z.string().optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const parsed = await readJson(request, commentSchema);
  if (parsed.response) return parsed.response;

  const user = await getCurrentUser(request);
  const userId = user?.id || request.headers.get('x-canigo-user');
  if (!userId) return fail('Sign in to comment.', 401);

  const { id } = await params;
  try {
    await prisma.userProfile.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: user?.name || userId },
    });
    const comment = await prisma.comment.create({
      data: {
        contributionId: id,
        authorId: userId,
        body: parsed.data.body,
        parentId: parsed.data.parentId,
      },
    });
    return ok({ comment, mode: 'prisma' }, { status: 201 });
  } catch (error) {
    console.error('Comment error:', error);
    return fail('Could not save comment. Confirm the contribution exists and the database is initialized.', 503);
  }
}
