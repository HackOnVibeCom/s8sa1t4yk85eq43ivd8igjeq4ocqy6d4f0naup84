import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { VerificationBadge } from '../components/common/VerificationBadge';
import { CanigoRobotIcon } from '../components/common/AccessibilityIcon';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  ThumbsUp, 
  Check, 
  MessageSquare, 
  Flag, 
  HelpCircle, 
  Info, 
  Star, 
  Send,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const PhotoEvidencePage: React.FC = () => {
  const { navigateTo, userProfile, addNotification } = useApp();

  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [helpfulCount, setHelpfulCount] = useState(24);
  const [hasVotedHelpful, setHasVotedHelpful] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [newComment, setNewComment] = useState('');

  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
      title: 'Entrance / Ramp'
    },
    {
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
      title: 'Ramp Railing Slope'
    },
    {
      url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=85',
      title: 'Lift / Elevator Doors'
    },
    {
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
      title: 'Indoor Seating'
    }
  ];

  const [comments, setComments] = useState([
    {
      id: 'c-1',
      author: 'Suresh M.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      date: '2 days ago',
      content: 'The ramp is present and looks well built, but it seems a bit steep in the photo. It would be great to have the approximate slope or a measurement if possible.',
      likes: 12
    },
    {
      id: 'c-2',
      author: 'Priya R.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      date: '1 day ago',
      content: 'Has anyone visited this place recently? Can you confirm if the ramp is still in good condition and accessible?',
      likes: 5
    },
    {
      id: 'c-3',
      author: 'Karthik V.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      date: '1 day ago',
      content: 'Good evidence, but the image alone cannot establish the ramp gradient or clear width. An on-site measurement or an additional photo from a wider angle would help.',
      likes: 8
    }
  ]);

  const toggleHelpful = () => {
    if (hasVotedHelpful) {
      setHelpfulCount(prev => prev - 1);
      setHasVotedHelpful(false);
    } else {
      setHelpfulCount(prev => prev + 1);
      setHasVotedHelpful(true);
    }
  };

  const handleConfirmObservation = () => {
    setIsConfirmed(true);
    addNotification({
      type: 'helpful',
      title: 'Observation Corroborated',
      description: 'You corroborated the ramp observation for The Garden Café.',
      linkUrl: '/venues/the-garden-cafe'
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const newEntry = {
      id: `c-${Date.now()}`,
      author: userProfile.name,
      avatar: userProfile.avatar,
      date: 'Just now',
      content: newComment.trim(),
      likes: 0
    };
    setComments(prev => [...prev, newEntry]);
    setNewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigateTo('/venues/the-garden-cafe')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#263C3A] hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to The Garden Café
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#EDF4EA] text-forest flex items-center justify-center flex-shrink-0">
          <CanigoRobotIcon className="w-5 h-5 text-forest" size={20} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263C3A] tracking-tight">
            Review Photo Evidence
          </h1>
          <p className="text-xs sm:text-sm text-[#74817B]">
            Inspect one accessibility observation, share context and help keep venue information reliable.
          </p>
        </div>
      </div>

      {/* Main Grid: Photo Inspection (Left) + Evidence Review Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Photo Viewer, Details, Actions, Comments */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Large Photo Viewer Card (PDF Page 13) */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-gray-100 group">
              <img
                src={photos[currentPhotoIdx].url}
                alt={photos[currentPhotoIdx].title}
                className="w-full h-full object-cover transition-all"
              />

              {/* Photo counter */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {currentPhotoIdx + 1}/{photos.length}
              </div>

              {/* Arrows */}
              <button
                onClick={() => setCurrentPhotoIdx(prev => (prev === 0 ? photos.length - 1 : prev - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#263C3A] flex items-center justify-center shadow-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPhotoIdx(prev => (prev === photos.length - 1 ? 0 : prev + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#263C3A] flex items-center justify-center shadow-md transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button className="absolute bottom-3 right-3 p-2 bg-black/60 text-white rounded-lg hover:bg-black">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {photos.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentPhotoIdx(idx)}
                  className={`h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    currentPhotoIdx === idx ? 'border-forest ring-1 ring-forest' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Photo Info & Claim Box */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 sm:p-6 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#263C3A]">The Garden Café</h2>
                <p className="text-xs text-[#74817B] mt-0.5">
                  Entrance / Ramp • Submitted by Arun K. • 2 days ago
                </p>
              </div>
              <VerificationBadge status="Evidence attached" size="md" />
            </div>

            <p className="text-xs sm:text-sm text-[#74817B]">
              Photo shows a ramp and handrails; slope and clear width have not been measured.
            </p>

            {/* Claim Box */}
            <div className="p-4 bg-[#F7F6F0] rounded-2xl border border-[#E5E5DC] space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-sm text-[#263C3A]">
                  Claim: Step-free entrance available
                </span>
                <VerificationBadge status="Needs independent confirmation" size="sm" />
              </div>
              <div className="text-xs text-[#74817B] space-y-1 pt-1">
                <p>📋 Observed from submitted image</p>
                <p>📏 Measurement: Not provided</p>
              </div>
            </div>

            {/* Action Buttons Row (PDF Page 13) */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#E5E5DC]">
              <button
                onClick={toggleHelpful}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border flex items-center gap-1.5 transition-colors ${
                  hasVotedHelpful
                    ? 'bg-[#EDF4EA] text-forest border-[#C3D8CE]'
                    : 'bg-white hover:bg-[#F7F6F0] border-[#E5E5DC] text-[#263C3A]'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${hasVotedHelpful ? 'fill-forest' : ''}`} />
                Helpful evidence ({helpfulCount})
              </button>

              <button
                onClick={handleConfirmObservation}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs ${
                  isConfirmed
                    ? 'bg-[#DDEBE1] text-forest border border-forest/30'
                    : 'bg-forest hover:bg-forest-hover text-white'
                }`}
              >
                <Check className="w-4 h-4" />
                {isConfirmed ? 'Observation Corroborated' : 'Confirm observation'}
              </button>

              <button
                onClick={() => {}}
                className="px-4 py-2 bg-white hover:bg-[#F7F6F0] border border-[#E5E5DC] text-[#263C3A] text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Add comment
              </button>

              <button
                onClick={() => navigateTo('/report/contrib-1')}
                className="px-4 py-2 bg-white hover:bg-[#FCEBE7] border border-[#F1C8BE] text-terracotta text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Flag className="w-4 h-4 text-terracotta" />
                Report issue
              </button>
            </div>

          </div>

          {/* Comments Section (PDF Page 13) */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#263C3A]">
              Comments ({comments.length})
            </h3>

            <div className="space-y-3.5 divide-y divide-gray-100">
              {comments.map((c) => (
                <div key={c.id} className="pt-3 flex gap-3 items-start">
                  <img src={c.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-[#263C3A]">{c.author}</span>
                      <span className="text-[11px] text-[#74817B]">{c.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#263C3A] leading-relaxed">
                      {c.content}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-xs text-[#74817B]">
                      <button className="flex items-center gap-1 hover:text-forest">
                        <ThumbsUp className="w-3 h-3" /> {c.likes}
                      </button>
                      <button className="hover:text-forest">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="pt-3 border-t border-[#E5E5DC] flex items-center gap-2">
              <img src={userProfile.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment or add useful context..."
                className="flex-1 text-xs sm:text-sm px-3.5 py-2 bg-[#F7F6F0] border border-[#E5E5DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest text-[#263C3A]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-forest text-white text-xs font-bold rounded-xl hover:bg-forest-hover transition-colors"
              >
                Post comment
              </button>
            </form>
          </div>

        </div>

        {/* Right Sidebar: Evidence Review Summary & Verification History */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Evidence Review Summary Card (PDF Page 13) */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-forest" />
              <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
                Evidence review summary
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-[#263C3A]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                <span><strong>What is visible:</strong> ramp, handrail, entrance</span>
              </div>
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span><strong>What is unknown:</strong> gradient, clear width, current condition</span>
              </div>
              <div className="flex items-start gap-2">
                <CanigoRobotIcon className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" size={16} />
                <span><strong>AI assistance:</strong> possible ramp detected — not verification</span>
              </div>
            </div>

            <div className="pt-2">
              <VerificationBadge status="Not independently verified" size="md" className="w-full justify-center py-2" />
            </div>
          </div>

          {/* Verification History Card (PDF Page 13) */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-forest" />
              <h3 className="font-bold text-sm sm:text-base text-[#263C3A]">
                Verification history
              </h3>
            </div>

            <div className="space-y-3 text-xs relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DDEBE1]">
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-forest text-white text-[8px] font-bold flex items-center justify-center">✓</span>
                <p className="font-bold text-[#263C3A]">Photo submitted</p>
                <p className="text-[11px] text-[#74817B]">2 days ago by Arun K.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-forest text-white text-[8px] font-bold flex items-center justify-center">✓</span>
                <p className="font-bold text-[#263C3A]">AI observations suggested</p>
                <p className="text-[11px] text-[#74817B]">2 days ago • Possible ramp detected</p>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white ring-1 ring-amber-400" />
                <p className="font-bold text-[#263C3A]">Community review pending</p>
                <p className="text-[11px] text-[#74817B]">Awaiting additional confirmations</p>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-gray-300 border-2 border-white ring-1 ring-gray-300" />
                <p className="font-bold text-gray-500">Independent assessment not recorded</p>
                <p className="text-[11px] text-gray-400">No on-site or organisational verification yet</p>
              </div>
            </div>
          </div>

          {/* Related Venue Card */}
          <div className="bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#263C3A]">Related venue</h3>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=140&q=80"
                alt=""
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-xs text-[#263C3A]">The Garden Café</h4>
                <p className="text-[11px] text-[#74817B]">Café • T. Nagar, Chennai</p>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#263C3A] mt-0.5">
                  <Star className="w-3 h-3 fill-[#D6A34B] text-[#D6A34B]" />
                  <span>4.6 (128 reviews)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('/venues/the-garden-cafe')}
              className="w-full py-2 bg-white hover:bg-[#F7F6F0] border border-[#E5E5DC] text-forest text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open venue profile
            </button>
          </div>

          {/* Disclaimer Banner (PDF Page 13) */}
          <div className="p-3.5 bg-[#FBF1DC] rounded-2xl border border-[#EAD39E] text-xs text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700" />
            <span>Helpful votes show usefulness, not proof of accessibility.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
