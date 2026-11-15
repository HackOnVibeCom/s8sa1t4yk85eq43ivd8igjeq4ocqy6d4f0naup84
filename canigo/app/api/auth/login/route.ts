import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { createSessionToken, SESSION_COOKIE_NAME, verifyPassword } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
  const parsed = await readJson(request, loginSchema);
  if (parsed.response) return parsed.response;

  const { email, password } = parsed.data;

  try {
    const user = await prisma.userProfile.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
      return fail('Invalid email or password.', 401);
    }

    const token = createSessionToken({ userId: user.id, role: user.role });
    const response = ok({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.headers.set(
      'Set-Cookie',
      `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return fail('Unable to sign in. Please try again.', 500);
  }
}
