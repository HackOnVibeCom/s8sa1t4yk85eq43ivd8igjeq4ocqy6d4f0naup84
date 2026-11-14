'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="flex min-h-screen items-center justify-center bg-paper px-5"><div className="max-w-md text-center"><AlertTriangle className="mx-auto h-10 w-10 text-coral" /><h1 className="mt-5 text-3xl font-black text-navy">Something needs another look.</h1><p className="mt-3 text-sm leading-6 text-slate-500">The page could not load. Try again, or return to public discovery.</p><button onClick={() => reset()} className="mt-6 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white hover:bg-teal">Try again</button></div></main>;
}
