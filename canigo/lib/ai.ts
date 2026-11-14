import { z } from 'zod';
import type { AiObservationDraft } from './types';

const observationSchema = z.object({
  attribute: z.string(),
  observations: z.array(z.object({
    type: z.string(),
    description: z.string(),
    evidence_region: z.string().optional(),
    confidence: z.enum(['low', 'medium', 'high']),
  })).max(8),
  cannot_determine: z.array(z.string()).max(12),
  requires_human_confirmation: z.literal(true),
});

function isEnabled() {
  return process.env.AI_ANALYSIS_ENABLED === 'true' && Boolean(process.env.OPEN_SOURCE_VISION_API_URL) && Boolean(process.env.OPEN_SOURCE_VISION_MODEL);
}

export function aiAvailability() {
  return {
    enabled: isEnabled(),
    provider: 'Open-source vision model endpoint',
    model: process.env.OPEN_SOURCE_VISION_MODEL || 'Qwen2.5-VL-7B-Instruct',
    message: isEnabled() ? 'AI draft observations are available for human review.' : 'Configure an open-source vision endpoint to enable draft observations. No AI result is fabricated in demo mode.',
  };
}

export async function analyzeImage(input: { imageUrl: string; attribute: string; note?: string }): Promise<AiObservationDraft> {
  if (!isEnabled()) throw new Error('OPEN_SOURCE_VISION_NOT_CONFIGURED');
  const endpoint = process.env.OPEN_SOURCE_VISION_API_URL as string;
  const model = process.env.OPEN_SOURCE_VISION_MODEL as string;
  const response = await fetch(`${endpoint.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.OPEN_SOURCE_VISION_API_KEY ? { Authorization: `Bearer ${process.env.OPEN_SOURCE_VISION_API_KEY}` } : {}),
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [
        { role: 'system', content: 'You are an evidence assistant for CANIGO. Describe only visible evidence relevant to the selected accessibility attribute. Never certify accessibility, legal compliance, exact dimensions, operational status, restroom compliance, or complete barrier-free routes. Always say what cannot be determined. Return JSON only.' },
        { role: 'user', content: [
          { type: 'text', text: `Selected attribute: ${input.attribute}. Contributor note: ${input.note || 'none'}. Return observations of visible features only. Every result requires human confirmation.` },
          { type: 'image_url', image_url: { url: input.imageUrl, detail: 'auto' } },
        ] },
      ],
      response_format: { type: 'json_object' },
    }),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`OPEN_SOURCE_VISION_HTTP_${response.status}`);
  const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error('OPEN_SOURCE_VISION_EMPTY_RESPONSE');
  const parsed = observationSchema.parse(JSON.parse(content));
  return {
    attribute: parsed.attribute,
    observations: parsed.observations.map((item) => ({ type: item.type, description: item.description, evidenceRegion: item.evidence_region, confidence: item.confidence })),
    cannotDetermine: parsed.cannot_determine,
    requiresHumanConfirmation: true,
    model,
    generatedAt: new Date().toISOString(),
  };
}
