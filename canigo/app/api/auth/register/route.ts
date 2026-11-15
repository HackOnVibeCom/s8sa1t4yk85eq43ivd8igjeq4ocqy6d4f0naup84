import { z } from 'zod';
import { fail, ok, readJson } from '@/lib/api';
import { prisma } from '@/lib/prisma';
import { createSessionToken, hashPassword, SESSION_COOKIE_NAME } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Contributor', 'Moderator']).default('Contributor'),
});

export async function POST(request: Request) {
  const parsed = await readJson(request, registerSchema);
  if (parsed.response) return parsed.response;

  const { name, email, password, role } = parsed.data;

  try {
    const existing = await prisma.userProfile.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return fail('An account with this email already exists.', 409);
    }

    const user = await prisma.userProfile.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        role,
      },
    });

    const token = createSessionToken({ userId: user.id, role: user.role });
    const response = ok({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });

    response.headers.set(
      'Set-Cookie',
      `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`
    );

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return fail('Unable to create account. Please try again.', 500);
  }
}
