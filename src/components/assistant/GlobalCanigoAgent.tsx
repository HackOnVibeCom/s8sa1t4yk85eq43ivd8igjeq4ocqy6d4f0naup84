import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '../../contexts/AIContext';
import { useApp } from '../../contexts/AppContext';
import { CanigoRobotIcon } from '../common/AccessibilityIcon';
import { VerificationBadge } from '../common/VerificationBadge';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Navigation, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw,
  Paperclip,
  Clock,
  Car,
  Info,
  ArrowUpRight,
  LoaderCircle
} from 'lucide-react';

export const GlobalCanigoAgent: React.FC = () => {
  const { 
    isOpen, 
    isExpanded, 
    openAgent,
    closeAgent, 
    toggleExpanded,
    messages, 
    sendMessage, 
    clearConversation,
    isThinking,
    isListening, 
    startListening, 
    stopListening,
    isSpeaking,
    stopSpeaking,
    isVoiceMuted,
    toggleVoiceMute,
    transcriptFeedback,
    spokenTranscript,
    quickActions
  } = useAI();

  const { currentRoute, navigateTo } = useApp();
  const [inputText, setInputText] = useState('');
  const [dismissedFeedback, setDismissedFeedback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronize real-time speech into the input field
  useEffect(() => {
    if (spokenTranscript) {
      setInputText(spokenTranscript);
    }
  }, [spokenTranscript]);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  // Reset dismissed feedback if new feedback comes in
  useEffect(() => {
    if (transcriptFeedback) {
      setDismissedFeedback(false);
    }
  }, [transcriptFeedback]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || isThinking) return;
    setInputText('');
    void sendMessage(text);
  };

  const handleSuggestedAction = (action: string, payload?: unknown) => {
    if ((action === 'open_venue' || action === 'nav_venue') && typeof payload === 'string') {
      navigateTo(`/venues/${payload}`);
      return;
    }
    if (action === 'open_map' || action === 'open_route_map') {
      navigateTo('/map');
      return;
    }
    if (action === 'contribute' || action === 'open_contribute') {
      navigateTo('/contribute');
      return;
    }
    if (action === 'nav_saved' || action === 'open_saved') {
      navigateTo('/saved');
      return;
    }
    if (action === 'nav_explore' || action === 'open_explore') {
      navigateTo('/explore');
      return;
    }
    if (action === 'open_photo_evidence') {
      navigateTo(`/evidence/${typeof payload === 'string' ? payload : 'photo-1'}`);
      return;
    }
    void sendMessage(action);
  };

  const getPageContextLabel = () => {
    if (currentRoute === '/') return 'Home';
    if (currentRoute === '/explore') return 'Explore accessible places';
    if (currentRoute.startsWith('/venues/')) return 'Venue details';
    if (currentRoute === '/contribute') return 'Contribute a place';
    if (currentRoute === '/community') return 'Community discussions';
    if (currentRoute === '/profile') return 'My profile & contributions';
    if (currentRoute === '/admin') return 'Admin workspace';
    if (currentRoute === '/saved') return 'Saved places & lists';
    if (currentRoute === '/notifications') return 'Notifications';
    if (currentRoute === '/map') return 'Accessibility map';
    if (currentRoute.startsWith('/evidence/')) return 'Photo evidence';
    if (currentRoute.startsWith('/report/')) return 'Report a contribution';
    if (currentRoute === '/about') return 'About CANIGO';
    return 'CANIGO Platform';
  };

  return (
    <>
      {/* Mobile Backdrop when Assistant is Open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 sm:hidden"
          onClick={closeAgent}
          aria-hidden="true"
        />
      )}

      {/* Floating Bot Button (Bottom Right) */}
      {!isOpen && (
        <button
          type="button"
          onClick={openAgent}
          aria-label="Open CANIGO Assistant"
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 p-3 sm:p-3.5 bg-forest text-white rounded-full shadow-[0_12px_35px_rgba(21,94,75,0.35)] hover:bg-forest-hover transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center ring-4 ring-white/60 focus:outline-none focus:ring-4 focus:ring-forest"
        >
          <CanigoRobotIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" size={30} />
          <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#80A995] border-2 border-white rounded-full animate-pulse" />
        </button>
      )}

      {/* Floating / Expanded AI Assistant Panel */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 ease-out flex flex-col bg-white border border-[#E5E5DC] shadow-2xl overflow-hidden ${
            isExpanded
              ? 'inset-2 sm:inset-6 md:inset-8 lg:inset-12 max-w-6xl mx-auto rounded-2xl md:rounded-3xl'
              : 'inset-x-0 bottom-0 top-12 sm:top-auto sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[620px] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl'
          }`}
          role="dialog"
          aria-label="CANIGO AI Assistant Window"
        >
          {/* Mobile Drag Handle Indicator */}
          <div className="w-full flex justify-center pt-2 sm:hidden bg-[#EDF4EA]">
            <div className="w-10 h-1 bg-[#80A995]/50 rounded-full" />
          </div>

          {/* Panel Header */}
          <div className="bg-[#EDF4EA] border-b border-[#DDEBE1] px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center shadow-xs">
                <CanigoRobotIcon className="w-5 h-5 text-white" size={22} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm sm:text-base text-[#263C3A] leading-tight font-sans">
                    CANIGO Assistant
                  </h3>
                  <span className="bg-[#DDEBE1] text-[#155E4B] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-ping' : isThinking ? 'bg-amber-500 animate-pulse' : 'bg-forest'}`} />
                  <p className="text-[11px] text-[#74817B]">
                    {isListening ? 'Listening...' : isThinking ? 'Thinking...' : isSpeaking ? 'Speaking...' : 'Accessibility Guide'}
                  </p>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleVoiceMute}
                title={isVoiceMuted ? 'Unmute voice replies' : 'Mute voice replies'}
                aria-label={isVoiceMuted ? 'Unmute voice replies' : 'Mute voice replies'}
                className="p-1.5 text-[#74817B] hover:text-forest hover:bg-white/60 rounded-full transition-colors"
              >
                {isVoiceMuted ? <VolumeX className="w-4 h-4 text-terracotta" /> : <Volume2 className="w-4 h-4 text-forest" />}
              </button>

              <button
                type="button"
                onClick={toggleExpanded}
                title={isExpanded ? 'Restore compact view' : 'Expand view'}
                aria-label={isExpanded ? 'Restore compact view' : 'Expand view'}
                className="p-1.5 text-[#74817B] hover:text-forest hover:bg-white/60 rounded-full transition-colors hidden sm:flex"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={closeAgent}
                title="Close assistant"
                aria-label="Close assistant"
                className="p-1.5 text-[#74817B] hover:text-terracotta hover:bg-white/60 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="bg-[#F7F6F0] px-4 py-2 border-b border-[#E5E5DC] flex items-center justify-between text-xs text-[#74817B] flex-shrink-0">
            <span className="flex items-center gap-1.5 truncate">
              <span className="font-medium text-[#263C3A]">Current page:</span>
              <span className="text-forest font-semibold truncate">{getPageContextLabel()}</span>
            </span>
            <button
              type="button"
              onClick={clearConversation}
              title="Reset conversation"
              className="text-[#74817B] hover:text-forest flex items-center gap-1 text-[11px] font-medium ml-2 flex-shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Main Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF9F5]/70">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-start gap-2 max-w-[90%] sm:max-w-[85%]">
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-[#DDEBE1] text-forest flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-3.5 h-3.5 text-forest" />
                      </div>
                    )}
                    
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#EDF4EA] text-[#155E4B] font-medium rounded-tr-xs shadow-2xs'
                          : 'bg-white text-[#263C3A] border border-[#E5E5DC] rounded-tl-xs shadow-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {/* Venue Card Preview */}
                      {msg.venueCard && (
                        <div className="mt-3 bg-[#FAF9F5] rounded-xl p-3 border border-[#E5E5DC] shadow-xs flex gap-3">
                          {msg.venueCard.heroImage && (
                            <img
                              src={msg.venueCard.heroImage}
                              alt={msg.venueCard.name}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-[#263C3A] truncate">
                              {msg.venueCard.name}
                            </h4>
                            <p className="text-[11px] text-[#74817B] truncate">
                              {msg.venueCard.address} · {msg.venueCard.distance}
                            </p>
                            <div className="mt-1">
                              <VerificationBadge status={msg.venueCard.verificationStatus} size="sm" />
                            </div>
                            <button
                              type="button"
                              onClick={() => navigateTo(`/venues/${msg.venueCard?.slug}`)}
                              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#155E4B] hover:underline"
                            >
                              Open details <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Route Card Preview */}
                      {msg.routeCard && (
                        <div className="mt-3 bg-[#FAF9F5] rounded-xl p-3 border border-[#E5E5DC] shadow-xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EDF4EA] text-forest text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                              Accessible Route (Recommended)
                            </span>
                          </div>
                          
                          <div className="text-xs font-semibold text-[#263C3A] flex items-center gap-3 py-1">
                            <span className="flex items-center gap-1 text-forest font-bold">
                              <Car className="w-3.5 h-3.5 text-forest" />
                              {msg.routeCard.distance}
                            </span>
                            <span className="text-gray-400">|</span>
                            <span className="flex items-center gap-1 text-[#74817B]">
                              <Clock className="w-3.5 h-3.5" />
                              {msg.routeCard.duration}
                            </span>
                          </div>

                          <div className="space-y-1 mt-2 text-[11px] text-[#263C3A]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-[#EDF4EA] text-forest flex items-center justify-center text-[10px] font-bold">✓</span>
                              <span>{msg.routeCard.stepFreeStretches}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-[#EDF4EA] text-forest flex items-center justify-center text-[10px] font-bold">✓</span>
                              <span>Nearby accessible restrooms ({msg.routeCard.accessibleRestroomsCount})</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-[#EDF4EA] text-forest flex items-center justify-center text-[10px] font-bold">✓</span>
                              <span>Wheelchair-friendly landmarks ({msg.routeCard.wheelchairLandmarksCount})</span>
                            </div>
                          </div>

                          <p className="text-[10px] text-[#74817B] mt-2 italic flex items-start gap-1">
                            <Info className="w-3 h-3 flex-shrink-0 mt-0.5 text-gray-400" />
                            {msg.routeCard.disclaimer}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => {
                                navigateTo('/map');
                                closeAgent();
                              }}
                              className="px-3 py-1.5 bg-forest hover:bg-forest-hover text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              Open Route on Map
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Suggested Action Chips */}
                      {msg.suggestedActions && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5 pt-1">
                          {msg.suggestedActions.map((action, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSuggestedAction(action.action, action.payload)}
                              className="px-2.5 py-1 bg-white hover:bg-[#DDEBE1] text-forest border border-[#C3D8CE] rounded-full text-xs font-semibold transition-all shadow-2xs"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-[#74817B] bg-white border border-[#E5E5DC] rounded-2xl px-3.5 py-2 w-fit shadow-xs">
                <LoaderCircle className="w-3.5 h-3.5 animate-spin text-forest" />
                <span>CANIGO is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-[#F7F6F0] border-t border-[#E5E5DC] flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
            <span className="text-[11px] font-bold text-[#74817B] uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
              <Sparkles className="w-3 h-3 text-forest" /> Quick:
            </span>
            {quickActions.map((qa, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => void sendMessage(qa.prompt)}
                disabled={isThinking}
                className="text-xs bg-white hover:bg-[#EDF4EA] text-[#263C3A] hover:text-forest border border-[#E5E5DC] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors flex-shrink-0 disabled:opacity-50"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Speaking Indicator */}
          {isSpeaking && (
            <div className="bg-[#EDF4EA] px-4 py-1.5 border-t border-[#DDEBE1] flex items-center justify-between text-xs text-forest font-medium flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                CANIGO Assistant is speaking...
              </span>
              <button
                type="button"
                onClick={stopSpeaking}
                className="text-xs font-bold text-terracotta hover:underline"
              >
                Stop
              </button>
            </div>
          )}

          {/* Voice Input Active Indicator */}
          {isListening && (
            <div className="bg-[#FBF1DC] px-4 py-2 border-t border-[#EAD39E] flex items-center justify-between text-xs text-amber-900 font-medium flex-shrink-0">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="truncate">{transcriptFeedback || 'Listening for your voice...'}</span>
              </div>
              <button
                type="button"
                onClick={stopListening}
                className="text-xs font-bold text-red-600 hover:underline flex-shrink-0 ml-2"
              >
                Done
              </button>
            </div>
          )}

          {/* Microphone Feedback Banner (When not listening, e.g. error notice) */}
          {transcriptFeedback && !isListening && !dismissedFeedback && (
            <div className="bg-[#FFF8E6] px-3.5 py-1.5 border-t border-[#F5E6B8] flex items-center justify-between text-[11px] text-[#8C6D1F] flex-shrink-0">
              <span className="truncate">{transcriptFeedback}</span>
              <button
                type="button"
                onClick={() => setDismissedFeedback(true)}
                className="ml-2 hover:text-[#5C450B] font-bold text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Assistant Footer Input */}
          <div className="p-3 bg-white border-t border-[#E5E5DC] flex-shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void sendMessage('I want to attach a photo to contribute')}
                title="Attach photo or evidence"
                className="p-2 text-gray-400 hover:text-forest hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me anything about accessibility, places, routes..."
                disabled={isThinking}
                className="flex-1 px-3 py-2 text-xs sm:text-sm bg-[#F7F6F0] border border-[#E5E5DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest text-[#263C3A] placeholder-[#74817B] disabled:opacity-60"
              />

              {/* Microphone Button */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                title={isListening ? 'Stop listening' : 'Speak to CANIGO Assistant'}
                className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-[#74817B] hover:text-forest hover:bg-[#DDEBE1]/40'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                title="Send message"
                className="p-2.5 bg-forest text-white rounded-full hover:bg-forest-hover transition-colors disabled:opacity-40 disabled:hover:bg-forest flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 text-center">
              <p className="text-[10px] text-gray-400">
                Tap the microphone to speak · Review actions before they are applied
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
