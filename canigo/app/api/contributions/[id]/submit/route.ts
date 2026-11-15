import { fail, ok } from '@/lib/api';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!request.headers.get('x-canigo-user')) return fail('Authentication is required to submit a contribution.', 401);
  const { id } = await params;
  try { const contribution = await prisma.contribution.update({ where: { id }, data: { moderationStatus: 'queued' } }); return ok({ id: contribution.id, status: 'queued', verificationStatus: contribution.status, auditEvent: 'submission_created', mode: 'prisma', message: 'Queued for human review; helpful votes cannot verify it.' }); } catch { return fail('Contribution not found or database is not initialized.', 404); }
}
