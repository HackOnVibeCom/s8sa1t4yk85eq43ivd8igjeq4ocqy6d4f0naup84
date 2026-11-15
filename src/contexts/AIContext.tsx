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
  abort?: () => void;
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
  spokenTranscript: string;
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
const normalizeCategory = (cat?: string): string | undefined => {
  if (!cat) return undefined;
  const lower = cat.toLowerCase();
  if (lower.includes('cafe') || lower.includes('coffee')) return 'Cafes';
  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('dine')) return 'Restaurants';
  if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('medical')) return 'Hospital';
  if (lower.includes('mall') || lower.includes('shopping')) return 'Shopping Mall';
  if (lower.includes('park') || lower.includes('beach') || lower.includes('garden')) return 'Parks';
  if (lower.includes('public')) return 'Public Place';
  if (lower.includes('education') || lower.includes('library') || lower.includes('college')) return 'Educational';
  return undefined;
};

const timestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const parseAction = (value: unknown): AssistantAction => {
  if (!isRecord(value) || typeof value.type !== 'string' || !ACTION_TYPES.has(value.type as ActionType)) {
    return { type: 'answer' };
  }

  const action: AssistantAction = { type: value.type as ActionType };
  if (typeof value.venueSlug === 'string') action.venueSlug = value.venueSlug.slice(0, 100);
  if (typeof value.category === 'string') {
    action.category = normalizeCategory(value.category) ?? value.category;
  }
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
  const normCat = normalizeCategory(category) ?? category;
  if (normCat === 'Restaurants') return venue.category === 'Restaurant';
  if (normCat === 'Cafes') return venue.category === 'Cafes' || venue.category === 'Restaurant';
  if (normCat === 'Hospital' || normCat === 'Hospitals') return venue.category === 'Hospital';
  if (normCat === 'Parks') return venue.category === 'Parks' || venue.category === 'Public Place';
  return venue.category.toLowerCase() === normCat.toLowerCase();
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
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef(false);
  const continuousVoiceRef = useRef(false);
  const startingListeningRef = useRef(false);
  const processingRequestRef = useRef(false);
  const speakingRef = useRef(false);
  const restartTimerRef = useRef<number | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const speechSubmittedRef = useRef(false);
  const speechTranscriptRef = useRef('');
  const speechSequenceRef = useRef(0);
  const sendMessageRef = useRef<(text: string) => Promise<void>>(async () => undefined);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const isOpenRef = useRef(isOpen);
  const autoStartForCitizenRef = useRef(false);
  isOpenRef.current = isOpen;

  const scheduleListeningRestart = () => {
    if (restartTimerRef.current !== null) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (!continuousVoiceRef.current || !isOpenRef.current) return;

    restartTimerRef.current = window.setTimeout(() => {
      restartTimerRef.current = null;
      if (
        !continuousVoiceRef.current
        || !isOpenRef.current
        || processingRequestRef.current
        || speakingRef.current
        || shouldListenRef.current
        || startingListeningRef.current
      ) return;
      void startListening();
    }, 500);
  };

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
    shouldListenRef.current = false;
    if (restartTimerRef.current !== null) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    try {
      recognitionRef.current?.stop();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'InvalidStateError') return;
      console.warn('Failed to stop speech recognition.', error);
    }
  };

  const submitSpokenSpeech = (textOverride?: string) => {
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    const textToSend = (textOverride ?? speechTranscriptRef.current).trim();
    if (!textToSend || speechSubmittedRef.current) return;
    speechSubmittedRef.current = true;
    speechTranscriptRef.current = '';
    setSpokenTranscript('');
    shouldListenRef.current = false;
    setIsListening(false);
    stopRecognition();
    setTranscriptFeedback(`Processing: "${textToSend}"...`);
    void sendMessageRef.current(textToSend);
  };

  const speakText = (text: string, pauseRecognition = true) => {
    if (isVoiceMuted) return;
    if (!synthRef.current || typeof SpeechSynthesisUtterance === 'undefined') {
      setTranscriptFeedback('Voice playback is not supported in this browser. The reply is available as text.');
      scheduleListeningRestart();
      return;
    }
    speechSequenceRef.current += 1;
    const sequence = speechSequenceRef.current;
    try {
      synthRef.current.cancel();
    } catch {
      // ignore
    }
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
    utterance.onerror = () => {
      if (sequence !== speechSequenceRef.current) return;
      setTranscriptFeedback('Voice playback failed. The reply is available as text.');
      finishSpeaking();
    };
    try {
      synthRef.current.speak(utterance);
    } catch (error) {
      console.warn('Failed to speak the assistant response.', error);
      speakingRef.current = false;
      setIsSpeaking(false);
      scheduleListeningRestart();
    }
  };

  const stopSpeaking = () => {
    speechSequenceRef.current += 1;
    try {
      synthRef.current?.cancel();
    } catch {
      // ignore
    }
    speakingRef.current = false;
    setIsSpeaking(false);
    scheduleListeningRestart();
  };

  const toggleVoiceMute = () => {
    if (!isVoiceMuted) stopSpeaking();
    setIsVoiceMuted((previous) => !previous);
  };

  const startListening = async () => {
    if (startingListeningRef.current || shouldListenRef.current) return;
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscriptFeedback('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    startingListeningRef.current = true;
    continuousVoiceRef.current = true;

    if (speakingRef.current) {
      stopSpeaking();
    }

    speechSubmittedRef.current = false;
    speechTranscriptRef.current = '';
    setSpokenTranscript('');
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // Proactively verify / request microphone permission using getUserMedia
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: unknown) {
        console.warn('Microphone permission check failed:', err);
        const mediaError = err as { name?: string; message?: string };
        startingListeningRef.current = false;
        continuousVoiceRef.current = false;
        setIsListening(false);
        shouldListenRef.current = false;
        if (mediaError.name === 'NotAllowedError' || mediaError.name === 'PermissionDeniedError') {
          setTranscriptFeedback('Microphone permission blocked. Please click the site icon in your browser address bar and set Microphone to Allow.');
        } else if (mediaError.name === 'NotFoundError' || mediaError.name === 'DevicesNotFoundError') {
          setTranscriptFeedback('No microphone detected on your system. Please plug in a microphone or headset, or type your message.');
        } else {
          setTranscriptFeedback('Microphone is busy or inaccessible. Please check your Windows sound settings or type your message.');
        }
        return;
      }
    }

    if (!continuousVoiceRef.current) {
      startingListeningRef.current = false;
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort?.();
        } catch {
          // ignore
        }
      }

      shouldListenRef.current = true;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        startingListeningRef.current = false;
        setIsListening(true);
        setTranscriptFeedback('Listening... Speak your command or question.');
      };

      recognition.onresult = (event) => {
        let finalPart = '';
        let interimPart = '';
        for (let i = 0; i < event.results.length; i += 1) {
          const res = event.results[i];
          if (res.isFinal) {
            finalPart += res[0].transcript + ' ';
          } else {
            interimPart += res[0].transcript;
          }
        }
        const combined = (finalPart + interimPart).trim();
        if (combined) {
          speechTranscriptRef.current = combined;
          setSpokenTranscript(combined);
          setTranscriptFeedback(combined);

          if (silenceTimerRef.current !== null) {
            window.clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = window.setTimeout(() => {
            if (!speechSubmittedRef.current && speechTranscriptRef.current.trim()) {
              submitSpokenSpeech();
            }
          }, 1200);
        }

        if (finalPart.trim() && !interimPart.trim()) {
          submitSpokenSpeech(finalPart.trim());
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error', event.error);
        startingListeningRef.current = false;
        shouldListenRef.current = false;
        setIsListening(false);

        if (event.error === 'aborted') {
          return;
        }

        if (event.error === 'audio-capture') {
          continuousVoiceRef.current = false;
          setTranscriptFeedback('No microphone input detected. Please verify your microphone is plugged in and enabled in Windows Settings.');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          continuousVoiceRef.current = false;
          setTranscriptFeedback('Microphone permission blocked. Please click the site icon in your browser URL bar and allow microphone access.');
        } else if (event.error === 'no-speech') {
          if (speechTranscriptRef.current.trim() && !speechSubmittedRef.current) {
            submitSpokenSpeech();
            return;
          }
          setTranscriptFeedback('No speech detected. Say a command or tap the mic to speak.');
        } else if (event.error === 'network') {
          continuousVoiceRef.current = false;
          setTranscriptFeedback('Speech recognition network issue. Please type your message.');
        } else {
          continuousVoiceRef.current = false;
          setTranscriptFeedback(`Voice recognition issue (${event.error}). Please type your message below.`);
        }
      };

      recognition.onend = () => {
        startingListeningRef.current = false;
        setIsListening(false);
        shouldListenRef.current = false;
        if (speechTranscriptRef.current.trim() && !speechSubmittedRef.current) {
          submitSpokenSpeech();
        }
        scheduleListeningRestart();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.warn('Failed to start speech recognition.', error);
      startingListeningRef.current = false;
      continuousVoiceRef.current = false;
      shouldListenRef.current = false;
      setIsListening(false);
      setTranscriptFeedback('Could not access microphone. Tap the mic to retry or type your message.');
    }
  };

  const stopListening = () => {
    continuousVoiceRef.current = false;
    shouldListenRef.current = false;
    if (restartTimerRef.current !== null) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (speechTranscriptRef.current.trim() && !speechSubmittedRef.current) {
      submitSpokenSpeech();
      return;
    }
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    speechTranscriptRef.current = '';
    setSpokenTranscript('');
    stopRecognition();
    setIsListening(false);
    setTranscriptFeedback('');
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
      return { reply: `Opening ${matchedVenue.name}.`, action: { type: 'open_venue', venueSlug: matchedVenue.slug } };
    }
    if (/(save|bookmark|favourite)/.test(lower)) return { reply: 'Saving this place to your saved places.', action: { type: 'save_place' } };
    if (/put post|create post|add post|new post|make post|write post/.test(lower)) {
      return { reply: 'Opening the contribution page so you can post a place or accessibility update.', action: { type: 'open_contribute' } };
    }
    if (/community|feed|discussions/.test(lower)) return { reply: 'Opening the community feed.', action: { type: 'open_community' } };
    if (/(restroom|toilet|washroom|cafe|caf[eé]|coffee|restaurant|food|wheelchair|step.free|lift|accessible places|find places|list places)/.test(lower)) {
      const category = normalizeCategory(lower);
      return {
        reply: `Opening Explore and filtering for ${category ?? 'accessible'} places.`,
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
        const cleanQuery = action.query?.trim();
        const isGenericCity = Boolean(cleanQuery && /^(chennai|near chennai|in chennai)$/i.test(cleanQuery));
        const isCategoryRepeat = Boolean(cleanQuery && action.category && cleanQuery.toLowerCase().includes(action.category.toLowerCase().replace(/s$/, '')));

        const nextFilters: FilterState = {
          ...filters,
          ...(isGenericCity ? { location: 'Chennai' } : {}),
          ...(!isGenericCity && !isCategoryRepeat && cleanQuery ? { searchQuery: cleanQuery } : { searchQuery: '' }),
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
        navigateTo(action.view === 'map' ? '/map' : '/explore');
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
        navigateTo('/map');
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
            reply = 'The admin workspace requires administrator access. Opening sign-in page.';
            break;
          }
          navigateTo('/admin');
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

    try {
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
      if (response.ok && isRecord(result) && typeof result.reply === 'string' && result.reply.trim()) {
        const action = parseAction(result.action);
        if (action.type === 'answer') {
          const offlinePlan = getOfflinePlan(text);
          if (offlinePlan && offlinePlan.action.type !== 'answer') {
            return { reply: result.reply.trim(), action: offlinePlan.action };
          }
        }
        return { reply: result.reply.trim(), action };
      }

      const offlinePlan = getOfflinePlan(text);
      if (offlinePlan) return offlinePlan;

      const detail = isRecord(result) && typeof result.error === 'string' ? result.error : 'The assistant service returned an error.';
      throw new Error(detail);
    } catch (err) {
      const offlinePlan = getOfflinePlan(text);
      if (offlinePlan) return offlinePlan;
      throw err;
    }
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
    if (!authRole) {
      stopListening();
      stopSpeaking();
      setIsOpen(false);
    }
  }, [authRole]);

  useEffect(() => {
    if (authRole !== 'citizen') {
      if (!authRole) autoStartForCitizenRef.current = false;
      return;
    }
    if (autoStartForCitizenRef.current) return;

    autoStartForCitizenRef.current = true;
    setIsOpen(true);
    void startListening();
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
            void startListening();
          }
        },
        openAgent: () => {
          setIsOpen(true);
          void startListening();
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
        spokenTranscript,
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
