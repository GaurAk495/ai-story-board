import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

/**
 * Split text into individual sentences using punctuation boundaries.
 * Handles . ! ? and also respects newlines as potential sentence boundaries.
 */
function splitIntoSentences(text: string): string[] {
  // Normalize line endings and trim
  const normalized = text.replace(/\r\n/g, '\n').trim();

  // Split on sentence-ending punctuation followed by whitespace or end, 
  // OR on double newlines (paragraph breaks = new scene beat)
  const raw = normalized
    .split(/(?<=[.!?])\s+|\n{2,}/)
    .map(s => s.trim())
    .filter(s => s.length > 8); // drop very short fragments

  return raw;
}

export async function POST(req: Request) {
  try {
    const { story, style } = await req.json();

    if (!story) {
      return NextResponse.json({ error: 'Story is required' }, { status: 400 });
    }

    const aesthetic = style || "Cinematic Movie";

    // --- STEP 1: Split the script into sentences deterministically ---
    const sentences = splitIntoSentences(story);

    if (sentences.length === 0) {
      return NextResponse.json({ error: 'Could not extract sentences from script' }, { status: 400 });
    }

    // --- STEP 2: Send all sentences to Gemini in ONE call to enrich with metadata ---
    // We give it the numbered list of sentences and ask it to return enriched metadata for each.
    const sentenceList = sentences
      .map((s, i) => `${i + 1}. "${s}"`)
      .join('\n');

    const prompt = `
You are a professional storyboard director.

Below is a numbered list of sentences from a script. Each sentence is ONE storyboard scene/shot.
Your job: Return enriched storyboard metadata for EACH sentence — one JSON object per sentence, in the SAME order.

Visual style for this storyboard: "${aesthetic}"

For each sentence, return:
- id: "scene_1", "scene_2", etc. (matching the sentence number)
- title: 3-6 word scene title
- description: 1-2 sentences of director's visual notes for this exact moment
- scriptLine: the EXACT sentence text (copy verbatim from the list)
- location: inferred location
- time: inferred time of day
- characters: array of character names present (infer from context)
- emotion: dominant mood
- camera: best camera shot for this moment (e.g., Close-up, Wide Shot, POV)
- visualStyle: lighting, color, atmosphere matching the "${aesthetic}" art style
- imagePrompt: "" (always empty string)

Return a JSON array ONLY. No markdown fences, no explanation. Exactly ${sentences.length} objects:
[
  {
    "id": "scene_1",
    "title": "...",
    "description": "...",
    "scriptLine": "...",
    "location": "...",
    "time": "...",
    "characters": [],
    "emotion": "...",
    "camera": "...",
    "visualStyle": "...",
    "imagePrompt": ""
  }
]

Sentences:
${sentenceList}
    `;

    const resultText = await callGemini(prompt);

    let resultJson = resultText.trim();
    if (resultJson.startsWith('```json')) {
      resultJson = resultJson.replace(/```json\n?/, '').replace(/```$/, '').trim();
    } else if (resultJson.startsWith('```')) {
      resultJson = resultJson.replace(/```\n?/, '').replace(/```$/, '').trim();
    }

    const parsedResult = JSON.parse(resultJson);

    // Guarantee IDs and required fields
    const processedResult = parsedResult.map((s: any, index: number) => ({
      ...s,
      scriptLine: s.scriptLine || sentences[index] || '',
      imageUrl: '',
      imagePrompt: '',
      id: s.id || `scene_${index + 1}_${Date.now()}`
    }));

    return NextResponse.json(processedResult);
  } catch (error: any) {
    console.error('Error generating scenes:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate scenes' }, { status: 500 });
  }
}
