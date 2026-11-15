import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, UserRound, Users } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const demoAccounts = [
  {
    role: 'citizen' as const,
    title: 'Citizen portal',
    description: 'Discover places, contribute access details, and connect with your community.',
    email: 'citizen@canigo.demo',
    password: 'demo-citizen',
    icon: Users,
    button: 'Continue as citizen',
  },
  {
    role: 'admin' as const,
    title: 'Admin workspace',
    description: 'Review submissions, manage reports, and moderate accessibility information.',
    email: 'admin@canigo.demo',
    password: 'demo-admin',
    icon: ShieldCheck,
    button: 'Continue as admin',
  },
];

export const SignInPage: React.FC = () => {
  const { authRole, authError, isSupabaseConfigured, signIn, signInDemo, signUp } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');
    setNotice('');
    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        const signedIn = await signUp(displayName, email, password);
        if (!signedIn) setNotice('Account created. Check your email to confirm your address, then sign in.');
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Sign-in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8 bg-ivory">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-7">
          <div className="mx-auto mb-3 w-11 h-11 rounded-2xl bg-[#DDEBE1] text-forest flex items-center justify-center">
            <UserRound className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold tracking-widest uppercase text-forest">
            {isSupabaseConfigured ? 'CANIGO secure access' : 'CANIGO demo access'}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#263C3A]">
            {isSupabaseConfigured ? 'Sign in to CANIGO' : 'Choose your workspace'}
          </h1>
          <p className="mt-2 text-sm text-[#74817B]">
            {isSupabaseConfigured
              ? 'Create a citizen account or sign in to your existing workspace.'
              : 'Sign in as a citizen or administrator to open the matching set of tools.'}
          </p>
        </div>

        {authRole && (
          <div className="mb-4 rounded-xl border border-[#C3D8CE] bg-[#EDF4EA] px-4 py-3 text-center text-sm text-[#155E4B]">
            You are currently signed in as <strong>{authRole}</strong>.{' '}
            {isSupabaseConfigured ? 'Use the account menu to sign out before switching accounts.' : 'Choose either demo account to switch workspaces.'}
          </div>
        )}

        {isSupabaseConfigured ? (
          <form onSubmit={handleSubmit} className="mx-auto max-w-md rounded-2xl border border-[#E5E5DC] bg-white p-6 shadow-card">
            {mode === 'signup' && (
              <label className="mb-4 block text-sm font-semibold text-[#263C3A]">
                Display name
                <input
                  required
                  autoComplete="name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#E5E5DC] bg-[#F7F6F0] px-3 py-2.5 font-normal"
                />
              </label>
            )}
            <label className="mb-4 block text-sm font-semibold text-[#263C3A]">
              Email
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E5E5DC] bg-[#F7F6F0] px-3 py-2.5 font-normal"
              />
            </label>
            <label className="mb-4 block text-sm font-semibold text-[#263C3A]">
              Password
              <input
                required
                type="password"
                minLength={8}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#E5E5DC] bg-[#F7F6F0] px-3 py-2.5 font-normal"
              />
            </label>
            {(formError || authError) && (
              <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError || authError}</p>
            )}
            {notice && <p role="status" className="mb-3 rounded-lg bg-[#EDF4EA] px-3 py-2 text-sm text-forest">{notice}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-hover disabled:opacity-60"
            >
              {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Create citizen account' : 'Sign in'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
            <p className="mt-4 text-center text-sm text-[#74817B]">
              {mode === 'signup' ? 'Already have an account?' : 'New to CANIGO?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup');
                  setFormError('');
                  setNotice('');
                }}
                className="font-bold text-forest underline"
              >
                {mode === 'signup' ? 'Sign in' : 'Create a citizen account'}
              </button>
            </p>
            <p className="mt-4 text-center text-xs text-[#74817B]">
              Administrator accounts are assigned by the project owner; public sign-up creates citizen accounts only.
            </p>
          </form>
        ) : <div className="grid gap-4 md:grid-cols-2">
          {demoAccounts.map(({ role, title, description, email, password, icon: Icon, button }) => (
            <section key={role} className="rounded-2xl border border-[#E5E5DC] bg-white p-5 shadow-card">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF4EA] text-forest">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#263C3A]">{title}</h2>
                  <p className="mt-1 text-sm leading-5 text-[#74817B]">{description}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-[#F7F6F0] px-3.5 py-3 text-xs">
                <p className="font-semibold text-[#263C3A]">Demo account</p>
                <p className="mt-1 text-[#74817B]">Email: <span className="font-medium text-[#263C3A]">{email}</span></p>
                <p className="mt-0.5 text-[#74817B]">Password: <span className="font-medium text-[#263C3A]">{password}</span></p>
              </div>

              <button
                type="button"
                onClick={() => signInDemo(role)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
              >
                {button}
                <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          ))}
        </div>}

        <p className="mt-5 text-center text-xs text-[#74817B]">
          {isSupabaseConfigured
            ? 'Your account and role are managed securely through Supabase.'
            : 'Demo mode only — these client-side roles are for preview and are not production authentication.'}
        </p>
      </div>
    </section>
  );
};
