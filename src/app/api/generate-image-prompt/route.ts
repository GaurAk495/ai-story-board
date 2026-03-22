import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { scene, characters, style } = await req.json();

    if (!scene) {
      return NextResponse.json({ error: 'Scene is required' }, { status: 400 });
    }

    const aesthetic = style || "Cinematic Movie";

    // Build a rich character block by injecting appearances
    const characterDetails = (characters || [])
      .filter((c: any) => scene.characters?.some((n: string) => n.toLowerCase().includes(c.name.toLowerCase())))
      .map((c: any) => `- ${c.name}: ${c.appearance}`)
      .join('\n');

    const prompt = `
You are an expert text-to-image prompt engineer specializing in the "${aesthetic}" visual style.

Generate a single, highly effective image generation prompt for the following storyboard scene.

Scene Info:
- Script Line (THE visual focus): "${scene.scriptLine || scene.description}"
- Location: ${scene.location}
- Time: ${scene.time}
- Atmosphere: ${scene.emotion}
- Camera Shot: ${scene.camera}
- Director's Style Notes: ${scene.visualStyle}
${characterDetails ? `- Characters present:\n${characterDetails}` : ''}

Rules for the prompt:
1. The prompt must be written in plain English, describing only WHAT SHOULD BE IN THE IMAGE.
2. It MUST open with the art style declaration: "Artwork in ${aesthetic} style."
3. Describe the characters (using their appearance details) and their exact action from the script line.
4. Include setting, lighting, mood/atmosphere, and camera angle.
5. Do NOT include meta instructions, explanations, markdown, or quotes. Just the raw prompt text.
6. Keep it under 180 words.

Output only the prompt text, nothing else.
    `;

    const promptText = await callGemini(prompt);
    return NextResponse.json({ prompt: promptText.trim() });
  } catch (error: any) {
    console.error('Error generating image prompt:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate prompt' }, { status: 500 });
  }
}
