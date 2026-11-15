import React from 'react';
import { useApp } from '../contexts/AppContext';
import { WheelchairIcon } from '../components/common/AccessibilityIcon';
import { 
  Users, 
  ShieldCheck, 
  MapPin, 
  Heart, 
  Leaf, 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Quote
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Section (PDF Page 14) */}
      <div className="bg-white rounded-3xl border border-[#E5E5DC] p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DDEBE1] text-forest flex items-center justify-center">
              <WheelchairIcon className="w-6 h-6 text-forest" size={26} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#263C3A] tracking-tight">
              About CANIGO
            </h1>

            <p className="text-lg font-bold text-forest">
              Accessible Places. Stronger Communities.
            </p>

            <p className="text-sm sm:text-base text-[#74817B] leading-relaxed max-w-xl">
              CANIGO is a community-driven platform that helps people discover, verify and share accessibility information about public places. We believe that everyone deserves equal access — and together, we can make it happen.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-gray-100 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85"
                alt="Inclusive accessibility"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-forest shadow-xs">
              Better Access, Brighter Futures
            </div>
          </div>

        </div>
      </div>

      {/* 5 Core Values Cards Row (PDF Page 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white rounded-2xl border border-[#E5E5DC] p-4 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#EDF4EA] text-forest flex items-center justify-center">
            <Users className="w-5 h-5 text-forest" />
          </div>
          <h3 className="font-bold text-sm text-[#263C3A]">Community Driven</h3>
          <p className="text-xs text-[#74817B]">Real people. Real experiences. Real impact.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5DC] p-4 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#EDF4EA] text-forest flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-forest" />
          </div>
          <h3 className="font-bold text-sm text-[#263C3A]">Verified Information</h3>
          <p className="text-xs text-[#74817B]">Community + moderation for accurate details.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5DC] p-4 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#EDF4EA] text-forest flex items-center justify-center">
            <MapPin className="w-5 h-5 text-forest" />
          </div>
          <h3 className="font-bold text-sm text-[#263C3A]">Inclusive Access</h3>
          <p className="text-xs text-[#74817B]">Help everyone find accessible places.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5DC] p-4 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#EDF4EA] text-forest flex items-center justify-center">
            <Heart className="w-5 h-5 text-forest" />
          </div>
          <h3 className="font-bold text-sm text-[#263C3A]">Social Impact</h3>
          <p className="text-xs text-[#74817B]">More inclusion. More opportunities.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5DC] p-4 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#EDF4EA] text-forest flex items-center justify-center">
            <Leaf className="w-5 h-5 text-forest" />
          </div>
          <h3 className="font-bold text-sm text-[#263C3A]">Sustainable Growth</h3>
          <p className="text-xs text-[#74817B]">Built by the community, for the community.</p>
        </div>

      </div>

      {/* Main Grid: How It Works + Right Sidebar Our Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: How It Works & Call to action */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* How It Works Card (PDF Page 14) */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#263C3A]">How It Works</h2>
              <p className="text-xs sm:text-sm text-[#74817B] mt-0.5">Simple steps. Real change.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              
              {/* Step 1: Explore */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center">1</span>
                  <div className="w-8 h-8 rounded-lg bg-[#EDF4EA] text-forest flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[#263C3A]">Explore</h4>
                <p className="text-xs text-[#74817B]">Find accessible places near you or anywhere.</p>
              </div>

              {/* Step 2: Contribute */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center">2</span>
                  <div className="w-8 h-8 rounded-lg bg-[#EDF4EA] text-forest flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[#263C3A]">Contribute</h4>
                <p className="text-xs text-[#74817B]">Add new places or share your experiences.</p>
              </div>

              {/* Step 3: Verify */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center">3</span>
                  <div className="w-8 h-8 rounded-lg bg-[#EDF4EA] text-forest flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[#263C3A]">Verify</h4>
                <p className="text-xs text-[#74817B]">Our community and team verify the information.</p>
              </div>

              {/* Step 4: Create Impact */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center">4</span>
                  <div className="w-8 h-8 rounded-lg bg-[#EDF4EA] text-forest flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-[#263C3A]">Create Impact</h4>
                <p className="text-xs text-[#74817B]">Help others, improve accessibility, and build inclusion.</p>
              </div>

            </div>
          </div>

          {/* Be a Part of the Change CTA Banner (PDF Page 14) */}
          <div className="bg-[#EDF4EA] rounded-3xl border border-[#C3D8CE] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-forest flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Leaf className="w-6 h-6 text-forest" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-[#263C3A]">
                  Be a Part of the Change
                </h3>
                <p className="text-xs sm:text-sm text-[#74817B]">
                  Whether you're exploring, contributing or just spreading the word — you're helping build a more accessible world.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('/explore')}
              className="px-6 py-2.5 bg-forest hover:bg-forest-hover text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors flex-shrink-0 shadow-xs"
            >
              <span>Join CANIGO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Sidebar: Our Impact Card (PDF Page 14) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-6 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#263C3A]">Our Impact</h3>
              <p className="text-xs text-[#74817B]">Together, we're building a more inclusive world.</p>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E5E5DC]">
                <MapPin className="w-4 h-4 text-forest mb-1" />
                <p className="text-lg font-extrabold text-[#263C3A]">1,250+</p>
                <p className="text-[11px] text-[#74817B]">Places Listed</p>
              </div>

              <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E5E5DC]">
                <Users className="w-4 h-4 text-forest mb-1" />
                <p className="text-lg font-extrabold text-[#263C3A]">3,800+</p>
                <p className="text-[11px] text-[#74817B]">Community Members</p>
              </div>

              <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E5E5DC]">
                <CheckCircle2 className="w-4 h-4 text-forest mb-1" />
                <p className="text-lg font-extrabold text-[#263C3A]">920+</p>
                <p className="text-[11px] text-[#74817B]">Verified Places</p>
              </div>

              <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E5E5DC]">
                <Star className="w-4 h-4 text-[#D6A34B] mb-1 fill-[#D6A34B]" />
                <p className="text-lg font-extrabold text-[#263C3A]">12,500+</p>
                <p className="text-[11px] text-[#74817B]">Helpful Votes</p>
              </div>
            </div>

            {/* Entrance photo */}
            <div className="h-44 rounded-2xl overflow-hidden border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
                alt="Accessible facility"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Forest green Quote Card (PDF Page 14) */}
            <div className="bg-forest text-white rounded-2xl p-5 shadow-xs space-y-2">
              <Quote className="w-6 h-6 text-[#80A995]" />
              <p className="text-sm font-semibold leading-relaxed">
                “Accessibility is not a privilege, it's a right.”
              </p>
              <p className="text-xs text-[#DDEBE1] font-medium">— CANIGO Community</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
