import { moderationItems } from '@/lib/demo-data';
import { fail, ok } from '@/lib/api';

export async function GET(request: Request) {
  const role = request.headers.get('x-canigo-role');
  if (role !== 'Moderator' && role !== 'Administrator') return fail('Moderator access is required.', 403);
  return ok({ items: moderationItems, mode: 'demo', audit: 'Every decision must include reason code, explanation, moderator identity and timestamp.' });
}
