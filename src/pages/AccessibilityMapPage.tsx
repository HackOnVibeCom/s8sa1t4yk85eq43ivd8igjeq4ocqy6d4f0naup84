import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { InteractiveMap } from '../components/maps/InteractiveMap';
import { WheelchairIcon, RampIcon, RestroomIcon } from '../components/common/AccessibilityIcon';
import { 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Layers, 
  Navigation, 
  Bookmark, 
  Star, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  Ban, 
  LocateFixed, 
  Building2,
  Hospital,
  Train,
  TreePine,
  GraduationCap
} from 'lucide-react';

export const AccessibilityMapPage: React.FC = () => {
  const { 
    venues, 
    selectedVenue, 
    selectVenue, 
    selectedMapVenueId, 
    setSelectedMapVenueId, 
    navigateTo, 
    activeRoutePlan 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'Nearby' | 'Saved' | 'Routes'>('Nearby');
  const [accessibilityFilter, setAccessibilityFilter] = useState<'all' | 'fully' | 'partially' | 'none'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoutePlan, setShowRoutePlan] = useState(false);

  const [layers, setLayers] = useState({
    accessiblePlaces: true,
    rampsStepFree: true,
    accessibleRestrooms: true,
    publicTransport: false,
    hospitals: true,
    educational: false,
    parks: false,
  });

  const filteredVenues = venues.filter(v => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!v.name.toLowerCase().includes(q) && !v.address.toLowerCase().includes(q)) return false;
    }
    if (accessibilityFilter === 'fully') {
      return v.features.wheelchairAccess && v.features.stepFree;
    }
    if (accessibilityFilter === 'partially') {
      return v.features.wheelchairAccess && !v.features.stepFree;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      
      {/* Top Map Header & Controls (PDF Page 12) */}
      <div className="bg-white rounded-2xl border border-[#E5E5DC] p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Title card */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-[#EDF4EA] text-forest flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-forest" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#263C3A] leading-tight">
              Accessibility Map
            </h1>
            <p className="text-xs text-[#74817B]">
              Discover, explore and navigate accessible places around you.
            </p>
          </div>
        </div>

        {/* Center: Search places, areas or landmarks */}
        <div className="flex-1 max-w-md w-full flex items-center gap-2 bg-[#F7F6F0] border border-[#E5E5DC] rounded-xl px-3.5 py-2">
          <Search className="w-4 h-4 text-[#74817B] flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search places, areas or landmarks..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#263C3A] focus:outline-none"
          />
          <button className="text-gray-400 hover:text-forest">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Quick actions: Nearby, Saved, Routes */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('Nearby')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
              activeTab === 'Nearby' ? 'bg-[#EDF4EA] text-forest border border-[#C3D8CE]' : 'text-[#74817B] hover:bg-gray-100'
            }`}
          >
            Nearby
          </button>
          <button
            onClick={() => setActiveTab('Saved')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
              activeTab === 'Saved' ? 'bg-[#EDF4EA] text-forest border border-[#C3D8CE]' : 'text-[#74817B] hover:bg-gray-100'
            }`}
          >
            Saved
          </button>
          <button
            onClick={() => {
              setActiveTab('Routes');
              setShowRoutePlan(!showRoutePlan);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1 ${
              showRoutePlan ? 'bg-forest text-white' : 'text-[#74817B] hover:bg-gray-100'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            Routes
          </button>
        </div>

      </div>

      {/* Top Filter Pills Row (PDF Page 12) */}
      <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto pb-1.5 no-scrollbar sm:flex-wrap">
        <button
          onClick={() => setAccessibilityFilter('all')}
          className={`px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            accessibilityFilter === 'all'
              ? 'bg-forest text-white shadow-xs'
              : 'bg-white text-[#263C3A] border border-[#E5E5DC] hover:bg-gray-50'
          }`}
        >
          <span>All Places</span>
        </button>

        <button
          onClick={() => setAccessibilityFilter('fully')}
          className={`px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            accessibilityFilter === 'fully'
              ? 'bg-forest text-white shadow-xs'
              : 'bg-white text-[#263C3A] border border-[#E5E5DC] hover:bg-gray-50'
          }`}
        >
          <WheelchairIcon className="w-3.5 h-3.5" size={14} />
          <span>Fully Accessible</span>
        </button>

        <button
          onClick={() => setAccessibilityFilter('partially')}
          className={`px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            accessibilityFilter === 'partially'
              ? 'bg-forest text-white shadow-xs'
              : 'bg-white text-[#263C3A] border border-[#E5E5DC] hover:bg-gray-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Partially Accessible</span>
        </button>

        <button
          onClick={() => setAccessibilityFilter('none')}
          className={`px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 flex-shrink-0 ${
            accessibilityFilter === 'none'
              ? 'bg-forest text-white shadow-xs'
              : 'bg-white text-[#263C3A] border border-[#E5E5DC] hover:bg-gray-50'
          }`}
        >
          <Ban className="w-3.5 h-3.5 text-terracotta" />
          <span>Not Accessible</span>
        </button>

        <select className="bg-white border border-[#E5E5DC] rounded-full px-3 py-1.5 text-xs font-semibold text-[#263C3A] ml-0 sm:ml-auto flex-shrink-0">
          <option>All Categories</option>
          <option>Restaurants</option>
          <option>Hospitals</option>
          <option>Shopping Malls</option>
        </select>
      </div>

      {/* Main Full Viewport Map Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 items-stretch lg:h-[540px]">
        
        {/* Center / Full Map Container (Primary on Mobile) */}
        <div className="order-1 lg:order-2 lg:col-span-6 relative rounded-2xl overflow-hidden border border-[#E5E5DC] h-[52vh] min-h-[340px] sm:min-h-[420px] lg:h-full">
          <InteractiveMap
            venuesList={filteredVenues}
            activeVenueId={selectedMapVenueId}
            showRoute={showRoutePlan}
            className="h-full w-full"
            zoomLevel={14}
          />

          {/* Bottom Floating Route Planning Pill (PDF Page 12) */}
          <div 
            onClick={() => setShowRoutePlan(!showRoutePlan)}
            className="absolute bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-[#E5E5DC] shadow-card flex items-center justify-between cursor-pointer hover:bg-white transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center flex-shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#263C3A] truncate">
                  Accessible Route Planning
                </p>
                <p className="text-[11px] text-[#74817B] truncate">
                  {showRoutePlan ? 'CIT to Marina Beach route active (18.4 km • ~42 min)' : 'Get step-free and wheelchair-friendly routes.'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>
        </div>

        {/* Left Nearby Places Sidebar (PDF Page 12) */}
        <div className="order-2 lg:order-1 lg:col-span-3 bg-white rounded-2xl border border-[#E5E5DC] p-4 flex flex-col justify-between shadow-xs max-h-[380px] lg:max-h-none overflow-hidden">
          <div className="space-y-3 overflow-y-auto pr-1 flex-1">
            <h2 className="font-bold text-sm text-[#263C3A]">
              Nearby Places ({filteredVenues.length})
            </h2>

            <div className="space-y-2.5">
              {filteredVenues.map((v) => {
                const isSelected = v.id === selectedMapVenueId;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      setSelectedMapVenueId(v.id);
                      selectVenue(v);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex gap-2.5 ${
                      isSelected
                        ? 'bg-[#EDF4EA] border-[#C3D8CE] shadow-xs'
                        : 'bg-[#F7F6F0]/60 border-[#E5E5DC] hover:bg-[#F7F6F0]'
                    }`}
                  >
                    <img
                      src={v.heroImage}
                      alt={v.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-[#263C3A] truncate">{v.name}</h4>
                        <Bookmark className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <p className="text-[11px] text-[#74817B] truncate">
                        {v.categoryLabel} • {v.distance}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#263C3A] mt-0.5">
                        <Star className="w-3 h-3 fill-[#D6A34B] text-[#D6A34B]" />
                        <span>{v.rating} ({v.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => navigateTo('/explore')}
            className="w-full mt-3 py-2 bg-white hover:bg-[#F7F6F0] border border-[#E5E5DC] text-forest text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View All on Map</span>
          </button>
        </div>

        {/* Right Map Layers Panel (PDF Page 12) */}
        <div className="order-3 lg:order-3 lg:col-span-3 bg-white rounded-2xl border border-[#E5E5DC] p-4 flex flex-col justify-between shadow-xs space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5DC]">
              <Layers className="w-4 h-4 text-forest" />
              <h3 className="font-bold text-sm text-[#263C3A]">Map Layers</h3>
            </div>

            <div className="space-y-2.5 text-xs text-[#263C3A]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.accessiblePlaces}
                  onChange={(e) => setLayers({ ...layers, accessiblePlaces: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
                <WheelchairIcon className="w-4 h-4 text-forest" size={16} />
                <span>Accessible Places</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.rampsStepFree}
                  onChange={(e) => setLayers({ ...layers, rampsStepFree: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
                <RampIcon className="w-4 h-4 text-forest" size={16} />
                <span>Ramps & Step-free Access</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.accessibleRestrooms}
                  onChange={(e) => setLayers({ ...layers, accessibleRestrooms: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
                <RestroomIcon className="w-4 h-4 text-forest" size={16} />
                <span>Accessible Restrooms</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.publicTransport}
                  onChange={(e) => setLayers({ ...layers, publicTransport: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
                <Train className="w-4 h-4 text-blue-600" />
                <span>Public Transport</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.hospitals}
                  onChange={(e) => setLayers({ ...layers, hospitals: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
                <Hospital className="w-4 h-4 text-red-600" />
                <span>Hospitals</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.educational}
                  onChange={(e) => setLayers({ ...layers, educational: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Educational Places</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.parks}
                  onChange={(e) => setLayers({ ...layers, parks: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
                <TreePine className="w-4 h-4 text-green-700" />
                <span>Parks & Public Spaces</span>
              </label>
            </div>
          </div>

          {/* Scale & Controls Indicator */}
          <div className="pt-3 border-t border-[#E5E5DC] flex items-center justify-between text-[11px] text-[#74817B]">
            <span>Scale: 1 km</span>
            <span className="font-semibold text-forest">OSM Verified Tiles</span>
          </div>
        </div>

      </div>

    </div>
  );
};
