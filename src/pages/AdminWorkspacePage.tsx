import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileImage,
  MapPin,
  Search,
  Shield,
  Users,
} from 'lucide-react';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { useApp } from '../contexts/AppContext';
import { CommunityPost, Contribution, ReportItem } from '../types';

type AdminSection = 'overview' | 'reviews' | 'contributors' | 'places' | 'community' | 'reports';
type QueueFilter = 'All' | 'Needs review' | 'Verified' | 'Rejected';

interface ContributorSummary {
  name: string;
  avatar: string;
  contributions: number;
  posts: number;
  comments: number;
  helpful: number;
}

const reviewableStatuses: Contribution['status'][] = ['Pending Verification', 'Under Review', 'Reported'];

const panelClass = 'rounded-2xl border border-[#E5E5DC] bg-white p-4 shadow-xs';
const buttonClass = 'rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest';
const adminSections: Record<string, AdminSection> = {
  reviews: 'reviews',
  contributors: 'contributors',
  places: 'places',
  community: 'community',
  reports: 'reports',
};

const sectionFromRoute = (route: string): AdminSection => {
  const section = route.slice('/admin/'.length);
  return adminSections[section] ?? 'overview';
};

export const AdminWorkspacePage: React.FC = () => {
  const {
    contributions,
    communityPosts,
    venues,
    reports,
    updateContributionStatus,
    updateCommunityPostStatus,
    updateReportStatus,
    navigateTo,
    currentRoute,
    isSupabaseConfigured,
  } = useApp();

  const section = sectionFromRoute(currentRoute);
  const sectionTitles: Record<AdminSection, { title: string; description: string }> = {
    overview: { title: 'Admin overview', description: 'A quick view of submissions, contributors, places, and reports.' },
    reviews: { title: 'Post review queue', description: 'Check new accessibility submissions and review their evidence.' },
    contributors: { title: 'Contributors', description: 'See everyone who submitted, posted, commented, or verified information.' },
    places: { title: 'Places & map', description: 'Browse existing places and their current verification status.' },
    community: { title: 'Community posts', description: 'Review published community updates, photos, and discussions.' },
    reports: { title: 'Reports', description: 'Investigate reports about inaccurate or outdated accessibility information.' },
  };
  const [selectedContributionId, setSelectedContributionId] = useState(contributions[0]?.id ?? '');
  const [queueFilter, setQueueFilter] = useState<QueueFilter>('Needs review');
  const [reviewSearch, setReviewSearch] = useState('');
  const [contributorSearch, setContributorSearch] = useState('');
  const [placeSearch, setPlaceSearch] = useState('');
  const [feedback, setFeedback] = useState('');

  const pendingContributions = contributions.filter((item) => reviewableStatuses.includes(item.status));
  const pendingCommunityPosts = communityPosts.filter((post) => (post.moderationStatus ?? 'Verified') === 'Pending');
  const selectedContribution = contributions.find((item) => item.id === selectedContributionId) ?? pendingContributions[0];
  const pendingReports = reports.filter((report) => report.status === 'Pending' || report.status === 'Investigating');
  const verifiedPlaces = venues.filter((venue) => venue.verificationStatus === 'Verified').length;

  const contributors = useMemo(() => {
    const directory = new Map<string, ContributorSummary>();
    const ensureContributor = (name: string, avatar: string) => {
      const key = name.trim().toLowerCase();
      const existing = directory.get(key);
      if (existing) {
        if (!existing.avatar && avatar) existing.avatar = avatar;
        return existing;
      }
      const contributor = { name, avatar, contributions: 0, posts: 0, comments: 0, helpful: 0 };
      directory.set(key, contributor);
      return contributor;
    };

    contributions.forEach((item) => {
      const contributor = ensureContributor(item.contributorName, item.contributorAvatar);
      contributor.contributions += 1;
      contributor.helpful += item.helpfulCount;
    });
    communityPosts.forEach((post) => {
      const contributor = ensureContributor(post.authorName, post.authorAvatar);
      contributor.posts += 1;
      contributor.helpful += post.helpfulCount;
      post.comments.forEach((comment) => {
        const commenter = ensureContributor(comment.authorName, comment.authorAvatar);
        commenter.comments += 1;
      });
    });
    venues.forEach((venue) => venue.verificationSummary.contributors.forEach((person) => {
      ensureContributor(person.name, person.avatar);
    }));

    return Array.from(directory.values()).sort((a, b) =>
      (b.contributions + b.posts) - (a.contributions + a.posts) || a.name.localeCompare(b.name)
    );
  }, [communityPosts, contributions, venues]);

  const filteredContributions = contributions.filter((item) => {
    const matchesFilter = queueFilter === 'All'
      || (queueFilter === 'Needs review' && reviewableStatuses.includes(item.status))
      || (queueFilter === 'Verified' && (item.status === 'Verified' || item.status === 'Community Verified'))
      || (queueFilter === 'Rejected' && item.status === 'Rejected');
    const query = reviewSearch.trim().toLowerCase();
    const matchesSearch = !query || [
      item.venueName,
      item.contributorName,
      item.venueCity,
      item.status,
    ].some((value) => value.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const filteredContributors = contributors.filter((contributor) =>
    contributor.name.toLowerCase().includes(contributorSearch.trim().toLowerCase())
  );
  const filteredPlaces = venues.filter((venue) =>
    [venue.name, venue.categoryLabel, venue.address, venue.verificationStatus]
      .some((value) => value.toLowerCase().includes(placeSearch.trim().toLowerCase()))
  );

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 3500);
  };

  const updateSelectedContribution = (status: Contribution['status'], note: string) => {
    if (!selectedContribution) return;
    updateContributionStatus(selectedContribution.id, status, note);
    showFeedback(`${selectedContribution.venueName}: ${status}.`);
  };

  const changeReportStatus = (report: ReportItem, status: ReportItem['status']) => {
    updateReportStatus(report.id, status);
    showFeedback(`Report for ${report.venueName} marked ${status.toLowerCase()}.`);
  };

  const moderateCommunityPost = (post: CommunityPost, status: 'Verified' | 'Rejected') => {
    updateCommunityPostStatus(post.id, status);
    showFeedback(`${post.venueName} post ${status.toLowerCase()}.`);
  };

  const communityReviewList = (items: CommunityPost[]) => (
    <div className="divide-y divide-[#EEEDE6]">
      {items.length ? items.map((post) => (
        <article key={post.id} className="py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[#263C3A]">{post.venueName} · {post.authorName}</p>
              <p className="mt-1 line-clamp-2 text-xs text-[#52635D]">{post.content}</p>
              <button
                type="button"
                onClick={() => navigateTo(`/venues/${post.venueSlug}`)}
                className="mt-1 text-xs font-semibold text-forest hover:underline"
              >
                Review place and location
              </button>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button type="button" onClick={() => moderateCommunityPost(post, 'Verified')} className={`${buttonClass} bg-forest text-white hover:bg-forest-hover`}>Verify</button>
              <button type="button" onClick={() => moderateCommunityPost(post, 'Rejected')} className={`${buttonClass} border border-[#F1C8BE] text-[#A84732] hover:bg-[#FCEBE7]`}>Reject</button>
            </div>
          </div>
        </article>
      )) : <p className="py-4 text-sm text-[#74817B]">No community posts are waiting for review.</p>}
    </div>
  );

  const reviewList = (items: Contribution[], compact = false) => (
    <div className="divide-y divide-[#EEEDE6]">
      {items.length ? items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            setSelectedContributionId(item.id);
            navigateTo('/admin/reviews');
          }}
          className="flex w-full items-center gap-3 py-3 text-left hover:bg-[#F7F6F0] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest"
        >
          <img
            src={item.photos[0]?.url ?? '/images/garden-cafe.jpg'}
            alt=""
            className={`${compact ? 'h-10 w-10' : 'h-12 w-12'} shrink-0 rounded-lg object-cover`}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-[#263C3A]">{item.venueName}</span>
            <span className="mt-0.5 block truncate text-xs text-[#74817B]">
              {item.contributorName} · {item.venueCategory} · {item.submissionDate}
            </span>
          </span>
          <VerificationBadge status={item.status} size="sm" />
        </button>
      )) : (
        <p className="py-8 text-center text-sm text-[#74817B]">No posts match this review filter.</p>
      )}
    </div>
  );

  const contributorList = (items: ContributorSummary[]) => (
    <div className="divide-y divide-[#EEEDE6]">
      {items.length ? items.map((contributor) => (
        <div key={contributor.name} className="flex items-center gap-3 py-3">
          <img
            src={contributor.avatar || '/images/profile-avatar.jpg'}
            alt=""
            className="h-10 w-10 rounded-full border border-[#E5E5DC] object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#263C3A]">{contributor.name}</p>
            <p className="text-xs text-[#74817B]">
              {contributor.contributions} submissions · {contributor.posts} posts · {contributor.comments} comments · {contributor.helpful} helpful
            </p>
          </div>
        </div>
      )) : <p className="py-8 text-center text-sm text-[#74817B]">No contributors found.</p>}
    </div>
  );

  const placeList = (items = filteredPlaces) => (
    <div className="divide-y divide-[#EEEDE6]">
      {items.map((venue) => (
        <button
          key={venue.id}
          type="button"
          onClick={() => navigateTo(`/venues/${venue.slug}`)}
          className="flex w-full items-center gap-3 py-3 text-left hover:bg-[#F7F6F0]"
        >
          <img src={venue.heroImage} alt="" className="h-11 w-11 rounded-lg object-cover" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-[#263C3A]">{venue.name}</span>
            <span className="block truncate text-xs text-[#74817B]">{venue.categoryLabel} · {venue.address}</span>
          </span>
          <VerificationBadge status={venue.verificationStatus} size="sm" />
        </button>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1600px] space-y-4 px-4 py-4 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF4EA] text-forest">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#263C3A]">{sectionTitles[section].title}</h1>
            <p className="text-xs text-[#74817B]">{sectionTitles[section].description}</p>
          </div>
        </div>
        <span className="rounded-full bg-[#EDF4EA] px-3 py-1.5 text-xs font-bold text-forest">
          {isSupabaseConfigured ? 'Administrator' : 'Demo administrator'}
        </span>
      </header>

      {feedback && (
        <div role="status" className="flex items-center gap-2 rounded-xl border border-[#C3D8CE] bg-[#EDF4EA] px-3 py-2 text-sm font-semibold text-forest">
          <CheckCircle2 className="h-4 w-4" /> {feedback}
        </div>
      )}

      {section === 'overview' && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: 'Needs review', count: pendingContributions.length + pendingCommunityPosts.length, icon: Clock3 },
              { label: 'Verified places', count: verifiedPlaces, icon: CheckCircle2 },
              { label: 'Open reports', count: pendingReports.length, icon: AlertTriangle },
              { label: 'Contributors', count: contributors.length, icon: Users },
              { label: 'Community posts', count: communityPosts.length, icon: FileImage },
            ].map(({ label, count, icon: Icon }) => (
              <div key={label} className={`${panelClass} flex items-center gap-3`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF4EA] text-forest"><Icon className="h-4 w-4" /></div>
                <div><p className="text-xl font-extrabold text-[#263C3A]">{count}</p><p className="text-xs text-[#74817B]">{label}</p></div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <section className={panelClass}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-[#263C3A]">New posts for review</h2>
                  <p className="text-xs text-[#74817B]">Recent citizen submissions awaiting moderation.</p>
                </div>
                <button type="button" onClick={() => navigateTo('/admin/reviews')} className="text-xs font-bold text-forest hover:underline">Open review queue</button>
              </div>
              {reviewList(pendingContributions.slice(0, 4), true)}
            </section>

            <section className={panelClass}>
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#263C3A]">Existing places</h2>
                  <p className="text-xs text-[#74817B]">{venues.length} listed places · click a marker for details.</p>
                </div>
                <button type="button" onClick={() => navigateTo('/admin/places')} className="text-xs font-bold text-forest hover:underline">Manage places</button>
              </div>
              <InteractiveMap venuesList={venues} className="h-[280px] w-full" zoomLevel={13} />
            </section>
          </div>

          {pendingCommunityPosts.length > 0 && (
            <section className={panelClass}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-[#263C3A]">Community posts awaiting review</h2>
                  <p className="text-xs text-[#74817B]">{pendingCommunityPosts.length} posts are live with a pending label.</p>
                </div>
                <button type="button" onClick={() => navigateTo('/admin/community')} className="text-xs font-bold text-forest hover:underline">Review all posts</button>
              </div>
              {communityReviewList(pendingCommunityPosts.slice(0, 4))}
            </section>
          )}

          <section className={panelClass}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#263C3A]">Contributor directory</h2>
                <p className="text-xs text-[#74817B]">People who submitted, posted, or verified information.</p>
              </div>
              <button type="button" onClick={() => navigateTo('/admin/contributors')} className="text-xs font-bold text-forest hover:underline">View all contributors</button>
            </div>
            <div className="grid gap-x-6 md:grid-cols-2">
              {contributorList(contributors.slice(0, 6))}
            </div>
          </section>
        </>
      )}

      {section === 'reviews' && (
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.4fr)]">
          <section className={panelClass}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#263C3A]">Submission review queue</h2>
                <p className="text-xs text-[#74817B]">{pendingContributions.length} posts need review.</p>
              </div>
              <FileImage className="h-5 w-5 text-forest" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(['Needs review', 'All', 'Verified', 'Rejected'] as QueueFilter[]).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setQueueFilter(filter)}
                  className={`${buttonClass} ${queueFilter === filter ? 'bg-forest text-white' : 'bg-[#F7F6F0] text-[#52635D]'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <label className="mt-3 flex items-center gap-2 rounded-lg border border-[#E5E5DC] bg-[#F7F6F0] px-3 py-2">
              <Search className="h-4 w-4 text-[#74817B]" />
              <input value={reviewSearch} onChange={(event) => setReviewSearch(event.target.value)} placeholder="Search post, place, or contributor" className="w-full bg-transparent text-xs outline-none" />
            </label>
            {reviewList(filteredContributions)}
            <div className="mt-4 border-t border-[#E5E5DC] pt-3">
              <h3 className="text-sm font-bold text-[#263C3A]">Community posts awaiting review</h3>
              {communityReviewList(pendingCommunityPosts)}
            </div>
          </section>

          <section className={panelClass}>
            {selectedContribution ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E5E5DC] pb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-forest">Post detail</p>
                    <h2 className="mt-1 text-lg font-bold text-[#263C3A]">{selectedContribution.venueName}</h2>
                    <p className="text-xs text-[#74817B]">{selectedContribution.venueCategory} · {selectedContribution.venueCity} · by {selectedContribution.contributorName}</p>
                  </div>
                  <VerificationBadge status={selectedContribution.status} size="sm" />
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selectedContribution.photos.map((photo) => (
                    <figure key={photo.id} className="overflow-hidden rounded-xl border border-[#E5E5DC]">
                      <img src={photo.url} alt={`${photo.category} evidence`} className="h-36 w-full object-cover" />
                      <figcaption className="px-2.5 py-2 text-xs font-semibold text-[#52635D]">{photo.category}</figcaption>
                    </figure>
                  ))}
                </div>
                <div className="mt-3 rounded-xl bg-[#F7F6F0] p-3">
                  <p className="text-xs font-bold text-[#263C3A]">Contributor's note</p>
                  <p className="mt-1 text-sm leading-5 text-[#52635D]">{selectedContribution.note}</p>
                </div>
                <div className="mt-3 rounded-xl border border-[#C3D8CE] bg-[#EDF4EA]/60 p-3">
                  <p className="text-xs font-bold text-forest">AI review aid · {selectedContribution.aiAnalysis.confidence} confidence</p>
                  <p className="mt-1 text-xs text-[#52635D]">{selectedContribution.aiAnalysis.detected.join(' · ')}</p>
                  <p className="mt-1 text-xs text-[#74817B]">{selectedContribution.aiAnalysis.notes}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => updateSelectedContribution('Verified', 'Approved by administrator.')} className={`${buttonClass} flex items-center gap-1.5 bg-forest text-white hover:bg-forest-hover`}><Check className="h-4 w-4" /> Approve</button>
                  <button type="button" onClick={() => updateSelectedContribution('Under Review', 'More evidence requested by administrator.')} className={`${buttonClass} border border-[#E5E5DC] text-[#263C3A] hover:bg-[#F7F6F0]`}>Request changes</button>
                  <button type="button" onClick={() => updateSelectedContribution('Rejected', 'Rejected by administrator.')} className={`${buttonClass} border border-[#F1C8BE] text-[#A84732] hover:bg-[#FCEBE7]`}>Reject</button>
                  <button type="button" onClick={() => navigateTo(`/venues/${selectedContribution.venueId}`)} className={`${buttonClass} ml-auto flex items-center gap-1.5 text-forest hover:bg-[#EDF4EA]`}>Open place <ExternalLink className="h-3.5 w-3.5" /></button>
                </div>
              </>
            ) : <p className="py-10 text-center text-sm text-[#74817B]">Select a post to review.</p>}
          </section>
        </div>
      )}

      {section === 'contributors' && (
        <section className={panelClass}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#263C3A]">All contributors</h2>
              <p className="text-xs text-[#74817B]">Contributor activity aggregated from submissions, community posts, and place verification credits.</p>
            </div>
            <label className="flex w-full items-center gap-2 rounded-lg border border-[#E5E5DC] bg-[#F7F6F0] px-3 py-2 sm:w-72">
              <Search className="h-4 w-4 text-[#74817B]" />
              <input value={contributorSearch} onChange={(event) => setContributorSearch(event.target.value)} placeholder="Find a contributor" className="w-full bg-transparent text-xs outline-none" />
            </label>
          </div>
          <div className="mt-3 grid gap-x-8 md:grid-cols-2">
            {contributorList(filteredContributors)}
          </div>
        </section>
      )}

      {section === 'places' && (
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
          <section className={panelClass}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-[#263C3A]">Places map</h2>
                <p className="text-xs text-[#74817B]">All current places and their verification state.</p>
              </div>
              <MapPin className="h-5 w-5 text-forest" />
            </div>
            <InteractiveMap venuesList={venues} className="h-[min(65vh,620px)] w-full" zoomLevel={13} />
          </section>
          <section className={panelClass}>
            <div className="mb-2">
              <h2 className="text-base font-bold text-[#263C3A]">Place directory ({filteredPlaces.length})</h2>
            </div>
            <label className="flex items-center gap-2 rounded-lg border border-[#E5E5DC] bg-[#F7F6F0] px-3 py-2">
              <Search className="h-4 w-4 text-[#74817B]" />
              <input value={placeSearch} onChange={(event) => setPlaceSearch(event.target.value)} placeholder="Search places" className="w-full bg-transparent text-xs outline-none" />
            </label>
            {placeList()}
          </section>
        </div>
      )}

      {section === 'community' && (
        <section className={panelClass}>
          <div className="mb-2">
            <h2 className="text-lg font-bold text-[#263C3A]">Community posts</h2>
            <p className="text-xs text-[#74817B]">New posts are visible to the community while awaiting review. Rejected posts remain in the author’s profile but are hidden from the feed.</p>
          </div>
          {communityPosts.length ? (
            <div className="divide-y divide-[#EEEDE6]">
              {communityPosts.map((post) => (
                <article key={post.id} className="py-4">
                  <div className="flex items-start gap-3">
                    <img src={post.authorAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="text-sm font-bold text-[#263C3A]">{post.authorName}</h3>
                        <span className="text-xs text-[#74817B]">{post.date}</span>
                        <span className="rounded-full bg-[#EDF4EA] px-2 py-0.5 text-[11px] font-semibold text-forest">{post.category}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          post.moderationStatus === 'Rejected'
                            ? 'bg-[#FCEBE7] text-[#A84732]'
                            : post.moderationStatus === 'Pending'
                              ? 'bg-[#FBF1DC] text-[#976B20]'
                              : 'bg-[#EDF4EA] text-forest'
                        }`}>{post.moderationStatus ?? 'Verified'}</span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-[#52635D]">{post.venueName}</p>
                      <p className="mt-1 max-w-4xl text-sm leading-5 text-[#52635D]">{post.content}</p>
                      {post.photos.length > 0 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto">
                          {post.photos.map((photo, index) => (
                            <img key={`${post.id}-${index}`} src={photo} alt={`Post evidence ${index + 1}`} className="h-20 w-24 shrink-0 rounded-lg object-cover" />
                          ))}
                        </div>
                      )}
                      <p className="mt-2 text-xs text-[#74817B]">{post.helpfulCount} helpful · {post.commentCount} comments</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateTo(`/venues/${post.venueSlug}`)}
                      className={`${buttonClass} hidden items-center gap-1 text-forest hover:bg-[#EDF4EA] sm:inline-flex`}
                    >
                      View place <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex shrink-0 flex-col gap-1">
                      {(post.moderationStatus ?? 'Verified') !== 'Verified' && (
                        <button
                          type="button"
                          onClick={() => updateCommunityPostStatus(post.id, 'Verified')}
                          className={`${buttonClass} bg-forest text-white hover:bg-forest-hover`}
                        >
                          Verify
                        </button>
                      )}
                      {(post.moderationStatus ?? 'Verified') !== 'Rejected' && (
                        <button
                          type="button"
                          onClick={() => updateCommunityPostStatus(post.id, 'Rejected')}
                          className={`${buttonClass} border border-[#F1C8BE] text-[#A84732] hover:bg-[#FCEBE7]`}
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="py-8 text-center text-sm text-[#74817B]">No community posts yet.</p>}
        </section>
      )}

      {section === 'reports' && (
        <section className={panelClass}>
          <div className="mb-2">
            <h2 className="text-lg font-bold text-[#263C3A]">Community reports</h2>
            <p className="text-xs text-[#74817B]">Investigate potentially outdated or inaccurate accessibility information.</p>
          </div>
          {reports.length ? (
            <div className="divide-y divide-[#EEEDE6]">
              {reports.map((report) => (
                <article key={report.id} className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-[#263C3A]">{report.venueName}</h3>
                        <span className="rounded-full bg-[#F7F6F0] px-2 py-0.5 text-[11px] font-semibold text-[#52635D]">{report.reason}</span>
                        <span className="text-[11px] text-[#74817B]">{report.createdAt}</span>
                      </div>
                      <p className="mt-1 text-sm text-[#52635D]">{report.description}</p>
                    </div>
                    <span className="rounded-full border border-[#E5E5DC] px-2.5 py-1 text-xs font-semibold text-[#52635D]">{report.status}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => changeReportStatus(report, 'Investigating')} className={`${buttonClass} border border-[#E5E5DC] text-[#263C3A] hover:bg-[#F7F6F0]`}>Investigate</button>
                    <button type="button" onClick={() => changeReportStatus(report, 'Resolved')} className={`${buttonClass} bg-forest text-white hover:bg-forest-hover`}>Resolve</button>
                    <button type="button" onClick={() => changeReportStatus(report, 'Dismissed')} className={`${buttonClass} text-[#A84732] hover:bg-[#FCEBE7]`}>Dismiss</button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedContributionId(report.contributionId);
                        navigateTo('/admin/reviews');
                      }}
                      className={`${buttonClass} ml-auto flex items-center gap-1 text-forest hover:bg-[#EDF4EA]`}
                    >
                      Review related post <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="py-8 text-center text-sm text-[#74817B]">No reports have been submitted.</p>}
        </section>
      )}
    </div>
  );
};
