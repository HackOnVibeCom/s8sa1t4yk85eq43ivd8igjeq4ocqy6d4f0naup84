'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserCheck, UserRound } from 'lucide-react';

export default function NavAuthStatus() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (payload?.data?.user) {
          setUser(payload.data.user);
        }
      })
      .catch(() => {});
  }, []);

  if (user) {
    return (
      <Link
        href="/profile"
        className="flex items-center gap-2 rounded-full border border-teal/30 bg-teal/5 px-3.5 py-1.5 text-xs font-bold text-teal transition hover:bg-teal/10"
      >
        <UserCheck className="h-3.5 w-3.5" />
        <span>{user.name.split(' ')[0]}</span>
        <span className="rounded bg-teal/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">{user.role}</span>
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-navy transition hover:border-teal hover:text-teal sm:inline-flex items-center gap-1.5"
    >
      <UserRound className="h-3.5 w-3.5 text-slate-400" />
      Sign in
    </Link>
  );
}
