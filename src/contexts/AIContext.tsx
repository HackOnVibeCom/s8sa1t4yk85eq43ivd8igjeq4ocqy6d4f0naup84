import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AIMessage, AccessibleRoutePlan, Venue } from '../types';
import { useApp } from './AppContext';
import { SAMPLE_ROUTE_PLAN } from '../data/initialData';
import type { FilterState } from './AppContext';

type ActionType =
  | 'answer'
  | 'find_places'
  | 'open_venue'
  | 'save_place'
  | 'plan_route'
  | 'open_map'
  | 'open_saved'
  | 'open_profile'
  | 'open_contribute'
  | 'open_community'
  | 'open_notifications'
  | 'open_explore'
  | 'open_home'
  | 'open_report'
  | 'open_admin';

interface AssistantAction {
  type: ActionType;
  venueSlug?: string;
  category?: string;
  wheelchairAccess?: boolean;
  stepFree?: boolean;
  lift?: boolean;
  accessibleRestroom?: boolean;
  query?: string;
  view?: 'map' | 'list';
  origin?: string;
  destination?: string;
}

interface AssistantPlan {
  reply: string;
  action: AssistantAction;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: { resultIndex: number; results: ArrayLike<SpeechRecognitionResultLike> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

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
  isThinking: boolean;
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
    payload?: unknown;
    execute: () => void;
  } | null;
  confirmPendingAction: () => void;
  cancelPendingAction: () => void;
  quickActions: { label: string; prompt: string }[];
}

const AIContext = createContext<AIContextType | undefined>(undefined);
const ACTION_TYPES = new Set<ActionType>([
  'answer',
  'find_places',
  'open_venue',
  'save_place',
  'plan_route',
  'open_map',
  'open_saved',
  'open_profile',
  'open_contribute',
  'open_community',
  'open_notifications',
  'open_explore',
  'open_home',
  'open_report',
  'open_admin',
]);
const VENUE_CATEGORIES = new Set([
  'All Categories',
  'Restaurants',
  'Cafes',
  'Shopping Mall',
  'Hospitals',
  'Parks',
  'Public Place',
  'Educational',
]);

const timestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const parseAction = (value: unknown): AssistantAction => {
  if (!isRecord(value) || typeof value.type !== 'string' || !ACTION_TYPES.has(value.type as ActionType)) {
    return { type: 'answer' };
  }

  const action: AssistantAction = { type: value.type as ActionType };
  if (typeof value.venueSlug === 'string') action.venueSlug = value.venueSlug.slice(0, 100);
  if (typeof value.category === 'string' && VENUE_CATEGORIES.has(value.category)) action.category = value.category;
  if (typeof value.query === 'string') action.query = value.query.slice(0, 120);
  if (value.view === 'map' || value.view === 'list') action.view = value.view;
  if (typeof value.origin === 'string') action.origin = value.origin.slice(0, 120);
  if (typeof value.destination === 'string') action.destination = value.destination.slice(0, 120);
  for (const key of ['wheelchairAccess', 'stepFree', 'lift', 'accessibleRestroom'] as const) {
    if (typeof value[key] === 'boolean') action[key] = value[key];
  }
  return action;
};

const matchesCategory = (venue: Venue, category: string | undefined) => {
  if (!category || category === 'All Categories') return true;
  if (category === 'Restaurants') return venue.category === 'Restaurant';
  if (category === 'Cafes') return venue.category === 'Cafes' || venue.category === 'Restaurant';
  if (category === 'Hospitals') return venue.category === 'Hospital';
  if (category === 'Parks') return venue.category === 'Parks' || venue.category === 'Public Place';
  return venue.category === category;
};

const supportedRoute = (origin: string, destination: string) => {
  const from = origin.toLowerCase();
  const to = destination.toLowerCase();
  return (from.includes('cit') || from.includes('chennai institute of technology'))
    && to.includes('marina beach');
};

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentRoute,
    navigateTo,
    authRole,
    venues,
    selectedVenue,
    selectVenue,
    getVenueBySlug,
    saveVenue,
    updateFilter,
    setFilters,
    filters,
    setActiveRoutePlan,
    setSelectedMapVenueId,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcriptFeedback, setTranscriptFeedback] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-init-1',
      role: 'assistant',
      content: 'Hello! I am your CANIGO Accessibility Assistant. I can help you discover accessible places, check evidence, plan the available demo route, and navigate CANIGO. What can I help you find today?',
      timestamp: '10:20 AM',
      suggestedActions: [
        { label: 'Find accessible cafes', action: 'find_places', payload: { category: 'Cafes', wheelchairAccess: true } },
        { label: 'Plan the demo route', action: 'plan_route' },
        { label: 'Contribute a photo', action: 'open_contribute' },
        { label: 'View accessibility map', action: 'open_map' },
      ],
    },
  ]);
  const [pendingAction] = useState<AIContextType['pendingAction']>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef(false);
  const processingRequestRef = useRef(false);
  const speakingRef = useRef(false);
  const restartTimerRef = useRef<number | null>(null);
  const speechSequenceRef = useRef(0);
  const sendMessageRef = useRef<(text: string) => Promise<void>>(async () => undefined);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const quickActions = (() => {
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
        { label: 'Find restrooms', prompt: 'Show accessible restrooms on the map.' },
        { label: 'Wheelchair cafes', prompt: 'Filter map to wheelchair accessible cafes.' },
        { label: 'Plan the demo route', prompt: 'Plan the demo route from CIT to Marina Beach.' },
      ];
    }
    return [
      { label: 'Find wheelchair-accessible cafes', prompt: 'Find wheelchair-accessible cafes in Chennai.' },
      { label: 'Route: CIT to Marina Beach', prompt: 'Plan the demo route from CIT to Marina Beach.' },
      { label: 'Show my saved places', prompt: 'Show me my saved places.' },
    ];
  })();

  const stopRecognition = () => {
    try {
      recognitionRef.current?.stop();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'InvalidStateError') return;
      console.error('Failed to pause speech recognition.', error);
      setTranscriptFeedback('Could not pause voice listening. You can turn the microphone off or type your message.');
    }
  };

  const speakText = (text: string, pauseRecognition = true) => {
    if (isVoiceMuted || !synthRef.current || typeof SpeechSynthesisUtterance === 'undefined') return;
    speechSequenceRef.current += 1;
    const sequence = speechSequenceRef.current;
    synthRef.current.cancel();
    speakingRef.current = true;
    if (pauseRecognition) stopRecognition();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_#`]/g, ''));
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    const finishSpeaking = () => {
      if (sequence !== speechSequenceRef.current) return;
      speakingRef.current = false;
      setIsSpeaking(false);
      scheduleListeningRestart();
    };
    utterance.onend = finishSpeaking;
    utterance.onerror = finishSpeaking;
    try {
      synthRef.current.speak(utterance);
    } catch (error) {
      console.error('Failed to speak the assistant response.', error);
      speakingRef.current = false;
      setIsSpeaking(false);
      setTranscriptFeedback('Voice output is unavailable. You can still read and type to CANIGO.');
      scheduleListeningRestart();
    }
  };

  const stopSpeaking = () => {
    speechSequenceRef.current += 1;
    synthRef.current?.cancel();
    speakingRef.current = false;
    setIsSpeaking(false);
    scheduleListeningRestart();
  };

  const toggleVoiceMute = () => {
    if (!isVoiceMuted) stopSpeaking();
    setIsVoiceMuted((previous) => !previous);
  };

  const scheduleListeningRestart = () => {
    if (!shouldListenRef.current || processingRequestRef.current || speakingRef.current || !recognitionRef.current) return;
    if (restartTimerRef.current !== null) window.clearTimeout(restartTimerRef.current);
    restartTimerRef.current = window.setTimeout(() => {
      restartTimerRef.current = null;
      if (!shouldListenRef.current || processingRequestRef.current || speakingRef.current) return;
      try {
        recognitionRef.current?.start();
      } catch (error) {
        if (error instanceof DOMException && error.name === 'InvalidStateError') return;
        shouldListenRef.current = false;
        setIsListening(false);
        setTranscriptFeedback('Could not restart voice listening. You can try again or type your message.');
      }
    }, 350);
  };

  const startListening = () => {
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscriptFeedback('Speech recognition is not supported in this browser. Use text input instead.');
      return;
    }

    try {
      shouldListenRef.current = true;
      if (restartTimerRef.current !== null) {
        window.clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
      const recognition = recognitionRef.current ?? new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        setIsListening(true);
        setTranscriptFeedback('Listening continuously. Say a question or type it below.');
      };
      recognition.onresult = (event) => {
        if (speakingRef.current) return;
        let interimTranscript = '';
        const finalTranscripts: string[] = [];
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const result = event.results[index];
          if (result.isFinal) finalTranscripts.push(result[0].transcript);
          else interimTranscript += result[0].transcript;
        }
        const finalTranscript = finalTranscripts.join(' ').trim();
        setTranscriptFeedback(interimTranscript || finalTranscript || 'Listening...');
        if (finalTranscript) void sendMessageRef.current(finalTranscript);
      };
      recognition.onerror = (event) => {
        if (event.error === 'aborted') {
          setIsListening(false);
          return;
        }
        console.warn('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          shouldListenRef.current = false;
          setTranscriptFeedback('Microphone access was not allowed. Enable it in browser settings or type your message.');
        } else {
          setTranscriptFeedback(`Voice recognition issue: ${event.error}. I will retry if possible; typing also works.`);
        }
      };
      recognition.onend = () => {
        setIsListening(false);
        scheduleListeningRestart();
      };
      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'InvalidStateError') return;
      console.error('Failed to start speech recognition.', error);
      shouldListenRef.current = false;
      setIsListening(false);
      setTranscriptFeedback('Could not start voice listening. Allow microphone access or type your message instead.');
    }
  };

  const stopListening = () => {
    shouldListenRef.current = false;
    if (restartTimerRef.current !== null) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    stopRecognition();
    setIsListening(false);
    setTranscriptFeedback('Voice listening is off. You can type or turn the microphone back on.');
  };

  const getOfflinePlan = (text: string): AssistantPlan | null => {
    const lower = text.toLowerCase();
    const matchedVenue = venues.find((venue) => lower.includes(venue.name.toLowerCase()));

    if (/(route|directions|how do i get|navigate to)/.test(lower)) {
      const routeSupported = (lower.includes('cit') || lower.includes('chennai institute of technology'))
        && lower.includes('marina beach');
      return routeSupported
        ? {
          reply: 'I can show the CANIGO demonstration route from Chennai Institute of Technology (CIT) to Marina Beach. It is sample data, not live navigation; please verify conditions before travelling.',
          action: { type: 'plan_route', origin: 'CIT', destination: 'Marina Beach' },
        }
        : {
          reply: 'I can show the demonstration route from CIT to Marina Beach only. CANIGO does not currently calculate live routes for other locations.',
          action: { type: 'answer' },
        };
    }
    if (matchedVenue && /(open|show|view|details)/.test(lower)) {
      return { reply: `Opening ${matchedVenue.name}. The details reflect community-submitted information and may not be independently verified.`, action: { type: 'open_venue', venueSlug: matchedVenue.slug } };
    }
    if (/(save|bookmark|favourite)/.test(lower)) return { reply: 'I will save the selected place to your saved places.', action: { type: 'save_place' } };
    if (/(restroom|toilet|washroom|cafe|caf[eé]|restaurant|wheelchair|step.free|lift|accessible places|find places)/.test(lower)) {
      const category = /caf[eé]|coffee/.test(lower) ? 'Cafes' : /restaurant|food/.test(lower) ? 'Restaurants' : undefined;
      return {
        reply: 'I will filter the available places using those accessibility needs. Check each venue’s verification status before relying on its details.',
        action: {
          type: 'find_places',
          category,
          wheelchairAccess: /wheelchair/.test(lower) ? true : undefined,
          stepFree: /step.free/.test(lower) ? true : undefined,
          lift: /lift|elevator/.test(lower) ? true : undefined,
          accessibleRestroom: /restroom|toilet|washroom/.test(lower) ? true : undefined,
          view: lower.includes('map') ? 'map' : 'list',
        },
      };
    }
    if (/saved places|my lists|favourites/.test(lower)) return { reply: 'Opening your saved places.', action: { type: 'open_saved' } };
    if (/community|posts|discussions/.test(lower)) return { reply: 'Opening the community feed.', action: { type: 'open_community' } };
    if (/notifications|alerts/.test(lower)) return { reply: 'Opening your notifications.', action: { type: 'open_notifications' } };
    if (/explore|browse places/.test(lower)) return { reply: 'Opening accessible places.', action: { type: 'open_explore' } };
    if (/home|start page/.test(lower)) return { reply: 'Opening CANIGO home.', action: { type: 'open_home' } };
    if (/pending contributions|my contributions|my profile|profile/.test(lower)) return { reply: 'Opening your profile and contributions.', action: { type: 'open_profile' } };
    if (/contribute|upload|add a place/.test(lower)) return { reply: 'Opening the contribution form.', action: { type: 'open_contribute' } };
    if (/report|misleading|wrong information/.test(lower)) return { reply: 'Opening the report form for the demo contribution.', action: { type: 'open_report' } };
    if (/map/.test(lower)) return { reply: 'Opening the accessibility map.', action: { type: 'open_map' } };
    if (/admin|moderation|review queue/.test(lower)) return { reply: 'Opening the admin workspace.', action: { type: 'open_admin' } };
    if (matchedVenue) return { reply: `I found ${matchedVenue.name}. Would you like me to open its details?`, action: { type: 'answer' } };
    return null;
  };

  const executePlan = (plan: AssistantPlan): AIMessage => {
    const { action } = plan;
    let reply = plan.reply;
    let venueCard: Venue | undefined;
    let routeCard: AccessibleRoutePlan | undefined;
    let suggestedActions: AIMessage['suggestedActions'];

    switch (action.type) {
      case 'find_places': {
        const nextFilters: FilterState = {
          ...filters,
          ...(action.query ? { searchQuery: action.query } : {}),
          ...(action.category ? { category: action.category } : {}),
          ...(typeof action.wheelchairAccess === 'boolean' ? { wheelchairAccess: action.wheelchairAccess } : {}),
          ...(typeof action.stepFree === 'boolean' ? { stepFree: action.stepFree } : {}),
          ...(typeof action.lift === 'boolean' ? { lift: action.lift } : {}),
          ...(typeof action.accessibleRestroom === 'boolean' ? { accessibleRestroom: action.accessibleRestroom } : {}),
        };
        const matches = venues.filter((venue) =>
          matchesCategory(venue, nextFilters.category)
          && (!nextFilters.searchQuery || `${venue.name} ${venue.description} ${venue.address} ${venue.category}`.toLowerCase().includes(nextFilters.searchQuery.toLowerCase()))
          && (!nextFilters.wheelchairAccess || venue.features.wheelchairAccess)
          && (!nextFilters.stepFree || venue.features.stepFree)
          && (!nextFilters.lift || venue.features.lift)
          && (!nextFilters.accessibleRestroom || venue.features.accessibleRestroom)
        );
        setFilters(nextFilters);
        if (action.view === 'map' && authRole !== 'citizen') {
          navigateTo('/signin');
          reply = 'I applied the place filters. Sign in with the citizen demo account to open the accessibility map.';
        } else {
          navigateTo(action.view === 'map' ? '/map' : '/explore');
        }
        if (matches[0]) {
          venueCard = matches[0];
          selectVenue(matches[0]);
          setSelectedMapVenueId(matches[0].id);
        } else {
          reply = `${reply} I could not find a matching place in the current demo data.`;
        }
        suggestedActions = [
          { label: 'Open results', action: action.view === 'map' ? 'open_map' : 'nav_explore' },
          ...(matches[0] ? [{ label: `Open ${matches[0].name}`, action: 'open_venue', payload: matches[0].slug }] : []),
        ];
        break;
      }
      case 'open_venue': {
        const venue = action.venueSlug ? getVenueBySlug(action.venueSlug) : undefined;
        if (!venue) {
          reply = 'I could not match that request to a place in CANIGO’s current venue data. Try searching by its listed name.';
          break;
        }
        venueCard = venue;
        selectVenue(venue);
        navigateTo(`/venues/${venue.slug}`);
        break;
      }
      case 'save_place': {
        const venue = action.venueSlug ? getVenueBySlug(action.venueSlug) : selectedVenue;
        if (!venue) {
          reply = 'Select a place first, and I can save it for you.';
          break;
        }
        saveVenue(venue.id);
        reply = `Saved ${venue.name} to your saved places.`;
        suggestedActions = [{ label: 'View saved places', action: 'nav_saved' }];
        break;
      }
      case 'plan_route': {
        const origin = action.origin ?? '';
        const destination = action.destination ?? '';
        if (!supportedRoute(origin, destination)) {
          reply = 'CANIGO only has demonstration route data for CIT to Marina Beach. I cannot calculate or verify a live route for other locations.';
          break;
        }
        routeCard = {
          ...SAMPLE_ROUTE_PLAN,
          disclaimer: 'Demonstration route data only; this is not live navigation. Accessibility conditions can change, so verify the route before travelling.',
        };
        setActiveRoutePlan(routeCard);
        reply = `${reply} This is the sample CIT-to-Marina route, not a live route calculation. Please verify conditions before travelling.`;
        suggestedActions = [
          { label: 'Open route on map', action: 'open_route_map' },
          { label: 'View route details', action: 'open_route_map' },
        ];
        break;
      }
      case 'open_map':
        if (authRole !== 'citizen') {
          navigateTo('/signin');
          reply = 'The accessibility map requires the citizen demo sign-in. Taking you to sign-in.';
        } else {
          navigateTo('/map');
        }
        break;
      case 'open_explore':
        navigateTo('/explore');
        break;
      case 'open_home':
        navigateTo('/');
        break;
      case 'open_saved':
      case 'open_profile':
      case 'open_contribute':
      case 'open_community':
      case 'open_notifications':
      case 'open_report':
      case 'open_admin': {
        if (action.type === 'open_admin') {
          if (authRole !== 'admin') {
            navigateTo('/signin');
            reply = 'The admin workspace requires the admin demo sign-in. Taking you to sign-in.';
            break;
          }
          navigateTo('/admin');
          break;
        }
        if (authRole !== 'citizen') {
          navigateTo('/signin');
          reply = 'Please sign in with the citizen demo account to access that page.';
          break;
        }
        const routes = {
          open_saved: '/saved',
          open_profile: '/profile',
          open_contribute: '/contribute',
          open_community: '/community',
          open_notifications: '/notifications',
          open_report: '/report/contrib-1',
        } as const;
        navigateTo(routes[action.type]);
        break;
      }
      case 'answer':
        break;
    }

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: timestamp(),
      ...(venueCard ? { venueCard } : {}),
      ...(routeCard ? { routeCard } : {}),
      ...(suggestedActions ? { suggestedActions } : {}),
    };
  };

  const requestAssistantPlan = async (text: string): Promise<AssistantPlan> => {
    const history = messages
      .filter((message) => message.id !== 'msg-init-1')
      .slice(-8)
      .map(({ role, content }) => ({ role, content }));
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userText: text,
        history,
        currentRoute,
        selectedVenue: selectedVenue?.name ?? null,
        venues: venues.map(({ name, slug, category, address, verificationStatus, features }) => ({
          name,
          slug,
          category,
          address,
          verificationStatus,
          features,
        })),
      }),
    });

    const result: unknown = await response.json().catch(() => null);
    if (response.status === 503) {
      const offlinePlan = getOfflinePlan(text);
      if (offlinePlan) return offlinePlan;
    }
    if (!response.ok) {
      const detail = isRecord(result) && typeof result.error === 'string' ? result.error : 'The assistant service returned an error.';
      throw new Error(detail);
    }
    if (!isRecord(result) || typeof result.reply !== 'string' || !result.reply.trim()) {
      throw new Error('The assistant service returned an invalid response. Please try again.');
    }
    return { reply: result.reply.trim(), action: parseAction(result.action) };
  };

  const sendMessage = async (text: string) => {
    const message = text.trim();
    if (!message || processingRequestRef.current) return;
    processingRequestRef.current = true;
    if (shouldListenRef.current) stopRecognition();
    setMessages((previous) => [...previous, {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: timestamp(),
    }]);
    setIsThinking(true);
    setTranscriptFeedback('');
    try {
      const plan = await requestAssistantPlan(message);
      const reply = executePlan(plan);
      setMessages((previous) => [...previous, reply]);
      speakText(reply.content);
    } catch (error) {
      const replyText = error instanceof Error ? error.message : 'The assistant could not complete that request. Please try again.';
      const errorMessage: AIMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: timestamp(),
      };
      setMessages((previous) => [...previous, errorMessage]);
      speakText(replyText);
    } finally {
      processingRequestRef.current = false;
      setIsThinking(false);
      scheduleListeningRestart();
    }
  };

  sendMessageRef.current = sendMessage;

  useEffect(() => {
    if (authRole === 'citizen') {
      setIsOpen(true);
      startListening();
      const greeting = messages.find((message) => message.id === 'msg-init-1');
      if (greeting) speakText(greeting.content, false);
      return;
    }

    setIsOpen(false);
    stopListening();
    stopSpeaking();
  }, [authRole]);

  const clearConversation = () => {
    setMessages([{
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: 'Conversation cleared. How can I help with CANIGO?',
      timestamp: timestamp(),
    }]);
  };

  const confirmPendingAction = () => pendingAction?.execute();
  const cancelPendingAction = () => undefined;

  return (
    <AIContext.Provider
      value={{
        isOpen,
        isExpanded,
        toggleOpen: () => {
          if (isOpen) {
            stopListening();
            stopSpeaking();
            setIsOpen(false);
          } else {
            setIsOpen(true);
            if (authRole === 'citizen') startListening();
          }
        },
        openAgent: () => {
          setIsOpen(true);
          if (authRole === 'citizen') startListening();
        },
        closeAgent: () => {
          stopListening();
          stopSpeaking();
          setIsOpen(false);
        },
        toggleExpanded: () => setIsExpanded((previous) => !previous),
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
        pendingAction,
        confirmPendingAction,
        cancelPendingAction,
        quickActions,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) throw new Error('useAI must be used within an AIProvider');
  return context;
};
