"use client";

import { useStoryStore } from "@/store/useStoryStore";
import { useState } from "react";
import { SceneCard } from "./SceneCard";
import { Play } from "lucide-react";

export function SceneList() {
  const { scenes, characters, style, updateScene } = useStoryStore();
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  /**
   * STEP 1: Generate Image Prompt via AI for a given scene
   */
  const handleGeneratePrompt = async (sceneId: string): Promise<string | null> => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return null;

    updateScene(sceneId, { imagePrompt: "__generating__" });

    try {
      const res = await fetch("/api/generate-image-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene, characters, style }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const generatedPrompt: string = data.prompt;
      updateScene(sceneId, { imagePrompt: generatedPrompt });
      return generatedPrompt;
    } catch (error) {
      console.error("Failed to generate image prompt:", error);
      updateScene(sceneId, { imagePrompt: "" });
      return null;
    }
  };

  /**
   * STEP 2: Generate Image from an existing prompt
   */
  const handleGenerateImage = async (sceneId: string, promptOverride?: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    // If no prompt exists yet or we need a new one, generate it first
    let imagePrompt = promptOverride || scene.imagePrompt;
    if (!imagePrompt || imagePrompt === "__generating__") {
      const newPrompt = await handleGeneratePrompt(sceneId);
      if (!newPrompt) return;
      imagePrompt = newPrompt;
    }

    // Clear previous image, show loading state
    updateScene(sceneId, { imageUrl: "" });

    const freshSeed = Math.floor(Math.random() * 1000000);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt, seed: freshSeed }),
      });
      const data = await res.json();

      if (data.url) {
        updateScene(sceneId, { imageUrl: data.url });
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  };

  /**
   * BATCH: Generate missing frames sequentially (prompt then image for each)
   */
  const handleGenerateMissing = async () => {
    if (isBatchGenerating) return;
    setIsBatchGenerating(true);

    for (const scene of scenes) {
      if (!scene.imageUrl) {
        await handleGenerateImage(scene.id);
      }
    }

    setIsBatchGenerating(false);
  };

  const handleEditScene = (id: string, field: string, value: string) => {
    updateScene(id, { [field]: value });
  };

  if (scenes.length === 0) return null;

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 hide-scrollbar">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 px-4 gap-4">
        <h2 className="text-white/40 font-bold tracking-widest uppercase text-sm">Storyboard Timeline ({scenes.length} Scenes)</h2>
        <button
          onClick={handleGenerateMissing}
          disabled={isBatchGenerating}
          className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 border border-white/5 disabled:opacity-50"
        >
          <Play className="w-4 h-4 text-purple-400" />
          {isBatchGenerating ? "Rolling Cameras..." : "Generate All Missing Frames"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-12 pb-32">
        {scenes.map((scene, index) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            index={index}
            onGeneratePrompt={handleGeneratePrompt}
            onGenerateImage={handleGenerateImage}
            onEdit={handleEditScene}
          />
        ))}
      </div>
    </div>
  );
}
