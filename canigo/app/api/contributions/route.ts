import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const contributionSchema = z.object({
  venueId: z.string().min(1),
  attributeKey: z.string().min(1),
  note: z.string().min(10).max(2000),
  observedAt: z.string().date(),
  publicConsent: z.literal(true),
  aiConsent: z.boolean(),
  evidenceAssetId: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = await readJson(request, contributionSchema);
  if (parsed.response) return parsed.response;

  const user = await getCurrentUser(request);
  const contributorId = user?.id || request.headers.get('x-canigo-user');
  if (!contributorId) return fail('Authentication is required to submit a contribution.', 401);

  try {
    const venue = await prisma.venue.findUnique({ where: { id: parsed.data.venueId } });
    if (!venue) return fail('Venue was not found in the database.', 404);

    const claim = await prisma.accessClaim.findFirst({
      where: { venueId: venue.id, attributeKey: parsed.data.attributeKey },
    });

    const profile = await prisma.userProfile.upsert({
      where: { id: contributorId },
      update: {},
      create: { id: contributorId, name: user?.name || contributorId },
    });

    const contribution = await prisma.contribution.create({
      data: {
        venueId: venue.id,
        claimId: claim?.id,
        contributorId: profile.id,
        attributeLabel: claim?.label ?? parsed.data.attributeKey,
        note: parsed.data.note,
        observedAt: new Date(parsed.data.observedAt),
        publicConsent: true,
        aiConsent: parsed.data.aiConsent,
        status: parsed.data.evidenceAssetId ? 'Evidence attached' : 'Reported',
      },
    });

    return ok({ contribution, mode: 'prisma', message: 'Saved for human review; this is not verified.' }, { status: 201 });
  } catch (error) {
    console.error('Contribution error:', error);
    return fail('Unable to save contribution. Check database setup and venue/claim IDs.', 503);
  }
}
