import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';
import { prisma } from '@/lib/prisma';

const commentSchema = z.object({ body: z.string().min(2).max(2000), parentId: z.string().optional() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const parsed = await readJson(request, commentSchema);
  if (parsed.response) return parsed.response;
  const user = request.headers.get('x-canigo-user');
  if (!user) return fail('Sign in to comment.', 401);
  const { id } = await params;
  try {
    await prisma.userProfile.upsert({ where: { id: user }, update: {}, create: { id: user, name: user } });
    const comment = await prisma.comment.create({ data: { contributionId: id, authorId: user, body: parsed.data.body, parentId: parsed.data.parentId } });
    return ok({ comment, mode: 'prisma' }, { status: 201 });
  } catch { return fail('Could not save comment. Confirm the contribution exists and the database is initialized.', 503); }
}
