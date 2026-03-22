import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { story, style } = await req.json();

    if (!story) {
      return NextResponse.json({ error: 'Story is required' }, { status: 400 });
    }

    const aesthetic = style || "Cinematic Movie";

    const prompt = `
Extract the main characters from the story provided.

CRITICAL INSTRUCTION: You are creating VISUAL CHARACTER SHEETS for a storyboard in the "${aesthetic}" art style.
The "appearance" field will be directly injected into an AI image prompt, so it MUST be:
1. Extremely specific and detailed — enough that an image AI re-creates the exact same person every time.
2. Strictly in the "${aesthetic}" visual style (e.g., if "Minimalist Stickman", describe simple line-art features; if "Anime", describe anime proportions and stylized traits; if "Cinematic Movie", describe realistic photographic detail).
3. Cover ALL of the following in order: Age range, Ethnicity/skin tone, Body type/height, Hair (color, length, style), Facial features (eyes, nose, lips, jawline, expression), Outfit (every item worn — fabric, color, fit), Accessories, and any distinctive marks or style elements.

The "consistencyTag" field is a short visual anchor phrase (under 12 words) that must appear in EVERY image prompt to lock in their look (e.g., "young Indian woman, deep brown eyes, red saree with gold border").

Return a JSON array EXACTLY in this format, ONLY JSON, no markdown:
[
  {
    "id": "char_1",
    "name": "Character Name",
    "appearance": "Detailed visual description in ${aesthetic} style covering age, ethnicity, hair, face, outfit, accessories...",
    "consistencyTag": "Short anchor phrase for image prompts",
    "personality": "2-3 key personality traits",
    "description": "Their role in the story"
  }
]

Story:
${story}
    `;

    const resultText = await callGemini(prompt);
    
    let resultJson = resultText;
    if (resultText.startsWith('```json')) {
      resultJson = resultText.replace(/```json\n?/, '').replace(/```$/, '');
    }
    
    const parsedResult = JSON.parse(resultJson);

    // Make sure each character has a unique ID if Gemini forgot
    const processedResult = parsedResult.map((c: any, index: number) => ({
      ...c,
      id: c.id || `char_${index + 1}_${Date.now()}`
    }));

    return NextResponse.json(processedResult);
  } catch (error: any) {
    console.error('Error generating characters:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate characters' }, { status: 500 });
  }
}
