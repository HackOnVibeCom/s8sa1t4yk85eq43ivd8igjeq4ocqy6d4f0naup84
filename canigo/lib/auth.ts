import crypto from 'node:crypto';
import { prisma } from './prisma';

const SESSION_SECRET = process.env.SESSION_SECRET || 'canigo-hackathon-super-secret-key-2026';
export const SESSION_COOKIE_NAME = 'canigo_session';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
  } catch {
    return false;
  }
}

export function createSessionToken(payload: { userId: string; role: string }): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const data = JSON.stringify({ ...payload, exp: expiresAt });
  const encoded = Buffer.from(data).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string): { userId: string; role: string } | null {
  try {
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
    const data = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!data.exp || data.exp < Date.now()) return null;
    return { userId: data.userId, role: data.role };
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [key, ...v] = c.trim().split('=');
      return [key, decodeURIComponent(v.join('='))];
    })
  );
}

export async function getCurrentUser(request: Request) {
  // Check cookie first
  const cookieHeader = request.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);
  const token = cookies[SESSION_COOKIE_NAME];
  let userId: string | null = null;

  if (token) {
    const verified = verifySessionToken(token);
    if (verified) userId = verified.userId;
  }

  // Fallback to x-canigo-user header for API testing/compatibility
  if (!userId) {
    userId = request.headers.get('x-canigo-user');
  }

  if (!userId) return null;

  try {
    return await prisma.userProfile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  } catch {
    return null;
  }
}
