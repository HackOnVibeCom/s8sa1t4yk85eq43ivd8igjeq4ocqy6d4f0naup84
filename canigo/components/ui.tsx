import Link from 'next/link';
import { ArrowUpRight, Check, CircleAlert, Clock3, Eye, FileCheck2, Flag, Info, LockKeyhole, MapPin, ShieldCheck, Sparkles, ThumbsUp, Users } from 'lucide-react';
import { cn, formatDate, getFreshnessLabel, statusTone, valueTone } from '@/lib/utils';
import type { AccessibilityClaim, EvidenceAsset, Venue } from '@/lib/types';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="group inline-flex items-center gap-3" aria-label="CANIGO home">
    <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-teal text-white shadow-sm transition-transform group-hover:-translate-y-0.5">
      <span className="absolute h-5 w-3 rounded-t-md border-2 border-white border-b-0" />
      <span className="absolute bottom-1.5 h-1.5 w-4 rounded-full bg-white/80" />
    </span>
    {!compact && <span className="text-[1.1rem] font-black tracking-[0.18em] text-navy">CANIGO</span>}
  </Link>;
}

export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-paper text-ink">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white">Skip to content</a>
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-8">
        <BrandLogo />
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/discover" className="transition-colors hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2">Discover</Link>
          <Link href="/contribute" className="transition-colors hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2">Contribute evidence</Link>
          <Link href="/moderation" className="transition-colors hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2">Moderation</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/profile" className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-navy transition hover:border-teal hover:text-teal sm:inline-flex">Sign in</Link>
          <Link href="/contribute" className="rounded-full bg-navy px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2">Share an observation</Link>
        </div>
      </div>
    </header>
    <main id="main-content">{children}</main>
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-10 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div><BrandLogo compact /><p className="mt-3 max-w-sm leading-6">Evidence-backed place information for more confident journeys. CANIGO is not a legal accessibility certification.</p></div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 font-semibold"><Link href="/discover" className="hover:text-teal">Discover places</Link><Link href="/contribute" className="hover:text-teal">Contribute</Link><Link href="/profile" className="hover:text-teal">Your profile</Link><span className="text-slate-400">Prisma + SQLite</span></div>
      </div>
    </footer>
  </div>;
}

export function SectionLabel({ eyebrow, children, dark = false }: { eyebrow: string; children: React.ReactNode; dark?: boolean }) {
  return <div className="mb-5"><p className={cn('mb-2 text-xs font-black uppercase tracking-[0.2em]', dark ? 'text-teal-200' : 'text-teal')}>{eyebrow}</p><h2 className={cn('text-2xl font-black tracking-tight sm:text-3xl', dark ? 'text-white' : 'text-navy')}>{children}</h2></div>;
}

export function DemoNotice({ compact = false }: { compact?: boolean }) {
  return <div className={cn('flex gap-3 rounded-2xl border border-[#D5E7E4] bg-[#EFF8F6] text-[#175F5B]', compact ? 'px-4 py-3 text-xs' : 'px-5 py-4 text-sm')}>
    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><p><strong>Demo data.</strong> These venue records and images are seeded examples for the MVP. They are not verified real-world accessibility information.</p>
  </div>;
}

export function StatusBadge({ status, compact = false }: { status: AccessibilityClaim['status']; compact?: boolean }) {
  const tone = statusTone(status);
  const icon = status === 'Independently reviewed' ? <ShieldCheck /> : status === 'Disputed' ? <CircleAlert /> : status === 'Stale' ? <Clock3 /> : status === 'Evidence attached' ? <FileCheck2 /> : <Eye />;
  return <span className={cn('status-badge', `status-${tone}`, compact && 'status-compact')} title={status}>{icon}<span>{status}</span></span>;
}

export function ValuePill({ value }: { value: AccessibilityClaim['value'] }) {
  return <span className={cn('value-pill', `value-${valueTone(value)}`)}><span className="value-dot" aria-hidden="true" />{value}</span>;
}

export function EvidenceVisual({ asset, large = false }: { asset?: EvidenceAsset; large?: boolean }) {
  const visual = asset?.visual ?? 'entrance';
  return <div className={cn('evidence-visual relative overflow-hidden', large ? 'min-h-[260px]' : 'min-h-[150px]')} data-visual={visual} role="img" aria-label={asset?.alt ?? 'Illustrative evidence image'}>
    <div className="absolute inset-0 opacity-80" />
    <div className="absolute bottom-0 left-[12%] right-[12%] top-[21%] rounded-t-[22px] border-[6px] border-white/75 bg-white/20 shadow-2xl backdrop-blur-[2px]" />
    <div className="absolute bottom-0 left-1/2 top-[35%] w-[6px] -translate-x-1/2 bg-white/80" />
    {visual === 'ramp' && <div className="absolute bottom-[18%] left-[13%] h-[14px] w-[70%] rotate-[-10deg] rounded-full bg-white/80 shadow-lg" />}
    {visual === 'lift' && <><div className="absolute left-[25%] top-[48%] h-[31%] w-[50%] rounded-t-xl border-4 border-white/70 bg-white/15" /><div className="absolute left-[53%] top-[58%] h-2 w-2 rounded-full bg-white" /></>}
    {visual === 'restroom' && <div className="absolute left-1/2 top-[47%] h-10 w-16 -translate-x-1/2 rounded-lg border-4 border-white/70 bg-white/20" />}
    {visual === 'parking' && <div className="absolute bottom-[13%] left-[10%] right-[10%] h-7 -skew-x-12 border-y-2 border-white/70" />}
    {visual === 'path' && <div className="absolute bottom-[-4%] left-[34%] h-[65%] w-[32%] rotate-[18deg] rounded-[50%] bg-white/45" />}
    <div className="absolute left-4 top-4 rounded-full bg-navy/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">Demo evidence image</div>
    {asset && <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3 text-white"><span className="text-sm font-bold drop-shadow">{asset.title}</span><span className="rounded-full bg-black/30 px-2 py-1 text-[10px] font-bold">{formatDate(asset.observedAt)}</span></div>}
  </div>;
}

export function ClaimCard({ claim, evidence, onClick }: { claim: AccessibilityClaim; evidence?: EvidenceAsset; onClick?: () => void }) {
  const content = <div className="claim-card group">
    <div className="flex items-start justify-between gap-4"><div><p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{claim.group}</p><h3 className="text-base font-extrabold text-navy">{claim.label}</h3></div><ValuePill value={claim.value} /></div>
    <p className="mt-3 text-sm leading-6 text-slate-600">{claim.note}</p>
    <div className="mt-4 flex flex-wrap items-center gap-2"><StatusBadge status={claim.status} compact /><span className="meta-item"><Clock3 />Observed {formatDate(claim.observedAt)}</span>{claim.lastReviewedAt && <span className="meta-item"><ShieldCheck />Reviewed {formatDate(claim.lastReviewedAt)}{claim.reviewedBy ? ` · ${claim.reviewedBy}` : ''}</span>}{claim.corroborationCount > 0 && <span className="meta-item"><Users />{claim.corroborationCount} corroboration{claim.corroborationCount === 1 ? '' : 's'}</span>}</div>
    {claim.status === 'Disputed' && <p className="mt-4 flex items-center gap-2 rounded-xl bg-[#FFF4EE] px-3 py-2 text-xs font-bold text-coral"><CircleAlert className="h-4 w-4" />Contradictory evidence is under review. Do not treat this claim as settled.</p>}
    {claim.status === 'Stale' && <p className="mt-4 flex items-center gap-2 rounded-xl bg-[#FFF8E7] px-3 py-2 text-xs font-bold text-amber"><Clock3 className="h-4 w-4" />This information may have changed. Consider re-checking before travel.</p>}
    {evidence && <div className="mt-4 overflow-hidden rounded-xl"><EvidenceVisual asset={evidence} /></div>}
  </div>;
  return onClick ? <button onClick={onClick} className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2">{content}</button> : content;
}

export function StatChip({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div className="stat-chip"><span className="stat-icon">{icon}</span><div><strong>{value}</strong><span>{label}</span></div></div>;
}

export function TrustLegend() {
  return <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
    <div className="legend-card"><ShieldCheck className="text-teal" /><div><strong>Independently reviewed</strong><span>Relevant evidence checked by a reviewer.</span></div></div>
    <div className="legend-card"><FileCheck2 className="text-sky-700" /><div><strong>Evidence attached</strong><span>A photo or note is available to inspect.</span></div></div>
    <div className="legend-card"><CircleAlert className="text-coral" /><div><strong>Disputed</strong><span>Material evidence conflicts or is under review.</span></div></div>
    <div className="legend-card"><Clock3 className="text-amber" /><div><strong>Stale</strong><span>Older information may no longer reflect conditions.</span></div></div>
  </div>;
}

export function ShareCard({ venue }: { venue: Venue }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky text-teal"><ArrowUpRight className="h-5 w-5" /></div><div><h3 className="font-extrabold text-navy">Share this evidence trail</h3><p className="mt-1 text-sm leading-5 text-slate-500">A recipient can inspect {venue.name}&apos;s claims without creating an account.</p></div></div><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-navy hover:border-teal hover:text-teal"><LockKeyhole className="h-4 w-4" />Copy public profile link</button></div>;
}

export function HelpfulButton({ count }: { count: number }) { return <span className="inline-flex items-center gap-1.5"><ThumbsUp className="h-4 w-4" />Helpful <span>{count}</span></span>; }
export function ConfirmButton({ count }: { count: number }) { return <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4" />I observed this too <span>{count}</span></span>; }
export function ReportButton() { return <span className="inline-flex items-center gap-1.5"><Flag className="h-4 w-4" />Report</span>; }
export function AiMark() { return <span className="inline-flex items-center gap-1 rounded-full bg-[#F0EAFE] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#6B45B7]"><Sparkles className="h-3 w-3" />Open-source AI draft</span>; }
export function VenuePin({ venue }: { venue: Venue }) { return <span className="meta-item"><MapPin />{venue.district}</span>; }
