'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Filter, List, Map, MapPin, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { cn, getFreshnessLabel, statusTone } from '@/lib/utils';
import type { Venue } from '@/lib/types';
import { StatusBadge, ValuePill, VenuePin } from './ui';

const filters = ['All access needs', 'Step-free entrance', 'Ramp', 'Lift', 'Accessible restroom', 'Parking / drop-off'];

export default function DiscoveryBrowser({ initialVenues }: { initialVenues: Venue[] }) {
  const [venues, setVenues] = useState(initialVenues);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All venue types');
  const [accessFilter, setAccessFilter] = useState('All access needs');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => { let active = true; fetch('/api/venues').then(r => r.json()).then(result => { if (active && result?.data?.venues) setVenues(result.data.venues); }).catch(() => {}); return () => { active = false; }; }, []);
  const filtered = useMemo(() => venues.filter((venue) => {
    const matchesQuery = !query || `${venue.name} ${venue.address} ${venue.district}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All venue types' || venue.category === category;
    const matchesAccess = accessFilter === 'All access needs' || venue.claims.some((claim) => claim.label.toLowerCase().includes(accessFilter.replace(' / ', ' ').toLowerCase()) && claim.value !== 'Unknown');
    return matchesQuery && matchesCategory && matchesAccess;
  }), [accessFilter, category, venues, query]);

  return <div>
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-bold text-teal">{filtered.length} places to explore</p><p className="mt-1 text-sm text-slate-500">Every result has claim-level evidence to inspect.</p></div><div className="flex items-center gap-2"><button onClick={() => setView('list')} className={cn('view-toggle', view === 'list' && 'view-toggle-active')} aria-pressed={view === 'list'}><List className="h-4 w-4" />List</button><button onClick={() => setView('map')} className={cn('view-toggle', view === 'map' && 'view-toggle-active')} aria-pressed={view === 'map'}><Map className="h-4 w-4" />Map</button></div></div>
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
      <div className="flex flex-col gap-3 lg:flex-row"><label className="relative flex-1"><span className="sr-only">Search venues</span><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by place, neighbourhood or landmark" className="search-input pl-11" /></label><select value={category} onChange={(event) => setCategory(event.target.value)} className="select-input"><option>All venue types</option><option>Restaurant</option><option>Hospital</option><option>Shopping mall</option><option>Educational institution</option><option>Hotel</option><option>Public venue</option></select><button onClick={() => setFiltersOpen((open) => !open)} className="filter-trigger"><SlidersHorizontal className="h-4 w-4" />Filters <span className="rounded-full bg-teal px-1.5 py-0.5 text-[10px] text-white">{accessFilter === 'All access needs' ? 0 : 1}</span></button></div>
      {filtersOpen && <div className="mt-3 border-t border-slate-100 pt-3"><div className="flex flex-wrap gap-2" role="group" aria-label="Accessibility filters">{filters.map((filter) => <button key={filter} onClick={() => setAccessFilter(filter)} className={cn('filter-chip', accessFilter === filter && 'filter-chip-active')}>{filter}{accessFilter === filter && filter !== 'All access needs' && <X className="h-3 w-3" />}</button>)}</div><p className="mt-3 text-xs text-slate-500"><Sparkles className="mr-1 inline h-3 w-3 text-[#6B45B7]" />Filters are evidence-aware. Unknown claims are not treated as negative answers.</p></div>}
    </div>
    {view === 'map' ? <div className="mt-5 grid min-h-[560px] overflow-hidden rounded-2xl border border-slate-200 bg-[#E7F1F6] shadow-soft lg:grid-cols-[0.85fr_1.15fr]"><div className="overflow-y-auto bg-white p-5">{filtered.map((venue) => <Link key={venue.id} href={`/venues/${venue.id}`} className="block border-b border-slate-100 py-4 first:pt-0"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.1em] text-teal">{venue.category}</p><h3 className="mt-1 font-extrabold text-navy">{venue.name}</h3><VenuePin venue={venue} /></div><span className="rounded-full bg-[#EFF8F6] px-2 py-1 text-[10px] font-bold text-teal">{venue.claims.length} claims</span></div></Link>)}</div><div className="map-surface relative p-8"><div className="map-grid absolute inset-0" /><div className="relative flex h-full min-h-[490px] items-center justify-center"><div className="absolute left-[17%] top-[22%] h-28 w-52 rotate-12 rounded-[48%] bg-white/55" /><div className="absolute bottom-[16%] right-[10%] h-36 w-64 -rotate-12 rounded-[48%] bg-white/50" />{filtered.map((venue, index) => <Link key={venue.id} href={`/venues/${venue.id}`} className="map-marker" style={{ left: `${22 + (index * 19) % 58}%`, top: `${21 + (index * 17) % 60}%` }} aria-label={`Open ${venue.name}`}><span>{index + 1}</span><strong>{venue.name}</strong></Link>)}<div className="absolute bottom-5 left-5 rounded-xl border border-white/70 bg-white/85 px-4 py-3 text-xs font-semibold text-slate-600 shadow-sm"><MapPin className="mr-1 inline h-3.5 w-3.5 text-teal" />Map provider not configured in demo mode</div></div></div></div> : <div className="mt-5 grid gap-4 lg:grid-cols-2">{filtered.map((venue) => <VenueResultCard key={venue.id} venue={venue} />)}{filtered.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><Search className="mx-auto h-8 w-8 text-slate-300" /><h3 className="mt-3 text-lg font-extrabold text-navy">No places match these filters</h3><p className="mt-2 text-sm text-slate-500">Try a broader search or keep the attribute as Unknown.</p></div>}</div>}
  </div>;
}

function VenueResultCard({ venue }: { venue: Venue }) {
  const leadClaim = venue.claims.find((claim) => claim.value !== 'Unknown') ?? venue.claims[0];
  return <Link href={`/venues/${venue.id}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"><div className="flex items-start justify-between gap-4"><div><span className="text-xs font-black uppercase tracking-[0.14em] text-teal">{venue.category}</span><h3 className="mt-2 text-xl font-black text-navy group-hover:text-teal">{venue.name}</h3><p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-3.5 w-3.5" />{venue.address}</p></div><span className="rounded-xl bg-mist px-3 py-2 text-center"><strong className="block text-lg font-black text-navy">{venue.claims.length}</strong><span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">claims</span></span></div><p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{venue.description}</p><div className="mt-5 flex flex-wrap items-center gap-2">{leadClaim && <ValuePill value={leadClaim.value} />}{leadClaim && <StatusBadge status={leadClaim.status} compact />}<span className="meta-item ml-auto">{getFreshnessLabel(venue.lastObserved)}</span></div><div className="mt-4 flex flex-wrap gap-2">{venue.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500">{tag}</span>)}</div></Link>;
}
