import { PrismaClient } from '@prisma/client';
import { venues } from '../lib/demo-data';

const prisma = new PrismaClient();

async function main() {
  await prisma.userProfile.upsert({
    where: { id: 'demo-contributor' },
    update: { name: 'Demo contributor', role: 'Contributor' },
    create: { id: 'demo-contributor', name: 'Demo contributor', role: 'Contributor' },
  });
  await prisma.userProfile.upsert({
    where: { id: 'demo-moderator' },
    update: { name: 'Demo moderator', role: 'Moderator' },
    create: { id: 'demo-moderator', name: 'Demo moderator', role: 'Moderator' },
  });

  for (const venue of venues) {
    await prisma.venue.upsert({
      where: { id: venue.id },
      update: {
        name: venue.name,
        category: venue.category,
        address: venue.address,
        district: venue.district,
        lat: venue.lat,
        lon: venue.lon,
        source: venue.source,
        description: venue.description,
        tags: JSON.stringify(venue.tags),
        isDemo: true,
      },
      create: {
        id: venue.id,
        name: venue.name,
        category: venue.category,
        address: venue.address,
        district: venue.district,
        lat: venue.lat,
        lon: venue.lon,
        source: venue.source,
        description: venue.description,
        tags: JSON.stringify(venue.tags),
        isDemo: true,
      },
    });

    for (const claim of venue.claims) {
      await prisma.accessClaim.upsert({
        where: { id: claim.id },
        update: {
          attributeKey: claim.attributeKey,
          label: claim.label,
          group: claim.group,
          value: claim.value,
          note: claim.note,
          status: claim.status,
          observedAt: new Date(claim.observedAt),
          submittedAt: new Date(claim.submittedAt),
          lastReviewedAt: claim.lastReviewedAt ? new Date(claim.lastReviewedAt) : null,
          reviewedBy: claim.reviewedBy ?? null,
          evidenceIds: JSON.stringify(claim.evidenceIds),
          corroborationCount: claim.corroborationCount,
          challengeCount: claim.challengeCount,
          ownerProvided: claim.ownerProvided ?? false,
        },
        create: {
          id: claim.id,
          venueId: venue.id,
          attributeKey: claim.attributeKey,
          label: claim.label,
          group: claim.group,
          value: claim.value,
          note: claim.note,
          status: claim.status,
          observedAt: new Date(claim.observedAt),
          submittedAt: new Date(claim.submittedAt),
          lastReviewedAt: claim.lastReviewedAt ? new Date(claim.lastReviewedAt) : null,
          reviewedBy: claim.reviewedBy ?? null,
          evidenceIds: JSON.stringify(claim.evidenceIds),
          corroborationCount: claim.corroborationCount,
          challengeCount: claim.challengeCount,
          ownerProvided: claim.ownerProvided ?? false,
        },
      });
    }

    for (const contribution of venue.contributions) {
      await prisma.contribution.upsert({
        where: { id: contribution.id },
        update: {
          note: contribution.note,
          attributeLabel: contribution.attributeLabel,
          status: contribution.status,
          moderationStatus: 'visible',
          observedAt: new Date(contribution.observedAt),
          submittedAt: new Date(contribution.submittedAt),
          publicConsent: true,
          isDemo: true,
        },
        create: {
          id: contribution.id,
          venueId: venue.id,
          claimId: contribution.claimId,
          contributorId: 'demo-contributor',
          attributeLabel: contribution.attributeLabel,
          note: contribution.note,
          observedAt: new Date(contribution.observedAt),
          submittedAt: new Date(contribution.submittedAt),
          status: contribution.status,
          moderationStatus: 'visible',
          publicConsent: true,
          isDemo: true,
        },
      });
    }
  }

  console.log(`Seeded ${venues.length} labeled demo venues.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
