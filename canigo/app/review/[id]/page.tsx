import Link from 'next/link';
import { ArrowLeft, FileCheck2, ShieldAlert } from 'lucide-react';
import AiReviewPanel from '@/components/ai-review-panel';
import { DemoNotice, EvidenceVisual, Shell } from '@/components/ui';
import { getContribution, getEvidence } from '@/lib/demo-data';
import { aiAvailability } from '@/lib/ai';

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = getContribution(id);
  const evidence = record?.contribution.evidenceIds[0] ? getEvidence(record.contribution.evidenceIds[0]) : undefined;
  const availability = aiAvailability();
  if (!record) return <Shell><div className="mx-auto max-w-3xl px-5 py-20 text-center"><h1 className="text-3xl font-black text-navy">Review item not found</h1><Link href="/contribute" className="mt-5 inline-block font-bold text-teal">Return to contribution flow</Link></div></Shell>;
  return <Shell><div className="mx-auto max-w-[1120px] px-5 pb-20 pt-8 lg:px-8"><Link href="/contribute" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal"><ArrowLeft className="h-4 w-4" />Back to contribution</Link><div className="mt-8 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><p className="eyebrow">Human confirmation checkpoint</p><h1 className="page-title">Review the visual observation draft.</h1><p className="mt-4 text-base leading-7 text-slate-600">The open-source model can describe visible evidence related to one selected attribute. You decide what is accurate, what needs editing and what should be rejected.</p><div className="mt-6"><DemoNotice compact /></div><div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">{evidence && <EvidenceVisual asset={evidence} large />}<div className="p-5"><p className="text-xs font-black uppercase tracking-[0.14em] text-teal">Selected attribute</p><h2 className="mt-1 text-xl font-black text-navy">{record.contribution.attributeLabel}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{record.contribution.note}</p><div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-400"><FileCheck2 className="h-4 w-4 text-teal" />Stored separately from confirmed claims</div></div></div></div><div><div className="mb-4 flex items-center gap-2 rounded-2xl border border-[#F5C7B8] bg-[#FFF4EE] p-4 text-sm text-coral"><ShieldAlert className="h-5 w-5 shrink-0" /><span><strong>Safety rule:</strong> model confidence is not accessibility confidence.</span></div><AiReviewPanel draft={record.contribution.aiDraft} unavailable={!availability.enabled} /></div></div></div></Shell>;
}
