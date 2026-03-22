"use client";

import { useStoryStore } from "@/store/useStoryStore";

export function Timeline() {
  const { scenes } = useStoryStore();

  if (scenes.length === 0) return null;

  const scrollToScene = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="h-24 bg-black/90 border-t border-white/10 flex-shrink-0 flex items-center px-6 overflow-x-auto hide-scrollbar z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex gap-4 min-w-max">
        {scenes.map((scene, index) => (
          <button
            key={scene.id}
            onClick={() => scrollToScene(scene.id)}
            className="relative w-32 h-16 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 group transition-all shrink-0 hover:scale-105"
          >
            {scene.imageUrl ? (
              <img src={scene.imageUrl} alt={scene.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-xs text-white/30 font-medium">
                Scene {index + 1}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <span className="text-[10px] text-white font-medium truncate w-full text-left">
                {scene.title}
              </span>
            </div>
            {/* Playhead indicator dot */}
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-purple-400 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
