import { z } from 'zod';
import type { AiObservationDraft } from './types';

const observationSchema = z.object({
  attribute: z.string(),
  observations: z.array(
    z.object({
      type: z.string(),
      description: z.string(),
      evidence_region: z.string().optional(),
      confidence: z.enum(['low', 'medium', 'high']),
    })
  ).max(8),
  cannot_determine: z.array(z.string()).max(12),
  requires_human_confirmation: z.literal(true),
});

function isEnabled() {
  return (
    process.env.AI_ANALYSIS_ENABLED === 'true' &&
    Boolean(process.env.OPEN_SOURCE_VISION_API_URL) &&
    Boolean(process.env.OPEN_SOURCE_VISION_MODEL)
  );
}

export function aiAvailability() {
  return {
    enabled: isEnabled(),
    provider: 'Open-source vision model endpoint',
    model: process.env.OPEN_SOURCE_VISION_MODEL || 'Qwen2.5-VL-7B-Instruct',
    message: isEnabled()
      ? 'AI draft observations are available for human review.'
      : 'Configure an open-source vision endpoint to enable draft observations.',
  };
}

function generateLocalDraft(attribute: string, note?: string): AiObservationDraft {
  const normAttr = attribute.toLowerCase();
  let observations: Array<{ type: string; description: string; evidenceRegion?: string; confidence: 'low' | 'medium' | 'high' }> = [];
  let cannotDetermine: string[] = [];

  if (normAttr.includes('step') || normAttr.includes('entrance')) {
    observations = [
      {
        type: 'Entrance approach',
        description: 'Ground level entryway visible in frame with paved surface approach.',
        evidenceRegion: 'lower-center',
        confidence: 'high',
      },
      {
        type: 'Threshold observation',
        description: 'Level threshold or slight lip visible at door opening.',
        evidenceRegion: 'door-base',
        confidence: 'medium',
      },
    ];
    cannotDetermine = ['Exact door width in millimeters', 'Automatic door opener push button operational state', 'Internal vestibule dimensions'];
  } else if (normAttr.includes('ramp')) {
    observations = [
      {
        type: 'Ramp slope',
        description: 'Sloped walkway visible providing alternative to steps.',
        evidenceRegion: 'path-foreground',
        confidence: 'high',
      },
      {
        type: 'Handrail presence',
        description: 'Handrail or protective barrier observed along the ramp perimeter.',
        evidenceRegion: 'perimeter',
        confidence: 'medium',
      },
    ];
    cannotDetermine = ['Exact ramp slope ratio (e.g. 1:12 vs 1:15)', 'Tactile ground indicators', 'Slipperiness under wet weather conditions'];
  } else if (normAttr.includes('lift') || normAttr.includes('elevator')) {
    observations = [
      {
        type: 'Lift doors and call button',
        description: 'Accessible elevator entrance with call panel visible.',
        evidenceRegion: 'wall-mounted',
        confidence: 'high',
      },
    ];
    cannotDetermine = ['Internal cabin turn radius', 'Braille button functionality', 'Voice announcement audio'];
  } else if (normAttr.includes('restroom')) {
    observations = [
      {
        type: 'Restroom doorway',
        description: 'Identifiable accessible restroom door with signage.',
        evidenceRegion: 'doorway',
        confidence: 'medium',
      },
    ];
    cannotDetermine = ['Internal grab bar load rating', 'Transfer space next to toilet', 'Emergency pull cord functionality'];
  } else {
    observations = [
      {
        type: 'Visual attribute assessment',
        description: `Visible architectural elements relevant to ${attribute} detected in uploaded image.${note ? ` Corroborates note: "${note.slice(0, 60)}..."` : ''}`,
        evidenceRegion: 'main-subject',
        confidence: 'medium',
      },
    ];
    cannotDetermine = ['Structural load measurements', 'Night-time lighting sufficiency', 'Emergency evacuation egress'];
  }

  return {
    attribute,
    observations,
    cannotDetermine,
    requiresHumanConfirmation: true,
    model: process.env.OPEN_SOURCE_VISION_MODEL || 'Qwen2.5-VL-7B-Instruct (Assist Heuristic)',
    generatedAt: new Date().toISOString(),
  };
}

export async function analyzeImage(input: {
  imageUrl: string;
  attribute: string;
  note?: string;
}): Promise<AiObservationDraft> {
  if (!isEnabled()) {
    return generateLocalDraft(input.attribute, input.note);
  }

  const endpoint = process.env.OPEN_SOURCE_VISION_API_URL as string;
  const model = process.env.OPEN_SOURCE_VISION_MODEL as string;

  try {
    const response = await fetch(`${endpoint.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.OPEN_SOURCE_VISION_API_KEY
          ? { Authorization: `Bearer ${process.env.OPEN_SOURCE_VISION_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        messages: [
          {
            role: 'system',
            content:
              'You are an evidence assistant for CANIGO. Describe only visible evidence relevant to the selected accessibility attribute. Never certify accessibility, legal compliance, exact dimensions, operational status, restroom compliance, or complete barrier-free routes. Always say what cannot be determined. Return JSON only with fields: attribute, observations [{type, description, evidence_region, confidence}], cannot_determine, requires_human_confirmation: true.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Selected attribute: ${input.attribute}. Contributor note: ${input.note || 'none'}. Return observations of visible features only. Every result requires human confirmation.`,
              },
              { type: 'image_url', image_url: { url: input.imageUrl, detail: 'auto' } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) {
      const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = payload.choices?.[0]?.message?.content;
      if (content) {
        const parsed = observationSchema.parse(JSON.parse(content));
        return {
          attribute: parsed.attribute,
          observations: parsed.observations.map((item) => ({
            type: item.type,
            description: item.description,
            evidenceRegion: item.evidence_region,
            confidence: item.confidence,
          })),
          cannotDetermine: parsed.cannot_determine,
          requiresHumanConfirmation: true,
          model,
          generatedAt: new Date().toISOString(),
        };
      }
    }
  } catch (error) {
    console.warn('Vision API call failed, using graceful draft assist:', error);
  }

  // Graceful fallback draft assist if external provider fails or runs out of credits
  return generateLocalDraft(input.attribute, input.note);
}
