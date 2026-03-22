import { create } from "zustand";
import { Story, Character, Scene } from "@/types";

interface StoryState {
  story: Story | null;
  characters: Character[];
  scenes: Scene[];
  style: string;
  isGenerating: boolean;
  generationStep: string;

  setStory: (story: Story | null) => void;
  setCharacters: (characters: Character[]) => void;
  setScenes: (scenes: Scene[]) => void;
  setStyle: (style: string) => void;
  setIsGenerating: (isGenerating: boolean, step?: string) => void;

  updateScene: (id: string, updated: Partial<Scene>) => void;
  updateCharacter: (id: string, updated: Partial<Character>) => void;
}

export const useStoryStore = create<StoryState>((set) => ({
  story: null,
  characters: [],
  scenes: [],
  style: "cinematic movie",
  isGenerating: false,
  generationStep: "",

  setStory: (story) => set({ story }),
  setCharacters: (characters) => set({ characters }),
  setScenes: (scenes) => set({ scenes }),
  setStyle: (style) => set({ style }),
  setIsGenerating: (isGenerating, step = "") => set({ isGenerating, generationStep: step }),

  updateScene: (id, updated) =>
    set((state) => ({
      scenes: state.scenes.map((s) =>
        s.id === id ? { ...s, ...updated } : s
      ),
    })),
  updateCharacter: (id, updated) =>
    set((state) => ({
      characters: state.characters.map((c) =>
        c.id === id ? { ...c, ...updated } : c
      ),
    })),
}));
