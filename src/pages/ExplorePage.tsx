import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { VenueCard } from '../components/venue/VenueCard';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { WheelchairIcon, RampIcon, RestroomIcon, SeatingIcon } from '../components/common/AccessibilityIcon';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  List, 
  Map as MapIcon, 
  ChevronDown, 
  ChevronUp,
  Utensils,
  Coffee,
  Hospital,
  Building2,
  TreePine,
  ShieldCheck,
  Users,
  ArrowUpDown
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { 
    filteredVenues, 
    filters, 
    updateFilter, 
    resetFilters,
    navigateTo,
    selectedMapVenueId,
    setSelectedMapVenueId
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(true);
  const [isPlaceTypeOpen, setIsPlaceTypeOpen] = useState(true);
  const [isVerificationOpen, setIsVerificationOpen] = useState(true);

  const placeTypeOptions = [
    { label: 'Restaurants', value: 'Restaurants', icon: <Utensils className="w-4 h-4" /> },
    { label: 'Cafes', value: 'Cafes', icon: <Coffee className="w-4 h-4" /> },
    { label: 'Hospitals', value: 'Hospitals', icon: <Hospital className="w-4 h-4" /> },
    { label: 'Malls', value: 'Shopping Mall', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Parks', value: 'Parks', icon: <TreePine className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263C3A] tracking-tight">
          Explore Accessible Places
        </h1>
        <p className="text-sm text-[#74817B]">
          Find and discover places with real accessibility information from the community.
        </p>
      </div>

      {/* Top Search & Filter Bar with City Skyline motif */}
      <div className="bg-white rounded-2xl border border-[#E5E5DC] p-3 sm:p-4 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Background illustration for Chennai */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-20 pointer-events-none hidden lg:block bg-contain bg-no-repeat bg-right"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 120' fill='%2380A995'%3E%3Cpath d='M20 120V80h15v40h10V60h20v60h10V40h15v80h10V70h30v50h15V50h25v70h15V30h20v90h15V60h30v60h10V80h20v40z' opacity='0.5'/%3E%3Ccircle cx='105' cy='25' r='10'/%3E%3Cpath d='M220 30l10-20 10 20z'/%3E%3C/svg%3E")`
          }}
        />

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1 z-10">
          {/* Location input */}
          <div className="flex items-center gap-2 bg-[#F7F6F0] border border-[#E5E5DC] rounded-xl px-3.5 py-2 w-full sm:w-64">
            <MapPin className="w-4 h-4 text-forest flex-shrink-0" />
            <input
              type="text"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              placeholder="City or area..."
              className="bg-transparent text-sm font-semibold text-[#263C3A] focus:outline-none w-full"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full sm:w-64">
            <div className="flex items-center gap-2 bg-[#F7F6F0] border border-[#E5E5DC] rounded-xl px-3.5 py-2">
              <Utensils className="w-4 h-4 text-forest flex-shrink-0" />
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="bg-transparent text-sm font-semibold text-[#263C3A] focus:outline-none w-full appearance-none cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                <option value="Restaurants">Restaurants</option>
                <option value="Cafes">Cafes</option>
                <option value="Shopping Mall">Shopping Malls</option>
                <option value="Hospitals">Hospitals</option>
                <option value="Parks">Parks & Public Spaces</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#74817B] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="w-full sm:w-auto flex items-center justify-end z-10">
          <button
            onClick={() => {}}
            className="w-full sm:w-auto px-6 py-2.5 bg-forest hover:bg-forest-hover text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Results + Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Filters Sidebar */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E5E5DC] p-4 sm:p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5DC]">
            <div className="flex items-center gap-2 font-bold text-sm text-[#263C3A]">
              <SlidersHorizontal className="w-4 h-4 text-forest" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-forest hover:text-forest-hover hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Section 1: Accessibility Needs */}
          <div className="space-y-2.5">
            <button
              onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
              className="flex items-center justify-between w-full text-xs font-bold text-[#263C3A] uppercase tracking-wider"
            >
              <span>Accessibility Needs</span>
              {isAccessibilityOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isAccessibilityOpen && (
              <div className="space-y-2 pt-1 text-xs sm:text-sm text-[#263C3A]">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.wheelchairAccess}
                    onChange={(e) => updateFilter('wheelchairAccess', e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-forest border-gray-300 accent-forest"
                  />
                  <WheelchairIcon className="w-4 h-4 text-forest" size={16} />
                  <span>Wheelchair access</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.stepFree}
                    onChange={(e) => updateFilter('stepFree', e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-forest border-gray-300 accent-forest"
                  />
                  <RampIcon className="w-4 h-4 text-forest" size={16} />
                  <span>Step-free entry</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.lift}
                    onChange={(e) => updateFilter('lift', e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-forest border-gray-300 accent-forest"
                  />
                  <ArrowUpDown className="w-4 h-4 text-forest" />
                  <span>Lift / Elevator</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.accessibleRestroom}
                    onChange={(e) => updateFilter('accessibleRestroom', e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-forest border-gray-300 accent-forest"
                  />
                  <RestroomIcon className="w-4 h-4 text-forest" size={16} />
                  <span>Accessible restroom</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.wheelchairSeating}
                    onChange={(e) => updateFilter('wheelchairSeating', e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-forest border-gray-300 accent-forest"
                  />
                  <SeatingIcon className="w-4 h-4 text-forest" size={16} />
                  <span>Wheelchair-friendly seating</span>
                </label>
              </div>
            )}
          </div>

          {/* Section 2: Place Type */}
          <div className="space-y-2.5 pt-3 border-t border-[#E5E5DC]">
            <button
              onClick={() => setIsPlaceTypeOpen(!isPlaceTypeOpen)}
              className="flex items-center justify-between w-full text-xs font-bold text-[#263C3A] uppercase tracking-wider"
            >
              <span>Place Type</span>
              {isPlaceTypeOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isPlaceTypeOpen && (
              <div className="space-y-2 pt-1 text-xs sm:text-sm text-[#263C3A]">
                {placeTypeOptions.map((type) => (
                  <label key={type.value} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.category === type.value}
                      onChange={(e) => updateFilter('category', e.target.checked ? type.value : 'All Categories')}
                      className="w-4 h-4 rounded text-forest focus:ring-forest border-gray-300 accent-forest"
                    />
                    <span className="text-forest">{type.icon}</span>
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Verification Status */}
          <div className="space-y-2.5 pt-3 border-t border-[#E5E5DC]">
            <button
              onClick={() => setIsVerificationOpen(!isVerificationOpen)}
              className="flex items-center justify-between w-full text-xs font-bold text-[#263C3A] uppercase tracking-wider"
            >
              <span>Verification Status</span>
              {isVerificationOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isVerificationOpen && (
              <div className="space-y-2 pt-1 text-xs sm:text-sm text-[#263C3A]">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => updateFilter('verifiedOnly', e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-forest border-gray-300 accent-forest"
                  />
                  <span>Verified only</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.communityVerified}
                    onChange={(e) => updateFilter('communityVerified', e.target.checked)}
                    className="w-4 h-4 rounded text-forest focus:ring-forest border-gray-300 accent-forest"
                  />
                  <span>Community verified</span>
                </label>
              </div>
            )}
          </div>

        </div>

        {/* Middle Column: Results List */}
        <div className={`space-y-4 ${viewMode === 'list' ? 'lg:col-span-5' : 'lg:col-span-4'}`}>
          {/* List Header: Count, Toggle, Sort */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#263C3A]">
              {filteredVenues.length} places found in {filters.location}
            </span>

            <div className="flex items-center gap-2">
              {/* List / Map Switch */}
              <div className="inline-flex rounded-lg border border-[#E5E5DC] bg-white p-0.5 shadow-2xs">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-forest text-white'
                      : 'text-[#263C3A] hover:text-forest'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    viewMode === 'map'
                      ? 'bg-forest text-white'
                      : 'text-[#263C3A] hover:text-forest'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  Map
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as any)}
                className="bg-white border border-[#E5E5DC] text-xs font-semibold text-[#263C3A] rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="rating">Sort by: Highest Rating</option>
                <option value="distance">Sort by: Nearest</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filteredVenues.map((venue) => (
              <VenueCard 
                key={venue.id} 
                venue={venue} 
                onSelect={() => setSelectedMapVenueId(venue.id)} 
              />
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Map Preview */}
        <div className={`hidden lg:block sticky top-24 ${viewMode === 'list' ? 'lg:col-span-4' : 'lg:col-span-5'}`}>
          <div className="bg-white rounded-2xl border border-[#E5E5DC] p-3 shadow-xs space-y-2">
            <InteractiveMap
              venuesList={filteredVenues}
              activeVenueId={selectedMapVenueId}
              className="h-[520px] w-full"
            />
            {/* Floating Info card at bottom of preview */}
            <div className="flex items-center justify-between p-2.5 bg-[#F7F6F0] rounded-xl border border-[#E5E5DC]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-forest" />
                <div>
                  <p className="text-xs font-bold text-[#263C3A]">Viewing in Chennai</p>
                  <p className="text-[11px] text-[#74817B]">{filteredVenues.length} accessible places</p>
                </div>
              </div>
              <button 
                onClick={() => navigateTo('/map')}
                className="text-xs font-bold text-forest hover:underline"
              >
                Expand Map →
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
