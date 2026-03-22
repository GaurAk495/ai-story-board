import { NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { idea, style } = await req.json();

    if (!idea) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
    }

    const aesthetic = style || "Cinematic Movie";

    const prompt = `
You are a professional storyboard writer.

Your job is to turn an idea into a clear, visual, and specific narration script.

Write in SIMPLE ENGLISH. Use short, clear sentences.

STRICT RULES:

1. NO VAGUE LANGUAGE

* Do NOT use words like: "something", "someone", "somewhere", "things", "situation"
* Do NOT be generic or abstract
* Every sentence must describe a clear action, place, or visual

2. NO HYPOTHETICAL OR THINKING LANGUAGE

* Do NOT use: "maybe", "perhaps", "it seems", "as if", "he feels like"
* Do NOT describe thoughts unless shown through action

3. SHOW, DON’T TELL

* Do NOT say: "he is scared"
* Instead show it: "his hands shake", "he steps back", "his breath gets fast"

4. VISUAL FIRST

* Every line must be something that can be shown in an image
* Describe:

  * actions
  * environment
  * body movement
  * lighting
  * objects

5. CONSISTENT DETAILS

* Use the same character names
* Keep locations and objects consistent
* Do not randomly introduce new elements

6. SIMPLE SENTENCE FLOW

* One idea per sentence
* Avoid long or complex sentences

7. STRUCTURE
   Write in this order:

* Strong opening visual (hook)
* Build clear sequence of actions
* Add tension through events (not emotions)
* Clear peak moment
* Clean ending

8. NARRATION ONLY

* Only write what the narrator says
* No dialogue formatting
* No scene labels
* No screenplay format

OUTPUT FORMAT (STRICT JSON ONLY):

{
"title": "Short clear title",
"genre": "Genre",
"tone": "Tone",
"content": "Sentence 1. Sentence 2. Sentence 3.\n\nSentence 4. Sentence 5..."
}

${idea}
    `;

    const resultText = await callGemini(prompt);

    // Attempt to parse the JSON. Sometimes Gemini wraps in ```json ... ```
    let resultJson = resultText;
    if (resultText.startsWith('```json')) {
      resultJson = resultText.replace(/```json\n?/, '').replace(/```$/, '');
    }

    const parsedResult = JSON.parse(resultJson);

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error('Error generating story:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate story' }, { status: 500 });
  }
}
