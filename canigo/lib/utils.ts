import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClaimStatus, ClaimValue } from './types';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

export function statusTone(status: ClaimStatus) {
  if (status === 'Independently reviewed') return 'reviewed';
  if (status === 'Community corroborated') return 'corroborated';
  if (status === 'Disputed') return 'disputed';
  if (status === 'Stale') return 'stale';
  if (status === 'Rejected / removed') return 'removed';
  if (status === 'Evidence attached') return 'evidence';
  return 'reported';
}

export function valueTone(value: ClaimValue) {
  if (value === 'Yes') return 'positive';
  if (value === 'No') return 'negative';
  if (value === 'Partial') return 'partial';
  return 'unknown';
}

export function getFreshnessLabel(observedAt: string) {
  const days = Math.floor((Date.now() - new Date(`${observedAt}T00:00:00`).getTime()) / 86400000);
  if (days < 45) return 'Observed recently';
  if (days < 120) return 'Observed this season';
  return 'Needs a re-check';
}
