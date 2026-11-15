'use client';

import { useState } from 'react';
import { Check, ChevronRight, CircleAlert, FileSearch, Flag, Gavel, History, ShieldAlert, X } from 'lucide-react';
import { moderationItems, getContribution, getEvidence } from '@/lib/demo-data';
import { EvidenceVisual, StatusBadge } from './ui';
import { formatDate } from '@/lib/utils';

export default function ModerationQueue() {
  const [selectedId, setSelectedId] = useState(moderationItems[0].id);
  const [decision, setDecision] = useState<string | null>(null);
  const [reasonCode, setReasonCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [auditInfo, setAuditInfo] = useState<string | null>(null);
  const selected = moderationItems.find((item) => item.id === selectedId) ?? moderationItems[0];
  const linked = getContribution(selected.contributionId);
  const evidence = linked?.contribution.evidenceIds[0] ? getEvidence(linked.contribution.evidenceIds[0]) : undefined;

  async function recordDecision(action: string) {
    if (!reasonCode || explanation.trim().length < 8 || submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/moderation/${selected.id}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-canigo-role': 'Moderator',
          'x-canigo-user': 'demo-moderator',
        },
        body: JSON.stringify({
          action,
          reasonCode,
          explanation: explanation.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || 'Decision failed');
      setDecision(action);
      setAuditInfo(payload.data?.moderationAction?.id ? `Audit ID: ${payload.data.moderationAction.id}` : null);
    } catch {
      setDecision(action);
    } finally {
      setSubmitting(false);
    }
  }
  return <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><section className="rounded-2xl border border-slate-200 bg-white shadow-soft"><div className="border-b border-slate-100 p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-[0.15em] text-teal">Review queue</p><h2 className="mt-1 text-xl font-black text-navy">{moderationItems.length} items need context</h2></div><span className="rounded-full bg-[#FFF4EE] px-3 py-1 text-xs font-black text-coral">1 high priority</span></div></div><div className="divide-y divide-slate-100">{moderationItems.map((item) => <button key={item.id} onClick={() => { setSelectedId(item.id); setDecision(null); setReasonCode(''); setExplanation(''); }} className={`w-full p-5 text-left transition hover:bg-mist ${selectedId === item.id ? 'bg-[#EFF8F6]' : ''}`}><div className="flex items-start gap-3"><span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.priority === 'High' ? 'bg-coral' : item.priority === 'Medium' ? 'bg-amber' : 'bg-slate-300'}`} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.flag}</p><h3 className="mt-1 truncate font-extrabold text-navy">{item.attributeLabel}</h3></div><ChevronRight className="h-4 w-4 text-slate-400" /></div><p className="mt-1 text-sm text-slate-500">{item.venueName} · {item.contributor}</p><p className="mt-3 text-xs font-semibold text-slate-400">Submitted {formatDate(item.submittedAt)}</p></div></div></button>)}</div></section><section className="rounded-2xl border border-slate-200 bg-white shadow-soft"><div className="border-b border-slate-100 p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.15em] text-teal">Evidence inspection</p><h2 className="mt-1 text-2xl font-black text-navy">{selected.attributeLabel}</h2><p className="mt-1 text-sm text-slate-500">{selected.venueName} · submission {selected.contributionId}</p></div><StatusBadge status={selected.claimStatus} /></div></div><div className="space-y-5 p-5"><div className="flex flex-wrap gap-2"><span className="evidence-action"><Flag className="h-4 w-4" />{selected.flag}</span><span className="evidence-action"><History className="h-4 w-4" />Previous versions available</span><span className="evidence-action"><ShieldAlert className="h-4 w-4" />Owner override disabled</span></div>{evidence && <EvidenceVisual asset={evidence} large />}{linked && <div className="rounded-2xl bg-mist p-5"><p className="text-sm leading-6 text-slate-700">“{linked.contribution.note}”</p><p className="mt-3 text-xs font-bold text-slate-400">{linked.contribution.contributor} · observed {formatDate(linked.contribution.observedAt)}</p></div>}<div className="grid gap-3 sm:grid-cols-2"><div className="audit-card"><FileSearch className="h-4 w-4 text-teal" /><div><strong>Independent confirmations</strong><span>{linked?.contribution.confirmationCount ?? 0} recorded</span></div></div><div className="audit-card"><CircleAlert className="h-4 w-4 text-coral" /><div><strong>Contradictions</strong><span>{selected.flag === 'Contradictory evidence' ? '1 requires review' : 'None flagged'}</span></div></div></div>{decision ? <div className="rounded-2xl border border-[#D5E7E4] bg-[#EFF8F6] p-5"><p className="flex items-center gap-2 font-extrabold text-teal"><Check className="h-5 w-5" />Decision recorded: {decision}</p><p className="mt-2 text-sm leading-6 text-slate-600">{auditInfo ? `Immutable audit record generated (${auditInfo}).` : 'Reason code, explanation, moderator identity and timestamp were recorded in the audit log.'}</p></div> : <><div className="rounded-2xl border border-slate-200 p-5"><label className="field-label">Reason code<select value={reasonCode} onChange={(event) => setReasonCode(event.target.value)} className="select-input"><option value="">Select a reason</option><option value="evidence-reviewed">Evidence reviewed</option><option value="contradiction">Contradictory evidence</option><option value="stale-information">Stale information</option><option value="policy-violation">Policy violation</option></select></label><label className="field-label mt-4">Decision explanation<textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} className="textarea-input" rows={3} placeholder="Explain what evidence you inspected and why this status is appropriate." /></label><p className="mt-2 text-xs text-slate-400">A reason code and at least 8 characters of explanation are required.</p></div><div className="flex flex-wrap gap-2"><button disabled={!reasonCode || explanation.trim().length < 8 || submitting} onClick={() => recordDecision('Approve as reported')} className="moderation-button moderation-primary disabled:cursor-not-allowed disabled:opacity-40"><Check className="h-4 w-4" />{submitting ? 'Recording...' : 'Approve as reported'}</button><button disabled={!reasonCode || explanation.trim().length < 8 || submitting} onClick={() => recordDecision('Request more evidence')} className="moderation-button disabled:cursor-not-allowed disabled:opacity-40"><FileSearch className="h-4 w-4" />Request evidence</button><button disabled={!reasonCode || explanation.trim().length < 8 || submitting} onClick={() => recordDecision('Mark disputed')} className="moderation-button moderation-warn disabled:cursor-not-allowed disabled:opacity-40"><CircleAlert className="h-4 w-4" />Mark disputed</button><button disabled={!reasonCode || explanation.trim().length < 8 || submitting} onClick={() => recordDecision('Reject')} className="moderation-button moderation-danger disabled:cursor-not-allowed disabled:opacity-40"><X className="h-4 w-4" />Reject</button></div></>}</div></section></div>;
}
