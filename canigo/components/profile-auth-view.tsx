'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Gavel,
  KeyRound,
  LockKeyhole,
  LogOut,
  MapPin,
  ShieldCheck,
  UserCheck,
  UserPlus,
  UserRound,
} from 'lucide-react';

interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  role: string;
}

export default function ProfileAuthView() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<{ contributionsCount: number; reactionsCount: number }>({
    contributionsCount: 0,
    reactionsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Contributor' | 'Moderator'>('Contributor');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const payload = await res.json();
        if (payload.data?.user) {
          setCurrentUser(payload.data.user);
          setStats(payload.data.stats || { contributionsCount: 0, reactionsCount: 0 });
        }
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to sign in.');
      }
      setCurrentUser(data.data.user);
      setSuccessMsg('Successfully signed in!');
      fetchUser();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to create account.');
      }
      setCurrentUser(data.data.user);
      setSuccessMsg('Account created successfully!');
      fetchUser();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setSubmitting(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setEmail('');
      setPassword('');
      setSuccessMsg('Logged out successfully.');
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  function fillPreset(presetEmail: string, presetPass: string) {
    setEmail(presetEmail);
    setPassword(presetPass);
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-teal border-t-transparent" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Checking session...</p>
      </div>
    );
  }

  // LOGGED IN STATE
  if (currentUser) {
    return (
      <div className="space-y-8">
        <div className="rounded-3xl border border-teal/20 bg-gradient-to-br from-white to-[#F0FAF8] p-8 shadow-soft">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal text-white shadow-md">
                <UserCheck className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-navy">{currentUser.name}</h2>
                  <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-teal-800">
                    {currentUser.role}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{currentUser.email || 'No email provided'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-coral"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>

          <div className="mt-8 grid gap-4 border-t border-slate-200/60 pt-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Contributions</p>
              <p className="mt-2 text-2xl font-black text-navy">{stats.contributionsCount}</p>
              <p className="text-xs text-slate-500">Observations submitted</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Reactions</p>
              <p className="mt-2 text-2xl font-black text-navy">{stats.reactionsCount}</p>
              <p className="text-xs text-slate-500">Community validations</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Trust Level</p>
              <p className="mt-2 text-2xl font-black text-teal">Active</p>
              <p className="text-xs text-slate-500">Full verified access</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/contribute"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:border-teal hover:shadow-lift"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <Camera className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-black text-navy group-hover:text-teal">Submit New Observation</h3>
              <p className="mt-1 text-sm text-slate-500">Add first-hand accessibility evidence for any venue.</p>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-teal" />
          </Link>

          {currentUser.role === 'Moderator' ? (
            <Link
              href="/moderation"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:border-teal hover:shadow-lift"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <Gavel className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-black text-navy group-hover:text-teal">Moderator Queue</h3>
                <p className="mt-1 text-sm text-slate-500">Review pending reports, verify evidence, and audit logs.</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-teal" />
            </Link>
          ) : (
            <Link
              href="/discover"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:border-teal hover:shadow-lift"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-black text-navy group-hover:text-teal">Explore Verified Places</h3>
                <p className="mt-1 text-sm text-slate-500">Browse interactive map and claim-level details.</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-teal" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  // NOT LOGGED IN STATE: TABS FOR SIGN IN & CREATE ACCOUNT
  return (
    <div className="mx-auto max-w-xl">
      {/* Tab toggle */}
      <div className="mb-6 flex rounded-2xl bg-slate-100 p-1">
        <button
          onClick={() => {
            setAuthMode('signin');
            setErrorMsg('');
          }}
          className={`flex-1 rounded-xl py-3 text-sm font-bold transition ${
            authMode === 'signin' ? 'bg-white text-navy shadow-sm' : 'text-slate-600 hover:text-navy'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setAuthMode('register');
            setErrorMsg('');
          }}
          className={`flex-1 rounded-xl py-3 text-sm font-bold transition ${
            authMode === 'register' ? 'bg-white text-navy shadow-sm' : 'text-slate-600 hover:text-navy'
          }`}
        >
          Create Account
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-2xl border border-coral/30 bg-coral/10 p-4 text-sm font-bold text-coral">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-teal/30 bg-teal/10 p-4 text-sm font-bold text-teal">
          <CheckCircle2 className="h-5 w-5" />
          {successMsg}
        </div>
      )}

      {authMode === 'signin' ? (
        <form onSubmit={handleLogin} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-xl font-black text-navy">Welcome Back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in with your email and password.</p>

          {/* Quick preset credentials for testing */}
          <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200/70">
            <p className="text-xs font-bold text-slate-600">Quick sign-in credentials:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fillPreset('contributor@canigo.org', 'password123')}
                className="rounded-lg bg-teal/10 px-2.5 py-1 text-xs font-semibold text-teal hover:bg-teal/20"
              >
                Contributor (contributor@canigo.org)
              </button>
              <button
                type="button"
                onClick={() => fillPreset('moderator@canigo.org', 'password123')}
                className="rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-200"
              >
                Moderator (moderator@canigo.org)
              </button>
            </div>
          </div>

          <label className="field-label mt-5">
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-input"
              placeholder="you@example.com"
            />
          </label>

          <label className="field-label mt-5">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-input"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3.5 text-sm font-bold text-white transition hover:bg-teal disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-xl font-black text-navy">Create your Account</h2>
          <p className="mt-1 text-sm text-slate-500">Join the civic-tech accessibility community.</p>

          <label className="field-label mt-5">
            Full name
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-input"
              placeholder="Alex Morgan"
            />
          </label>

          <label className="field-label mt-5">
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-input"
              placeholder="alex@example.com"
            />
          </label>

          <label className="field-label mt-5">
            Password (at least 6 characters)
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-input"
              placeholder="Choose a secure password"
            />
          </label>

          <label className="field-label mt-5">
            Account Role
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'Contributor' | 'Moderator')}
              className="select-input"
            >
              <option value="Contributor">Contributor (Submit observations & corroborate)</option>
              <option value="Moderator">Moderator (Review queue & policy verification)</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 py-3.5 text-sm font-bold text-white transition hover:bg-teal disabled:opacity-50"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
            <UserPlus className="h-4 w-4" />
          </button>
        </form>
      )}
    </div>
  );
}
