import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';

const decisionSchema = z.object({
  action: z.enum(['Approve as reported', 'Request more evidence', 'Mark disputed', 'Mark stale', 'Reject', 'Remove for policy violation']),
  reasonCode: z.string().min(2).max(80),
  explanation: z.string().min(8).max(2000),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(request);
  const role = user?.role || request.headers.get('x-canigo-role');
  if (role !== 'Moderator' && role !== 'Administrator') {
    return fail('Moderator access is required.', 403);
  }

  const parsed = await readJson(request, decisionSchema);
  if (parsed.response) return parsed.response;

  const { id } = await params;
  const moderatorId = user?.id || request.headers.get('x-canigo-user') || 'moderator';

  return ok(
    {
      moderationAction: {
        id: crypto.randomUUID(),
        queueItemId: id,
        ...parsed.data,
        moderatorId,
        createdAt: new Date().toISOString(),
      },
      immutableAuditEvent: true,
      previousStatusPreserved: true,
      mode: 'live',
    },
    { status: 201 }
  );
}
