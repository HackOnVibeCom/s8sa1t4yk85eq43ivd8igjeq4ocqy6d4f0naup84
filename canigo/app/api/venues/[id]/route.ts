import { getEvidence, getVenue } from '@/lib/demo-data';
import { fail, ok } from '@/lib/api';
import { prisma } from '@/lib/prisma';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const record = await prisma.venue.findUnique({ where: { id }, include: { claims: true, contributions: { where: { NOT: { moderationStatus: 'rejected' } }, orderBy: { submittedAt: 'desc' } } } });
    if (record) return ok({ venue: { ...record, tags: JSON.parse(record.tags), claims: record.claims.map(c => ({ ...c, observedAt: c.observedAt.toISOString().slice(0,10), evidenceIds: JSON.parse(c.evidenceIds) })) }, evidence: [], demo: record.isDemo, source: 'prisma' });
  } catch { /* demo fallback */ }
  const venue = getVenue(id);
  if (!venue) return fail('Venue not found.', 404);
  return ok({ venue, evidence: venue.claims.flatMap(claim => claim.evidenceIds.map(getEvidence).filter(Boolean)), demo: true, source: 'demo' });
}
