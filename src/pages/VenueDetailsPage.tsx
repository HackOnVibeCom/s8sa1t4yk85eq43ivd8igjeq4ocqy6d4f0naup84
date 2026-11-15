import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AccessibilityAttributeCard } from '../components/venue/AccessibilityAttributeCard';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { 
  ArrowLeft, 
  Star, 
  CheckCircle, 
  MessageSquare, 
  Camera, 
  Bookmark, 
  Share2, 
  MapPin, 
  ThumbsUp, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Maximize2,
  Info
} from 'lucide-react';

export const VenueDetailsPage: React.FC = () => {
  const { 
    selectedVenue, 
    venues, 
    navigateTo, 
    saveVenue, 
    unsaveVenue 
  } = useApp();

  // If no venue is selected, default to The Garden Café
  const venue = selectedVenue || venues[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'accessibility' | 'photos' | 'reviews' | 'updates'>('accessibility');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const toggleSave = () => {
    if (venue.saved) {
      unsaveVenue(venue.id);
    } else {
      saveVenue(venue.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: venue.name,
        text: `Check out accessibility information for ${venue.name} on CANIGO`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigateTo('/explore')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#263C3A] hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </button>
      </div>

      {/* Top Header Card: Hero Image + Venue Title & Actions */}
      <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Hero Image with Photo Counter (1/12) */}
          <div className="lg:col-span-5 relative rounded-xl overflow-hidden h-40 sm:h-44 border border-gray-100 group">
            <img
              src={venue.heroImage}
              alt={venue.name}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
            {/* Photo Counter Pill */}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>1/12</span>
            </div>
            {/* Expand / View Photos */}
            <button
              onClick={() => navigateTo('/evidence/photo-1')}
              className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white rounded-full transition-colors"
              title="Inspect Photo Evidence"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Details & Action Controls */}
          <div className="lg:col-span-7 space-y-3.5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263C3A] tracking-tight">
                  {venue.name}
                </h1>
                <CheckCircle className="w-6 h-6 text-forest fill-[#EDF4EA] flex-shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-[#74817B] mt-1">
                {venue.categoryLabel} • {venue.city}, Tamil Nadu • {venue.distance}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs sm:text-sm font-semibold text-[#263C3A]">
                <Star className="w-4 h-4 fill-[#D6A34B] text-[#D6A34B]" />
                <span>{venue.rating} ({venue.reviewCount} reviews)</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#74817B] leading-relaxed">
              {venue.description}
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => navigateTo('/community')}
                className="px-4 py-2 bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                Add Review
              </button>

              <button
                onClick={() => navigateTo('/contribute')}
                className="px-4 py-2 bg-white hover:bg-[#F7F6F0] border border-[#E5E5DC] text-[#263C3A] text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Camera className="w-4 h-4 text-forest" />
                Contribute Photos
              </button>

              <button
                onClick={toggleSave}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-[#E5E5DC] flex items-center gap-1.5 transition-colors ${
                  venue.saved
                    ? 'bg-[#EDF4EA] text-forest border-[#C3D8CE]'
                    : 'bg-white hover:bg-[#F7F6F0] text-[#263C3A]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${venue.saved ? 'fill-forest text-forest' : ''}`} />
                {venue.saved ? 'Saved' : 'Save'}
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-2 bg-white hover:bg-[#F7F6F0] border border-[#E5E5DC] text-[#263C3A] text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-6 mt-6 pt-2 border-t border-[#E5E5DC] overflow-x-auto text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-b-2 border-forest text-forest font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`pb-2 transition-colors whitespace-nowrap ${
              activeTab === 'accessibility'
                ? 'border-b-2 border-forest text-forest font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            Accessibility
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`pb-2 transition-colors whitespace-nowrap ${
              activeTab === 'photos'
                ? 'border-b-2 border-forest text-forest font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            Photos (12)
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-b-2 border-forest text-forest font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            Reviews ({venue.reviewCount})
          </button>
          <button
            onClick={() => setActiveTab('updates')}
            className={`pb-2 transition-colors whitespace-nowrap ${
              activeTab === 'updates'
                ? 'border-b-2 border-forest text-forest font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            Updates (4)
          </button>
        </div>
      </div>

      {/* Main Content Layout: Attribute Grid + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Accessibility Information Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#263C3A]">
                Accessibility Information
              </h2>
              <p className="text-xs sm:text-sm text-[#74817B] mt-0.5">
                Real-world accessibility details from community contributions, photos and verifications.
              </p>
            </div>

            {/* 8-Card Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {venue.attributes.map((attr) => (
                <AccessibilityAttributeCard
                  key={attr.id}
                  attribute={attr}
                  onPhotoClick={() => navigateTo('/evidence/photo-1')}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Verification Summary, Community Summary, Mini Map */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Verification Summary Card */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#EDF4EA] text-forest flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-forest" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
                Community Verified
              </h3>
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
            </div>

            <p className="text-xs text-[#74817B]">
              Verified by {venue.verificationSummary.verifiedCount} independent contributors
            </p>

            <div className="flex items-center gap-1.5 pt-1">
              {venue.verificationSummary.contributors.map((contrib, idx) => (
                <img
                  key={idx}
                  src={contrib.avatar}
                  alt={contrib.name}
                  title={contrib.name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ))}
              <span className="text-xs font-semibold text-[#74817B] ml-1">+3 more</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#74817B] pt-2 border-t border-gray-100">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Last updated {venue.verificationSummary.lastUpdated}</span>
            </div>
          </div>

          {/* Community Summary Card */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
              Community Summary
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-[#263C3A]">
              <div className="flex items-center gap-2.5">
                <ThumbsUp className="w-4 h-4 text-forest" />
                <span>{venue.verificationSummary.helpfulCount} people found this helpful</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-forest" />
                <span>{venue.verificationSummary.reviewCount} reviews and comments</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-forest" />
                <span>{venue.verificationSummary.photoCount} photos from the community</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-forest" />
                <span>{venue.verificationSummary.updateCount} updates (last: {venue.verificationSummary.lastUpdated})</span>
              </div>
            </div>
          </div>

          {/* Location / Mini Map Card */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3">
            <InteractiveMap
              venuesList={[venue]}
              activeVenueId={venue.id}
              className="h-36 w-full rounded-xl"
              zoomLevel={15}
            />

            <div>
              <h4 className="font-bold text-sm text-[#263C3A]">{venue.name}</h4>
              <p className="text-xs text-[#74817B] mt-0.5">{venue.address}</p>
            </div>

            <button
              onClick={() => navigateTo('/map')}
              className="w-full py-2 bg-white hover:bg-[#F7F6F0] border border-[#E5E5DC] text-forest text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Maps
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
