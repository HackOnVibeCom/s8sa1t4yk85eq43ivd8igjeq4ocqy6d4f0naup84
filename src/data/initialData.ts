import { Venue, Contribution, CommunityPost, SavedList, NotificationItem, ReportItem, AccessibleRoutePlan } from '../types';

export const INITIAL_VENUES: Venue[] = [
  {
    id: 'venue-1',
    name: 'The Garden Café',
    slug: 'the-garden-cafe',
    category: 'Restaurant',
    categoryLabel: 'Restaurant',
    address: 'No. 42, Cathedral Road, Chennai - 600086',
    city: 'Chennai',
    distance: '2.3 km',
    rating: 4.6,
    reviewCount: 28,
    description: 'A cozy café with step-free entrance, spacious seating and accessibility-friendly facilities.',
    heroImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    ],
    verificationStatus: 'Community Verified',
    verificationSummary: {
      verifiedCount: 3,
      contributors: [
        { name: 'Arun K.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' },
        { name: 'Nisha R.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
        { name: 'Karthik V.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
      ],
      lastUpdated: '2 days ago',
      helpfulCount: 428,
      reviewCount: 28,
      photoCount: 12,
      updateCount: 4,
    },
    coordinates: {
      lat: 13.0458,
      lng: 80.2520,
    },
    features: {
      wheelchairAccess: true,
      stepFree: true,
      lift: true,
      accessibleRestroom: true,
      seating: true,
      parking: false,
      quietSpace: true,
      tactilePath: false,
    },
    saved: true,
    attributes: [
      {
        id: 'attr-1',
        type: 'Entrance',
        status: 'Confirmed',
        description: 'Step-free entrance with ramp and handrail.',
        photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
        confirmedBy: 4,
        lastObserved: '2 days ago'
      },
      {
        id: 'attr-2',
        type: 'Ramp',
        status: 'Confirmed',
        description: 'Ramp available (~1:12 slope, with railing).',
        photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
        slope: '~1:12 slope',
        confirmedBy: 5,
        lastObserved: '2 days ago'
      },
      {
        id: 'attr-3',
        type: 'Lift / Elevator',
        status: 'Confirmed',
        description: 'Lift available and operational.',
        photoUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=400&q=80',
        confirmedBy: 3,
        lastObserved: '5 days ago'
      },
      {
        id: 'attr-4',
        type: 'Accessible Restroom',
        status: 'Reported',
        description: 'Reported by users, awaiting more evidence.',
        photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
        confirmedBy: 1,
        lastObserved: '3 days ago'
      },
      {
        id: 'attr-5',
        type: 'Wheelchair-Friendly Seating',
        status: 'Confirmed',
        description: 'Spacious seating with moveable chairs.',
        confirmedBy: 6,
        lastObserved: '2 days ago'
      },
      {
        id: 'attr-6',
        type: 'Accessible Parking',
        status: 'Not Available',
        description: 'No dedicated accessible parking observed nearby.',
        lastObserved: '1 week ago'
      },
      {
        id: 'attr-7',
        type: 'Quiet Space',
        status: 'Reported',
        description: 'Quieter seating area available (indoor).',
        confirmedBy: 2,
        lastObserved: '4 days ago'
      },
      {
        id: 'attr-8',
        type: 'Tactile / Visual Aids',
        status: 'Unknown',
        description: 'No information yet.',
        lastObserved: 'Never reported'
      }
    ]
  },
  {
    id: 'venue-2',
    name: 'Urban Dine',
    slug: 'urban-dine',
    category: 'Restaurant',
    categoryLabel: 'Restaurant',
    address: '15, Khader Nawaz Khan Rd, Nungambakkam, Chennai',
    city: 'Chennai',
    distance: '3.1 km',
    rating: 4.1,
    reviewCount: 17,
    description: 'Modern restaurant with accessible entrance and wide aisles.',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    ],
    verificationStatus: 'Under Review',
    verificationSummary: {
      verifiedCount: 1,
      contributors: [
        { name: 'Nisha R.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' }
      ],
      lastUpdated: 'Nov 11, 2026',
      helpfulCount: 95,
      reviewCount: 17,
      photoCount: 4,
      updateCount: 2,
    },
    coordinates: {
      lat: 13.0610,
      lng: 80.2440,
    },
    features: {
      wheelchairAccess: true,
      stepFree: true,
      lift: false,
      accessibleRestroom: true,
      seating: true,
      parking: false,
    },
    saved: false,
    attributes: [
      {
        id: 'attr-201',
        type: 'Entrance',
        status: 'Confirmed',
        description: 'Level step-free entrance from pavement.',
        confirmedBy: 2,
        lastObserved: 'Nov 11, 2026'
      },
      {
        id: 'attr-202',
        type: 'Accessible Restroom',
        status: 'Confirmed',
        description: 'Ground floor restroom with wide door.',
        confirmedBy: 1,
        lastObserved: 'Nov 11, 2026'
      },
      {
        id: 'attr-203',
        type: 'Lift / Elevator',
        status: 'Unknown',
        description: 'Single level venue, upper terrace lift status unknown.',
        lastObserved: 'Unknown'
      }
    ]
  },
  {
    id: 'venue-3',
    name: 'City Central Mall',
    slug: 'city-central-mall',
    category: 'Shopping Mall',
    categoryLabel: 'Shopping Mall',
    address: '49/50 Whites Road, Royapettah, Chennai - 600014',
    city: 'Chennai',
    distance: '5.8 km',
    rating: 4.7,
    reviewCount: 64,
    description: 'Multi-level mall with lifts, accessible restrooms and reserved parking.',
    heroImage: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    ],
    verificationStatus: 'Verified',
    verificationSummary: {
      verifiedCount: 5,
      contributors: [
        { name: 'Kanish Mathew M', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' },
        { name: 'Nisha R.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
      ],
      lastUpdated: 'Nov 8, 2026',
      helpfulCount: 612,
      reviewCount: 64,
      photoCount: 22,
      updateCount: 8,
    },
    coordinates: {
      lat: 13.0544,
      lng: 80.2612,
    },
    features: {
      wheelchairAccess: true,
      stepFree: true,
      lift: true,
      accessibleRestroom: true,
      seating: true,
      parking: true,
      tactilePath: true,
    },
    saved: true,
    attributes: [
      {
        id: 'attr-301',
        type: 'Entrance',
        status: 'Confirmed',
        description: 'Automatic wide sliding doors with smooth zero-threshold ramp.',
        confirmedBy: 6,
        lastObserved: 'Nov 8, 2026'
      },
      {
        id: 'attr-302',
        type: 'Lift / Elevator',
        status: 'Confirmed',
        description: 'Braille buttons, audible announcements, spacious interior.',
        confirmedBy: 5,
        lastObserved: 'Nov 8, 2026'
      },
      {
        id: 'attr-303',
        type: 'Accessible Restroom',
        status: 'Confirmed',
        description: 'Dedicated accessible restrooms on all 4 retail levels with call buttons.',
        confirmedBy: 7,
        lastObserved: 'Nov 8, 2026'
      },
      {
        id: 'attr-304',
        type: 'Accessible Parking',
        status: 'Confirmed',
        description: '12 dedicated extra-wide accessible parking bays next to basement elevators.',
        confirmedBy: 4,
        lastObserved: 'Nov 8, 2026'
      }
    ]
  },
  {
    id: 'venue-4',
    name: 'Marina Beach Promenade',
    slug: 'marina-beach-promenade',
    category: 'Public Place',
    categoryLabel: 'Public Place',
    address: 'Kamarajar Salai, Triplicane, Chennai - 600005',
    city: 'Chennai',
    distance: '6.4 km',
    rating: 4.5,
    reviewCount: 41,
    description: 'A popular beach promenade with step-free access and seating.',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
    ],
    verificationStatus: 'Community Verified',
    verificationSummary: {
      verifiedCount: 5,
      contributors: [
        { name: 'Keerthi M.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' }
      ],
      lastUpdated: 'Nov 5, 2026',
      helpfulCount: 380,
      reviewCount: 41,
      photoCount: 18,
      updateCount: 3,
    },
    coordinates: {
      lat: 13.0500,
      lng: 80.2824,
    },
    features: {
      wheelchairAccess: true,
      stepFree: true,
      lift: false,
      accessibleRestroom: false,
      seating: true,
      parking: true,
      widePath: true,
    },
    saved: true,
    attributes: [
      {
        id: 'attr-401',
        type: 'Entrance',
        status: 'Confirmed',
        description: 'Permanent concrete ramps leading from Kamarajar Salai to the promenade walkway.',
        confirmedBy: 6,
        lastObserved: 'Nov 5, 2026'
      },
      {
        id: 'attr-402',
        type: 'Wheelchair-Friendly Seating',
        status: 'Confirmed',
        description: 'Rest bays with cut-outs for wheelchairs next to stone benches.',
        confirmedBy: 5,
        lastObserved: 'Nov 5, 2026'
      },
      {
        id: 'attr-403',
        type: 'Accessible Restroom',
        status: 'Unknown',
        description: 'Public bio-toilets along beach; accessibility ramp condition varies.',
        lastObserved: 'Nov 5, 2026'
      }
    ]
  },
  {
    id: 'venue-5',
    name: 'Chennai Public Library',
    slug: 'chennai-public-library',
    category: 'Educational',
    categoryLabel: 'Educational',
    address: 'Gandhi Irwin Rd, Egmore, Chennai - 600008',
    city: 'Chennai',
    distance: '800 m',
    rating: 4.7,
    reviewCount: 212,
    description: 'Renowned state central library with dedicated Braille section and audio reading aids.',
    heroImage: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    ],
    verificationStatus: 'Verified',
    verificationSummary: {
      verifiedCount: 8,
      contributors: [
        { name: 'Arun K.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' }
      ],
      lastUpdated: 'Nov 10, 2026',
      helpfulCount: 512,
      reviewCount: 212,
      photoCount: 15,
      updateCount: 5,
    },
    coordinates: {
      lat: 13.0780,
      lng: 80.2600,
    },
    features: {
      wheelchairAccess: true,
      stepFree: true,
      lift: true,
      accessibleRestroom: true,
      seating: true,
      parking: true,
      tactilePath: true,
    },
    saved: false,
    attributes: [
      {
        id: 'attr-501',
        type: 'Entrance',
        status: 'Confirmed',
        description: 'Ramp entrance with tactile guidance from gate to reception.',
        confirmedBy: 8,
        lastObserved: 'Nov 10, 2026'
      },
      {
        id: 'attr-502',
        type: 'Tactile / Visual Aids',
        status: 'Confirmed',
        description: 'Extensive Braille signage, tactile paving, and audio assistance desks.',
        confirmedBy: 6,
        lastObserved: 'Nov 10, 2026'
      }
    ]
  },
  {
    id: 'venue-6',
    name: 'Govt. General Hospital',
    slug: 'govt-general-hospital',
    category: 'Hospital',
    categoryLabel: 'Hospital',
    address: 'EVR Periyar Salai, Park Town, Chennai - 600003',
    city: 'Chennai',
    distance: '1.5 km',
    rating: 4.1,
    reviewCount: 56,
    description: 'Major medical center with emergency ramps, patient stretcher lifts and 24/7 assistance.',
    heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    ],
    verificationStatus: 'Verified',
    verificationSummary: {
      verifiedCount: 12,
      contributors: [
        { name: 'Dr. Ramesh S.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' }
      ],
      lastUpdated: 'Nov 12, 2026',
      helpfulCount: 740,
      reviewCount: 56,
      photoCount: 30,
      updateCount: 9,
    },
    coordinates: {
      lat: 13.0818,
      lng: 80.2785,
    },
    features: {
      wheelchairAccess: true,
      stepFree: true,
      lift: true,
      accessibleRestroom: true,
      seating: true,
      parking: true,
    },
    saved: false,
    attributes: [
      {
        id: 'attr-601',
        type: 'Entrance',
        status: 'Confirmed',
        description: 'Multi-bay ambulance and wheelchair triage ramps.',
        confirmedBy: 12,
        lastObserved: 'Nov 12, 2026'
      }
    ]
  },
  {
    id: 'venue-7',
    name: 'Metro Plaza',
    slug: 'metro-plaza',
    category: 'Shopping Mall',
    categoryLabel: 'Shopping Mall',
    address: 'Anna Salai, Thousand Lights, Chennai - 600006',
    city: 'Chennai',
    distance: '3.8 km',
    rating: 3.9,
    reviewCount: 22,
    description: 'Commercial shopping complex. Accessibility maintenance is under reporting.',
    heroImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    ],
    verificationStatus: 'Reported',
    verificationSummary: {
      verifiedCount: 1,
      contributors: [
        { name: 'Vignesh S.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' }
      ],
      lastUpdated: 'Nov 10, 2026',
      helpfulCount: 42,
      reviewCount: 22,
      photoCount: 5,
      updateCount: 3,
    },
    coordinates: {
      lat: 13.0601,
      lng: 80.2505,
    },
    features: {
      wheelchairAccess: false,
      stepFree: false,
      lift: true,
      accessibleRestroom: false,
      seating: false,
      parking: true,
    },
    saved: false,
    attributes: [
      {
        id: 'attr-701',
        type: 'Ramp',
        status: 'Disputed',
        description: 'Ramp reported blocked by temporary construction; needs updated photos.',
        confirmedBy: 1,
        lastObserved: 'Nov 10, 2026'
      }
    ]
  }
];

export const INITIAL_CONTRIBUTIONS: Contribution[] = [
  {
    id: 'contrib-1',
    venueId: 'venue-1',
    venueName: 'The Garden Café',
    venueCategory: 'Restaurant',
    venueCity: 'Chennai',
    contributorName: 'Arun K.',
    contributorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    submissionDate: 'Nov 12, 2026 at 10:24 AM',
    note: 'Visited today. The entrance has a wheelchair ramp with handrail. The seating area is spacious and easily accessible.',
    status: 'Pending Verification',
    photos: [
      {
        id: 'photo-1',
        url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        category: 'Entrance',
        detectedFeatures: ['Ramp detected', 'Handrail detected', 'Wide entrance'],
      },
      {
        id: 'photo-2',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        category: 'Ramp Railing',
        detectedFeatures: ['Handrail detected', 'Gentle slope'],
      },
      {
        id: 'photo-3',
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        category: 'Seating',
        detectedFeatures: ['Moveable chairs', 'Wide aisle'],
      },
      {
        id: 'photo-4',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        category: 'Restroom',
        detectedFeatures: ['Grab bars detected', 'Emergency cord'],
      }
    ],
    aiAnalysis: {
      detected: ['Ramp detected', 'Handrail detected', 'Wide entrance'],
      confidence: 'High',
      notes: 'Observation suggestion: Stainless steel dual handrail with ~1:12 slope visible. Clear path free of threshold steps.'
    },
    claim: 'Step-free entrance available',
    measurement: 'Slope and clear width have not been measured.',
    helpfulCount: 24,
  },
  {
    id: 'contrib-2',
    venueId: 'venue-3',
    venueName: 'City Central Mall',
    venueCategory: 'Shopping Mall',
    venueCity: 'Chennai',
    contributorName: 'Nisha R.',
    contributorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    submissionDate: 'Nov 11, 2026',
    note: 'Added new photos of ground floor accessible restroom with grab bars and emergency alarm cord.',
    status: 'Under Review',
    photos: [
      {
        id: 'photo-201',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
        category: 'Accessible Restroom',
        detectedFeatures: ['Grab bars', 'Lowered sink', 'No step'],
      }
    ],
    aiAnalysis: {
      detected: ['Grab rails present', 'Lower basin present'],
      confidence: 'Medium',
      notes: 'Restroom matches accessible standards. Clear turn radius visible.'
    },
    claim: 'Accessible Restroom available on all floors',
    measurement: 'Standard door width 900mm',
    helpfulCount: 36,
  },
  {
    id: 'contrib-3',
    venueId: 'venue-7',
    venueName: 'Metro Plaza',
    venueCategory: 'Shopping Mall',
    venueCity: 'Chennai',
    contributorName: 'Vignesh S.',
    contributorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    submissionDate: 'Nov 10, 2026',
    note: 'East gate elevator is functional. Lift buttons have raised relief numerals.',
    status: 'Reported',
    photos: [
      {
        id: 'photo-301',
        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        category: 'Lift / Elevator',
        detectedFeatures: ['Braille panel', 'Wide elevator doors'],
      }
    ],
    aiAnalysis: {
      detected: ['Lift doors', 'Braille indicators'],
      confidence: 'Medium',
      notes: 'Elevator appears accessible; user reports surrounding approach is under maintenance.'
    },
    claim: 'Operational lift to first floor',
    helpfulCount: 15,
  },
  {
    id: 'contrib-4',
    venueId: 'venue-4',
    venueName: 'Marina Beach Promenade',
    venueCategory: 'Public Place',
    venueCity: 'Chennai',
    contributorName: 'Keerthi M.',
    contributorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    submissionDate: 'Nov 9, 2026',
    note: 'New tactile blister paving tiles installed near lighthouse ramp entry.',
    status: 'Pending Verification',
    photos: [
      {
        id: 'photo-401',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        category: 'Tactile Paving',
        detectedFeatures: ['Yellow tactile blister pavers', 'Ramp boundary'],
      }
    ],
    aiAnalysis: {
      detected: ['Yellow tactile ground surface indicator (TGSI)'],
      confidence: 'High',
      notes: 'Clearly identifiable visual and tactile contrast tiles.'
    },
    claim: 'Tactile indicators at ramp junction',
    helpfulCount: 29,
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Arun K.',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    authorBadge: 'Top Contributor',
    venueName: 'The Garden Café',
    venueSlug: 'the-garden-cafe',
    date: '2 days ago',
    content: 'Visited today. The ramp is available and in good condition. The entrance is wide enough for a wheelchair and the indoor seating is also accessible.',
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80',
    ],
    helpfulCount: 24,
    commentCount: 6,
    isLiked: false,
    isSaved: false,
    category: 'All Posts',
    comments: [
      {
        id: 'c-1',
        authorName: 'Suresh M.',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        date: '2 days ago',
        content: 'The ramp is present and looks well built, but it seems a bit steep in the photo. It would be great to have the approximate slope or a measurement if possible.',
        likes: 12
      },
      {
        id: 'c-2',
        authorName: 'Priya R.',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        date: '1 day ago',
        content: 'Has anyone visited this place recently? Can you confirm if the ramp is still in good condition and accessible?',
        likes: 5
      },
      {
        id: 'c-3',
        authorName: 'Karthik V.',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        date: '1 day ago',
        content: 'Good evidence, but the image alone cannot establish the ramp gradient or clear width. An on-site measurement or an additional photo from a wider angle would help.',
        likes: 8
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Nisha R.',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    authorBadge: 'Community Verified',
    venueName: 'City Central Mall',
    venueSlug: 'city-central-mall',
    date: '4 days ago',
    content: 'The mall has multiple lifts and accessible restrooms on each floor. Wheelchair movement is comfortable and there are reserved parking spots near the entrance.',
    photos: [
      'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80',
    ],
    helpfulCount: 36,
    commentCount: 12,
    isLiked: true,
    isSaved: true,
    category: 'Reviews',
    comments: [
      {
        id: 'c-4',
        authorName: 'Madhesh S',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        date: '3 days ago',
        content: 'Completely agree! The staff at entrance 2 are also very helpful with wheelchair assistance if needed.',
        likes: 9
      }
    ]
  }
];

export const INITIAL_SAVED_LISTS: SavedList[] = [
  {
    id: 'list-1',
    name: 'Favourites',
    icon: 'star',
    venueIds: ['venue-1', 'venue-3', 'venue-4', 'venue-5']
  },
  {
    id: 'list-2',
    name: 'College Route',
    icon: 'briefcase',
    venueIds: ['venue-1', 'venue-5']
  },
  {
    id: 'list-3',
    name: 'Chennai Accessible Spots',
    icon: 'pin',
    venueIds: ['venue-1', 'venue-3', 'venue-4', 'venue-5', 'venue-6']
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'verified',
    title: 'Your contribution has been verified!',
    description: 'The Garden Café has been verified by 3 community members.',
    timestamp: '2 hours ago',
    read: false,
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=200&q=80',
    linkUrl: '/venues/the-garden-cafe'
  },
  {
    id: 'notif-2',
    type: 'comment',
    title: 'New comment on your review',
    description: 'Madhesh S commented on your review of City Central Mall.',
    timestamp: '5 hours ago',
    read: false,
    linkUrl: '/community'
  },
  {
    id: 'notif-3',
    type: 'helpful',
    title: 'Your review was marked as helpful',
    description: 'Your review of Marina Beach Promenade was marked helpful by 7 people.',
    timestamp: '8 hours ago',
    read: true,
    linkUrl: '/venues/marina-beach-promenade'
  },
  {
    id: 'notif-4',
    type: 'update_request',
    title: 'Update requested',
    description: 'Please add a clearer photo of the ramp at Metro Plaza.',
    timestamp: '12 hours ago',
    read: true,
    linkUrl: '/venues/metro-plaza'
  },
  {
    id: 'notif-5',
    type: 'report',
    title: 'Your report is being reviewed',
    description: 'The reported contribution for City Library is under moderation.',
    timestamp: '1 day ago',
    read: true,
    linkUrl: '/admin'
  },
  {
    id: 'notif-6',
    type: 'badge',
    title: "You've earned a new badge!",
    description: 'Community Contributor - for 10+ verified contributions.',
    timestamp: '2 days ago',
    read: true,
    badgeGraphic: 'Community Contributor'
  },
  {
    id: 'notif-7',
    type: 'new_place',
    title: 'New place added near you',
    description: 'Chennai Trade Centre was added by Keerthi M.',
    timestamp: '2 days ago',
    read: true,
    thumbnail: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=200&q=80',
    linkUrl: '/explore'
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'report-1',
    contributionId: 'contrib-1',
    venueName: 'The Garden Café',
    reason: 'Incorrect Information',
    description: 'The entrance ramp slope is slightly steeper than reported; awaiting handrail measurement.',
    status: 'Pending',
    createdAt: 'Nov 12, 2026'
  },
  {
    id: 'report-2',
    contributionId: 'contrib-3',
    venueName: 'Metro Plaza',
    reason: 'Outdated Information',
    description: 'The side ramp is currently closed due to tile renovation work near gate 3.',
    status: 'Investigating',
    createdAt: 'Nov 10, 2026'
  }
];

export const SAMPLE_ROUTE_PLAN: AccessibleRoutePlan = {
  from: 'Chennai Institute of Technology (CIT)',
  to: 'Marina Beach',
  distance: '18.4 km',
  duration: '~ 42 min',
  stepFreeStretches: 'Major stretches (88% verified step-free)',
  accessibleRestroomsCount: 3,
  wheelchairLandmarksCount: 2,
  disclaimer: 'Route is based on available accessibility data and community reports. Some road crossings may lack dropped kerbs.',
  coordinates: [
    [12.9716, 80.0433],
    [12.9800, 80.0800],
    [13.0067, 80.1450],
    [13.0280, 80.2100],
    [13.0458, 80.2520],
    [13.0500, 80.2824],
  ],
  steps: [
    {
      instruction: 'Start from CIT main gate ramp onto Kundrathur Main Road.',
      distance: '1.2 km',
      accessibilityNote: 'Paved sidewalk with curb cut',
      hasStepFree: true
    },
    {
      instruction: 'Continue along Porur Link Road towards Mount-Poonamallee High Road.',
      distance: '5.6 km',
      accessibilityNote: 'Wide pedestrian path, metro construction bypass',
      hasStepFree: true
    },
    {
      instruction: 'Pass near Guindy Station; accessible subway ramp available.',
      distance: '4.8 km',
      accessibilityNote: 'Elevator operational at Guindy Metro',
      hasStepFree: true
    },
    {
      instruction: 'Follow Anna Salai through T. Nagar towards Cathedral Road.',
      distance: '4.2 km',
      accessibilityNote: 'The Garden Café accessible restroom stop available at km 15.8',
      hasStepFree: true
    },
    {
      instruction: 'Arrive at Kamarajar Salai, Marina Beach ramp promenade entrance.',
      distance: '2.6 km',
      accessibilityNote: 'Direct ramp connection onto seaside promenade',
      hasStepFree: true
    }
  ]
};
