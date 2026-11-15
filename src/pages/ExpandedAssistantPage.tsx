import React, { useState } from 'react';
import { useAI } from '../contexts/AIContext';
import { useApp } from '../contexts/AppContext';
import { CanigoRobotIcon } from '../components/common/AccessibilityIcon';
import { 
  Sparkles, 
  MapPin, 
  Navigation, 
  LayoutGrid, 
  Upload, 
  Info, 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Car, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const ExpandedAssistantPage: React.FC = () => {
  const { 
    messages, 
    sendMessage, 
    isThinking,
    isListening, 
    startListening, 
    stopListening,
    quickActions 
  } = useAI();

  const { navigateTo } = useApp();
  const [inputText, setInputText] = useState('');
  const [activeSideItem, setActiveSideItem] = useState('Ask Anything');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const txt = inputText;
    setInputText('');
    sendMessage(txt);
  };

  const sideMenu = [
    { label: 'Ask Anything', icon: <Sparkles className="w-4 h-4 text-forest" />, prompt: 'What can you help me with on CANIGO?' },
    { label: 'Find Accessible Places', icon: <MapPin className="w-4 h-4 text-forest" />, prompt: 'Find wheelchair-accessible places near me in Chennai.' },
    { label: 'Plan an Accessible Route', icon: <Navigation className="w-4 h-4 text-forest" />, prompt: 'I want to go to Marina Beach from CIT. Find an accessible route with step-free access and nearby accessible restrooms.' },
    { label: 'Navigate CANIGO', icon: <LayoutGrid className="w-4 h-4 text-forest" />, prompt: 'Show me all the sections and tools available on CANIGO.' },
    { label: 'Contribute with Help', icon: <Upload className="w-4 h-4 text-forest" />, prompt: 'Guide me through contributing a new accessible place.' },
    { label: 'Get Accessibility Info', icon: <Info className="w-4 h-4 text-forest" />, prompt: 'What are the verification standards for ramps, restrooms, and lifts on CANIGO?' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar (PDF Page 11) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E5DC] p-5 shadow-xs space-y-5">
          {/* Top Robot Badge */}
          <div className="bg-[#EDF4EA] rounded-2xl p-4 border border-[#C3D8CE] space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center">
                <CanigoRobotIcon className="w-5 h-5 text-white" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-sm text-[#263C3A]">CANIGO Assistant</h2>
                <span className="text-[10px] font-bold text-forest bg-white px-2 py-0.5 rounded-full uppercase">
                  AI Agent
                </span>
              </div>
            </div>
            <p className="text-xs text-[#74817B] leading-relaxed">
              Your accessibility companion for exploring, navigating and contributing on CANIGO.
            </p>
          </div>

          {/* Action Navigation Options */}
          <div className="space-y-1.5">
            {sideMenu.map((item) => {
              const isActive = activeSideItem === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveSideItem(item.label);
                    sendMessage(item.prompt);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-[#EDF4EA] text-forest font-bold shadow-2xs'
                      : 'text-[#263C3A] hover:bg-[#F7F6F0]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Wheelchair User Illustration at bottom (PDF Page 11) */}
          <div className="pt-4 border-t border-[#E5E5DC] flex flex-col items-center text-center p-3">
            <div className="w-32 h-32 rounded-2xl bg-[#DDEBE1]/40 flex items-center justify-center overflow-hidden border border-[#DDEBE1]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                alt="Accessible tech companion"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-[#74817B] mt-2 font-medium">
              Community Verified • Accessibility First
            </p>
          </div>
        </div>

        {/* Main Chat Stream (PDF Page 11) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E5DC] shadow-xs flex flex-col h-[750px] overflow-hidden">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E5E5DC] flex items-center justify-between bg-[#F7F6F0]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EDF4EA] text-forest flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-forest" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-[#263C3A]">
                    CANIGO Assistant
                  </h3>
                  <span className="bg-[#DDEBE1] text-[#155E4B] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    Beta
                  </span>
                </div>
                <p className="text-xs text-[#74817B]">
                  An AI agent that helps you discover, navigate and contribute to accessible places — all in one chat.
                </p>
              </div>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF4EA] text-forest text-xs font-bold border border-[#C3D8CE]">
              <ShieldCheck className="w-4 h-4 text-forest" />
              Accessibility-First AI
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white/50">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[92%] sm:max-w-[85%] ${
                      isUser
                        ? 'bg-[#EDF4EA] text-[#155E4B] font-medium'
                        : 'bg-[#F7F6F0] text-[#263C3A] border border-[#E5E5DC] shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Route Card Preview (PDF Page 11) */}
                    {msg.routeCard && (
                      <div className="mt-3.5 bg-white rounded-2xl p-4 border border-[#E5E5DC] shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF4EA] text-forest text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4 text-forest" />
                            Accessible Route (Recommended)
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-semibold text-[#263C3A] pt-1">
                          <span className="flex items-center gap-1.5 text-forest font-bold">
                            <Car className="w-4 h-4 text-forest" />
                            {msg.routeCard.distance}
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className="flex items-center gap-1.5 text-[#74817B]">
                            <Clock className="w-4 h-4" />
                            {msg.routeCard.duration}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-[#263C3A]">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#EDF4EA] text-forest flex items-center justify-center text-[10px] font-bold">✓</span>
                            <span>{msg.routeCard.stepFreeStretches}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#EDF4EA] text-forest flex items-center justify-center text-[10px] font-bold">✓</span>
                            <span>Nearby accessible restrooms ({msg.routeCard.accessibleRestroomsCount})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#EDF4EA] text-forest flex items-center justify-center text-[10px] font-bold">✓</span>
                            <span>Wheelchair-friendly landmarks ({msg.routeCard.wheelchairLandmarksCount})</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-[#74817B] italic">
                          ℹ️ {msg.routeCard.disclaimer}
                        </p>

                        {/* Route Action Buttons (PDF Page 11) */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => navigateTo('/map')}
                            className="px-4 py-2 bg-forest hover:bg-forest-hover text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            Open Route on Map
                          </button>
                          <button
                            onClick={() => navigateTo('/map')}
                            className="px-4 py-2 bg-white border border-[#E5E5DC] text-[#263C3A] hover:bg-[#F7F6F0] text-xs font-bold rounded-xl transition-colors"
                          >
                            View Route Details
                          </button>
                          <button
                            onClick={() => navigateTo('/map')}
                            className="px-4 py-2 bg-white border border-[#E5E5DC] text-[#263C3A] hover:bg-[#F7F6F0] text-xs font-bold rounded-xl transition-colors"
                          >
                            Show Nearby Facilities
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 px-1">{msg.timestamp}</span>
                </div>
              );
            })}
            {isThinking && (
              <p className="text-xs text-[#74817B] italic" role="status">CANIGO is understanding your request...</p>
            )}
          </div>

          {/* Bottom Chat Input Form (PDF Page 11) */}
          <div className="p-4 border-t border-[#E5E5DC] bg-white">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-forest hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isThinking}
                placeholder="Ask me anything about accessibility, places, routes or how to use CANIGO..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-[#F7F6F0] border border-[#E5E5DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-forest text-[#263C3A]"
              />

              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-colors ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'text-[#74817B] hover:text-forest'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className="p-2.5 bg-forest text-white rounded-full hover:bg-forest-hover transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
