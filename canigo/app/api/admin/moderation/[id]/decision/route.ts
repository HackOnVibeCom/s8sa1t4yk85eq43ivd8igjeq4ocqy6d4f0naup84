import { z } from 'zod';
import { fail, ok, readJson, requireModerator } from '@/lib/api';

const decisionSchema = z.object({ action: z.enum(['Approve as reported', 'Request more evidence', 'Mark disputed', 'Mark stale', 'Reject', 'Remove for policy violation']), reasonCode: z.string().min(2).max(80), explanation: z.string().min(8).max(2000) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!requireModerator(request)) return fail('Moderator access is required.', 403);
  const parsed = await readJson(request, decisionSchema);
  if (parsed.response) return parsed.response;
  const { id } = await params;
  return ok({ moderationAction: { id: crypto.randomUUID(), queueItemId: id, ...parsed.data, moderatorId: request.headers.get('x-canigo-user') || 'demo-moderator', createdAt: new Date().toISOString() }, immutableAuditEvent: true, previousStatusPreserved: true, mode: 'demo' }, { status: 201 });
}
