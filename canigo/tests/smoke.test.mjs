import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
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
