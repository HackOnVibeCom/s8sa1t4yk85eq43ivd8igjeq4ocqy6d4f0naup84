import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  LoaderCircle,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useAI } from '../../contexts/AIContext';
import { useApp } from '../../contexts/AppContext';
import { CanigoRobotIcon } from '../common/AccessibilityIcon';

export const GlobalCanigoAgent: React.FC = () => {
  const {
    isOpen,
    openAgent,
    closeAgent,
    messages,
    sendMessage,
    isThinking,
    isListening,
    startListening,
    stopListening,
    isSpeaking,
    stopSpeaking,
    isVoiceMuted,
    toggleVoiceMute,
    transcriptFeedback,
    quickActions,
  } = useAI();
  const { navigateTo, authRole } = useApp();
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
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

  const visibleMessages = messages.slice(-3);
  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={openAgent}
          aria-label="Open CANIGO voice assistant"
          className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#155E4B] text-white shadow-[0_12px_35px_rgba(21,94,75,0.35)] transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#80A995]/60"
        >
          <CanigoRobotIcon className="h-9 w-9" size={36} />
          <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-white bg-[#80A995]" />
        </button>
      )}

      {isOpen && (
        <>
          <div
            aria-live="polite"
            aria-label="CANIGO conversation"
            className="pointer-events-none fixed bottom-[23rem] right-5 z-40 flex max-h-[36vh] w-[min(88vw,25rem)] flex-col items-end gap-2 overflow-y-auto px-1 pb-1 sm:bottom-[24rem] sm:right-8"
          >
            {visibleMessages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`pointer-events-auto max-w-full animate-[canigo-float-in_250ms_ease-out] ${
                    isUser ? 'self-end text-right' : 'self-start text-left'
                  }`}
                >
                  <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#52635D] drop-shadow-sm">
                    {!isUser && <Sparkles className="h-3 w-3" aria-hidden="true" />}
                    {isUser ? 'You' : 'CANIGO'}
                  </p>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-[0_4px_18px_rgba(38,60,58,0.10)] backdrop-blur ${
                    isUser
                      ? 'rounded-br-sm bg-[#DDEBE1]/95 text-[#155E4B]'
                      : 'rounded-bl-sm bg-white/90 text-[#263C3A]'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.venueCard && (
                      <button
                        type="button"
                        onClick={() => navigateTo(`/venues/${message.venueCard?.slug}`)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#155E4B] underline"
                      >
                        Open {message.venueCard.name} <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {message.routeCard && (
                      <button
                        type="button"
                        onClick={() => navigateTo('/map')}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#155E4B] underline"
                      >
                        View sample route on map <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  {message.suggestedActions && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {message.suggestedActions.map((action, index) => (
                        <button
                          key={`${action.action}-${index}`}
                          type="button"
                          onClick={() => handleSuggestedAction(action.action, action.payload)}
                          className="pointer-events-auto rounded-full border border-[#C3D8CE] bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#155E4B] shadow-sm backdrop-blur hover:bg-[#EDF4EA]"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {isThinking && (
              <p role="status" className="pointer-events-auto rounded-full bg-white/90 px-3 py-1.5 text-xs text-[#52635D] shadow-sm">
                CANIGO is thinking…
              </p>
            )}
          </div>

          <div className="fixed bottom-36 right-5 z-50 flex flex-col items-center gap-2 sm:bottom-24 sm:right-8">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleVoiceMute}
                aria-label={isVoiceMuted ? 'Unmute CANIGO voice' : 'Mute CANIGO voice'}
                title={isVoiceMuted ? 'Unmute voice replies' : 'Mute voice replies'}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#155E4B] shadow-md backdrop-blur hover:bg-[#EDF4EA]"
              >
                {isVoiceMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={closeAgent}
                aria-label="Close CANIGO assistant"
                title="Close assistant and stop listening"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#52635D] shadow-md backdrop-blur hover:bg-[#EDF4EA]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative flex h-28 w-28 items-center justify-center">
              {(isListening || isSpeaking || isThinking) && (
                <>
                  <span className={`absolute inset-0 rounded-full bg-[#80A995]/25 ${isSpeaking ? 'animate-ping' : 'animate-pulse'}`} />
                  <span className="absolute inset-2 rounded-full border border-[#80A995]/40" />
                </>
              )}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                aria-label={isListening ? 'Stop continuous listening' : 'Start voice listening'}
                aria-pressed={isListening}
                title={isListening ? 'Listening continuously — tap to stop' : 'Tap to allow microphone and start listening'}
                className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#80A995] via-[#357B65] to-[#155E4B] text-white shadow-[0_12px_32px_rgba(21,94,75,0.35)] transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#80A995]/50 ${
                  isSpeaking ? 'scale-105' : 'animate-[canigo-orb-float_4s_ease-in-out_infinite]'
                }`}
              >
                <CanigoRobotIcon className="h-11 w-11" size={44} />
              </button>
            </div>
            <div className="max-w-[13rem] text-center text-[11px] font-semibold text-[#263C3A] drop-shadow-[0_1px_4px_rgba(255,255,255,0.95)]">
              {isThinking ? (
                <span className="inline-flex items-center gap-1"><LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Thinking</span>
              ) : isSpeaking ? 'Speaking — you can ask me to stop' : isListening ? 'Listening continuously' : authRole === 'citizen' ? 'Voice is paused' : 'CANIGO assistant'}
            </div>
          </div>

          <div className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,34rem)] -translate-x-1/2">
            <div className="mb-2 flex justify-center gap-1.5 overflow-x-auto px-1">
              {quickActions.slice(0, 3).map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => void sendMessage(action.prompt)}
                  disabled={isThinking}
                  className="shrink-0 rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-[#155E4B] shadow-sm backdrop-blur hover:bg-[#EDF4EA] disabled:opacity-50"
                >
                  {action.label}
                </button>
              ))}
            </div>
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 rounded-full border border-white/80 bg-white/90 p-2 pl-4 shadow-[0_10px_32px_rgba(38,60,58,0.18)] backdrop-blur-xl"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                disabled={isThinking}
                aria-label="Type a message to CANIGO"
                placeholder="Ask or say anything…"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#263C3A] outline-none placeholder:text-[#74817B] disabled:opacity-60"
              />
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                aria-label={isListening ? 'Stop voice listening' : 'Start voice listening'}
                title={isListening ? 'Stop voice listening' : 'Start voice listening'}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                  isListening ? 'bg-[#FCE5E2] text-[#B54C3C]' : 'bg-[#EDF4EA] text-[#155E4B] hover:bg-[#DDEBE1]'
                }`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#155E4B] text-white transition hover:bg-[#104D3E] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            {transcriptFeedback && (
              <p role="status" className="mx-auto mt-1.5 w-fit max-w-full rounded-full bg-white/80 px-3 py-1 text-center text-[10px] text-[#52635D] shadow-sm backdrop-blur">
                {transcriptFeedback}
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
};
