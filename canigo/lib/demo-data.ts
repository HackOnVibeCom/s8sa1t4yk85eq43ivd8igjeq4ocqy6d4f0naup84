import type { AccessibilityClaim, Contribution, EvidenceAsset, ModerationItem, Venue } from './types';

export const evidenceAssets: EvidenceAsset[] = [
  { id: 'ev-entrance-1', kind: 'photo', title: 'Main entrance approach', alt: 'Illustrative demo image of a level entry and glass door', observedAt: '2026-11-10', submittedAt: '2026-11-11', contributor: 'Asha (demo)', isDemo: true, visual: 'entrance' },
  { id: 'ev-ramp-1', kind: 'photo', title: 'Side ramp', alt: 'Illustrative demo image of a gentle side ramp with handrail', observedAt: '2026-11-09', submittedAt: '2026-11-09', contributor: 'Rohan (demo)', isDemo: true, visual: 'ramp' },
  { id: 'ev-lift-1', kind: 'photo', title: 'Lift lobby', alt: 'Illustrative demo image of a lift lobby and call button', observedAt: '2026-11-04', submittedAt: '2026-11-05', contributor: 'Meera (demo)', isDemo: true, visual: 'lift' },
  { id: 'ev-restroom-1', kind: 'photo', title: 'Restroom entry', alt: 'Illustrative demo image of a wide restroom entry', observedAt: '2026-10-21', submittedAt: '2026-10-22', contributor: 'Nikhil (demo)', isDemo: true, visual: 'restroom' },
  { id: 'ev-parking-1', kind: 'photo', title: 'Drop-off bay', alt: 'Illustrative demo image of a marked drop-off bay near a curb cut', observedAt: '2026-10-30', submittedAt: '2026-10-31', contributor: 'Asha (demo)', isDemo: true, visual: 'parking' },
  { id: 'ev-path-1', kind: 'photo', title: 'Courtyard path', alt: 'Illustrative demo image of a paved courtyard path', observedAt: '2026-09-14', submittedAt: '2026-09-15', contributor: 'Kabir (demo)', isDemo: true, visual: 'path' },
];

const claim = (input: Omit<AccessibilityClaim, 'venueId'> & { venueId?: string }): AccessibilityClaim => ({ ...input, venueId: input.venueId ?? '' });

const venueSeed: Array<Omit<Venue, 'claims' | 'contributions'> & { claimSeeds: Array<Omit<AccessibilityClaim, 'venueId'>>; contributionSeeds: Array<Omit<Contribution, 'venueId'>> }> = [
  {
    id: 'venue-1', name: 'Lumen House', category: 'Restaurant', address: '24 Residency Road, Ashok Nagar', district: 'Central Bengaluru', lat: 12.9718, lon: 77.5947,
    source: 'CANIGO demo seed', isDemo: true, lastObserved: '2026-11-10',
    description: 'A neighbourhood restaurant with a street-level front door and a quieter side entrance. The team has shared opening-hours information, but operating conditions can change.',
    tags: ['street-level', 'side entrance', 'quiet seating'],
    claimSeeds: [
      claim({ id: 'claim-1', attributeKey: 'step_free_entrance', label: 'Step-free entrance', group: 'Entrance', value: 'Yes', note: 'Main entrance appears level from the pavement. Ask staff to hold the second door open during busy periods.', status: 'Evidence attached', observedAt: '2026-11-10', submittedAt: '2026-11-11', evidenceIds: ['ev-entrance-1'], corroborationCount: 2, challengeCount: 0 }),
      claim({ id: 'claim-2', attributeKey: 'ramp_availability', label: 'Ramp availability', group: 'Entrance', value: 'Partial', note: 'A sloped side approach is visible. Exact gradient and whether it is always clear were not measured.', status: 'Reported', observedAt: '2026-11-09', submittedAt: '2026-11-09', evidenceIds: ['ev-ramp-1'], corroborationCount: 1, challengeCount: 0 }),
      claim({ id: 'claim-3', attributeKey: 'accessible_restroom', label: 'Accessible restroom', group: 'Restroom', value: 'Unknown', note: 'No current evidence about turning clearance or grab rails.', status: 'Reported', observedAt: '2026-10-18', submittedAt: '2026-10-18', evidenceIds: [], corroborationCount: 0, challengeCount: 0 }),
      claim({ id: 'claim-4', attributeKey: 'seating_accessibility', label: 'Seating accessibility', group: 'Seating', value: 'Partial', note: 'Several tables have knee clearance; the narrow back room has fixed bench seating.', status: 'Community corroborated', observedAt: '2026-10-28', submittedAt: '2026-10-29', lastReviewedAt: '2026-11-02', reviewedBy: 'CANIGO community review', evidenceIds: ['ev-entrance-1'], corroborationCount: 3, challengeCount: 1 }),
    ],
    contributionSeeds: [
      { id: 'contrib-1', claimId: 'claim-1', attributeLabel: 'Step-free entrance', note: 'I visited before lunch. The street-level entrance was open and the door was easy to pull from a seated position.', contributor: 'Asha R.', contributorType: 'Demo contributor', submittedAt: '2026-11-11', observedAt: '2026-11-10', status: 'Evidence attached', helpfulCount: 18, confirmationCount: 3, reportCount: 0, evidenceIds: ['ev-entrance-1'], isDemo: true },
      { id: 'contrib-2', claimId: 'claim-2', attributeLabel: 'Ramp availability', note: 'The side ramp was visible, but I could not confirm the slope or whether the side gate is unlocked after 8pm.', contributor: 'Rohan P.', contributorType: 'Demo contributor', submittedAt: '2026-11-09', observedAt: '2026-11-09', status: 'Reported', helpfulCount: 9, confirmationCount: 1, reportCount: 0, evidenceIds: ['ev-ramp-1'], isDemo: true },
    ],
  },
  {
    id: 'venue-2', name: 'Civic Square Hospital', category: 'Hospital', address: '8 Dr Ambedkar Veedhi, Shivajinagar', district: 'North Bengaluru', lat: 12.9859, lon: 77.6033,
    source: 'CANIGO demo seed', isDemo: true, lastObserved: '2026-11-04',
    description: 'A public hospital campus with a marked drop-off area and multiple buildings. The emergency entrance and outpatient entrance may have different conditions.',
    tags: ['drop-off', 'lift', 'multi-building'],
    claimSeeds: [
      claim({ id: 'claim-5', attributeKey: 'accessible_parking', label: 'Accessible parking', group: 'Approach', value: 'Partial', note: 'A marked drop-off bay is near the outpatient entrance. Dedicated parking allocation was not confirmed.', status: 'Evidence attached', observedAt: '2026-10-30', submittedAt: '2026-10-31', evidenceIds: ['ev-parking-1'], corroborationCount: 1, challengeCount: 0 }),
      claim({ id: 'claim-6', attributeKey: 'lift_availability', label: 'Lift availability', group: 'Inside circulation', value: 'Yes', note: 'A lift lobby is visible in the outpatient block. Operational status may vary; ask at reception on arrival.', status: 'Disputed', observedAt: '2026-11-04', submittedAt: '2026-11-05', lastReviewedAt: '2026-11-06', reviewedBy: 'S. Iyer, moderator', evidenceIds: ['ev-lift-1'], corroborationCount: 1, challengeCount: 1 }),
      claim({ id: 'claim-7', attributeKey: 'path_surface', label: 'Path surface', group: 'Approach', value: 'Partial', note: 'The main approach is paved, but a construction section may create a temporary uneven patch.', status: 'Stale', observedAt: '2026-09-14', submittedAt: '2026-09-15', evidenceIds: ['ev-path-1'], corroborationCount: 2, challengeCount: 1 }),
    ],
    contributionSeeds: [
      { id: 'contrib-3', claimId: 'claim-6', attributeLabel: 'Lift availability', note: 'The lift was marked out of service during my visit on 4 Nov. This may be a temporary outage, so please re-check with staff.', contributor: 'Meera S.', contributorType: 'Demo contributor', submittedAt: '2026-11-05', observedAt: '2026-11-04', status: 'Disputed', helpfulCount: 22, confirmationCount: 0, reportCount: 1, evidenceIds: ['ev-lift-1'], isDemo: true },
    ],
  },
  {
    id: 'venue-3', name: 'Mosaic Mall', category: 'Shopping mall', address: '100 Outer Ring Road, Mahadevapura', district: 'East Bengaluru', lat: 12.9592, lon: 77.6974,
    source: 'CANIGO demo seed', isDemo: true, lastObserved: '2026-10-21',
    description: 'A large retail centre with several entry points. This profile is a useful example of why individual claims matter: the ground-floor entry and restroom evidence are different.',
    tags: ['large venue', 'multiple entrances', 'ground floor'],
    claimSeeds: [
      claim({ id: 'claim-8', attributeKey: 'step_free_entrance', label: 'Step-free entrance', group: 'Entrance', value: 'Yes', note: 'West entrance is shown as level in the latest observation.', status: 'Community corroborated', observedAt: '2026-10-21', submittedAt: '2026-10-22', evidenceIds: ['ev-entrance-1'], corroborationCount: 4, challengeCount: 0 }),
      claim({ id: 'claim-9', attributeKey: 'accessible_restroom', label: 'Accessible restroom', group: 'Restroom', value: 'Partial', note: 'A wide entry is visible, but the internal layout and transfer space were not measured.', status: 'Evidence attached', observedAt: '2026-10-21', submittedAt: '2026-10-22', evidenceIds: ['ev-restroom-1'], corroborationCount: 1, challengeCount: 0 }),
      claim({ id: 'claim-10', attributeKey: 'drop_off', label: 'Drop-off availability', group: 'Approach', value: 'Unknown', note: 'No recent first-hand observation is available for the taxi drop-off lane.', status: 'Reported', observedAt: '2026-09-30', submittedAt: '2026-10-01', evidenceIds: [], corroborationCount: 0, challengeCount: 0 }),
    ],
    contributionSeeds: [
      { id: 'contrib-4', claimId: 'claim-9', attributeLabel: 'Accessible restroom', note: 'The entry is wide and signposted. I did not enter the stall, so the internal turning space is unknown.', contributor: 'Nikhil D.', contributorType: 'Demo contributor', submittedAt: '2026-10-22', observedAt: '2026-10-21', status: 'Evidence attached', helpfulCount: 14, confirmationCount: 2, reportCount: 0, evidenceIds: ['ev-restroom-1'], isDemo: true },
    ],
  },
  {
    id: 'venue-4', name: 'Riverbend Learning Commons', category: 'Educational institution', address: '5 University Avenue, Yelahanka', district: 'North Bengaluru', lat: 13.1007, lon: 77.5963,
    source: 'CANIGO demo seed', isDemo: true, lastObserved: '2026-10-30',
    description: 'A campus library and study space with a level plaza and lift connection between the public floors. Campus access may still require a visitor pass.',
    tags: ['library', 'campus', 'quiet space'],
    claimSeeds: [
      claim({ id: 'claim-11', attributeKey: 'step_free_entrance', label: 'Step-free entrance', group: 'Entrance', value: 'Yes', note: 'Main plaza approach is level in the latest observation.', status: 'Independently reviewed', observedAt: '2026-10-30', submittedAt: '2026-10-30', lastReviewedAt: '2026-11-01', reviewedBy: 'CANIGO review panel', evidenceIds: ['ev-entrance-1'], corroborationCount: 3, challengeCount: 0 }),
      claim({ id: 'claim-12', attributeKey: 'lift_availability', label: 'Lift availability', group: 'Inside circulation', value: 'Unknown', note: 'Lift is shown on campus signage, but no current operating-status evidence is attached.', status: 'Reported', observedAt: '2026-10-30', submittedAt: '2026-10-30', evidenceIds: [], corroborationCount: 0, challengeCount: 0 }),
    ],
    contributionSeeds: [],
  },
];

export const venues: Venue[] = venueSeed.map((item) => {
  const claims = item.claimSeeds.map((seed) => ({ ...seed, venueId: item.id }));
  const contributions = item.contributionSeeds.map((seed) => ({ ...seed, venueId: item.id }));
  return { ...item, claims, contributions };
});

export const moderationItems: ModerationItem[] = [
  { id: 'mod-1', contributionId: 'contrib-3', venueId: 'venue-2', venueName: 'Civic Square Hospital', attributeLabel: 'Lift availability', flag: 'Contradictory evidence', submittedAt: '2026-11-05', contributor: 'Meera S.', claimStatus: 'Disputed', evidenceIds: ['ev-lift-1'], priority: 'High' },
  { id: 'mod-2', contributionId: 'contrib-4', venueId: 'venue-3', venueName: 'Mosaic Mall', attributeLabel: 'Accessible restroom', flag: 'Privacy review', submittedAt: '2026-10-22', contributor: 'Nikhil D.', claimStatus: 'Evidence attached', evidenceIds: ['ev-restroom-1'], priority: 'Medium' },
  { id: 'mod-3', contributionId: 'contrib-2', venueId: 'venue-1', venueName: 'Lumen House', attributeLabel: 'Ramp availability', flag: 'Outdated report', submittedAt: '2026-11-09', contributor: 'Rohan P.', claimStatus: 'Reported', evidenceIds: ['ev-ramp-1'], priority: 'Low' },
];

export function getVenue(id: string) { return venues.find((venue) => venue.id === id); }
export function getContribution(id: string) {
  for (const venue of venues) {
    const contribution = venue.contributions.find((item) => item.id === id);
    if (contribution) return { contribution, venue };
  }
  return undefined;
}
export function getEvidence(id: string) { return evidenceAssets.find((asset) => asset.id === id); }
