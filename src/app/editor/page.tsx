"use client";

import { useStoryStore } from "@/store/useStoryStore";
import { CharacterPanel } from "@/components/CharacterPanel";
import { SceneList } from "@/components/SceneList";
import { Timeline } from "@/components/Timeline";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Film, Download, Loader2, Home } from "lucide-react";
import JSZip from "jszip";

export default function EditorPage() {
  const { story, scenes } = useStoryStore();
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);

  // Redirect to home if accessed directly without generating a story
  useEffect(() => {
    if (!story && scenes.length === 0) {
      router.replace("/");
    }
  }, [story, scenes, router]);

  if (!story && scenes.length === 0) return null;

  const handleExport = async () => {
    if (!story || scenes.length === 0) return;
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // 1. Add Story Script
      let scriptContent = `# ${story.title}\n\n`;
      scriptContent += `Genre: ${story.genre}\nTone: ${story.tone}\n\n`;
      scriptContent += `## Full Text\n${story.content}\n\n`;
      
      scriptContent += `## Scenes Breakdown\n`;
      scenes.forEach((s, idx) => {
        scriptContent += `\n### Scene ${idx + 1}: ${s.title}\n`;
        scriptContent += `Quote: "${s.scriptLine}"\n`;
        scriptContent += `Action: ${s.description}\n`;
        scriptContent += `Location: ${s.location} | Time: ${s.time} | Shot: ${s.camera}\n`;
      });
      zip.file("storyboard_script.txt", scriptContent);

      // 2. Add Images
      const imgFolder = zip.folder("images");
      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        if (scene.imageUrl) {
          try {
            // Our imageUrl is a base64 string "data:image/jpeg;base64,...(data)..."
            const base64Data = scene.imageUrl.split(',')[1];
            if (base64Data && imgFolder) {
               imgFolder.file(`scene_${(i + 1).toString().padStart(2, '0')}.jpg`, base64Data, { base64: true });
            }
          } catch(e) {
            console.error("Failed to append image", e);
          }
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${story.title.replace(/\\s+/g, '_')}_export.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
       console.error("Export failed:", error);
       alert("Export failed! Check console.");
    }
    setIsExporting(false);
  };

  return (
    <div className="h-screen bg-[#050510] text-white overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-white/8 bg-[#050510]/80 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-base leading-tight text-white truncate max-w-xs">
              {story?.title || "Storyboard Editor"}
            </h1>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">
              {story?.genre || "Project"} &nbsp;·&nbsp; {scenes.filter(s => s.imageUrl).length}/{scenes.length} frames rendered
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/")}
            className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
            title="New Story"
          >
            <Home className="w-4 h-4" />
          </button>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-500 rounded-lg transition-all border border-white/10 flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-purple-500/10"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? "Zipping..." : "Export ZIP"}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Background glow for workspace */}
        <div className="absolute top-0 right-0 w-[80%] h-[50%] bg-blue-900/10 blur-[150px] pointer-events-none" />
        
        <CharacterPanel />
        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-black/0 to-black/40">
          <SceneList />
        </div>
      </div>

      {/* Timeline Footer */}
      <Timeline />
    </div>
  );
}
