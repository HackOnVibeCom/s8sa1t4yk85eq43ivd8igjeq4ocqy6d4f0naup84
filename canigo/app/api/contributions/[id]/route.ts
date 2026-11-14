import { getContribution } from '@/lib/demo-data';
import { fail, ok } from '@/lib/api';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = getContribution(id);
  if (!record) return fail('Contribution not found.', 404);
  return ok({ ...record, mode: 'demo' });
}
