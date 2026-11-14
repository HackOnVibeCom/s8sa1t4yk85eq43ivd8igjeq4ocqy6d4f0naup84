import { z } from 'zod';
import { analyzeImage, aiAvailability } from '@/lib/ai';
import { fail, ok, readJson } from '@/lib/api';

const schema = z.object({ imageUrl: z.string().url(), attribute: z.string().min(2).max(120), note: z.string().max(2000).optional() });

export async function POST(request: Request) {
  const parsed = await readJson(request, schema);
  if (parsed.response) return parsed.response;
  if (!request.headers.get('x-canigo-user')) return fail('Authentication is required before analyzing a contribution image.', 401);
  const availability = aiAvailability();
  if (!availability.enabled) return fail(availability.message, 503, { code: 'OPEN_SOURCE_VISION_NOT_CONFIGURED', model: availability.model });
  try {
    const draft = await analyzeImage(parsed.data);
    return ok({ draft, storedSeparatelyFromClaim: true, requiresHumanConfirmation: true });
  } catch (error) {
    console.error('Open-source vision analysis failed', error);
    return fail('The open-source vision model could not analyze this image. Your human observation is still valid and can be submitted without AI.', 502, { code: 'OPEN_SOURCE_VISION_FAILED' });
  }
}
