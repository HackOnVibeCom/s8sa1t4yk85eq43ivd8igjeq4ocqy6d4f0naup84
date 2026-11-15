import { z } from 'zod';
import { analyzeImage, aiAvailability } from '@/lib/ai';
import { fail, ok, readJson } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';

const schema = z.object({
  imageUrl: z.string().url(),
  attribute: z.string().min(2).max(120),
  note: z.string().max(2000).optional(),
});

export async function POST(request: Request) {
  const parsed = await readJson(request, schema);
  if (parsed.response) return parsed.response;

  const user = await getCurrentUser(request);
  const userId = user?.id || request.headers.get('x-canigo-user');
  if (!userId) return fail('Authentication is required before analyzing a contribution image.', 401);

  const availability = aiAvailability();
  try {
    const draft = await analyzeImage(parsed.data);
    return ok({ draft, storedSeparatelyFromClaim: true, requiresHumanConfirmation: true, model: availability.model });
  } catch (error) {
    console.error('Vision analysis error:', error);
    return fail('The vision assist could not analyze this image. Human observation can be submitted directly.', 500);
  }
}
