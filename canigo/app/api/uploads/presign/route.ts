import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';

const uploadSchema = z.object({ fileName: z.string().min(1).max(240), mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']), size: z.number().int().positive().max(10 * 1024 * 1024) });

export async function POST(request: Request) {
  const parsed = await readJson(request, uploadSchema);
  if (parsed.response) return parsed.response;
  if (!request.headers.get('x-canigo-user')) return fail('Authentication is required to request an upload.', 401);
  return fail('Private upload storage is not configured. Set up a trusted storage service before enabling uploads.', 503, { code: 'STORAGE_NOT_CONFIGURED' });
}
