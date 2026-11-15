import Link from 'next/link';
import { ArrowRight, Camera, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { Shell } from '@/components/ui';
import ProfileAuthView from '@/components/profile-auth-view';

export default function ProfilePage() {
  return (
    <Shell>
      <div className="mx-auto max-w-[960px] px-5 pb-20 pt-14 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-sky text-teal">
            <UserRound className="h-8 w-8" />
          </div>
          <p className="eyebrow mt-7">Your CANIGO Profile & Authentication</p>
          <h1 className="page-title">Sign in to contribute, review and build community trust.</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Public discovery is open to all. An account gives you access to first-hand contributions, corroborations, and moderation workflows.
          </p>
        </div>

        <div className="mt-10">
          <ProfileAuthView />
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <Camera className="h-5 w-5 text-teal" />
            <h2 className="mt-4 font-black text-navy">Contribute</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Submit photos and first-hand observations with explicit consent.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <ShieldCheck className="h-5 w-5 text-teal" />
            <h2 className="mt-4 font-black text-navy">Build trust</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Confirm, challenge or report evidence without turning votes into fake proof.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <LockKeyhole className="h-5 w-5 text-teal" />
            <h2 className="mt-4 font-black text-navy">Privacy First</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Sensitive EXIF metadata is stripped; private residence coordinates are never stored.</p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/discover" className="inline-flex items-center gap-2 text-sm font-black text-teal hover:underline">
            Continue exploring places without an account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Shell>
  );
}
