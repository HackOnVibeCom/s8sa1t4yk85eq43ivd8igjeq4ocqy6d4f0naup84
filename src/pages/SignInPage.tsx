import React, { useState } from 'react';
import { ArrowRight, UserRound } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const SignInPage: React.FC = () => {
  const { authRole, authError, isSupabaseConfigured, signIn, signUp } = useApp();
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

  const inputClassName = 'mt-1.5 w-full rounded-xl border border-[#E5E5DC] bg-[#F7F6F0] px-3 py-2.5 font-normal disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8 bg-ivory">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-7">
          <div className="mx-auto mb-3 w-11 h-11 rounded-2xl bg-[#DDEBE1] text-forest flex items-center justify-center">
            <UserRound className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold tracking-widest uppercase text-forest">CANIGO secure access</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#263C3A]">Sign in to CANIGO</h1>
          <p className="mt-2 text-sm text-[#74817B]">
            Sign in to your account or create a citizen account to continue.
          </p>
        </div>

        {authRole && (
          <div className="mb-4 rounded-xl border border-[#C3D8CE] bg-[#EDF4EA] px-4 py-3 text-center text-sm text-[#155E4B]">
            You are currently signed in as <strong>{authRole}</strong>. Use the account menu to sign out before switching accounts.
          </div>
        )}

        {!isSupabaseConfigured && (
          <p role="alert" className="mx-auto mb-4 max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Sign-in is unavailable because Supabase is not configured. Add your Supabase project URL and public anon key to the environment to enable authentication.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mx-auto max-w-md rounded-2xl border border-[#E5E5DC] bg-white p-6 shadow-card">
          {mode === 'signup' && (
            <label className="mb-4 block text-sm font-semibold text-[#263C3A]">
              Display name
              <input
                required
                disabled={!isSupabaseConfigured}
                autoComplete="name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className={inputClassName}
              />
            </label>
          )}
          <label className="mb-4 block text-sm font-semibold text-[#263C3A]">
            Email
            <input
              required
              disabled={!isSupabaseConfigured}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName}
            />
          </label>
          <label className="mb-4 block text-sm font-semibold text-[#263C3A]">
            Password
            <input
              required
              disabled={!isSupabaseConfigured}
              type="password"
              minLength={8}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClassName}
            />
          </label>
          {(formError || authError) && (
            <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError || authError}</p>
          )}
          {notice && <p role="status" className="mb-3 rounded-lg bg-[#EDF4EA] px-3 py-2 text-sm text-forest">{notice}</p>}
          <button
            type="submit"
            disabled={isSubmitting || !isSupabaseConfigured}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-forest-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Create citizen account' : 'Sign in'}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>
          <p className="mt-4 text-center text-sm text-[#74817B]">
            {mode === 'signup' ? 'Already have an account?' : 'New to CANIGO?'}{' '}
            <button
              type="button"
              disabled={!isSupabaseConfigured}
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup');
                setFormError('');
                setNotice('');
              }}
              className="font-bold text-forest underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mode === 'signup' ? 'Sign in' : 'Create a citizen account'}
            </button>
          </p>
          <p className="mt-4 text-center text-xs text-[#74817B]">
            New accounts are citizens. Administrator access is assigned separately by the project owner.
          </p>
        </form>

        <p className="mt-5 text-center text-xs text-[#74817B]">
          Your account and role are managed securely through Supabase.
        </p>
      </div>
    </section>
  );
};
