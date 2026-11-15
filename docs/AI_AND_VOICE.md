# AI assistant and voice

## Current AI implementation

The assistant endpoint is implemented in `functions/api/assistant.ts`; local development wiring is in `vite.config.ts`. The endpoint calls Google's Gemini `gemini-2.5-flash` `generateContent` API using the server-side `GEMINI_API_KEY`. The client sends user context and receives a textual answer plus a constrained set of supported actions.

The assistant is intended to help users navigate CANIGO and understand available application information. It does **not** independently verify venue accessibility, inspect or authenticate photo evidence, certify compliance, or replace advice from a person with relevant access needs.

## Provider status

- Gemini: current provider in code; requires a valid server-side key and network access.
- OpenRouter: not used by the current implementation.
- AgentRouter: not integrated. No verified public API contract or base URL was available, so provider-specific code was not guessed.

A provider change should only be made after its official API contract and model ID are verified. Put credentials in the server environment, not frontend code. The key shared in chat must be revoked and replaced; do not reuse it.

## Voice behavior

Voice input and output use browser `SpeechRecognition`/`webkitSpeechRecognition` and `speechSynthesis`. The app attempts to initiate listening for an authenticated citizen when the assistant is opened, subject to browser support and microphone permission. It can resume listening between turns. Browsers may block startup or require a user gesture; speech recognition is not available in every browser.

This is not realtime streaming speech-to-speech. The recognized text is sent through the normal assistant request path; the response is then spoken by the browser's speech synthesis. Voice behavior has not been verified in a real browser session for this submission.

## Demo guidance

For a reliable recording, use text interaction unless microphone access, recognition, response playback and turn-taking have all been tested in the exact browser/device. Clearly label any fallback. Never imply that a generated answer is a verified accessibility fact.
