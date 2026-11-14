export type VenueCategory = 'Restaurant' | 'Hospital' | 'Shopping mall' | 'Hotel' | 'Educational institution' | 'Public venue';
export type ClaimValue = 'Yes' | 'No' | 'Partial' | 'Unknown';
export type ClaimStatus = 'Reported' | 'Evidence attached' | 'Community corroborated' | 'Independently reviewed' | 'Disputed' | 'Stale' | 'Rejected / removed';
export type ReactionType = 'Helpful' | 'I observed this too' | 'This differs from my visit' | 'Outdated' | 'Report';
export type UserRole = 'Public visitor' | 'Contributor' | 'Venue owner' | 'Moderator' | 'Administrator';

export interface EvidenceAsset {
  id: string;
  kind: 'photo' | 'note';
  title: string;
  alt: string;
  observedAt: string;
  submittedAt: string;
  contributor: string;
  isDemo: boolean;
  visual: 'entrance' | 'ramp' | 'lift' | 'restroom' | 'parking' | 'path';
}

export interface AccessibilityClaim {
  id: string;
  venueId: string;
  attributeKey: string;
  label: string;
  group: 'Approach' | 'Entrance' | 'Inside circulation' | 'Restroom' | 'Seating';
  value: ClaimValue;
  note: string;
  status: ClaimStatus;
  observedAt: string;
  submittedAt: string;
  lastReviewedAt?: string;
  reviewedBy?: string;
  evidenceIds: string[];
  corroborationCount: number;
  challengeCount: number;
  ownerProvided?: boolean;
}

export interface Contribution {
  id: string;
  venueId: string;
  claimId: string;
  attributeLabel: string;
  note: string;
  contributor: string;
  contributorType: 'Community contributor' | 'Venue owner' | 'Demo contributor';
  submittedAt: string;
  observedAt: string;
  status: ClaimStatus;
  helpfulCount: number;
  confirmationCount: number;
  reportCount: number;
  evidenceIds: string[];
  isDemo: boolean;
  aiDraft?: AiObservationDraft;
}

export interface AiObservationDraft {
  attribute: string;
  observations: Array<{
    type: string;
    description: string;
    evidenceRegion?: string;
    confidence: 'low' | 'medium' | 'high';
  }>;
  cannotDetermine: string[];
  requiresHumanConfirmation: true;
  model: string;
  generatedAt: string;
}

export interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  address: string;
  district: string;
  lat: number;
  lon: number;
  source: string;
  isDemo: boolean;
  lastObserved: string;
  description: string;
  tags: string[];
  claims: AccessibilityClaim[];
  contributions: Contribution[];
}

export interface ModerationItem {
  id: string;
  contributionId: string;
  venueId: string;
  venueName: string;
  attributeLabel: string;
  flag: 'Privacy review' | 'Contradictory evidence' | 'Outdated report' | 'Duplicate signal';
  submittedAt: string;
  contributor: string;
  claimStatus: ClaimStatus;
  evidenceIds: string[];
  priority: 'High' | 'Medium' | 'Low';
}
