import React from 'react';
import { Venue } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { VerificationBadge } from '../common/VerificationBadge';
import { AccessibilityIcon } from '../common/AccessibilityIcon';
import { Bookmark, Star, CheckCircle, HelpCircle, XCircle } from 'lucide-react';

interface VenueCardProps {
  venue: Venue;
  onSelect?: () => void;
  showMapPin?: boolean;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onSelect, showMapPin }) => {
  const { navigateTo, selectVenue, saveVenue, unsaveVenue } = useApp();

  const handleCardClick = () => {
    selectVenue(venue);
    if (onSelect) {
      onSelect();
    } else {
      navigateTo(`/venues/${venue.slug}`);
    }
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (venue.saved) {
      unsaveVenue(venue.id);
    } else {
      saveVenue(venue.id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-[#E5E5DC] p-2 sm:p-2 hover:shadow-cardHover transition-all duration-200 cursor-pointer flex flex-col sm:flex-row gap-2 relative group"
    >
      {/* Venue Thumbnail Image */}
      <div className="sm:w-36 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
        <img
          src={venue.heroImage}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Mobile Bookmark Overlay */}
        <button
          onClick={toggleSave}
          aria-label={venue.saved ? 'Remove from saved' : 'Save place'}
          className="sm:hidden absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-xs rounded-full text-forest shadow-xs hover:bg-white"
        >
          <Bookmark className={`w-4 h-4 ${venue.saved ? 'fill-forest text-forest' : 'text-[#74817B]'}`} />
        </button>
      </div>

      {/* Content Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Top Row: Name, Status Badge, Save Button */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-bold text-[#263C3A] hover:text-forest transition-colors truncate">
                  {venue.name}
                </h3>
                {venue.verificationStatus === 'Verified' && (
                  <CheckCircle className="w-4 h-4 text-forest fill-[#EDF4EA] flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#74817B] mt-0.5">
                <span>{venue.categoryLabel}</span>
                <span>•</span>
                <span>{venue.distance}</span>
                {venue.rating > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 font-semibold text-[#263C3A]">
                      <Star className="w-3.5 h-3.5 fill-[#D6A34B] text-[#D6A34B]" />
                      {venue.rating} ({venue.reviewCount} reviews)
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <VerificationBadge status={venue.verificationStatus} size="sm" />
              <button
                onClick={toggleSave}
                aria-label={venue.saved ? 'Remove from saved' : 'Save place'}
                className="p-1.5 hover:bg-[#F7F6F0] rounded-full transition-colors text-[#74817B] hover:text-forest"
              >
                <Bookmark className={`w-4 h-4 ${venue.saved ? 'fill-forest text-forest' : ''}`} />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[#74817B] mt-1 line-clamp-1">
            {venue.description}
          </p>
        </div>

        {/* Feature Tags with Verification / Confirmation Status */}
        <div className="flex flex-wrap items-center gap-1 mt-2 pt-1.5 border-t border-gray-100">
          {/* Entrance */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EDF4EA] text-forest">
            <AccessibilityIcon type="entrance" className="w-3.5 h-3.5" />
            <span>Entrance</span>
            <CheckCircle className="w-3 h-3 text-forest" />
          </span>

          {/* Restroom */}
          {venue.features.accessibleRestroom ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EDF4EA] text-forest">
              <AccessibilityIcon type="restroom" className="w-3.5 h-3.5" />
              <span>Restroom</span>
              <CheckCircle className="w-3 h-3 text-forest" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
              <AccessibilityIcon type="restroom" className="w-3.5 h-3.5" />
              <span>Restroom</span>
              <HelpCircle className="w-3 h-3 text-gray-400" />
            </span>
          )}

          {/* Lift */}
          {venue.features.lift !== undefined && (
            venue.features.lift ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EDF4EA] text-forest">
                <AccessibilityIcon type="lift" className="w-3.5 h-3.5" />
                <span>Lift</span>
                <CheckCircle className="w-3 h-3 text-forest" />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                <AccessibilityIcon type="lift" className="w-3.5 h-3.5" />
                <span>Lift</span>
                <HelpCircle className="w-3 h-3 text-gray-400" />
              </span>
            )
          )}

          {/* Parking */}
          {venue.features.parking && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EDF4EA] text-forest">
              <AccessibilityIcon type="parking" className="w-3.5 h-3.5" />
              <span>Parking</span>
              <CheckCircle className="w-3 h-3 text-forest" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
