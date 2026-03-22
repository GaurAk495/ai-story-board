import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function callGemini(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });
  if (!response.text) {
    throw new Error("No content generated from Gemini API");
  }

  const textContent = response.text;

  if (!textContent) {
    throw new Error("No content generated from Gemini API");
  }

  return textContent;
}