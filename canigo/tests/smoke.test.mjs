import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const root = process.cwd();
const prisma = new PrismaClient();

test('project uses Prisma with a local SQLite default and no Supabase SDK', () => {
  const schema = fs.readFileSync(path.join(root, 'prisma/schema.prisma'), 'utf8');
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const env = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
  assert.match(schema, /provider = "sqlite"/);
  assert.match(schema, /model AccessClaim/);
  assert.match(schema, /@@unique\(\[contributionId, userId\]\)/);
  assert.match(env, /DATABASE_URL="file:\.\/dev\.db"/);
  assert.ok(pkg.dependencies['@prisma/client']);
  assert.equal(pkg.dependencies['@supabase/supabase-js'], undefined);
});

test('open-source vision configuration is available without closed model keys', () => {
  const env = fs.readFileSync(path.join(root, '.env.example'), 'utf8');
  assert.match(env, /OPEN_SOURCE_VISION_API_URL/);
  assert.match(env, /OPEN_SOURCE_VISION_MODEL=Qwen2\.5-VL-7B-Instruct/);
  assert.doesNotMatch(env, /GEMINI_API_KEY/);
});

test('route manifest includes public and protected surfaces', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/manus-routes.json'), 'utf8'));
  const paths = manifest.routes.map((route) => route.path);
  assert.ok(paths.includes('/'));
  assert.ok(paths.includes('/discover'));
  assert.ok(paths.includes('/venues/:id'));
  assert.ok(paths.includes('/moderation'));
});

test('database is initialized and seeded with venues and claims', async () => {
  const venueCount = await prisma.venue.count();
  assert.ok(venueCount >= 4, 'Should have at least 4 seeded venues');

  const claimCount = await prisma.accessClaim.count();
  assert.ok(claimCount >= 12, 'Should have at least 12 seeded claims');

  const lumenHouse = await prisma.venue.findUnique({
    where: { id: 'venue-1' },
    include: { claims: true },
  });
  assert.ok(lumenHouse, 'Lumen House should exist in database');
  assert.equal(lumenHouse.name, 'Lumen House');
  assert.ok(lumenHouse.claims.length > 0, 'Lumen House should have associated claims');
});

test('database enforces contribution and reaction relations', async () => {
  const testUserId = `test-user-${Date.now()}`;
  const user = await prisma.userProfile.create({
    data: { id: testUserId, name: 'Integration Test User', role: 'Contributor' },
  });

  const contribution = await prisma.contribution.create({
    data: {
      venueId: 'venue-1',
      contributorId: user.id,
      attributeLabel: 'Step-free entrance',
      note: 'Integration test observation note with sufficient length.',
      observedAt: new Date('2026-11-14'),
      publicConsent: true,
      aiConsent: true,
      status: 'Reported',
    },
  });
  assert.ok(contribution.id, 'Contribution should be created');

  const reaction = await prisma.reaction.create({
    data: {
      contributionId: contribution.id,
      userId: user.id,
      type: 'Helpful',
    },
  });
  assert.ok(reaction.id, 'Reaction should be recorded');

  // Verify unique reaction constraint per user/contribution
  await assert.rejects(
    () =>
      prisma.reaction.create({
        data: {
          contributionId: contribution.id,
          userId: user.id,
          type: 'Helpful',
        },
      }),
    /Unique constraint failed/,
    'Should prevent duplicate reactions from same user on same contribution'
  );

  // Clean up test data
  await prisma.reaction.delete({ where: { id: reaction.id } });
  await prisma.contribution.delete({ where: { id: contribution.id } });
  await prisma.userProfile.delete({ where: { id: user.id } });
});

test.after(async () => {
  await prisma.$disconnect();
});

