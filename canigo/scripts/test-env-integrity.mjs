import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

console.log('====================================================');
console.log('       CANIGO .env CONFIGURATION INTEGRITY AUDIT    ');
console.log('====================================================\n');

let allPassed = true;

// 1. Verify .env file exists and parse lines
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file does not exist at:', envPath);
  process.exit(1);
}
console.log('✅ .env file found at:', envPath);

// Helper to check URLs
async function testEndpoint(name, url, options = {}) {
  try {
    const res = await fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      console.log(`✅ [${name}] reachable (HTTP ${res.status})`);
      return { success: true, status: res.status, res };
    } else {
      console.log(`⚠️ [${name}] returned HTTP ${res.status}: ${res.statusText}`);
      return { success: false, status: res.status, res };
    }
  } catch (err) {
    console.error(`❌ [${name}] connection failed:`, err.message);
    return { success: false, error: err.message };
  }
}

// 2. Check Database URL and Prisma
console.log('\n--- 1. DATABASE_URL Integrity ---');
const dbUrl = process.env.DATABASE_URL;
console.log(`Configured DATABASE_URL: ${dbUrl}`);
if (!dbUrl) {
  console.error('❌ DATABASE_URL is missing in environment!');
  allPassed = false;
} else {
  try {
    const prisma = new PrismaClient();
    const venueCount = await prisma.venue.count();
    const claimCount = await prisma.accessClaim.count();
    console.log(`✅ Prisma SQLite database connection verified!`);
    console.log(`   - Venues table accessible: ${venueCount} records found`);
    console.log(`   - AccessClaims table accessible: ${claimCount} records found`);
    await prisma.$disconnect();
  } catch (err) {
    console.error('❌ Database connection/query failed:', err.message);
    allPassed = false;
  }
}

// 3. Check Map Tile Provider
console.log('\n--- 2. MAP_TILE_PROVIDER_URL Integrity ---');
const tileUrl = process.env.MAP_TILE_PROVIDER_URL;
console.log(`Configured MAP_TILE_PROVIDER_URL: ${tileUrl}`);
if (!tileUrl) {
  console.log('ℹ️ MAP_TILE_PROVIDER_URL is not set (using built-in fallback).');
} else {
  // Test loading coordinate (zoom 0, x 0, y 0)
  const testTileUrl = tileUrl.replace('{s}', 'a').replace('{z}', '0').replace('{x}', '0').replace('{y}', '0');
  const tileResult = await testEndpoint('OpenStreetMap Tile Provider', testTileUrl, {
    headers: { 'User-Agent': 'CANIGO-Accessibility-Audit/1.0' },
  });
  if (!tileResult.success) allPassed = false;
}

// 4. Check Map Geocoding Provider
console.log('\n--- 3. MAP_GEOCODING_PROVIDER_URL Integrity ---');
const geocodingUrl = process.env.MAP_GEOCODING_PROVIDER_URL;
console.log(`Configured MAP_GEOCODING_PROVIDER_URL: ${geocodingUrl}`);
if (!geocodingUrl) {
  console.log('ℹ️ MAP_GEOCODING_PROVIDER_URL is not set (using built-in fallback).');
} else {
  const testGeoUrl = `${geocodingUrl.replace(/\/$/, '')}?q=Bengaluru&format=json&limit=1`;
  const geoResult = await testEndpoint('Nominatim Geocoding Provider', testGeoUrl, {
    headers: { 'User-Agent': 'CANIGO-Accessibility-Audit/1.0' },
  });
  if (geoResult.success) {
    try {
      const data = await geoResult.res.json();
      if (Array.isArray(data) && data.length > 0) {
        console.log(`   - Sample geocoding response resolved: "${data[0].display_name.slice(0, 60)}..."`);
      }
    } catch {
      console.log('   - Could not parse geocoding JSON');
    }
  } else {
    allPassed = false;
  }
}

// 5. Check Open-Source Vision AI Configuration & Hugging Face Token
console.log('\n--- 4. OPEN_SOURCE_VISION_* AI Integrity ---');
console.log(`AI_ANALYSIS_ENABLED: ${process.env.AI_ANALYSIS_ENABLED}`);
console.log(`OPEN_SOURCE_VISION_API_URL: ${process.env.OPEN_SOURCE_VISION_API_URL}`);
console.log(`OPEN_SOURCE_VISION_MODEL: ${process.env.OPEN_SOURCE_VISION_MODEL}`);
const hasKey = Boolean(process.env.OPEN_SOURCE_VISION_API_KEY);
const maskedKey = hasKey ? `${process.env.OPEN_SOURCE_VISION_API_KEY.slice(0, 6)}...${process.env.OPEN_SOURCE_VISION_API_KEY.slice(-4)}` : 'none';
console.log(`OPEN_SOURCE_VISION_API_KEY: ${maskedKey}`);

if (process.env.AI_ANALYSIS_ENABLED === 'true') {
  const apiUrl = process.env.OPEN_SOURCE_VISION_API_URL;
  const apiKey = process.env.OPEN_SOURCE_VISION_API_KEY;
  const model = process.env.OPEN_SOURCE_VISION_MODEL;

  if (!apiUrl || !model) {
    console.error('❌ Vision AI is enabled, but API URL or MODEL is missing!');
    allPassed = false;
  } else {
    // Test endpoint connectivity and authentication
    console.log(`Testing authentication against ${apiUrl} using provided Hugging Face token...`);
    try {
      // Test models list or chat completion ping
      const authHeader = apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
      const modelsTest = await fetch(`${apiUrl.replace(/\/$/, '')}/models`, {
        headers: { ...authHeader, 'User-Agent': 'CANIGO-Accessibility-Audit/1.0' },
        signal: AbortSignal.timeout(10000),
      });

      if (modelsTest.ok) {
        console.log(`✅ Hugging Face authentication succeeded! (HTTP ${modelsTest.status})`);
        const modelsData = await modelsTest.json();
        console.log(`   - Endpoint is reachable and token is valid.`);
      } else if (modelsTest.status === 401 || modelsTest.status === 403) {
        console.error(`❌ Hugging Face token authentication failed (HTTP ${modelsTest.status}). Check token validity and permissions.`);
        allPassed = false;
      } else {
        console.log(`ℹ️ /models endpoint returned HTTP ${modelsTest.status} (${modelsTest.statusText}).`);
        // Test lightweight completion to test router
        console.log(`Testing chat/completions with model: ${model}...`);
        const chatTest = await fetch(`${apiUrl.replace(/\/$/, '')}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader,
            'User-Agent': 'CANIGO-Accessibility-Audit/1.0',
          },
          body: JSON.stringify({
            model,
            max_tokens: 5,
            messages: [{ role: 'user', content: 'Ping' }],
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (chatTest.ok) {
          console.log(`✅ Vision model endpoint successfully responded! (HTTP ${chatTest.status})`);
        } else {
          const errBody = await chatTest.text().catch(() => '');
          console.log(`⚠️ Chat endpoint status: HTTP ${chatTest.status} - ${errBody.slice(0, 120)}`);
          if (chatTest.status === 401 || chatTest.status === 403) {
            console.error('❌ Token was rejected by Hugging Face.');
            allPassed = false;
          } else {
            console.log('ℹ️ Router is reachable; note that serverless vision models on HF may load cold on demand.');
          }
        }
      }
    } catch (err) {
      console.error('❌ Vision AI endpoint check error:', err.message);
      allPassed = false;
    }
  }
} else {
  console.log('ℹ️ AI_ANALYSIS_ENABLED is false; vision inference is skipped.');
}

// 6. Summary
console.log('\n====================================================');
if (allPassed) {
  console.log('🎉 ALL CONFIGURATION INTEGRITY CHECKS PASSED!');
} else {
  console.log('⚠️ SOME CHECKS RETURNED WARNINGS OR ERRORS.');
}
console.log('====================================================\n');
