import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  ThumbsUp, 
  RefreshCw, 
  Flag, 
  Award, 
  Star, 
  ChevronRight, 
  Settings, 
  Eye, 
  Plus, 
  CheckCheck
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    navigateTo 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | 'Updates' | 'Comments' | 'Helpful Votes' | 'Reports'>('All');

  const [preferences, setPreferences] = useState({
    contributionUpdates: true,
    commentsReplies: true,
    helpfulVotes: true,
    reportStatus: true,
    badgesAchievements: true
  });

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Updates') return n.type === 'verified' || n.type === 'update_request' || n.type === 'new_place';
    if (activeTab === 'Comments') return n.type === 'comment';
    if (activeTab === 'Helpful Votes') return n.type === 'helpful';
    if (activeTab === 'Reports') return n.type === 'report';
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'verified':
        return (
          <div className="w-9 h-9 rounded-full bg-[#EDF4EA] text-forest flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-forest" />
          </div>
        );
      case 'comment':
        return (
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
        );
      case 'helpful':
        return (
          <div className="w-9 h-9 rounded-full bg-[#EDF4EA] text-forest flex items-center justify-center flex-shrink-0">
            <ThumbsUp className="w-5 h-5" />
          </div>
        );
      case 'update_request':
        return (
          <div className="w-9 h-9 rounded-full bg-[#FBF1DC] text-amber-700 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
        );
      case 'report':
        return (
          <div className="w-9 h-9 rounded-full bg-[#FCEBE7] text-terracotta flex items-center justify-center flex-shrink-0">
            <Flag className="w-5 h-5" />
          </div>
        );
      case 'badge':
        return (
          <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 fill-current" />
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Title & Mark All Read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#DDEBE1] text-forest flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-forest" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263C3A] tracking-tight">
              Notifications & Activity
            </h1>
            <p className="text-xs sm:text-sm text-[#74817B]">
              Stay updated on your contributions, reviews and community interactions.
            </p>
          </div>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs font-semibold text-forest hover:text-forest-hover flex items-center gap-1.5 self-start sm:self-auto hover:underline"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {/* Filter Tabs (PDF Page 10) */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('All')}
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            activeTab === 'All' ? 'bg-[#DDEBE1] text-[#155E4B] font-bold' : 'text-[#74817B] hover:text-[#263C3A]'
          }`}
        >
          All (12)
        </button>
        <button
          onClick={() => setActiveTab('Updates')}
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            activeTab === 'Updates' ? 'bg-[#DDEBE1] text-[#155E4B] font-bold' : 'text-[#74817B] hover:text-[#263C3A]'
          }`}
        >
          Updates (4)
        </button>
        <button
          onClick={() => setActiveTab('Comments')}
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            activeTab === 'Comments' ? 'bg-[#DDEBE1] text-[#155E4B] font-bold' : 'text-[#74817B] hover:text-[#263C3A]'
          }`}
        >
          Comments (3)
        </button>
        <button
          onClick={() => setActiveTab('Helpful Votes')}
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            activeTab === 'Helpful Votes' ? 'bg-[#DDEBE1] text-[#155E4B] font-bold' : 'text-[#74817B] hover:text-[#263C3A]'
          }`}
        >
          Helpful Votes (2)
        </button>
        <button
          onClick={() => setActiveTab('Reports')}
          className={`px-3.5 py-1.5 rounded-full transition-colors ${
            activeTab === 'Reports' ? 'bg-[#DDEBE1] text-[#155E4B] font-bold' : 'text-[#74817B] hover:text-[#263C3A]'
          }`}
        >
          Reports (2)
        </button>
      </div>

      {/* Main Grid: Notification Feed + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Notification Cards List */}
        <div className="lg:col-span-8 space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationAsRead(n.id);
                if (n.linkUrl) navigateTo(n.linkUrl);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                !n.read
                  ? 'bg-white border-[#C3D8CE] shadow-xs'
                  : 'bg-white/80 border-[#E5E5DC] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {getNotifIcon(n.type)}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs sm:text-sm text-[#263C3A] truncate">
                      {n.title}
                    </h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-forest flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#74817B] mt-0.5 line-clamp-1">
                    {n.description}
                  </p>
                </div>
              </div>

              {/* Right: Timestamp, Thumbnail / Badge, Chevron */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[11px] text-[#74817B] hidden sm:block">
                  {n.timestamp}
                </span>

                {n.thumbnail && (
                  <img
                    src={n.thumbnail}
                    alt=""
                    className="w-12 h-10 rounded-lg object-cover border border-gray-100 hidden sm:block"
                  />
                )}

                {n.badgeGraphic && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EDF4EA] text-forest text-[11px] font-bold border border-[#C3D8CE]">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Community Contributor
                  </span>
                )}

                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar: Notification Preferences & 30-Day Activity (PDF Page 10) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Notification Preferences Card */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-forest" />
              <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
                Notification Preferences
              </h3>
            </div>
            <p className="text-xs text-[#74817B]">
              Choose what updates you want to receive.
            </p>

            <div className="space-y-3 pt-1 text-xs sm:text-sm text-[#263C3A]">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Contribution updates</span>
                <input
                  type="checkbox"
                  checked={preferences.contributionUpdates}
                  onChange={(e) => setPreferences({ ...preferences, contributionUpdates: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Comments and replies</span>
                <input
                  type="checkbox"
                  checked={preferences.commentsReplies}
                  onChange={(e) => setPreferences({ ...preferences, commentsReplies: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Helpful votes</span>
                <input
                  type="checkbox"
                  checked={preferences.helpfulVotes}
                  onChange={(e) => setPreferences({ ...preferences, helpfulVotes: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Report status</span>
                <input
                  type="checkbox"
                  checked={preferences.reportStatus}
                  onChange={(e) => setPreferences({ ...preferences, reportStatus: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Badges and achievements</span>
                <input
                  type="checkbox"
                  checked={preferences.badgesAchievements}
                  onChange={(e) => setPreferences({ ...preferences, badgesAchievements: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
              </label>
            </div>
          </div>

          {/* Your Activity (Last 30 Days) Card (PDF Page 10) */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
              Your Activity (Last 30 Days)
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-3 bg-[#F7F6F0] rounded-2xl border border-[#E5E5DC]">
                <Plus className="w-4 h-4 text-forest mx-auto mb-1" />
                <p className="font-extrabold text-base text-[#263C3A]">+6</p>
                <p className="text-[10px] text-[#74817B]">Contributions</p>
              </div>

              <div className="p-3 bg-[#F7F6F0] rounded-2xl border border-[#E5E5DC]">
                <MessageSquare className="w-4 h-4 text-forest mx-auto mb-1" />
                <p className="font-extrabold text-base text-[#263C3A]">4</p>
                <p className="text-[10px] text-[#74817B]">Reviews</p>
              </div>

              <div className="p-3 bg-[#F7F6F0] rounded-2xl border border-[#E5E5DC]">
                <Eye className="w-4 h-4 text-forest mx-auto mb-1" />
                <p className="font-extrabold text-base text-[#263C3A]">18</p>
                <p className="text-[10px] text-[#74817B]">Profile Views</p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('/profile')}
              className="w-full py-2 bg-[#EDF4EA] hover:bg-[#DDEBE1] text-forest text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              View Full Activity History
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
