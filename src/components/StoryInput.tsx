"use client";

import { useState } from "react";
import { useStoryStore } from "@/store/useStoryStore";
import { useRouter } from "next/navigation";
import { Loader2, Wand2, Edit3, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = [
  "Cinematic Movie",
  "Franco-Belgian Comic",
  "Anime / Studio Ghibli",
  "YouTube Explainer Video",
  "Wholesome Kids Book",
  "Gritty Noir Graphic Novel",
  "Minimalist Stickman",
  "Vintage 1980s Anime"
];

export function StoryInput() {
  const [step, setStep] = useState<"idea" | "review">("idea");
  const [idea, setIdea] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [draftGenre, setDraftGenre] = useState("");
  const [draftTone, setDraftTone] = useState("");
  
  const router = useRouter();
  
  const { setStory, setCharacters, setScenes, setIsGenerating, isGenerating, generationStep, setStyle } = useStoryStore();

  const handleGenerateStory = async () => {
    if (!idea.trim()) return;

    try {
      setIsGenerating(true, "Drafting your story...");
      
      const storyRes = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, style: selectedStyle }),
      });
      const storyData = await storyRes.json();
      if (storyData.error) throw new Error(storyData.error);
      
      setDraftTitle(storyData.title || "Untitled");
      setDraftContent(storyData.content || "");
      setDraftGenre(storyData.genre || "Fiction");
      setDraftTone(storyData.tone || "Neutral");
      
      setStep("review");
      setIsGenerating(false, "");

    } catch (error) {
      console.error("Pipeline failed:", error);
      setIsGenerating(false, "");
      alert("Failed to generate story draft. Please check console for details.");
    }
  };

  const handleGenerateStoryboard = async () => {
    if (!draftContent.trim()) return;

    try {
      // Save the finalized (possibly user-edited) story to the store
      setStory({
        title: draftTitle,
        content: draftContent,
        genre: draftGenre,
        tone: draftTone
      });
      
      // Save their chosen visual aesthetic mapped deeply into building prompts
      setStyle(selectedStyle);

      setIsGenerating(true, "Casting characters...");
      const charRes = await fetch("/api/generate-characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story: draftContent, style: selectedStyle }),
      });
      const charData = await charRes.json();
      if (charData.error) throw new Error(charData.error);
      setCharacters(charData);

      setIsGenerating(true, "Directing scenes...");
      const sceneRes = await fetch("/api/generate-scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story: draftContent, style: selectedStyle }),
      });
      const sceneData = await sceneRes.json();
      if (sceneData.error) throw new Error(sceneData.error);
      setScenes(sceneData);

      setIsGenerating(false, "");
      router.push("/editor");

    } catch (error) {
      console.error("Storyboard generation failed:", error);
      setIsGenerating(false, "");
      alert("Failed to generate storyboard panels. Please check console.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[400px]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        
        <AnimatePresence mode="wait">
          {step === "idea" ? (
            <motion.div
              key="idea"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6 flex items-center gap-3">
                <Wand2 className="w-8 h-8 text-blue-400" />
                What's your story?
              </h2>
              
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g., A cyberpunk detective tries to solve a crime on a Mars colony..."
                className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none text-lg transition-all"
                disabled={isGenerating}
              />
              
              <div className="mt-6 mb-2">
                <label className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3 block">Visual Aesthetic</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((styleOption) => (
                    <button
                      key={styleOption}
                      onClick={() => setSelectedStyle(styleOption)}
                      disabled={isGenerating}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedStyle === styleOption 
                          ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20 border border-purple-400" 
                          : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/5 hover:text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {styleOption}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-purple-300/70 font-medium w-full text-center md:text-left">
                  {isGenerating ? (
                    <span className="flex items-center gap-2 animate-pulse justify-center md:justify-start">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {generationStep}
                    </span>
                  ) : (
                    <span>Powered by <span className="text-pink-400 font-bold tracking-wide">Pollinations.ai</span></span>
                  )}
                </div>
                
                <button
                  onClick={handleGenerateStory}
                  disabled={!idea.trim() || isGenerating}
                  className="w-full md:w-auto group relative px-8 py-4 bg-white text-black font-bold rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isGenerating ? "Processing..." : "Generate Draft"}
                  </span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col h-full space-y-4"
            >
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Edit3 className="w-7 h-7 text-purple-400" />
                Review & Edit
              </h2>
              <p className="text-white/50 text-sm mb-4">
                You can tweak the generated story below before creating the storyboard. 
                Every sentence here drives the final visuals!
              </p>
              
              <input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-bold text-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                disabled={isGenerating}
              />
              
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-y leading-relaxed"
                disabled={isGenerating}
              />
              
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-purple-300/70 font-medium w-full text-center md:text-left">
                  {isGenerating ? (
                    <span className="flex items-center gap-2 animate-pulse justify-center md:justify-start">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {generationStep}
                    </span>
                  ) : "Ready to cast characters and direct scenes."}
                </div>
                
                <button
                  onClick={handleGenerateStoryboard}
                  disabled={!draftContent.trim() || isGenerating}
                  className="w-full md:w-auto group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {isGenerating ? "Building..." : "Build Storyboard"}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
