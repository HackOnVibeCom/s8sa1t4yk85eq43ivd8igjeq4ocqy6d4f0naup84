import { NextRequest } from 'next/server';
import { z } from 'zod';
import { venues as demoVenues } from '@/lib/demo-data';
import { fail, ok, readJson } from '@/lib/api';
import { prisma } from '@/lib/prisma';
const createVenueSchema = z.object({ name: z.string().min(2).max(160), category: z.string().min(2).max(80), address: z.string().min(3).max(240), lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180) });
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.toLowerCase() ?? '';
  const category = request.nextUrl.searchParams.get('category') ?? '';
  const attribute = request.nextUrl.searchParams.get('attribute')?.toLowerCase() ?? '';
  try {
    const records = await prisma.venue.findMany({ where: { ...(category ? { category } : {}), ...(query ? { OR: [{ name: { contains: query } }, { address: { contains: query } }, { district: { contains: query } }] } : {}) }, include: { claims: true, _count: { select: { contributions: true } } } });
    if (records.length || process.env.DATABASE_URL) {
      const result = records.map((v) => {
        const claims = v.claims.map((c) => ({ ...c, observedAt: c.observedAt.toISOString().slice(0, 10), submittedAt: c.submittedAt.toISOString(), lastReviewedAt: c.lastReviewedAt?.toISOString(), evidenceIds: JSON.parse(c.evidenceIds) as string[] }));
        const lastObserved = claims.reduce((latest, claim) => (claim.observedAt > latest ? claim.observedAt : latest), claims[0]?.observedAt ?? v.createdAt.toISOString().slice(0, 10));
        return { ...v, tags: JSON.parse(v.tags) as string[], lastObserved, claims, contributions: [], contributionCount: v._count.contributions };
      });
      return ok({ venues: result.filter((venue) => !attribute || venue.claims.some((c) => c.label.toLowerCase().includes(attribute) && c.value !== 'Unknown')), demo: result.every((venue) => venue.isDemo), source: 'prisma' });
    }
  } catch { /* uninitialized database: keep the public demo experience available */ }
  const result = demoVenues.filter(v => (!query || `${v.name} ${v.address} ${v.district}`.toLowerCase().includes(query)) && (!category || v.category === category) && (!attribute || v.claims.some(c => c.label.toLowerCase().includes(attribute) && c.value !== 'Unknown'))).map(({ contributions, ...v }) => ({ ...v, contributionCount: contributions.length }));
  return ok({ venues: result, demo: true, source: 'demo', note: 'Sample information is illustrative and is not verified real-world accessibility data.' });
}
export async function POST(request: Request) {
  const parsed = await readJson(request, createVenueSchema); if (parsed.response) return parsed.response;
  const userId = request.headers.get('x-canigo-user'); if (!userId) return fail('Authentication is required to create a venue.', 401);
  try {
    const venue = await prisma.venue.create({ data: { ...parsed.data, source: 'community' } });
    return ok({ venue, mode: 'prisma' }, { status: 201 });
  } catch { return fail('Database is not ready. Run `npm run db:push` and try again.', 503); }
}
