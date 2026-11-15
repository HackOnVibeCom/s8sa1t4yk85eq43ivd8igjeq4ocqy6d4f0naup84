import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Users, 
  Plus, 
  Search, 
  ChevronDown, 
  ThumbsUp, 
  ThumbsDown,
  MessageSquare, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Flame, 
  Tag, 
  MapPin, 
  Send,
  Star,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const { 
    communityPosts, 
    likeCommunityPost, 
    dislikeCommunityPost,
    addCommentToPost, 
    addCommunityPost, 
    navigateTo, 
    userProfile,
    venues,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'All Posts' | 'Reviews' | 'Questions' | 'Updates' | 'Verified Contributions'>('All Posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  // New post modal fields
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostVenue, setNewPostVenue] = useState('The Garden Café');
  const [postError, setPostError] = useState('');

  const filteredPosts = communityPosts.filter(post => {
    if (post.moderationStatus === 'Rejected') return false;
    if (activeTab !== 'All Posts' && post.category !== activeTab) {
      if (activeTab === 'Reviews' && post.category !== 'Reviews') return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchVenue = post.venueName.toLowerCase().includes(q);
      const matchText = post.content.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      if (!matchVenue && !matchText && !matchAuthor) return false;
    }
    return true;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    const venue = venues.find((item) => item.name === newPostVenue);
    if (!venue) {
      setPostError('Choose an existing place so the admin can review its location.');
      return;
    }
    addCommunityPost({
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      authorBadge: 'Top Contributor',
      venueName: venue.name,
      venueSlug: venue.slug,
      content: newPostContent,
      photos: [],
      category: 'All Posts'
    });
    setNewPostContent('');
    setPostError('');
    setIsNewPostModalOpen(false);
  };

  const handleCommentSubmit = (postId: string) => {
    if (!newCommentText.trim()) return;
    addCommentToPost(postId, newCommentText.trim());
    setNewCommentText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#DDEBE1] text-forest flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-forest" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263C3A] tracking-tight">
              Community
            </h1>
            <p className="text-xs sm:text-sm text-[#74817B]">
              Reviews, discussions, updates and real experiences from the CANIGO community.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewPostModalOpen(true)}
          className="px-4 py-2.5 bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Post / Review
        </button>
      </div>

      {/* Horizontal Category Tabs */}
      <div className="flex items-center gap-6 border-b border-[#E5E5DC] overflow-x-auto text-xs sm:text-sm font-semibold">
        {(['All Posts', 'Reviews', 'Questions', 'Updates', 'Verified Contributions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-b-2 border-forest text-forest font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 bg-white border border-[#E5E5DC] rounded-xl px-3.5 py-2 w-full shadow-2xs">
          <Search className="w-4 h-4 text-[#74817B] flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions, places, or tags..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#263C3A] focus:outline-none"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-[#E5E5DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#263C3A] focus:outline-none shadow-2xs cursor-pointer flex-1 sm:flex-none"
          >
            <option value="All Categories">All Categories</option>
            <option value="Restaurants">Restaurants</option>
            <option value="Shopping Malls">Shopping Malls</option>
            <option value="Public Spaces">Public Spaces</option>
          </select>

          <select
            className="bg-white border border-[#E5E5DC] rounded-xl px-3 py-2 text-xs font-semibold text-[#263C3A] focus:outline-none shadow-2xs cursor-pointer flex-1 sm:flex-none"
          >
            <option value="Latest">Latest</option>
            <option value="Most Helpful">Most Helpful</option>
            <option value="Trending">Trending</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Feed + Right Sidebar Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Main Feed */}
        <div className="lg:col-span-8 space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-4">
              
              {/* Post Header: Contributor & Venue Tag */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#263C3A]">{post.authorName}</span>
                      {post.authorBadge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          post.authorBadge === 'Top Contributor'
                            ? 'bg-[#FBF1DC] text-[#976B20]'
                            : 'bg-[#EDF4EA] text-forest'
                        }`}>
                          <Star className="w-3 h-3 fill-current" />
                          {post.authorBadge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#74817B] mt-0.5">
                      <span 
                        onClick={() => navigateTo(`/venues/${post.venueSlug}`)}
                        className="font-medium hover:text-forest cursor-pointer hover:underline"
                      >
                        {post.venueName}
                      </span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    {post.moderationStatus === 'Pending' && (
                      <p className="mt-1 text-[11px] font-semibold text-amber-700">Visible to the community · awaiting admin review</p>
                    )}
                    {post.moderationStatus === 'Verified' && (
                      <p className="mt-1 text-[11px] font-semibold text-forest">Admin verified</p>
                    )}
                  </div>
                </div>

                <button className="text-gray-400 hover:text-[#263C3A] p-1">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Body Content */}
              <p className="text-xs sm:text-sm text-[#263C3A] leading-relaxed">
                {post.content}
              </p>

              {/* Photos Gallery Grid */}
              {post.photos && post.photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {post.photos.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => navigateTo('/evidence/photo-1')}
                      className="h-28 rounded-xl overflow-hidden border border-gray-100 cursor-pointer group"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Reaction Buttons Row */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs font-semibold text-[#74817B]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => likeCommunityPost(post.id)}
                    aria-pressed={Boolean(post.isLiked)}
                    className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors ${
                      post.isLiked
                        ? 'text-forest bg-[#EDF4EA]'
                        : 'hover:text-forest hover:bg-gray-50'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-forest' : ''}`} />
                    <span>Helpful ({post.helpfulCount})</span>
                  </button>

                  <button
                    onClick={() => dislikeCommunityPost(post.id)}
                    aria-pressed={Boolean(post.isDisliked)}
                    className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors ${
                      post.isDisliked ? 'text-terracotta bg-[#FCEBE7]' : 'hover:text-terracotta hover:bg-gray-50'
                    }`}
                  >
                    <ThumbsDown className={`w-4 h-4 ${post.isDisliked ? 'fill-terracotta' : ''}`} />
                    <span>Not helpful ({post.dislikeCount ?? 0})</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:text-forest hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentCount} Comments</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:text-forest hover:bg-gray-50 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:text-forest hover:bg-gray-50 rounded-lg transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expandable Comment Section */}
              {activeCommentPostId === post.id && (
                <div className="pt-3 border-t border-[#E5E5DC] space-y-3">
                  <div className="space-y-2.5">
                    {post.comments.map((c) => (
                      <div key={c.id} className="bg-[#F7F6F0] p-3 rounded-xl border border-[#E5E5DC] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#263C3A]">{c.authorName}</span>
                          <span className="text-[10px] text-[#74817B]">{c.date}</span>
                        </div>
                        <p className="text-[#263C3A]">{c.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      maxLength={1000}
                      placeholder="Write a comment or add context..."
                      className="flex-1 text-xs px-3.5 py-2 bg-[#F7F6F0] border border-[#E5E5DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest text-[#263C3A]"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="p-2 bg-forest text-white rounded-xl hover:bg-forest-hover transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Right Sidebar: Highlights, Trending Discussions, Popular Tags */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Community Highlights Card */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
                Community Highlights
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-[#F7F6F0] rounded-xl p-2.5 border border-[#E5E5DC]">
                <MapPin className="w-4 h-4 text-forest mx-auto mb-1" />
                <p className="font-extrabold text-sm sm:text-base text-[#263C3A]">1,420</p>
                <p className="text-[10px] text-[#74817B]">Places Shared</p>
              </div>

              <div className="bg-[#F7F6F0] rounded-xl p-2.5 border border-[#E5E5DC]">
                <Users className="w-4 h-4 text-forest mx-auto mb-1" />
                <p className="font-extrabold text-sm sm:text-base text-[#263C3A]">3,280</p>
                <p className="text-[10px] text-[#74817B]">Contributors</p>
              </div>

              <div className="bg-[#F7F6F0] rounded-xl p-2.5 border border-[#E5E5DC]">
                <MessageSquare className="w-4 h-4 text-forest mx-auto mb-1" />
                <p className="font-extrabold text-sm sm:text-base text-[#263C3A]">5,960</p>
                <p className="text-[10px] text-[#74817B]">Reviews & Comments</p>
              </div>
            </div>
          </div>

          {/* Trending Discussions Card (Flame icon) */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
                Trending Discussions
              </h3>
            </div>

            <div className="space-y-2.5 divide-y divide-gray-100 text-xs">
              <div className="pt-2 flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-bold text-[#263C3A] group-hover:text-forest transition-colors">
                    Best wheelchair-friendly restaurants in Chennai?
                  </p>
                  <p className="text-[11px] text-[#74817B]">32 comments</p>
                </div>
                <span className="text-gray-400 group-hover:text-forest">›</span>
              </div>

              <div className="pt-2 flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-bold text-[#263C3A] group-hover:text-forest transition-colors">
                    How to identify a truly accessible restroom?
                  </p>
                  <p className="text-[11px] text-[#74817B]">18 comments</p>
                </div>
                <span className="text-gray-400 group-hover:text-forest">›</span>
              </div>

              <div className="pt-2 flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-bold text-[#263C3A] group-hover:text-forest transition-colors">
                    Places with good tactile (visual aid) support?
                  </p>
                  <p className="text-[11px] text-[#74817B]">14 comments</p>
                </div>
                <span className="text-gray-400 group-hover:text-forest">›</span>
              </div>
            </div>
          </div>

          {/* Popular Tags Card */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-forest" />
              <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
                Popular Tags
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {['#WheelchairAccess', '#Restaurants', '#Ramps', '#AccessibleRestroom', '#Lifts', '#Chennai', '#Malls'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag.replace('#', ''))}
                  className="px-2.5 py-1 bg-[#EDF4EA] hover:bg-[#DDEBE1] text-forest rounded-full text-xs font-semibold transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* New Post Modal Dialog */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E5E5DC] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5DC]">
              <h3 className="font-bold text-base text-[#263C3A]">Share an Accessibility Review / Post</h3>
              <button onClick={() => setIsNewPostModalOpen(false)} className="text-gray-400 hover:text-[#263C3A]">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#263C3A] mb-1">Venue Name</label>
                <select
                  value={newPostVenue}
                  onChange={(e) => setNewPostVenue(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2 bg-[#F7F6F0] border border-[#E5E5DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest text-[#263C3A]"
                >
                  {venues.map((venue) => <option key={venue.id} value={venue.name}>{venue.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#263C3A] mb-1">Your Observation / Experience</label>
                <textarea
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  maxLength={1000}
                  placeholder="Describe entrance, ramp condition, door clearance, lift availability, restroom grab bars..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2 bg-[#F7F6F0] border border-[#E5E5DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest text-[#263C3A]"
                />
              </div>

              <p className="text-xs text-[#74817B]">Your post appears in Community immediately with a pending-review label. An admin can verify or reject it after checking the place.</p>
              {postError && <p role="alert" className="text-xs text-red-700">{postError}</p>}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5DC]">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#74817B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-forest text-white text-xs font-bold rounded-xl hover:bg-forest-hover shadow-xs"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
