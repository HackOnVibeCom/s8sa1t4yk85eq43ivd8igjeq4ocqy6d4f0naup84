import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Venue, 
  Contribution, 
  CommunityPost, 
  SavedList, 
  NotificationItem, 
  ReportItem,
  VerificationStatus,
  AccessibleRoutePlan
} from '../types';
import { 
  INITIAL_VENUES, 
  INITIAL_CONTRIBUTIONS, 
  INITIAL_COMMUNITY_POSTS, 
  INITIAL_SAVED_LISTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REPORTS,
  SAMPLE_ROUTE_PLAN
} from '../data/initialData';

export interface FilterState {
  searchQuery: string;
  location: string;
  category: string;
  wheelchairAccess: boolean;
  stepFree: boolean;
  lift: boolean;
  accessibleRestroom: boolean;
  wheelchairSeating: boolean;
  verifiedOnly: boolean;
  communityVerified: boolean;
  sortBy: 'relevance' | 'rating' | 'distance';
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  location: string;
  bio: string;
  badge: string;
  contributionsCount: number;
  reviewsCount: number;
  savedPlacesCount: number;
  reputationPoints: number;
}

interface AppContextType {
  // Navigation
  currentRoute: string;
  navigateTo: (route: string) => void;

  // Venues
  venues: Venue[];
  selectedVenue: Venue | null;
  selectVenue: (venue: Venue | null) => void;
  getVenueBySlug: (slug: string) => Venue | undefined;
  saveVenue: (venueId: string) => void;
  unsaveVenue: (venueId: string) => void;

  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  filteredVenues: Venue[];

  // Contributions
  contributions: Contribution[];
  addContribution: (newContrib: Omit<Contribution, 'id' | 'submissionDate' | 'status' | 'helpfulCount' | 'aiAnalysis'>) => Contribution;
  updateContributionStatus: (contribId: string, status: Contribution['status'], note?: string) => void;
  voteHelpfulContribution: (contribId: string) => void;

  // Community
  communityPosts: CommunityPost[];
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'date' | 'helpfulCount' | 'commentCount' | 'comments' | 'isLiked' | 'isSaved'>) => void;
  likeCommunityPost: (postId: string) => void;
  addCommentToPost: (postId: string, content: string) => void;

  // Saved Lists
  savedLists: SavedList[];
  createSavedList: (name: string, icon?: SavedList['icon']) => void;
  addVenueToList: (listId: string, venueId: string) => void;
  removeVenueFromList: (listId: string, venueId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Reports
  reports: ReportItem[];
  submitReport: (report: Omit<ReportItem, 'id' | 'createdAt' | 'status'>) => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Routes
  activeRoutePlan: AccessibleRoutePlan | null;
  setActiveRoutePlan: (plan: AccessibleRoutePlan | null) => void;

  // Map state
  selectedMapVenueId: string | null;
  setSelectedMapVenueId: (id: string | null) => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  location: 'Chennai',
  category: 'All Categories',
  wheelchairAccess: true,
  stepFree: false,
  lift: false,
  accessibleRestroom: false,
  wheelchairSeating: false,
  verifiedOnly: false,
  communityVerified: false,
  sortBy: 'relevance',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation sync with browser history / hash
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = window.location.pathname;
    return path && path !== '/' ? path : '/';
  });

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Venues with local storage persistence
  const [venues, setVenues] = useState<Venue[]>(() => {
    const saved = localStorage.getItem('canigo_venues');
    return saved ? JSON.parse(saved) : INITIAL_VENUES;
  });

  useEffect(() => {
    localStorage.setItem('canigo_venues', JSON.stringify(venues));
  }, [venues]);

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(venues[0]);
  const [selectedMapVenueId, setSelectedMapVenueId] = useState<string | null>('venue-1');
  const [activeRoutePlan, setActiveRoutePlan] = useState<AccessibleRoutePlan | null>(SAMPLE_ROUTE_PLAN);

  // Filters
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Filtered Venues computation
  const filteredVenues = venues.filter(v => {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = v.name.toLowerCase().includes(q);
      const matchDesc = v.description.toLowerCase().includes(q);
      const matchCat = v.category.toLowerCase().includes(q);
      const matchAddr = v.address.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat && !matchAddr) return false;
    }
    if (filters.category && filters.category !== 'All Categories' && filters.category !== 'All Places') {
      if (filters.category === 'Restaurants' && v.category !== 'Restaurant') return false;
      if (filters.category === 'Cafes' && v.category !== 'Cafes' && v.category !== 'Restaurant') return false;
      if (filters.category === 'Shopping Mall' && v.category !== 'Shopping Mall') return false;
      if (filters.category === 'Hospitals' && v.category !== 'Hospital') return false;
      if (filters.category === 'Parks' && v.category !== 'Parks' && v.category !== 'Public Place') return false;
    }
    if (filters.wheelchairAccess && !v.features.wheelchairAccess) return false;
    if (filters.stepFree && !v.features.stepFree) return false;
    if (filters.lift && !v.features.lift) return false;
    if (filters.accessibleRestroom && !v.features.accessibleRestroom) return false;
    if (filters.wheelchairSeating && !v.features.seating) return false;
    if (filters.verifiedOnly && v.verificationStatus !== 'Verified') return false;
    if (filters.communityVerified && v.verificationStatus !== 'Community Verified' && v.verificationStatus !== 'Verified') return false;
    return true;
  });

  const getVenueBySlug = (slug: string) => {
    return venues.find(v => v.slug === slug || v.id === slug);
  };

  const selectVenue = (venue: Venue | null) => {
    setSelectedVenue(venue);
    if (venue) {
      setSelectedMapVenueId(venue.id);
    }
  };

  const saveVenue = (venueId: string) => {
    setVenues(prev => prev.map(v => v.id === venueId ? { ...v, saved: true } : v));
    // Also add to Favourites list
    setSavedLists(prev => prev.map(list => {
      if (list.id === 'list-1' && !list.venueIds.includes(venueId)) {
        return { ...list, venueIds: [...list.venueIds, venueId] };
      }
      return list;
    }));
  };

  const unsaveVenue = (venueId: string) => {
    setVenues(prev => prev.map(v => v.id === venueId ? { ...v, saved: false } : v));
    setSavedLists(prev => prev.map(list => ({
      ...list,
      venueIds: list.venueIds.filter(id => id !== venueId)
    })));
  };

  // Contributions
  const [contributions, setContributions] = useState<Contribution[]>(() => {
    const saved = localStorage.getItem('canigo_contributions');
    return saved ? JSON.parse(saved) : INITIAL_CONTRIBUTIONS;
  });

  useEffect(() => {
    localStorage.setItem('canigo_contributions', JSON.stringify(contributions));
  }, [contributions]);

  const addContribution = (newContribData: Omit<Contribution, 'id' | 'submissionDate' | 'status' | 'helpfulCount' | 'aiAnalysis'>) => {
    const newContrib: Contribution = {
      ...newContribData,
      id: `contrib-${Date.now()}`,
      submissionDate: 'Just now',
      status: 'Under Review',
      helpfulCount: 0,
      aiAnalysis: {
        detected: ['Ramp detected', 'Accessible Entrance'],
        confidence: 'High',
        notes: 'AI Observation: Clear entrance with ramp and level approach detected.'
      }
    };

    setContributions(prev => [newContrib, ...prev]);

    // Add a notification
    addNotification({
      type: 'update_request',
      title: 'Contribution Submitted for Review',
      description: `Your contribution for ${newContrib.venueName} has been queued for verification.`,
      linkUrl: '/profile'
    });

    return newContrib;
  };

  const updateContributionStatus = (contribId: string, status: Contribution['status'], note?: string) => {
    setContributions(prev => prev.map(c => {
      if (c.id === contribId) {
        return { ...c, status, note: note ? `${c.note} | Admin: ${note}` : c.note };
      }
      return c;
    }));

    // If approved, update venue status
    const targetContrib = contributions.find(c => c.id === contribId);
    if (targetContrib && (status === 'Verified' || status === 'Community Verified')) {
      setVenues(prev => prev.map(v => {
        if (v.id === targetContrib.venueId || v.name.toLowerCase() === targetContrib.venueName.toLowerCase()) {
          return {
            ...v,
            verificationStatus: status === 'Verified' ? 'Verified' : 'Community Verified',
            verificationSummary: {
              ...v.verificationSummary,
              verifiedCount: v.verificationSummary.verifiedCount + 1,
              lastUpdated: 'Just now'
            }
          };
        }
        return v;
      }));

      addNotification({
        type: 'verified',
        title: 'Contribution Approved & Verified!',
        description: `${targetContrib.venueName} has been updated with verified accessibility information.`,
        linkUrl: `/venues/${targetContrib.venueId}`
      });
    }
  };

  const voteHelpfulContribution = (contribId: string) => {
    setContributions(prev => prev.map(c => c.id === contribId ? { ...c, helpfulCount: c.helpfulCount + 1 } : c));
  };

  // Community Posts
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('canigo_posts');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;
  });

  useEffect(() => {
    localStorage.setItem('canigo_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  const addCommunityPost = (postData: Omit<CommunityPost, 'id' | 'date' | 'helpfulCount' | 'commentCount' | 'comments' | 'isLiked' | 'isSaved'>) => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}`,
      date: 'Just now',
      helpfulCount: 0,
      commentCount: 0,
      comments: [],
      isLiked: false,
      isSaved: false
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const likeCommunityPost = (postId: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          helpfulCount: nextLiked ? p.helpfulCount + 1 : Math.max(0, p.helpfulCount - 1)
        };
      }
      return p;
    }));
  };

  const addCommentToPost = (postId: string, content: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: `comment-${Date.now()}`,
          authorName: userProfile.name,
          authorAvatar: userProfile.avatar,
          date: 'Just now',
          content,
          likes: 0
        };
        return {
          ...p,
          commentCount: p.commentCount + 1,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
  };

  // Saved Lists
  const [savedLists, setSavedLists] = useState<SavedList[]>(() => {
    const saved = localStorage.getItem('canigo_saved_lists');
    return saved ? JSON.parse(saved) : INITIAL_SAVED_LISTS;
  });

  useEffect(() => {
    localStorage.setItem('canigo_saved_lists', JSON.stringify(savedLists));
  }, [savedLists]);

  const createSavedList = (name: string, icon: SavedList['icon'] = 'pin') => {
    const newList: SavedList = {
      id: `list-${Date.now()}`,
      name,
      icon,
      venueIds: []
    };
    setSavedLists(prev => [...prev, newList]);
  };

  const addVenueToList = (listId: string, venueId: string) => {
    setSavedLists(prev => prev.map(l => {
      if (l.id === listId && !l.venueIds.includes(venueId)) {
        return { ...l, venueIds: [...l.venueIds, venueId] };
      }
      return l;
    }));
  };

  const removeVenueFromList = (listId: string, venueId: string) => {
    setSavedLists(prev => prev.map(l => {
      if (l.id === listId) {
        return { ...l, venueIds: l.venueIds.filter(id => id !== venueId) };
      }
      return l;
    }));
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('canigo_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('canigo_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Reports
  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('canigo_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  useEffect(() => {
    localStorage.setItem('canigo_reports', JSON.stringify(reports));
  }, [reports]);

  const submitReport = (reportData: Omit<ReportItem, 'id' | 'createdAt' | 'status'>) => {
    const newReport: ReportItem = {
      ...reportData,
      id: `report-${Date.now()}`,
      createdAt: 'Just now',
      status: 'Pending'
    };
    setReports(prev => [newReport, ...prev]);

    addNotification({
      type: 'report',
      title: 'Report Submitted',
      description: `Your report for ${reportData.venueName} has been received and forwarded to moderation.`,
      linkUrl: '/admin'
    });
  };

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-kanish',
    name: 'Kanish Mathew M',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80',
    location: 'Chennai, Tamil Nadu',
    bio: 'Passionate about building accessible and inclusive spaces. I contribute by sharing real-world accessibility information and reviewing community updates.',
    badge: 'Community Contributor',
    contributionsCount: 24,
    reviewsCount: 36,
    savedPlacesCount: 18,
    reputationPoints: 1240,
  });

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...patch }));
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        venues,
        selectedVenue,
        selectVenue,
        getVenueBySlug,
        saveVenue,
        unsaveVenue,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        filteredVenues,
        contributions,
        addContribution,
        updateContributionStatus,
        voteHelpfulContribution,
        communityPosts,
        addCommunityPost,
        likeCommunityPost,
        addCommentToPost,
        savedLists,
        createSavedList,
        addVenueToList,
        removeVenueFromList,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        reports,
        submitReport,
        userProfile,
        updateUserProfile,
        activeRoutePlan,
        setActiveRoutePlan,
        selectedMapVenueId,
        setSelectedMapVenueId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
