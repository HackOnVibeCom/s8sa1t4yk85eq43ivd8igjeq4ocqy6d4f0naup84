import { Search } from 'lucide-react';
import DiscoveryBrowser from '@/components/discovery-browser';
import { DemoNotice, SectionLabel, Shell } from '@/components/ui';
import { venues } from '@/lib/demo-data';

export default function DiscoverPage() {
  return <Shell><div className="mx-auto max-w-[1440px] px-5 pb-20 pt-12 lg:px-8"><div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end"><div><p className="eyebrow">Discovery, without guesswork</p><h1 className="page-title">Find out what a place may be like before you arrive.</h1></div><div className="rounded-2xl bg-mist p-5"><p className="flex items-center gap-2 text-sm font-bold text-navy"><Search className="h-4 w-4 text-teal" />Search claims, not star ratings.</p><p className="mt-2 text-sm leading-6 text-slate-600">Use filters to find specific evidence. A missing attribute remains Unknown, never a negative answer.</p></div></div><div className="mt-8"><DemoNotice compact /></div><div className="mt-10"><DiscoveryBrowser initialVenues={venues} /></div><div className="mt-12"><SectionLabel eyebrow="How to read the results">Every claim has a trail.</SectionLabel><p className="max-w-2xl text-sm leading-6 text-slate-600">Statuses tell you how a claim is currently treated, while evidence and dates tell you why. “Helpful” is a usefulness signal, not proof.</p></div></div></Shell>;
}
