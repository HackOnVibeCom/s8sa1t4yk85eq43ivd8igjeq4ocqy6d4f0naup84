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
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { loadAppRecords, saveAppRecord, updateAppRecord } from '../lib/appRecords';
import type { AppRecordType } from '../lib/appRecords';

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

export type UserRole = 'citizen' | 'admin';

interface AppContextType {
  // Navigation
  currentRoute: string;
  navigateTo: (route: string) => void;

  // Demo access
  authRole: UserRole | null;
  authUserId: string | null;
  authLoading: boolean;
  authError: string | null;
  dataError: string | null;
  isSupabaseConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (displayName: string, email: string, password: string) => Promise<boolean>;
  signInDemo: (role: UserRole) => void;
  signOutDemo: () => void;

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
  addContribution: (newContrib: Omit<Contribution, 'id' | 'submissionDate' | 'status' | 'helpfulCount' | 'aiAnalysis'>) => Promise<Contribution>;
  updateContributionStatus: (contribId: string, status: Contribution['status'], note?: string) => void;
  voteHelpfulContribution: (contribId: string) => void;

  // Community
  communityPosts: CommunityPost[];
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'date' | 'helpfulCount' | 'commentCount' | 'comments' | 'isLiked' | 'isSaved'>) => void;
  likeCommunityPost: (postId: string) => void;
  dislikeCommunityPost: (postId: string) => void;
  updateCommunityPostStatus: (postId: string, status: NonNullable<CommunityPost['moderationStatus']>) => void;
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
  updateReportStatus: (reportId: string, status: ReportItem['status']) => void;

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
  const [authRole, setAuthRole] = useState<UserRole | null>(() => {
    if (isSupabaseConfigured) return null;
    const storedRole = localStorage.getItem('canigo_demo_role');
    return storedRole === 'citizen' || storedRole === 'admin' ? storedRole : 'citizen';
  });
  const [authUserId, setAuthUserId] = useState<string | null>(() => {
    if (isSupabaseConfigured) return null;
    return 'citizen-1';
  });
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);

  const applySession = async (session: Session | null) => {
    setAuthUserId(session?.user.id ?? null);
    if (!session || !supabase) {
      setAuthRole(null);
      setAuthLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (error) {
      setAuthRole(null);
      setAuthError(`Could not load your account role: ${error.message}`);
    } else if (data.role === 'citizen' || data.role === 'admin') {
      setAuthRole(data.role);
      setAuthError(null);
    } else {
      setAuthRole(null);
      setAuthError('Your account has no valid CANIGO role. Contact an administrator.');
    }
    setAuthLoading(false);
  };

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    let active = true;
    const applyActiveSession = async (session: Session | null) => {
      if (active) await applySession(session);
    };
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => {
        void applyActiveSession(session);
      }, 0);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setAuthError(`Could not restore your sign-in: ${error.message}`);
        setAuthLoading(false);
        return;
      }
      void applyActiveSession(data.session);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const signInDemo = (role: UserRole) => {
    if (isSupabaseConfigured) {
      setAuthError('Demo sign-in is disabled when Supabase authentication is configured.');
      return;
    }
    localStorage.setItem('canigo_demo_role', role);
    setAuthRole(role);
    navigateTo(role === 'admin' ? '/admin' : '/explore');
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured for this deployment.');
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    await applySession(data.session);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();
    if (profileError) throw new Error(`Could not load your account role: ${profileError.message}`);
    if (profile.role !== 'citizen' && profile.role !== 'admin') {
      throw new Error('Your account has no valid CANIGO role. Contact an administrator.');
    }
    setAuthRole(profile.role);
    navigateTo(profile.role === 'admin' ? '/admin' : '/explore');
  };

  const signUp = async (displayName: string, email: string, password: string) => {
    if (!supabase) throw new Error('Supabase is not configured for this deployment.');
    setAuthError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName.trim() } },
    });
    if (error) throw new Error(error.message);
    if (!data.session) return false;
    await applySession(data.session);
    setAuthRole('citizen');
    navigateTo('/explore');
    return true;
  };

  const signOutDemo = () => {
    const cloudClient = supabase;
    if (cloudClient) {
      void cloudClient.auth.signOut().then(({ error }) => {
        if (error) {
          setAuthError(`Could not sign out: ${error.message}`);
          return;
        }
        setAuthUserId(null);
        setAuthRole(null);
        navigateTo('/');
      }).catch((error: unknown) => {
        setAuthError(error instanceof Error ? `Could not sign out: ${error.message}` : 'Could not sign out.');
      });
      return;
    }
    localStorage.removeItem('canigo_demo_role');
    setAuthRole(null);
    navigateTo('/');
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
    if (isSupabaseConfigured) return INITIAL_VENUES;
    const saved = localStorage.getItem('canigo_venues');
    if (!saved) return INITIAL_VENUES;

    return (JSON.parse(saved) as Venue[]).map((venue) => {
      if (
        venue.id !== 'venue-1' ||
        !venue.heroImage.startsWith('https://images.unsplash.com/photo-1554118811-1e0d58224f24')
      ) {
        return venue;
      }

      return {
        ...venue,
        heroImage: '/images/garden-cafe.jpg',
        saved: false,
        images: venue.images.map((image, index) =>
          index === 0 && image.startsWith('https://images.unsplash.com/photo-1554118811-1e0d58224f24')
            ? '/images/garden-cafe.jpg'
            : image
        ),
        attributes: venue.attributes.map((attribute) =>
          attribute.id === 'attr-1'
            ? { ...attribute, photoUrl: '/images/garden-cafe.jpg' }
            : attribute
        ),
      };
    });
  });

  useEffect(() => {
    if (!isSupabaseConfigured) localStorage.setItem('canigo_venues', JSON.stringify(venues));
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
    const updatedLists = savedLists.map(list => {
      if (list.id === 'list-1' && !list.venueIds.includes(venueId)) {
        return { ...list, venueIds: [...list.venueIds, venueId] };
      }
      return list;
    });
    setSavedLists(updatedLists);
    updatedLists.filter((list) => list.venueIds.includes(venueId)).forEach((list) =>
      persistAppRecord('saved_lists', list, authUserId)
    );
  };

  const unsaveVenue = (venueId: string) => {
    setVenues(prev => prev.map(v => v.id === venueId ? { ...v, saved: false } : v));
    const updatedLists = savedLists.map(list => ({
      ...list,
      venueIds: list.venueIds.filter(id => id !== venueId)
    }));
    setSavedLists(updatedLists);
    updatedLists.forEach((list) => persistAppRecord('saved_lists', list, authUserId));
  };

  // Contributions
  const [contributions, setContributions] = useState<Contribution[]>(() => {
    if (isSupabaseConfigured) return INITIAL_CONTRIBUTIONS;
    const saved = localStorage.getItem('canigo_contributions');
    return saved ? JSON.parse(saved) : INITIAL_CONTRIBUTIONS;
  });

  useEffect(() => {
    if (!isSupabaseConfigured) localStorage.setItem('canigo_contributions', JSON.stringify(contributions));
  }, [contributions]);

  const addContribution = async (newContribData: Omit<Contribution, 'id' | 'submissionDate' | 'status' | 'helpfulCount' | 'aiAnalysis'>) => {
    let newContrib: Contribution = {
      ...newContribData,
      id: `contrib-${Date.now()}`,
      contributorId: authUserId ?? undefined,
      submissionDate: 'Just now',
      status: 'Under Review',
      helpfulCount: 0,
      aiAnalysis: {
        detected: ['Ramp detected', 'Accessible Entrance'],
        confidence: 'High',
        notes: 'AI Observation: Clear entrance with ramp and level approach detected.'
      }
    };

    const cloudClient = supabase;
    if (cloudClient) {
      if (!authUserId) throw new Error('Sign in before submitting a contribution.');
      const uploadedPaths: string[] = [];
      try {
        const photos = await Promise.all(newContrib.photos.map(async (photo) => {
          if (!photo.url.startsWith('data:image/')) return photo;
          const blob = await fetch(photo.url).then((response) => response.blob());
          const extensionByType: Record<string, string> = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
          };
          const extension = extensionByType[blob.type];
          if (!extension) throw new Error('Photos must be JPEG, PNG, or WebP images.');
          const safePhotoId = photo.id.replace(/[^a-zA-Z0-9._-]/g, '-');
          const path = `${authUserId}/${newContrib.id}/${safePhotoId}.${extension}`;
          const { error } = await cloudClient.storage
            .from('contribution-photos')
            .upload(path, blob, { contentType: blob.type, upsert: true });
          if (error) throw new Error(`Could not upload a contribution photo: ${error.message}`);
          uploadedPaths.push(path);
          const { data } = cloudClient.storage.from('contribution-photos').getPublicUrl(path);
          return { ...photo, url: data.publicUrl };
        }));
        newContrib = { ...newContrib, photos };
        await saveAppRecord('contributions', newContrib, authUserId);
      } catch (error) {
        if (uploadedPaths.length) {
          const { error: cleanupError } = await cloudClient.storage.from('contribution-photos').remove(uploadedPaths);
          if (cleanupError) setDataError(`Contribution failed and uploaded photos could not be cleaned up: ${cleanupError.message}`);
        }
        throw error;
      }
    }

    setContributions(prev => [newContrib, ...prev]);
    if (!supabase) persistAppRecord('contributions', newContrib, authUserId);

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
    const updatedContributions = contributions.map((contribution) => {
      if (contribution.id !== contribId) return contribution;
      const updatedContribution = {
        ...contribution,
        status,
        note: note ? `${contribution.note} | Admin: ${note}` : contribution.note,
      };
      updateCloudRecord('contributions', updatedContribution);
      return updatedContribution;
    });
    setContributions(updatedContributions);

    // If approved, update venue status
    const targetContrib = contributions.find(c => c.id === contribId);
    if (targetContrib && (status === 'Verified' || status === 'Community Verified')) {
      const updatedVenues = venues.map((venue) => {
        if (venue.id !== targetContrib.venueId && venue.name.toLowerCase() !== targetContrib.venueName.toLowerCase()) return venue;
        const updatedVenue = {
          ...venue,
          verificationStatus: status === 'Verified' ? 'Verified' as const : 'Community Verified' as const,
          verificationSummary: {
            ...venue.verificationSummary,
            verifiedCount: venue.verificationSummary.verifiedCount + 1,
            lastUpdated: 'Just now'
          }
        };
        updateCloudRecord('venues', updatedVenue);
        return updatedVenue;
      });
      setVenues(updatedVenues);

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
    if (isSupabaseConfigured) return INITIAL_COMMUNITY_POSTS;
    const saved = localStorage.getItem('canigo_posts');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;
  });

  useEffect(() => {
    if (!isSupabaseConfigured) localStorage.setItem('canigo_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  const addCommunityPost = (postData: Omit<CommunityPost, 'id' | 'date' | 'helpfulCount' | 'commentCount' | 'comments' | 'isLiked' | 'isSaved'>) => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}`,
      authorId: authUserId ?? undefined,
      date: 'Just now',
      helpfulCount: 0,
      dislikeCount: 0,
      commentCount: 0,
      comments: [],
      isLiked: false,
      isDisliked: false,
      isSaved: false,
      moderationStatus: 'Pending',
    };
    setCommunityPosts(prev => [newPost, ...prev]);
    persistAppRecord('community_posts', newPost, authUserId);
  };

  const reactToCommunityPost = async (postId: string, reaction: 'like' | 'dislike') => {
    const post = communityPosts.find((item) => item.id === postId);
    if (!post) return;
    const previousReaction = post.isLiked ? 'like' : post.isDisliked ? 'dislike' : null;
    const nextReaction = previousReaction === reaction ? null : reaction;

    if (supabase) {
      if (!authUserId) {
        setDataError('Sign in before reacting to community posts.');
        return;
      }
      try {
        const { error } = nextReaction
          ? await supabase.from('community_post_reactions').upsert({
            post_id: postId,
            user_id: authUserId,
            reaction: nextReaction,
          }, { onConflict: 'post_id,user_id' })
          : await supabase.from('community_post_reactions').delete()
            .eq('post_id', postId)
            .eq('user_id', authUserId);
        if (error) {
          setDataError(`Could not save your reaction: ${error.message}`);
          return;
        }
      } catch (error) {
        setDataError(error instanceof Error ? `Could not save your reaction: ${error.message}` : 'Could not save your reaction.');
        return;
      }
    }

    setCommunityPosts((previous) => previous.map((item) => {
      if (item.id !== postId) return item;
      return {
        ...item,
        isLiked: nextReaction === 'like',
        isDisliked: nextReaction === 'dislike',
        helpfulCount: Math.max(0, item.helpfulCount + (nextReaction === 'like' ? 1 : 0) - (previousReaction === 'like' ? 1 : 0)),
        dislikeCount: Math.max(0, (item.dislikeCount ?? 0) + (nextReaction === 'dislike' ? 1 : 0) - (previousReaction === 'dislike' ? 1 : 0)),
      };
    }));
  };

  const likeCommunityPost = (postId: string) => {
    void reactToCommunityPost(postId, 'like');
  };

  const dislikeCommunityPost = (postId: string) => {
    void reactToCommunityPost(postId, 'dislike');
  };

  const updateCommunityPostStatus = (postId: string, status: NonNullable<CommunityPost['moderationStatus']>) => {
    const applyStatus = () => setCommunityPosts((previous) => previous.map((post) =>
      post.id === postId ? { ...post, moderationStatus: status } : post
    ));
    if (!supabase) {
      applyStatus();
      return;
    }
    if (authRole !== 'admin' || status === 'Pending') {
      setDataError('Administrator access is required to review community posts.');
      return;
    }
    void supabase.rpc('moderate_community_post', { p_record_id: postId, p_status: status })
      .then(({ error }) => {
        if (error) {
          setDataError(`Could not update post moderation: ${error.message}`);
          return;
        }
        applyStatus();
      }, (error: unknown) => {
        setDataError(error instanceof Error ? `Could not update post moderation: ${error.message}` : 'Could not update post moderation.');
      });
  };

  const addCommentToPost = (postId: string, content: string) => {
    const newComment = {
      id: `comment-${crypto.randomUUID()}`,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      date: 'Just now',
      content,
      likes: 0,
    };
    const addLocally = () => setCommunityPosts((previous) => previous.map((post) =>
      post.id === postId
        ? { ...post, commentCount: post.commentCount + 1, comments: [...post.comments, newComment] }
        : post
    ));

    if (!supabase) {
      addLocally();
      return;
    }
    if (!authUserId) {
      setDataError('Sign in before commenting on community posts.');
      return;
    }
    void supabase.from('community_post_comments').insert({
      id: newComment.id,
      post_id: postId,
      user_id: authUserId,
      payload: newComment,
    }).then(({ error }) => {
      if (error) {
        setDataError(`Could not save your comment: ${error.message}`);
        return;
      }
      addLocally();
    }, (error: unknown) => {
      setDataError(error instanceof Error ? `Could not save your comment: ${error.message}` : 'Could not save your comment.');
    });
  };

  // Saved Lists
  const [savedLists, setSavedLists] = useState<SavedList[]>(() => {
    if (isSupabaseConfigured) return INITIAL_SAVED_LISTS;
    const saved = localStorage.getItem('canigo_saved_lists');
    return saved ? JSON.parse(saved) : INITIAL_SAVED_LISTS;
  });

  useEffect(() => {
    if (!isSupabaseConfigured) localStorage.setItem('canigo_saved_lists', JSON.stringify(savedLists));
  }, [savedLists]);

  const createSavedList = (name: string, icon: SavedList['icon'] = 'pin') => {
    const newList: SavedList = {
      id: `list-${Date.now()}`,
      name,
      icon,
      venueIds: []
    };
    setSavedLists(prev => [...prev, newList]);
    persistAppRecord('saved_lists', newList, authUserId);
  };

  const addVenueToList = (listId: string, venueId: string) => {
    const updatedLists = savedLists.map(l => {
      if (l.id === listId && !l.venueIds.includes(venueId)) {
        return { ...l, venueIds: [...l.venueIds, venueId] };
      }
      return l;
    });
    setSavedLists(updatedLists);
    const updatedList = updatedLists.find((list) => list.id === listId);
    if (updatedList) persistAppRecord('saved_lists', updatedList, authUserId);
  };

  const removeVenueFromList = (listId: string, venueId: string) => {
    const updatedLists = savedLists.map(l => {
      if (l.id === listId) {
        return { ...l, venueIds: l.venueIds.filter(id => id !== venueId) };
      }
      return l;
    });
    setSavedLists(updatedLists);
    const updatedList = updatedLists.find((list) => list.id === listId);
    if (updatedList) persistAppRecord('saved_lists', updatedList, authUserId);
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (isSupabaseConfigured) return INITIAL_NOTIFICATIONS;
    const saved = localStorage.getItem('canigo_notifications');
    if (!saved) return INITIAL_NOTIFICATIONS;

    return (JSON.parse(saved) as NotificationItem[]).map((notification) =>
      notification.id === 'notif-2' ? { ...notification, read: true } : notification
    );
  });

  useEffect(() => {
    if (!isSupabaseConfigured) localStorage.setItem('canigo_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    const updatedNotification = updatedNotifications.find((notification) => notification.id === id);
    if (updatedNotification) persistAppRecord('notifications', updatedNotification, authUserId);
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
    updatedNotifications.forEach((notification) =>
      persistAppRecord('notifications', notification, authUserId)
    );
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    persistAppRecord('notifications', newNotif, authUserId);
  };

  // Reports
  const [reports, setReports] = useState<ReportItem[]>(() => {
    if (isSupabaseConfigured) return INITIAL_REPORTS;
    const saved = localStorage.getItem('canigo_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  useEffect(() => {
    if (!isSupabaseConfigured) localStorage.setItem('canigo_reports', JSON.stringify(reports));
  }, [reports]);

  const submitReport = (reportData: Omit<ReportItem, 'id' | 'createdAt' | 'status'>) => {
    const newReport: ReportItem = {
      ...reportData,
      id: `report-${Date.now()}`,
      createdAt: 'Just now',
      status: 'Pending'
    };
    setReports(prev => [newReport, ...prev]);
    persistAppRecord('reports', newReport, authUserId);

    addNotification({
      type: 'report',
      title: 'Report Submitted',
      description: `Your report for ${reportData.venueName} has been received and forwarded to moderation.`,
      linkUrl: '/admin'
    });
  };

  const updateReportStatus = (reportId: string, status: ReportItem['status']) => {
    const updatedReports = reports.map((report) => {
      if (report.id !== reportId) return report;
      const updatedReport = { ...report, status };
      updateCloudRecord('reports', updatedReport);
      return updatedReport;
    });
    setReports(updatedReports);
  };

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-kanish',
    name: 'Kanish Mathew M',
    avatar: '/images/profile-avatar.jpg',
    location: 'Chennai, Tamil Nadu',
    bio: 'Passionate about building accessible and inclusive spaces. I contribute by sharing real-world accessibility information and reviewing community updates.',
    badge: 'Community Contributor',
    contributionsCount: 24,
    reviewsCount: 36,
    savedPlacesCount: 18,
    reputationPoints: 1240,
  });

  useEffect(() => {
    const cloudClient = supabase;
    if (!cloudClient || authLoading) return;
    let active = true;

    const reportError = (error: unknown) => {
      if (active) {
        setDataError(error instanceof Error ? error.message : 'Could not synchronize CANIGO data with Supabase.');
      }
    };

    const seedSharedRecords = async <T extends { id: string }>(
      entityType: AppRecordType,
      records: T[]
    ) => {
      for (const record of records) await saveAppRecord(entityType, record, null);
    };

    const loadCloudData = async () => {
      try {
        const [venueRows, contributionRows, postRows, rejectedPostRows, savedRows, notificationRows, reportRows] = await Promise.all([
          loadAppRecords<Venue>('venues'),
          loadAppRecords<Contribution>('contributions'),
          loadAppRecords<CommunityPost>('community_posts'),
          loadAppRecords<CommunityPost>('rejected_posts'),
          loadAppRecords<SavedList>('saved_lists'),
          loadAppRecords<NotificationItem>('notifications'),
          loadAppRecords<ReportItem>('reports'),
        ]);
        if (!active) return;
        const { data: reactionRows, error: reactionError } = await cloudClient
          .from('community_post_reactions')
          .select('post_id, user_id, reaction');
        if (reactionError) throw new Error(`Could not load community reactions: ${reactionError.message}`);
        const { data: commentRows, error: commentError } = await cloudClient
          .from('community_post_comments')
          .select('post_id, payload')
          .order('created_at');
        if (commentError) throw new Error(`Could not load community comments: ${commentError.message}`);

        const postReactions = new Map<string, { likes: number; dislikes: number; mine: string | null }>();
        for (const reaction of reactionRows) {
          const totals = postReactions.get(reaction.post_id) ?? { likes: 0, dislikes: 0, mine: null };
          if (reaction.reaction === 'like') totals.likes += 1;
          else totals.dislikes += 1;
          if (reaction.user_id === authUserId) totals.mine = reaction.reaction;
          postReactions.set(reaction.post_id, totals);
        }
        const postComments = new Map<string, CommunityPost['comments']>();
        for (const row of commentRows) {
          const comments = postComments.get(row.post_id) ?? [];
          comments.push(row.payload as CommunityPost['comments'][number]);
          postComments.set(row.post_id, comments);
        }

        if (venueRows.length) {
          setVenues(venueRows.map(({ payload }) => ({ ...payload, saved: false })));
        } else if (authRole === 'admin') {
          const sampleVenues = INITIAL_VENUES.map((venue) => ({ ...venue, saved: false }));
          await seedSharedRecords('venues', sampleVenues);
          if (active) setVenues(sampleVenues);
        }

        if (contributionRows.length) {
          setContributions(contributionRows.map(({ payload, ownerId }) => ({
            ...payload,
            contributorId: ownerId ?? payload.contributorId,
          })));
        } else if (authRole === 'admin') {
          await seedSharedRecords('contributions', INITIAL_CONTRIBUTIONS);
          if (active) setContributions(INITIAL_CONTRIBUTIONS);
        }

        const allPostRows = [...postRows, ...rejectedPostRows];
        if (allPostRows.length) {
          setCommunityPosts(allPostRows.map(({ payload, ownerId }) => {
            const post = { ...payload, authorId: ownerId ?? payload.authorId, moderationStatus: payload.moderationStatus ?? 'Verified' };
            const reactions = postReactions.get(post.id);
            const comments = postComments.get(post.id) ?? [];
            return {
              ...post,
              comments: [...post.comments, ...comments],
              commentCount: post.commentCount + comments.length,
              helpfulCount: post.helpfulCount + (reactions?.likes ?? 0),
              dislikeCount: (post.dislikeCount ?? 0) + (reactions?.dislikes ?? 0),
              isLiked: reactions?.mine === 'like',
              isDisliked: reactions?.mine === 'dislike',
            };
          }));
        } else if (authRole === 'admin') {
          const samplePosts = INITIAL_COMMUNITY_POSTS.map((post) => ({
            ...post,
            moderationStatus: 'Verified' as const,
            dislikeCount: 0,
          }));
          await seedSharedRecords('community_posts', samplePosts);
          if (active) setCommunityPosts(samplePosts);
        }

        if (authUserId) {
          if (savedRows.length) {
            setSavedLists(savedRows.map(({ payload }) => payload));
          } else {
            const starterLists = INITIAL_SAVED_LISTS.map((list) => ({ ...list, venueIds: [] }));
            for (const list of starterLists) await saveAppRecord('saved_lists', list, authUserId);
            if (active) setSavedLists(starterLists);
          }
          const savedVenueIds = new Set(savedRows.flatMap(({ payload }) => payload.venueIds));
          if (!savedRows.length) setVenues((previous) => previous.map((venue) => ({ ...venue, saved: false })));
          else setVenues((previous) => previous.map((venue) => ({ ...venue, saved: savedVenueIds.has(venue.id) })));
          setNotifications(notificationRows.map(({ payload }) => payload));

          const { data: profile, error: profileError } = await cloudClient
            .from('profiles')
            .select('*')
            .eq('id', authUserId)
            .single();
          if (profileError) throw new Error(`Could not load your profile: ${profileError.message}`);
          if (active) {
            setUserProfile({
              id: profile.id,
              name: profile.display_name || 'CANIGO member',
              avatar: profile.avatar_url || '/images/profile-avatar.jpg',
              location: profile.location || 'Chennai, Tamil Nadu',
              bio: profile.bio,
              badge: profile.badge,
              contributionsCount: profile.contributions_count,
              reviewsCount: profile.reviews_count,
              savedPlacesCount: profile.saved_places_count,
              reputationPoints: profile.reputation_points,
            });
          }
        }

        if (reportRows.length) {
          setReports(reportRows.map(({ payload }) => payload));
        } else if (authRole === 'admin') {
          await seedSharedRecords('reports', INITIAL_REPORTS);
          if (active) setReports(INITIAL_REPORTS);
        } else if (authUserId) {
          setReports([]);
        }
        if (active) setDataError(null);
      } catch (error) {
        reportError(error);
      }
    };

    void loadCloudData();
    const channel = cloudClient
      .channel(`canigo-data-${authUserId ?? 'public'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_records' }, () => {
        void loadCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_post_reactions' }, () => {
        void loadCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_post_comments' }, () => {
        void loadCloudData();
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' && active) {
          setDataError('Live updates could not connect. Refresh the page to load the latest changes.');
        }
      });
    return () => {
      active = false;
      void cloudClient.removeChannel(channel);
    };
  }, [authLoading, authRole, authUserId]);

  const persistAppRecord = <T extends { id: string }>(
    entityType: AppRecordType,
    record: T,
    ownerId: string | null
  ) => {
    if (!supabase) return;
    void saveAppRecord(entityType, record, ownerId).catch((error: unknown) => {
      setDataError(error instanceof Error ? error.message : `Could not save ${entityType}.`);
    });
  };

  const updateCloudRecord = <T extends { id: string }>(entityType: AppRecordType, record: T) => {
    if (!supabase) return;
    void updateAppRecord(entityType, record).catch((error: unknown) => {
      setDataError(error instanceof Error ? error.message : `Could not update ${entityType}.`);
    });
  };

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...patch }));
    if (!supabase || !authUserId) return;
    const profilePatch = {
      ...(patch.name !== undefined ? { display_name: patch.name } : {}),
      ...(patch.avatar !== undefined ? { avatar_url: patch.avatar } : {}),
      ...(patch.location !== undefined ? { location: patch.location } : {}),
      ...(patch.bio !== undefined ? { bio: patch.bio } : {}),
    };
    void supabase.from('profiles').update(profilePatch).eq('id', authUserId).then(({ error }) => {
      if (error) setDataError(`Could not update your profile: ${error.message}`);
    }, (error: unknown) => {
      setDataError(error instanceof Error ? `Could not update your profile: ${error.message}` : 'Could not update your profile.');
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        authRole,
        authUserId,
        authLoading,
        authError,
        dataError,
        isSupabaseConfigured,
        signIn,
        signUp,
        signInDemo,
        signOutDemo,
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
        dislikeCommunityPost,
        updateCommunityPostStatus,
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
        updateReportStatus,
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
