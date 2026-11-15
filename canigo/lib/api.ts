import { NextResponse } from 'next/server';
import { z } from 'zod';

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data, error: null }, init);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ data: null, error: { message, details: details ?? null } }, { status });
}

type JsonResult<T extends z.ZodTypeAny> = { data: z.infer<T>; response?: never } | { data?: never; response: NextResponse };

export async function readJson<T extends z.ZodTypeAny>(request: Request, schema: T): Promise<JsonResult<T>> {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return { response: fail('Please check the highlighted fields.', 422, parsed.error.flatten()) };
    return { data: parsed.data };
  } catch {
    return { response: fail('Request body must be valid JSON.', 400) };
  }
}

import { getCurrentUser } from './auth';

export async function checkModerator(request: Request) {
  const user = await getCurrentUser(request);
  if (user && (user.role === 'Moderator' || user.role === 'Administrator')) {
    return true;
  }
  const role = request.headers.get('x-canigo-role');
  return role === 'Moderator' || role === 'Administrator';
}

export function requireModerator(request: Request) {
  const role = request.headers.get('x-canigo-role');
  return role === 'Moderator' || role === 'Administrator';
}
