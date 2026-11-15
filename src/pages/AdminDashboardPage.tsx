import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Users, 
  Search, 
  SlidersHorizontal, 
  ChevronRight, 
  ExternalLink, 
  Sparkles, 
  Check, 
  Edit3, 
  XCircle, 
  Calendar,
  Clock,
  Info
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { contributions, updateContributionStatus, navigateTo } = useApp();

  const [selectedQueueId, setSelectedQueueId] = useState<string>(contributions[0]?.id || 'contrib-1');
  const [activeQueueFilter, setActiveQueueFilter] = useState<'All' | 'Place Added' | 'Photo Update' | 'Report'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [moderationFeedback, setModerationFeedback] = useState('');

  const selectedItem = contributions.find(c => c.id === selectedQueueId) || contributions[0];

  const handleApprove = () => {
    if (selectedItem) {
      updateContributionStatus(selectedItem.id, 'Verified', 'Approved by administrator moderation.');
      setModerationFeedback(`Verified and approved ${selectedItem.venueName}.`);
      setTimeout(() => setModerationFeedback(''), 4000);
    }
  };

  const handleRequestChanges = () => {
    if (selectedItem) {
      updateContributionStatus(selectedItem.id, 'Under Review', 'Requested clearer photo of slope/width.');
      setModerationFeedback(`Requested changes for ${selectedItem.venueName}.`);
      setTimeout(() => setModerationFeedback(''), 4000);
    }
  };

  const handleReject = () => {
    if (selectedItem) {
      updateContributionStatus(selectedItem.id, 'Rejected', 'Rejected due to insufficient evidence.');
      setModerationFeedback(`Contribution rejected for ${selectedItem.venueName}.`);
      setTimeout(() => setModerationFeedback(''), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header: Shield icon & Time Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EDF4EA] text-forest flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-forest" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263C3A] tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#74817B]">
              Moderate contributions, review reports and manage verification requests.
            </p>
          </div>
        </div>

        <select className="bg-white border border-[#E5E5DC] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#263C3A] shadow-2xs cursor-pointer self-start sm:self-auto">
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* 5 Metric Cards in a row (PDF Page 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Pending Reviews */}
        <div className="bg-white rounded-2xl border border-[#E5E5DC] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDF4EA] text-forest flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-forest" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-[#263C3A]">24</p>
            <p className="text-xs text-[#74817B]">Pending Reviews</p>
          </div>
        </div>

        {/* Verified */}
        <div className="bg-white rounded-2xl border border-[#E5E5DC] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDF4EA] text-forest flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-forest" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-[#263C3A]">18</p>
            <p className="text-xs text-[#74817B]">Verified</p>
          </div>
        </div>

        {/* Reports */}
        <div className="bg-white rounded-2xl border border-[#E5E5DC] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FBF1DC] text-amber-700 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-[#263C3A]">8</p>
            <p className="text-xs text-[#74817B]">Reports</p>
          </div>
        </div>

        {/* Updates */}
        <div className="bg-white rounded-2xl border border-[#E5E5DC] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDF4EA] text-forest flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-5 h-5 text-forest" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-[#263C3A]">6</p>
            <p className="text-xs text-[#74817B]">Updates</p>
          </div>
        </div>

        {/* Active Contributors */}
        <div className="bg-white rounded-2xl border border-[#E5E5DC] p-4 shadow-xs flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-[#EDF4EA] text-forest flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-forest" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-[#263C3A]">152</p>
            <p className="text-xs text-[#74817B]">Active Contributors</p>
          </div>
        </div>

      </div>

      {moderationFeedback && (
        <div className="p-3 bg-[#EDF4EA] border border-[#C3D8CE] text-forest text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{moderationFeedback}</span>
        </div>
      )}

      {/* Main Layout: Review Queue (Left) + Review Contribution Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Review Queue (24) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base sm:text-lg font-bold text-[#263C3A]">
              Review Queue ({contributions.length})
            </h2>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => setActiveQueueFilter('All')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  activeQueueFilter === 'All' ? 'bg-forest text-white' : 'bg-gray-100 text-[#74817B] hover:text-[#263C3A]'
                }`}
              >
                All ({contributions.length})
              </button>
              <button
                onClick={() => setActiveQueueFilter('Place Added')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  activeQueueFilter === 'Place Added' ? 'bg-forest text-white' : 'bg-gray-100 text-[#74817B] hover:text-[#263C3A]'
                }`}
              >
                Place Added (8)
              </button>
              <button
                onClick={() => setActiveQueueFilter('Photo Update')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  activeQueueFilter === 'Photo Update' ? 'bg-forest text-white' : 'bg-gray-100 text-[#74817B] hover:text-[#263C3A]'
                }`}
              >
                Photo Update (10)
              </button>
              <button
                onClick={() => setActiveQueueFilter('Report')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  activeQueueFilter === 'Report' ? 'bg-forest text-white' : 'bg-gray-100 text-[#74817B] hover:text-[#263C3A]'
                }`}
              >
                Report (6)
              </button>
            </div>
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[#F7F6F0] border border-[#E5E5DC] rounded-xl px-3 py-2 text-xs">
              <Search className="w-3.5 h-3.5 text-[#74817B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by place, contributor or location..."
                className="w-full bg-transparent focus:outline-none text-[#263C3A]"
              />
            </div>
            <select className="bg-[#F7F6F0] border border-[#E5E5DC] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#263C3A]">
              <option>Sort: Newest</option>
              <option>Sort: Oldest</option>
            </select>
          </div>

          {/* Queue List Items */}
          <div className="space-y-2.5 divide-y divide-gray-100">
            {contributions.map((item) => {
              const isSelected = item.id === selectedQueueId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedQueueId(item.id)}
                  className={`pt-2.5 p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#EDF4EA] border border-[#C3D8CE]'
                      : 'hover:bg-[#F7F6F0] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.photos[0]?.url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=120&q=80'}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-[#263C3A] hover:text-forest">
                          {item.venueName}
                        </h4>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </div>
                      <p className="text-xs text-[#74817B]">
                        {item.venueCategory} • {item.venueCity}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        By {item.contributorName} • {item.submissionDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <VerificationBadge status={item.status} size="sm" />
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Review Contribution Panel for Selected Item (PDF Page 7) */}
        {selectedItem && (
          <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E5E5DC] p-5 sm:p-6 shadow-xs space-y-5">
            
            <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5DC]">
              <div className="w-7 h-7 rounded-lg bg-[#EDF4EA] text-forest flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-base text-[#263C3A]">Review Contribution</h2>
            </div>

            {/* Large Photo & Thumbnails */}
            <div className="space-y-2">
              <div className="h-60 rounded-2xl overflow-hidden border border-gray-100">
                <img
                  src={selectedItem.photos[0]?.url}
                  alt={selectedItem.venueName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails strip */}
              {selectedItem.photos.length > 1 && (
                <div className="flex gap-2">
                  {selectedItem.photos.slice(1, 4).map((p, i) => (
                    <img
                      key={p.id}
                      src={p.url}
                      alt=""
                      className="w-20 h-16 rounded-xl object-cover border border-gray-100"
                    />
                  ))}
                  {selectedItem.photos.length > 4 && (
                    <div className="w-20 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-[#74817B]">
                      +{selectedItem.photos.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Venue & Contributor Details */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#263C3A] flex items-center gap-1.5">
                    {selectedItem.venueName}
                    <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer" onClick={() => navigateTo(`/venues/${selectedItem.venueId}`)} />
                  </h3>
                  <p className="text-xs text-[#74817B]">
                    {selectedItem.venueCategory} • {selectedItem.venueCity}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedItem.contributorAvatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-gray-100"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#263C3A]">Submitted by {selectedItem.contributorName}</p>
                      <p className="text-[10px] text-[#74817B]">{selectedItem.submissionDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contributor's Note */}
              <div className="bg-[#F7F6F0] p-3.5 rounded-2xl border border-[#E5E5DC] text-xs">
                <p className="font-bold text-[#263C3A] flex items-center gap-1 mb-1">
                  <span>❝</span> Contributor's Note
                </p>
                <p className="text-[#263C3A] leading-relaxed italic">
                  {selectedItem.note}
                </p>
              </div>

              {/* AI Analysis (Assistance only) (PDF Page 7) */}
              <div className="bg-[#EDF4EA]/60 rounded-2xl p-4 border border-[#C3D8CE] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-forest">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Analysis (Assistance only)</span>
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedItem.aiAnalysis.detected.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-white text-forest border border-[#C3D8CE] text-xs font-semibold flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3 h-3 text-forest" />
                      {item}
                    </span>
                  ))}
                </div>

                <p className="text-[11px] text-[#74817B] italic pt-1">
                  {selectedItem.aiAnalysis.notes}
                </p>
              </div>

              {/* Admin Action Buttons (PDF Page 7) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <button
                  onClick={handleApprove}
                  className="py-2.5 px-3 bg-forest hover:bg-forest-hover text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Verify & Approve
                </button>

                <button
                  onClick={handleRequestChanges}
                  className="py-2.5 px-3 bg-white hover:bg-[#F7F6F0] border border-[#E5E5DC] text-[#263C3A] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-forest" />
                  Request Changes
                </button>

                <button
                  onClick={handleReject}
                  className="py-2.5 px-3 bg-white hover:bg-[#FCEBE7] border border-[#F1C8BE] text-terracotta text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-terracotta" />
                  Reject
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
