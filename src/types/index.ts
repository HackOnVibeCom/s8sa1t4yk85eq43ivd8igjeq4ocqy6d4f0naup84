export type VerificationStatus = 
  | 'Verified' 
  | 'Community Verified' 
  | 'Under Review' 
  | 'Pending Verification' 
  | 'Reported' 
  | 'Disputed' 
  | 'Unknown';

export type AttributeStatus = 
  | 'Confirmed' 
  | 'Reported' 
  | 'Not Available' 
  | 'Unknown' 
  | 'Disputed';

export interface AccessibilityAttribute {
  id: string;
  type: 'Entrance' | 'Ramp' | 'Lift / Elevator' | 'Accessible Restroom' | 'Wheelchair-Friendly Seating' | 'Accessible Parking' | 'Quiet Space' | 'Tactile / Visual Aids';
  status: AttributeStatus;
  description: string;
  photoUrl?: string;
  slope?: string;
  lastObserved?: string;
  confirmedBy?: number;
}

export interface VenueReview {
  id: string;
  authorName: string;
  authorAvatar: string;
  date: string;
  rating: number;
  comment: string;
  helpfulCount: number;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  category: 'Restaurant' | 'Cafes' | 'Shopping Mall' | 'Public Place' | 'Educational' | 'Hospital' | 'Parks';
  categoryLabel: string;
  address: string;
  city: string;
  distance: string;
  rating: number;
  reviewCount: number;
  description: string;
  heroImage: string;
  images: string[];
  verificationStatus: VerificationStatus;
  verificationSummary: {
    verifiedCount: number;
    contributors: { name: string; avatar: string }[];
    lastUpdated: string;
    helpfulCount: number;
    reviewCount: number;
    photoCount: number;
    updateCount: number;
  };
  attributes: AccessibilityAttribute[];
  coordinates: {
    lat: number;
    lng: number;
  };
  features: {
    wheelchairAccess: boolean;
    stepFree: boolean;
    lift: boolean;
    accessibleRestroom: boolean;
    seating: boolean;
    parking: boolean;
    tactilePath?: boolean;
    widePath?: boolean;
    quietSpace?: boolean;
  };
  saved?: boolean;
}

export interface ContributionPhoto {
  id: string;
  url: string;
  category: string;
  detectedFeatures?: string[];
}

export interface Contribution {
  id: string;
  venueId: string;
  venueName: string;
  venueCategory: string;
  venueCity: string;
  contributorName: string;
  contributorAvatar: string;
  submissionDate: string;
  note: string;
  status: 'Verified' | 'Under Review' | 'Pending Verification' | 'Community Verified' | 'Reported' | 'Rejected';
  photos: ContributionPhoto[];
  aiAnalysis: {
    detected: string[];
    confidence: string;
    notes: string;
  };
  claim?: string;
  measurement?: string;
  helpfulCount: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: 'Top Contributor' | 'Community Verified' | 'Volunteer';
  venueName: string;
  venueSlug: string;
  date: string;
  content: string;
  photos: string[];
  helpfulCount: number;
  commentCount: number;
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    date: string;
    content: string;
    likes: number;
  }[];
  isSaved?: boolean;
  isLiked?: boolean;
  category: 'All Posts' | 'Reviews' | 'Questions' | 'Updates' | 'Verified Contributions';
}

export interface SavedList {
  id: string;
  name: string;
  icon: 'star' | 'briefcase' | 'pin';
  venueIds: string[];
}

export interface NotificationItem {
  id: string;
  type: 'verified' | 'comment' | 'helpful' | 'update_request' | 'report' | 'badge' | 'new_place';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  thumbnail?: string;
  badgeGraphic?: string;
  linkUrl?: string;
}

export interface ReportItem {
  id: string;
  contributionId: string;
  venueName: string;
  reason: 'Incorrect Information' | 'Misleading Photo' | 'Outdated Information' | 'Other Issue';
  description: string;
  evidenceFiles?: string[];
  status: 'Pending' | 'Investigating' | 'Resolved' | 'Dismissed';
  createdAt: string;
}

export interface RouteStep {
  instruction: string;
  distance: string;
  accessibilityNote?: string;
  hasStepFree: boolean;
}

export interface AccessibleRoutePlan {
  from: string;
  to: string;
  distance: string;
  duration: string;
  stepFreeStretches: string;
  accessibleRestroomsCount: number;
  wheelchairLandmarksCount: number;
  coordinates: [number, number][];
  disclaimer: string;
  steps: RouteStep[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    action: string;
    payload?: any;
  }[];
  venueCard?: Venue;
  routeCard?: AccessibleRoutePlan;
  confirmationCard?: {
    title: string;
    description: string;
    confirmAction: string;
    confirmPayload?: any;
    cancelLabel?: string;
  };
  navigationAction?: string;
}
