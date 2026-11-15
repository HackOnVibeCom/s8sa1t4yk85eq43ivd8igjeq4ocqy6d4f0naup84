import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Shell } from '@/components/ui';

export default function NotFound() { return <Shell><div className="mx-auto max-w-xl px-5 py-24 text-center"><SearchX className="mx-auto h-10 w-10 text-slate-300" /><h1 className="mt-5 text-3xl font-black text-navy">We could not find that place.</h1><p className="mt-3 text-sm leading-6 text-slate-500">The profile may have been removed or the link may be incomplete.</p><Link href="/discover" className="mt-6 inline-flex rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white hover:bg-teal">Return to discovery</Link></div></Shell>; }
