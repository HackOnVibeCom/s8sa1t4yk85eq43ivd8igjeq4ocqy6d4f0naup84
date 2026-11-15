import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { 
  User, 
  MapPin, 
  FileText, 
  MessageSquare, 
  Bookmark, 
  Star, 
  Edit3, 
  Plus, 
  Eye, 
  MoreVertical,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Activity,
  Trash2
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    contributions, 
    navigateTo, 
    savedLists,
    venues 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'contributions' | 'reviews' | 'saved' | 'activity'>('contributions');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(userProfile.bio);

  const handleSaveBio = () => {
    updateUserProfile({ bio: tempBio });
    setIsEditingBio(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Profile Card with Chennai motif */}
      <div className="bg-white rounded-3xl border border-[#E5E5DC] p-6 shadow-xs relative overflow-hidden">
        {/* Soft skyline background illustration on right */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-80 opacity-20 pointer-events-none hidden md:block bg-contain bg-no-repeat bg-right"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 120' fill='%2380A995'%3E%3Cpath d='M20 120V80h15v40h10V60h20v60h10V40h15v80h10V70h30v50h15V50h25v70h15V30h20v90h15V60h30v60h10V80h20v40z' opacity='0.5'/%3E%3Ccircle cx='105' cy='25' r='10'/%3E%3Cpath d='M220 30l10-20 10 20z'/%3E%3C/svg%3E")`
          }}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10 relative">
          
          {/* Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex flex-col items-center">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#EDF4EA] shadow-xs"
              />
              <button
                onClick={() => setIsEditingBio(!isEditingBio)}
                className="mt-2 text-xs font-semibold text-forest hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>

            <div className="space-y-1.5 max-w-lg">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#263C3A] tracking-tight">
                  {userProfile.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EDF4EA] text-forest text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-forest" />
                  {userProfile.badge}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#74817B]">
                <MapPin className="w-3.5 h-3.5 text-forest" />
                <span>{userProfile.location}</span>
              </div>

              {isEditingBio ? (
                <div className="space-y-2 pt-1">
                  <textarea
                    rows={2}
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    className="w-full text-xs p-2 bg-[#F7F6F0] border border-[#E5E5DC] rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveBio}
                      className="px-3 py-1 bg-forest text-white text-xs font-semibold rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-3 py-1 bg-gray-200 text-[#263C3A] text-xs font-semibold rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-[#74817B] leading-relaxed">
                  {userProfile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 w-full md:w-auto">
            <div className="text-center p-3 bg-[#F7F6F0] rounded-2xl border border-[#E5E5DC]">
              <FileText className="w-4 h-4 text-forest mx-auto mb-1" />
              <p className="text-lg font-extrabold text-[#263C3A]">{userProfile.contributionsCount}</p>
              <p className="text-[11px] text-[#74817B]">Contributions</p>
            </div>

            <div className="text-center p-3 bg-[#F7F6F0] rounded-2xl border border-[#E5E5DC]">
              <MessageSquare className="w-4 h-4 text-forest mx-auto mb-1" />
              <p className="text-lg font-extrabold text-[#263C3A]">{userProfile.reviewsCount}</p>
              <p className="text-[11px] text-[#74817B]">Reviews</p>
            </div>

            <div className="text-center p-3 bg-[#F7F6F0] rounded-2xl border border-[#E5E5DC]">
              <Bookmark className="w-4 h-4 text-forest mx-auto mb-1" />
              <p className="text-lg font-extrabold text-[#263C3A]">{userProfile.savedPlacesCount}</p>
              <p className="text-[11px] text-[#74817B]">Saved Places</p>
            </div>

            <div className="text-center p-3 bg-[#F7F6F0] rounded-2xl border border-[#E5E5DC]">
              <Star className="w-4 h-4 text-[#D6A34B] mx-auto mb-1 fill-[#D6A34B]" />
              <p className="text-lg font-extrabold text-[#263C3A]">{userProfile.reputationPoints}</p>
              <p className="text-[11px] text-[#74817B]">Reputation Points</p>
            </div>
          </div>

        </div>

        {/* Horizontal Navigation Tabs (PDF Page 6) */}
        <div className="flex items-center gap-2 sm:gap-4 mt-6 pt-4 border-t border-[#E5E5DC] overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#DDEBE1] text-[#155E4B] font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            <User className="w-4 h-4" />
            My Profile
          </button>

          <button
            onClick={() => setActiveTab('contributions')}
            className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'contributions'
                ? 'bg-[#DDEBE1] text-[#155E4B] font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            <FileText className="w-4 h-4" />
            My Contributions
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-[#DDEBE1] text-[#155E4B] font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            My Reviews
          </button>

          <button
            onClick={() => navigateTo('/saved')}
            className="px-4 py-2 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 text-[#74817B] hover:text-[#263C3A]"
          >
            <Bookmark className="w-4 h-4" />
            Saved Places
          </button>

          <button
            onClick={() => navigateTo('/notifications')}
            className="px-4 py-2 rounded-xl transition-colors whitespace-nowrap flex items-center gap-2 text-[#74817B] hover:text-[#263C3A]"
          >
            <Activity className="w-4 h-4" />
            Activity
          </button>
        </div>

      </div>

      {/* Main Section: My Contributions List (PDF Page 6) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#263C3A]">My Contributions</h2>
            <p className="text-xs sm:text-sm text-[#74817B]">
              A list of places you've added or updated with accessibility information.
            </p>
          </div>

          <button
            onClick={() => navigateTo('/contribute')}
            className="px-4 py-2.5 bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add New Contribution
          </button>
        </div>

        {/* Contributions Cards List */}
        <div className="space-y-3.5">
          {contributions.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E5E5DC] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-subtle transition-shadow"
            >
              {/* Left Details */}
              <div className="flex items-center gap-4">
                <img
                  src={item.photos[0]?.url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=200&q=80'}
                  alt={item.venueName}
                  className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-base text-[#263C3A] hover:text-forest cursor-pointer" onClick={() => navigateTo(`/venues/${item.venueId}`)}>
                    {item.venueName}
                  </h3>
                  <p className="text-xs text-[#74817B] mt-0.5">
                    {item.venueCategory} • {item.venueCity}, Tamil Nadu
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Added on {item.submissionDate}
                  </p>
                </div>
              </div>

              {/* Status & Verification Text */}
              <div className="flex flex-col sm:items-start text-xs">
                <VerificationBadge status={item.status} size="md" />
                <span className="text-[11px] text-[#74817B] mt-1">
                  {item.status === 'Verified' && 'Verified by 3 community members.'}
                  {item.status === 'Under Review' && 'Awaiting community verification.'}
                  {item.status === 'Community Verified' && 'Verified by 5 community members.'}
                  {item.status === 'Pending Verification' && 'In review queue.'}
                  {item.status === 'Reported' && 'Under dispute review.'}
                </span>
              </div>

              {/* Actions: View, Edit, More */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => navigateTo(`/venues/${item.venueId}`)}
                  className="px-3 py-1.5 bg-white hover:bg-[#F7F6F0] border border-[#E5E5DC] text-[#263C3A] text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>

                <button
                  onClick={() => navigateTo('/contribute')}
                  className="px-3 py-1.5 bg-white hover:bg-[#F7F6F0] border border-[#E5E5DC] text-[#263C3A] text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>

                <button className="p-1.5 text-gray-400 hover:text-[#263C3A] rounded-lg">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
