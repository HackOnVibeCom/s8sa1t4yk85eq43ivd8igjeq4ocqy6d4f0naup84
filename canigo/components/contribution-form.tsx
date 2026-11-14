'use client';

import { useState } from 'react';
import { CheckCircle2, ImagePlus, LockKeyhole, Sparkles, UploadCloud } from 'lucide-react';
import { venues } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

export default function ContributionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState('');
  const [consentPublic, setConsentPublic] = useState(true);
  const [consentAi, setConsentAi] = useState(true);
  const [attribute, setAttribute] = useState('Step-free entrance');
  const [venueId, setVenueId] = useState('venue-1');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('2026-11-14');
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    if (!consentPublic) return;
    const file = (event.currentTarget as HTMLFormElement).querySelector<HTMLInputElement>('input[type="file"]')?.files?.[0];
    if (file && (file.size > 10 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
      setError('Choose a JPEG, PNG or WebP image up to 10MB.');
      return;
    }
    try {
      const response = await fetch('/api/contributions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-canigo-user': 'demo-contributor' }, body: JSON.stringify({ venueId, attributeKey: attribute.toLowerCase().replaceAll(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, ''), note, observedAt: date, publicConsent: consentPublic, aiConsent: consentAi, evidenceAssetId: file ? 'demo-upload-pending' : undefined }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || 'Contribution could not be submitted.');
      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Contribution could not be submitted.');
    }
  }
  if (submitted) return <div className="rounded-3xl border border-[#D5E7E4] bg-[#EFF8F6] p-8 text-center shadow-soft"><CheckCircle2 className="mx-auto h-12 w-12 text-teal" /><p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-teal">Contribution received</p><h2 className="mt-2 text-2xl font-black text-navy">Your observation is reported, not verified</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">In a connected environment, the image would be validated, privacy-processed and queued for community and moderator review. This demo keeps the workflow transparent without pretending to persist a real upload.</p><button onClick={() => setSubmitted(false)} className="mt-6 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white">Add another observation</button></div>;
  return <form onSubmit={submit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
    <div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Venue<select value={venueId} onChange={(event) => setVenueId(event.target.value)} className="select-input"><option value="">Select a venue</option>{venues.map((venue) => <option key={venue.id} value={venue.id}>{venue.name}</option>)}</select></label><label className="field-label">Accessibility attribute<select value={attribute} onChange={(event) => setAttribute(event.target.value)} className="select-input"><option>Step-free entrance</option><option>Ramp availability</option><option>Entrance steps</option><option>Doorway width (measured only)</option><option>Lift availability</option><option>Internal circulation</option><option>Accessible restroom</option><option>Accessible parking</option><option>Drop-off availability</option><option>Path surface</option><option>Seating accessibility</option></select></label></div>
    <label className="field-label">What did you observe?<textarea required minLength={10} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Share first-hand detail: what was visible, what was unknown, and what someone should ask on arrival." className="textarea-input" rows={5} /></label>
    <div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Observation date<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="text-input" /></label><div className="field-label"><span>Evidence photograph</span><label className="upload-zone"><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')} /><UploadCloud className="h-6 w-6 text-teal" /><span className="mt-2 text-sm font-bold text-navy">{fileName || 'Choose JPEG, PNG or WebP'}</span><span className="mt-1 text-xs text-slate-500">Private original + sanitized public derivative in connected mode</span></label></div></div>
    <div className="rounded-2xl border border-[#E4DCF8] bg-[#F7F3FF] p-5"><div className="flex gap-3"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#6B45B7]" /><div><h3 className="font-extrabold text-navy">Open-source AI observation assist</h3><p className="mt-1 text-sm leading-6 text-slate-600">If configured, the server sends this image to the selected open-source vision model for visible-evidence drafting only. You review every suggestion before it becomes part of a contribution.</p><p className="mt-3 text-xs font-bold text-[#6B45B7]">AI will never certify accessibility, measure compliance, or infer a complete barrier-free route.</p></div></div></div>
    <div className="space-y-3 rounded-2xl bg-mist p-5"><label className="consent-row"><input type="checkbox" checked={consentPublic} onChange={(event) => setConsentPublic(event.target.checked)} /><span><strong>Publish this observation and sanitized image</strong><small>Remove unnecessary EXIF metadata and protect personal details before display.</small></span></label><label className="consent-row"><input type="checkbox" checked={consentAi} onChange={(event) => setConsentAi(event.target.checked)} /><span><strong>Allow open-source AI processing</strong><small>AI output remains a separate draft and requires human confirmation.</small></span></label></div>
    {!consentPublic && <p className="text-sm font-bold text-coral">Public-display consent is required to submit a public contribution.</p>}
    {error && <p role="alert" className="rounded-xl bg-[#FFF4EE] px-4 py-3 text-sm font-bold text-coral">{error}</p>}
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-xs text-slate-500"><LockKeyhole className="h-4 w-4" />No exact home location is collected.</p><button type="submit" className={cn('rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-teal', !consentPublic && 'cursor-not-allowed opacity-50')}>Submit for review</button></div>
  </form>;
}
