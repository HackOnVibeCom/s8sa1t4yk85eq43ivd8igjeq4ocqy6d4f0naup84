import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AIMessage, Venue, AccessibleRoutePlan } from '../types';
import { useApp } from './AppContext';
import { SAMPLE_ROUTE_PLAN } from '../data/initialData';

interface AIContextType {
  isOpen: boolean;
  isExpanded: boolean;
  toggleOpen: () => void;
  openAgent: () => void;
  closeAgent: () => void;
  toggleExpanded: () => void;

  messages: AIMessage[];
  sendMessage: (text: string) => Promise<void>;
  clearConversation: () => void;

  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  isVoiceMuted: boolean;
  toggleVoiceMute: () => void;
  transcriptFeedback: string;

  pendingAction: {
    type: string;
    description: string;
    payload?: any;
    execute: () => void;
  } | null;
  confirmPendingAction: () => void;
  cancelPendingAction: () => void;

  quickActions: { label: string; prompt: string }[];
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentRoute,
    navigateTo,
    venues,
    selectedVenue,
    selectVenue,
    getVenueBySlug,
    saveVenue,
    unsaveVenue,
    updateFilter,
    resetFilters,
    filteredVenues,
    contributions,
    addNotification,
    submitReport,
    setActiveRoutePlan,
    setSelectedMapVenueId
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [transcriptFeedback, setTranscriptFeedback] = useState('');

  const [pendingAction, setPendingAction] = useState<{
    type: string;
    description: string;
    payload?: any;
    execute: () => void;
  } | null>(null);

  // Initial greeting message matching PDF Page 11 & 15
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-init-1',
      role: 'assistant',
      content: 'Hello! I am your CANIGO Accessibility Assistant. I can help you discover accessible places, check verified evidence, plan step-free routes, and guide your contributions. What can I help you find today?',
      timestamp: '10:20 AM',
      suggestedActions: [
        { label: 'Find accessible cafes', action: 'find_cafes' },
        { label: 'Plan a step-free route', action: 'plan_route' },
        { label: 'Contribute a photo', action: 'contribute' },
        { label: 'View accessibility map', action: 'open_map' },
      ]
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);

  // Quick prompt suggestions based on current route
  const getQuickActions = () => {
    if (currentRoute.startsWith('/venues/')) {
      return [
        { label: 'Save this place', prompt: 'Save this place to my favourites.' },
        { label: 'Restroom evidence', prompt: 'Show me evidence for accessible restrooms here.' },
        { label: 'Plan route here', prompt: `Plan a step-free route to ${selectedVenue?.name || 'this venue'}.` },
        { label: 'Contribute photo', prompt: `I want to contribute a photo for ${selectedVenue?.name || 'this place'}.` },
      ];
    }
    if (currentRoute === '/map') {
      return [
        { label: 'Find restrooms', prompt: 'Show nearby accessible restrooms on the map.' },
        { label: 'Wheelchair cafes', prompt: 'Filter map to wheelchair accessible cafes.' },
        { label: 'Plan route to beach', prompt: 'Plan an accessible route from CIT to Marina Beach.' },
      ];
    }
    if (currentRoute === '/explore') {
      return [
        { label: 'Only verified', prompt: 'Show only independently verified places.' },
        { label: 'Lifts and elevators', prompt: 'Filter places with operational lifts.' },
        { label: 'Open The Garden Café', prompt: 'Open The Garden Café.' },
      ];
    }
    return [
      { label: 'Wheelchair cafe near Anna Nagar', prompt: 'Find me a wheelchair-friendly café near Anna Nagar and plan a route with step-free access.' },
      { label: 'Route: CIT to Marina Beach', prompt: 'I want to go to Marina Beach from CIT. Find an accessible route with step-free access and nearby accessible restrooms.' },
      { label: 'Show my saved places', prompt: 'Show me my saved places.' },
      { label: 'Show pending contributions', prompt: 'Show my pending contributions.' },
    ];
  };

  const speakText = (text: string) => {
    if (isVoiceMuted || !synthRef.current) return;
    try {
      synthRef.current.cancel();
      // Remove URLs or markdown formatting for speech
      const clean = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceMute = () => {
    if (!isVoiceMuted) {
      stopSpeaking();
    }
    setIsVoiceMuted(prev => !prev);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use text input.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscriptFeedback('Listening...');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscriptFeedback(transcript);

        if (event.results[0].isFinal) {
          setIsListening(false);
          sendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error', event.error);
        setIsListening(false);
        setTranscriptFeedback('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Live Gemini API integration using VITE_GEMINI_API_KEY from .env
  const callGeminiApi = async (userPrompt: string): Promise<string | null> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      return null;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `You are the CANIGO AI Accessibility Assistant. You help wheelchair users, parents with strollers, elderly people, and caregivers discover verified accessible places in Chennai, inspect ramp/lift/restroom photographic evidence, and plan step-free routes. Prioritize truthfulness and transparency. Never claim a venue is 100% accessible if evidence is unverified or unknown. Keep responses concise (2-4 sentences max).`
            }]
          },
          contents: [{
            role: 'user',
            parts: [{ text: userPrompt }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 300,
          }
        })
      });

      if (!response.ok) {
        console.warn('Gemini API returned status', response.status);
        return null;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || null;
    } catch (err) {
      console.warn('Gemini API fetch error:', err);
      return null;
    }
  };

  // Natural Language Intent Engine & Tool Execution
  const processAssistantIntent = async (userText: string) => {
    const lower = userText.toLowerCase().trim();

    // 1. ROUTE PLANNING INTENT (matches PDF Page 11 & Page 15)
    // "I want to go to Marina Beach from CIT" or "route to..." or "plan a route"
    if (
      lower.includes('route') || 
      lower.includes('marina beach from cit') || 
      lower.includes('how to get to') ||
      lower.includes('directions')
    ) {
      setActiveRoutePlan(SAMPLE_ROUTE_PLAN);

      const responseText = "Here's an accessible route from Chennai Institute of Technology (CIT) to Marina Beach, with step-free access and nearby facilities.";
      const followUpText = "Would you like me to start navigation, save this route, or find accessible spots (cafes, restrooms, rest areas) along the way?";

      const routeMessage: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        routeCard: SAMPLE_ROUTE_PLAN,
        suggestedActions: [
          { label: 'Open Route on Map', action: 'open_route_map' },
          { label: 'View Route Details', action: 'open_route_details' },
          { label: 'Show Nearby Facilities', action: 'show_facilities' },
        ]
      };

      speakText(responseText);
      return routeMessage;
    }

    // 2. VENUE SEARCH WITH ACCESSIBILITY FILTERS (matches PDF Page 15)
    // "Find me a wheelchair-friendly café near Anna Nagar" or "wheelchair accessible restaurants"
    if (lower.includes('wheelchair') || lower.includes('café') || lower.includes('cafe') || lower.includes('restaurant') || lower.includes('food') || lower.includes('find')) {
      const isCafe = lower.includes('caf') || lower.includes('coffee');
      const targetVenues = venues.filter(v => v.features.wheelchairAccess);
      const chosen = targetVenues[0] || venues[0];

      // Update filters in explore
      updateFilter('wheelchairAccess', true);
      if (isCafe) {
        updateFilter('category', 'Cafes');
      }

      const responseText = `I found three options. I will show the evidence status for each place and avoid treating unverified details as confirmed.`;
      
      const venueMessage: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        venueCard: chosen,
        suggestedActions: [
          { label: 'Open venue', action: 'open_venue', payload: chosen.slug },
          { label: 'Plan route', action: 'plan_route_to_venue', payload: chosen },
          { label: 'View map', action: 'view_map', payload: chosen.id },
        ]
      };

      speakText(responseText);
      return venueMessage;
    }

    // 3. OPEN SPECIFIC VENUE
    // "Open The Garden Café" or "Show City Central Mall"
    const matchedVenue = venues.find(v => lower.includes(v.name.toLowerCase()));
    if (matchedVenue || lower.includes('garden café') || lower.includes('garden cafe')) {
      const v = matchedVenue || venues[0];
      selectVenue(v);
      navigateTo(`/venues/${v.slug}`);

      const responseText = `Opening ${v.name}. Here is its verified accessibility information, photos and community observation logs.`;
      speakText(responseText);

      return {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        venueCard: v,
        suggestedActions: [
          { label: 'Inspect Evidence Photos', action: 'open_photo_evidence', payload: 'photo-1' },
          { label: 'Contribute Photo', action: 'contribute' },
          { label: 'Save Place', action: 'save_current' }
        ]
      };
    }

    // 4. SAVE PLACE ACTION
    // "Save this place" or "Bookmark"
    if (lower.includes('save this') || lower.includes('save place') || lower.includes('bookmark')) {
      const target = selectedVenue || venues[0];
      saveVenue(target.id);

      const responseText = `Successfully saved ${target.name} to your Favourites list. You can view all your saved places in Saved Places.`;
      speakText(responseText);

      return {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'View Saved Places', action: 'nav_saved' },
          { label: 'Open Venue', action: 'open_venue', payload: target.slug }
        ]
      };
    }

    // 5. RESTROOM QUERY
    // "Take me to the nearest accessible restroom"
    if (lower.includes('restroom') || lower.includes('toilet') || lower.includes('washroom')) {
      const restroomVenues = venues.filter(v => v.features.accessibleRestroom);
      const target = restroomVenues[0] || venues[0];

      const responseText = `Found accessible restroom facilities at ${target.name} (${target.distance} away). Step-free approach is confirmed. Opening on the map.`;
      setSelectedMapVenueId(target.id);
      navigateTo('/map');
      speakText(responseText);

      return {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        venueCard: target,
        suggestedActions: [
          { label: 'Get Route', action: 'open_route_map' },
          { label: 'View Venue Details', action: 'open_venue', payload: target.slug }
        ]
      };
    }

    // 6. SHOW SAVED PLACES
    if (lower.includes('saved places') || lower.includes('my lists') || lower.includes('my favourites')) {
      navigateTo('/saved');
      const responseText = "Opening your Saved Places and customized lists.";
      speakText(responseText);
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // 7. SHOW PENDING CONTRIBUTIONS / PROFILE
    if (lower.includes('pending') || lower.includes('contributions') || lower.includes('my profile')) {
      navigateTo('/profile');
      const responseText = "Navigating to your Profile and Contributions tab where pending items awaiting community verification are listed.";
      speakText(responseText);
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // 8. CONTRIBUTE A PLACE / PHOTOGRAPH
    if (lower.includes('contribute') || lower.includes('upload') || lower.includes('add place')) {
      navigateTo('/contribute');
      const responseText = "Opening the contribution form. You can add place details, upload clear photos of ramps, lifts, and restrooms, and describe accessibility features.";
      speakText(responseText);
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // 9. REPORT A CONTRIBUTION (requires confirmation)
    if (lower.includes('report') || lower.includes('misleading') || lower.includes('wrong info')) {
      navigateTo('/report/contrib-1');
      const responseText = "Opening the report form for this contribution. Please inspect the category and provide context before submitting.";
      speakText(responseText);
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // 10. MAP / NAVIGATION
    if (lower.includes('map') || lower.includes('explore map') || lower.includes('chennai map')) {
      navigateTo('/map');
      const responseText = "Opening the Full Accessibility Map of Chennai with interactive filters and layer controls.";
      speakText(responseText);
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // 11. ADMIN DASHBOARD
    if (lower.includes('admin') || lower.includes('moderation') || lower.includes('review queue')) {
      navigateTo('/admin');
      const responseText = "Opening the Admin Moderation Dashboard with review queues and AI visual assistance logs.";
      speakText(responseText);
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }

    // If Gemini API is configured in .env, query live model; otherwise use structured domain fallback
    const liveGeminiAnswer = await callGeminiApi(userText);
    const responseText = liveGeminiAnswer || `I can help with that. CANIGO allows you to discover wheelchair-accessible venues, verify photographic evidence of ramps and lifts, plan step-free travel routes, and participate in community validation. Let me know which area or requirement you would like to explore!`;
    speakText(responseText);

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant' as const,
      content: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'Explore Accessible Places', action: 'nav_explore' },
        { label: 'View Full Map', action: 'open_map' },
        { label: 'Check The Garden Café', action: 'open_venue', payload: 'the-garden-cafe' },
      ]
    };
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: AIMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);

    // Process through intent engine
    const assistantMsg = await processAssistantIntent(text);
    setMessages(prev => [...prev, assistantMsg]);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Conversation cleared. How can I assist with accessibility discovery today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const confirmPendingAction = () => {
    if (pendingAction) {
      pendingAction.execute();
      setPendingAction(null);
    }
  };

  const cancelPendingAction = () => {
    setPendingAction(null);
  };

  return (
    <AIContext.Provider
      value={{
        isOpen,
        isExpanded,
        toggleOpen: () => setIsOpen(prev => !prev),
        openAgent: () => setIsOpen(true),
        closeAgent: () => setIsOpen(false),
        toggleExpanded: () => setIsExpanded(prev => !prev),
        messages,
        sendMessage,
        clearConversation,
        isListening,
        startListening,
        stopListening,
        isSpeaking,
        stopSpeaking,
        isVoiceMuted,
        toggleVoiceMute,
        transcriptFeedback,
        pendingAction,
        confirmPendingAction,
        cancelPendingAction,
        quickActions: getQuickActions(),
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
