interface AssistantEnv {
  GEMINI_API_KEY?: string;
}

interface AssistantRequestContext {
  request: Request;
  env: AssistantEnv;
}

interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
}

const allowedActionTypes = new Set([
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

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export async function handleAssistantRequest(request: Request, apiKey?: string): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Use POST to send a message.' }, 405);
  }

  if (!apiKey?.trim()) {
    return jsonResponse({ error: 'The server is missing GEMINI_API_KEY.' }, 503);
  }

  let body: Record<string, unknown>;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 64_000) {
      return jsonResponse({ error: 'The assistant request is too large.' }, 413);
    }
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: 'The assistant request must contain valid JSON.' }, 400);
  }

  const userText = typeof body.userText === 'string' ? body.userText.trim() : '';
  if (!userText || userText.length > 2000) {
    return jsonResponse({ error: 'Enter a message between 1 and 2,000 characters.' }, 400);
  }

  const history = Array.isArray(body.history)
    ? body.history.slice(-8).flatMap((item): { role: 'user' | 'model'; parts: { text: string }[] }[] => {
      if (!item || typeof item !== 'object') return [];
      const message = item as Partial<AssistantMessage>;
      if ((message.role !== 'user' && message.role !== 'assistant') || typeof message.content !== 'string') return [];
      return [{
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content.slice(0, 1200) }],
      }];
    })
    : [];

  const venueContext = Array.isArray(body.venues)
    ? body.venues.slice(0, 30)
    : [];
  const pageContext = typeof body.currentRoute === 'string' ? body.currentRoute.slice(0, 120) : '/';
  const selectedVenue = typeof body.selectedVenue === 'string' ? body.selectedVenue.slice(0, 100) : null;

  const systemInstruction = `You are CANIGO, an accessibility-focused assistant that can answer questions and choose safe actions within the CANIGO app.
Use only the supplied venue data for place facts. Do not invent availability, distance, route geometry, or verification. Explain uncertainty and distinguish reported information from verified information.
Choose exactly one action from: answer, find_places, open_venue, save_place, plan_route, open_map, open_saved, open_profile, open_contribute, open_community, open_notifications, open_explore, open_home, open_report, open_admin.
Return only JSON with this shape: {"reply":"short, conversational response","action":{"type":"action_name","venueSlug":"optional known slug","category":"optional category","wheelchairAccess":true,"stepFree":true,"lift":true,"accessibleRestroom":true,"query":"optional search term","view":"map or list","origin":"optional origin","destination":"optional destination"}}.
For search requests use find_places and only enable accessibility filters the user asked for. For a route request use plan_route and extract both endpoints if given; do not claim a route is computed. The app only has a demonstration route from Chennai Institute of Technology (CIT) to Marina Beach. For unsupported origins or destinations, use answer and ask for the supported demo route instead. Use open_venue only for an exact match to a supplied venue slug. For an action the user did not request, use answer.`;

  const prompt = `CANIGO page: ${pageContext}
Selected venue: ${selectedVenue ?? 'none'}
Venue data: ${JSON.stringify(venueContext)}
User message: ${userText}`;

  try {
    const upstream = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 500,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!upstream.ok) {
      console.error(`Gemini assistant request failed with status ${upstream.status}.`);
      return jsonResponse({ error: 'The AI provider could not process this message. Please try again.' }, 502);
    }

    const result = await upstream.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();
    if (!text) {
      return jsonResponse({ error: 'The AI provider returned an empty response. Please try again.' }, 502);
    }

    let plan: { reply?: unknown; action?: { type?: unknown; [key: string]: unknown } };
    try {
      plan = JSON.parse(text) as typeof plan;
    } catch {
      return jsonResponse({ error: 'The AI provider returned an invalid response. Please try again.' }, 502);
    }

    if (typeof plan.reply !== 'string' || !plan.reply.trim()) {
      return jsonResponse({ error: 'The AI provider returned an invalid response. Please try again.' }, 502);
    }

    const action = plan.action && typeof plan.action.type === 'string' && allowedActionTypes.has(plan.action.type)
      ? plan.action
      : { type: 'answer' };

    return jsonResponse({ reply: plan.reply.trim().slice(0, 2000), action });
  } catch (error) {
    console.error('Failed to reach Gemini for the assistant.', error);
    return jsonResponse({ error: 'Could not reach the AI provider. Check the server connection and try again.' }, 502);
  }
}

export const onRequestPost = ({ request, env }: AssistantRequestContext) =>
  handleAssistantRequest(request, env.GEMINI_API_KEY);
