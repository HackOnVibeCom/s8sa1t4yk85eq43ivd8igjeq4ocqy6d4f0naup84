import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAI } from '../contexts/AIContext';
import { AccessibilityIcon, WheelchairIcon, RampIcon, RestroomIcon } from '../components/common/AccessibilityIcon';
import { 
  Search, 
  MapPin, 
  Camera, 
  Users, 
  Leaf, 
  ArrowRight,
  Baby,
  Footprints
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo, updateFilter, setFilters } = useApp();
  const { openAgent, sendMessage } = useAI();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      updateFilter('searchQuery', searchInput.trim());
    }
    navigateTo('/explore');
  };

  const handlePopularSearch = (filterKey: string, filterVal: any, query?: string) => {
    if (query) {
      updateFilter('searchQuery', query);
    }
    if (filterKey === 'wheelchairAccess') updateFilter('wheelchairAccess', true);
    if (filterKey === 'stepFree') updateFilter('stepFree', true);
    if (filterKey === 'accessibleRestroom') updateFilter('accessibleRestroom', true);
    navigateTo('/explore');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between relative overflow-hidden bg-ivory">
      
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtitle, Search, Chips */}
          <div className="lg:col-span-7 space-y-6 z-10">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E5DC] shadow-2xs">
              <MapPin className="w-4 h-4 text-forest" />
              <span className="text-xs sm:text-sm font-semibold text-[#263C3A]">
                Accessible Places for Everyone
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#263C3A] tracking-tight leading-[1.12]">
              Discover <br />
              Accessible Places <br />
              <span className="text-forest">Around You</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#74817B] max-w-xl leading-relaxed">
              A community-powered platform to find, share and verify real-world accessibility information.
            </p>

            {/* Search Input Bar */}
            <form 
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-full border border-[#E5E5DC] p-1.5 sm:p-2 shadow-card flex items-center gap-2 max-w-xl transition-all focus-within:ring-2 focus-within:ring-forest focus-within:border-transparent"
            >
              <div className="pl-3 sm:pl-4 text-[#74817B]">
                <MapPin className="w-5 h-5 text-forest" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for places, e.g., cafes, restaurants, hospitals..."
                className="w-full text-sm sm:text-base text-[#263C3A] bg-transparent focus:outline-none placeholder-[#74817B]/80 font-normal py-1.5"
              />
              <button
                type="submit"
                aria-label="Search places"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-forest hover:bg-forest-hover text-white flex items-center justify-center transition-all flex-shrink-0 shadow-xs"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Popular Searches Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm text-[#74817B]">
              <span className="font-medium mr-1">Popular searches:</span>
              
              <button
                type="button"
                onClick={() => handlePopularSearch('wheelchairAccess', true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#DDEBE1] border border-[#E5E5DC] hover:border-forest/30 text-[#263C3A] hover:text-forest transition-colors shadow-2xs"
              >
                <WheelchairIcon className="w-4 h-4 text-forest" size={16} />
                <span>Wheelchair access</span>
              </button>

              <button
                type="button"
                onClick={() => handlePopularSearch('stroller', true, 'stroller-friendly')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#DDEBE1] border border-[#E5E5DC] hover:border-forest/30 text-[#263C3A] hover:text-forest transition-colors shadow-2xs"
              >
                <Baby className="w-4 h-4 text-forest" />
                <span>Stroller-friendly</span>
              </button>

              <button
                type="button"
                onClick={() => handlePopularSearch('stepFree', true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#DDEBE1] border border-[#E5E5DC] hover:border-forest/30 text-[#263C3A] hover:text-forest transition-colors shadow-2xs"
              >
                <RampIcon className="w-4 h-4 text-forest" size={16} />
                <span>Step-free entry</span>
              </button>

              <button
                type="button"
                onClick={() => handlePopularSearch('accessibleRestroom', true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#DDEBE1] border border-[#E5E5DC] hover:border-forest/30 text-[#263C3A] hover:text-forest transition-colors shadow-2xs"
              >
                <RestroomIcon className="w-4 h-4 text-forest" size={16} />
                <span>Accessible restroom</span>
              </button>
            </div>

          </div>

          {/* Right Column: Hero Photograph with Curved Background */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            {/* Soft decorative background glow */}
            <div className="absolute -top-12 -right-12 w-96 h-96 bg-[#DDEBE1]/70 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative w-full max-w-lg lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 group">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85"
                alt="Young person in a wheelchair entering a modern, accessible building via a ramp"
                className="w-full h-[360px] sm:h-[440px] lg:h-[480px] object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              {/* Subtle accessibility overlay badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl px-3.5 py-2 border border-white shadow-xs flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center">
                  <WheelchairIcon className="w-4 h-4" size={16} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[#263C3A] leading-tight">Step-Free Entry</p>
                  <p className="text-[10px] text-forest font-semibold">1:12 Ramp with Railing</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom Feature Cards (4 Cards Row) */}
      <section className="bg-white/80 backdrop-blur-xs border-t border-[#E5E5DC] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1: Find Places */}
            <div 
              onClick={() => navigateTo('/explore')}
              className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-[#F7F6F0] transition-colors cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-[#DDEBE1] group-hover:bg-[#C3D8CE] text-forest flex items-center justify-center mb-3 transition-colors">
                <Search className="w-6 h-6 text-forest" />
              </div>
              <h3 className="font-bold text-base text-[#263C3A] mb-1 group-hover:text-forest transition-colors">
                Find Places
              </h3>
              <p className="text-xs sm:text-sm text-[#74817B]">
                Search for accessible places near you
              </p>
            </div>

            {/* Feature 2: Share Information */}
            <div 
              onClick={() => navigateTo('/contribute')}
              className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-[#F7F6F0] transition-colors cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-[#DDEBE1] group-hover:bg-[#C3D8CE] text-forest flex items-center justify-center mb-3 transition-colors">
                <Camera className="w-6 h-6 text-forest" />
              </div>
              <h3 className="font-bold text-base text-[#263C3A] mb-1 group-hover:text-forest transition-colors">
                Share Information
              </h3>
              <p className="text-xs sm:text-sm text-[#74817B]">
                Upload photos and add accessibility details
              </p>
            </div>

            {/* Feature 3: Verify Together */}
            <div 
              onClick={() => navigateTo('/community')}
              className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-[#F7F6F0] transition-colors cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-[#DDEBE1] group-hover:bg-[#C3D8CE] text-forest flex items-center justify-center mb-3 transition-colors">
                <Users className="w-6 h-6 text-forest" />
              </div>
              <h3 className="font-bold text-base text-[#263C3A] mb-1 group-hover:text-forest transition-colors">
                Verify Together
              </h3>
              <p className="text-xs sm:text-sm text-[#74817B]">
                Community reviews, votes and verification
              </p>
            </div>

            {/* Feature 4: Build Inclusion */}
            <div 
              onClick={() => navigateTo('/about')}
              className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-[#F7F6F0] transition-colors cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-[#DDEBE1] group-hover:bg-[#C3D8CE] text-forest flex items-center justify-center mb-3 transition-colors">
                <Leaf className="w-6 h-6 text-forest" />
              </div>
              <h3 className="font-bold text-base text-[#263C3A] mb-1 group-hover:text-forest transition-colors">
                Build Inclusion
              </h3>
              <p className="text-xs sm:text-sm text-[#74817B]">
                Help create a more accessible world
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
