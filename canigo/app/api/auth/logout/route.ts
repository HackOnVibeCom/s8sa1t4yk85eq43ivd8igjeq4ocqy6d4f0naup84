import { ok } from '@/lib/api';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  const response = ok({ success: true, message: 'Logged out successfully' });
  response.headers.set(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
  return response;
}
