Alright — let’s turn this into a **build-ready, AI-friendly system spec**. I’ll structure it so you (or an AI coding agent) can directly implement it step-by-step.

---

# 🧠 0. Product Definition

**Name (optional):** Storyboard AI
**Goal:** Convert idea/story → structured scenes → images + audio → editable storyboard → export

---

# 🏗️ 1. Tech Stack (Confirmed)

### Frontend

* **Next.js (App Router)**
* **Tailwind CSS**
* **Zustand (state management)**

### Backend (Next.js API routes)

* Gemini API → story + scene + characters
* Pollinations API → image generation
* (Optional later) TTS API → audio

# 📁 2. Project Structure

```bash
/app
  /page.tsx                # Landing
  /editor/page.tsx         # Main storyboard editor

/components
  StoryInput.tsx
  SceneList.tsx
  SceneCard.tsx
  CharacterPanel.tsx
  ImageGenerator.tsx
  Timeline.tsx

/lib
  gemini.ts
  pollinations.ts
  promptBuilder.ts
  sceneParser.ts

/store
  useStoryStore.ts

/types
  index.ts

/app/api
  /generate-story/route.ts
  /generate-scenes/route.ts
  /generate-characters/route.ts
  /generate-image/route.ts
```

---

# 🧾 3. Core Data Models

## 🧍 Character

```ts
export type Character = {
  id: string;
  name: string;
  description: string;
  appearance: string;
  personality: string;
};
```

## 🎬 Scene

```ts
export type Scene = {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  characters: string[];
  emotion: string;
  camera: string;
  imagePrompt: string;
  imageUrl?: string;
  audioText?: string;
};
```

## 📖 Story

```ts
export type Story = {
  title: string;
  genre: string;
  tone: string;
  content: string;
};
```

---

# 🧠 4. Zustand Store

```ts
import { create } from "zustand";

export const useStoryStore = create((set) => ({
  story: null,
  characters: [],
  scenes: [],
  style: "cinematic",

  setStory: (story) => set({ story }),
  setCharacters: (characters) => set({ characters }),
  setScenes: (scenes) => set({ scenes }),

  updateScene: (id, updated) =>
    set((state) => ({
      scenes: state.scenes.map((s) =>
        s.id === id ? { ...s, ...updated } : s
      ),
    })),
}));
```

---

# 🔄 5. Full Pipeline Flow

```text
User Input
   ↓
Generate Story (Gemini)
   ↓
Extract Characters (Gemini)
   ↓
Generate Scenes (Gemini)
   ↓
Build Image Prompts
   ↓
Generate Images (Pollinations)
   ↓
Display Editable Storyboard
```

---

# 🤖 6. Gemini API Integration

## `/lib/gemini.ts`

```ts
export async function callGemini(prompt: string) {
  const res = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}
```

---

# 🧾 7. Prompt Engineering (VERY IMPORTANT)

## 🪄 7.1 Story Generator Prompt

```text
You are a professional screenwriter.

Convert the following idea into a polished short story.

Return JSON:
{
  "title": "",
  "genre": "",
  "tone": "",
  "content": ""
}

Idea:
{{user_input}}
```

---

## 🎭 7.2 Character Extraction Prompt

```text
Extract characters from the story.

Return JSON array:
[
  {
    "name": "",
    "appearance": "",
    "personality": "",
    "description": ""
  }
]

Story:
{{story}}
```

---

## 🎬 7.3 Scene Generator Prompt

```text
Break the story into cinematic scenes.

Each scene must include:
- title
- description
- location
- time
- characters
- emotion
- camera shot

Return JSON array.

Story:
{{story}}
```

---

# 🎨 8. Prompt Builder (CRITICAL)

## `/lib/promptBuilder.ts`

```ts
export function buildImagePrompt(scene, characters, style) {
  const charDescriptions = scene.characters
    .map((name) => {
      const char = characters.find((c) => c.name === name);
      return char ? `${char.name}: ${char.appearance}` : name;
    })
    .join(", ");

  return `
${style} cinematic scene,
${scene.description},
location: ${scene.location},
time: ${scene.time},
characters: ${charDescriptions},
emotion: ${scene.emotion},
camera: ${scene.camera},
high detail, dramatic lighting
`;
}
```

---

# 🖼️ 9. Pollinations Image API

## `/lib/pollinations.ts`

```ts
export function getImageUrl(prompt: string) {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}`;
}
```

---

# 🔌 10. API Routes

## ✅ Generate Story

```ts
// /api/generate-story
export async function POST(req) {
  const { idea } = await req.json();

  const prompt = `...`; // use template
  const result = await callGemini(prompt);

  return Response.json(JSON.parse(result));
}
```

---

## ✅ Generate Scenes

```ts
export async function POST(req) {
  const { story } = await req.json();

  const prompt = `...`;
  const result = await callGemini(prompt);

  return Response.json(JSON.parse(result));
}
```

---

## ✅ Generate Characters

```ts
export async function POST(req) {
  const { story } = await req.json();

  const prompt = `...`;
  const result = await callGemini(prompt);

  return Response.json(JSON.parse(result));
}
```

---

## ✅ Generate Image

```ts
export async function POST(req) {
  const { prompt } = await req.json();
  const url = getImageUrl(prompt);

  return Response.json({ url });
}
```

---

# 🖥️ 11. UI Flow

## 🟢 Step 1: Input Page

* textarea
* "Generate Story" button

---

## 🟡 Step 2: Processing

* loading states:

  * generating story
  * extracting characters
  * generating scenes

---

## 🔵 Step 3: Editor Page

### Layout:

```text
Sidebar → Characters
Main → Scenes
Bottom → Timeline
```

---

# 🧩 12. Components

## `StoryInput.tsx`

* input idea
* trigger pipeline

---

## `SceneCard.tsx`

* scene description
* regenerate image button
* edit fields

---

## `SceneList.tsx`

* map scenes

---

## `CharacterPanel.tsx`

* show characters
* allow edits

---

## `Timeline.tsx`

* horizontal scroll
* thumbnails

---

# 🔁 13. Image Generation Flow

For each scene:

```ts
for (scene of scenes) {
  const prompt = buildImagePrompt(scene, characters, style);
  const imageUrl = getImageUrl(prompt);

  updateScene(scene.id, { imagePrompt: prompt, imageUrl });
}
```

---

# 🎙️ 14. (Optional) Audio Layer

Add later:

```ts
scene.audioText = scene.description;
```

Then send to TTS API.

---

# ⚡ 15. UX Enhancements

### Must-have:

* regenerate image per scene
* edit scene text
* style switch (anime, realistic, comic)
* loading skeletons

---

# 🚀 16. MVP Build Order

### Phase 1

* input → story → scenes → display text

### Phase 2

* characters + prompt builder

### Phase 3

* image generation

### Phase 4

* editing + regeneration

### Phase 5

* export (PDF/video)

---

# 🧠 17. Key Differentiator (DO NOT SKIP)

👉 Scene-based generation
👉 Character consistency
👉 Editable storyboard UI

---
