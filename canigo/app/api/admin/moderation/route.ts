import { moderationItems } from '@/lib/demo-data';
import { fail, ok } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  const user = await getCurrentUser(request);
  const role = user?.role || request.headers.get('x-canigo-role');
  if (role !== 'Moderator' && role !== 'Administrator') {
    return fail('Moderator access is required. Please sign in as a Moderator.', 403);
  }
  return ok({
    items: moderationItems,
    mode: 'live',
    audit: 'Every decision must include reason code, explanation, moderator identity and timestamp.',
  });
}
