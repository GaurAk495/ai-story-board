"use client";

import { useState } from "react";
import { Scene } from "@/types";
import { ImageIcon, Edit3, X, Check, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SceneCardProps {
  scene: Scene;
  index: number;
  onGeneratePrompt: (id: string) => Promise<string | null>;
  onGenerateImage: (id: string, customPrompt?: string) => void;
  onEdit: (id: string, field: string, value: string) => void;
}

export function SceneCard({ scene, index, onGeneratePrompt, onGenerateImage, onEdit }: SceneCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editDesc, setEditDesc] = useState(scene.description);
  const [editPrompt, setEditPrompt] = useState(scene.imagePrompt);
  const [showPromptInfo, setShowPromptInfo] = useState(false);

  const saveEdit = () => {
    onEdit(scene.id, "description", editDesc);
    onEdit(scene.id, "imagePrompt", editPrompt);
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
      id={scene.id}
      className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col group max-w-5xl mx-auto w-full mb-12"
    >
      {/* 16:9 Image Section (Top) */}
      <div className="w-full aspect-video relative bg-black/80 flex flex-col items-center justify-center border-b border-white/5 overflow-hidden">
        {scene.imageUrl ? (
          <img 
            src={scene.imageUrl} 
            alt={scene.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 bg-gradient-to-b from-black/0 to-black/40">
            {scene.imagePrompt ? (
              <div className="animate-pulse flex flex-col items-center">
                <ImageIcon className="w-16 h-16 mb-4 opacity-40 text-purple-400" />
                <p className="tracking-widest uppercase text-xs font-bold text-purple-400">Synthesizing Frame...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                <p className="tracking-widest uppercase text-xs font-bold opacity-50">Empty Canvas</p>
              </div>
            )}
          </div>
        )}
        
        {/* Soft vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Floating Controls */}
        <div className="absolute top-6 right-6 z-10 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">
          <button 
            onClick={() => setShowPromptInfo(!showPromptInfo)}
            className="p-3 bg-black/60 backdrop-blur-md rounded-xl text-white/80 hover:text-white hover:bg-black/90 hover:scale-105 transition-all shadow-xl"
            title="View / Edit Prompt"
          >
            <Eye className="w-5 h-5" />
          </button>

          {!scene.imagePrompt || scene.imagePrompt === "__generating__" ? (
            // STEP 1 - No prompt yet, offer to generate one
            <button 
              onClick={() => onGeneratePrompt(scene.id)}
              className="px-5 py-3 bg-gradient-to-r from-indigo-600/90 to-blue-600/90 hover:from-indigo-500 hover:to-blue-500 backdrop-blur-md rounded-xl text-white font-bold tracking-wide hover:scale-105 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
            >
              {scene.imagePrompt === "__generating__" ? (
                <><span className="animate-spin">⚙️</span> Writing Prompt...</>
              ) : (
                <>✍️ Generate Prompt</>
              )}
            </button>
          ) : (
            // STEP 2 - Prompt exists, offer to generate the image
            <button 
              onClick={() => onGenerateImage(scene.id, scene.imagePrompt)}
              className="px-5 py-3 bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-500 hover:to-purple-500 backdrop-blur-md rounded-xl text-white font-bold tracking-wide hover:scale-105 transition-all shadow-xl shadow-purple-500/20"
            >
              {scene.imageUrl ? "🎬 Reshoot" : "🎥 Roll Camera"}
            </button>
          )}
        </div>

        {/* Panel Number Badge */}
        <div className="absolute bottom-6 left-6 z-10">
          <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-3 shadow-2xl">
            <span className="text-purple-400 font-mono font-bold">SCENE</span>
            <span className="text-white font-black text-xl">{(index + 1).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Prompt Info Modal */}
        {showPromptInfo && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md p-8 z-20 flex flex-col transition-all">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-xl text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-400" /> Director's Prompt
              </h4>
              <button onClick={() => setShowPromptInfo(false)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-white/80 font-mono tracking-tight leading-relaxed flex-1 overflow-y-auto pr-4 custom-scrollbar">
              {scene.imagePrompt || "No prompt available yet. Roll camera first."}
            </p>
          </div>
        )}
      </div>

      {/* Script & Content Section (Bottom) */}
      <div className="p-10 relative bg-gradient-to-b from-white/[0.02] to-transparent">
        {isEditing ? (
          <div className="space-y-6 relative z-10 w-full">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 block">Director's Notes (Description)</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full h-32 bg-black/60 border border-white/10 rounded-2xl p-5 text-white/90 text-sm focus:ring-2 focus:ring-purple-500/50 resize-y"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 block">Manual Prompt Override</label>
              <textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                className="w-full h-24 bg-black/60 border border-white/10 rounded-2xl p-5 text-white/70 text-xs font-mono focus:ring-2 focus:ring-blue-500/50 resize-y"
                placeholder="Leave blank to auto-generate from scene & characters"
              />
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
              <button 
                onClick={() => setIsEditing(false)} 
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-medium transition-colors"
              >
                Discard
              </button>
              <button 
                onClick={saveEdit} 
                className="px-6 py-3 rounded-xl bg-white text-black hover:bg-gray-200 font-bold flex items-center gap-2 transition-colors shadow-xl shadow-white/10"
              >
                <Check className="w-5 h-5" /> Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 group/edit w-full">
            <button 
              onClick={() => {
                setEditDesc(scene.description);
                setEditPrompt(scene.imagePrompt);
                setIsEditing(true);
                setShowDetails(true);
              }}
              className="absolute right-0 top-0 p-3 opacity-0 group-hover/edit:opacity-100 bg-white/5 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-all shadow-lg backdrop-blur-sm"
              title="Edit Scene Notes"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            
            {/* The Huge Script Line */}
            {scene.scriptLine && (
              <div className="mb-6 mt-2 px-6 border-l-4 border-purple-500">
                <p className="font-serif italic text-3xl md:text-4xl text-white/95 leading-tight tracking-wide">
                  "{scene.scriptLine}"
                </p>
              </div>
            )}

            {/* Expander Toggle */}
            <div className="flex justify-center mb-2">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] hover:bg-white/10 text-white/50 hover:text-white transition-all text-sm font-medium border border-white/5"
              >
                {showDetails ? (
                  <><ChevronUp className="w-4 h-4" /> Hide Details</>
                ) : (
                  <><ChevronDown className="w-4 h-4" /> View Scene Details</>
                )}
              </button>
            </div>
            
            <AnimatePresence>
              {showDetails && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-8 pt-8 mt-6 border-t border-white/5">
                    <div className="flex-1 space-y-6">
                      <h3 className="text-2xl font-bold text-white tracking-tight">{scene.title}</h3>
                      <p className="text-white/60 leading-relaxed text-lg font-light">
                        {scene.description}
                      </p>
                    </div>

                    {/* Metadata Panel */}
                    <div className="md:w-72 space-y-6 bg-black/30 p-6 rounded-2xl border border-white/5">
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Location</span>
                          <span className="text-sm font-medium text-blue-300">{scene.location}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Time</span>
                          <span className="text-sm font-medium text-purple-300">{scene.time}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Atmosphere</span>
                          <span className="text-sm font-medium text-pink-300">{scene.emotion}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Shot Type</span>
                          <span className="text-sm font-medium text-white/80">{scene.camera}</span>
                        </div>
                      </div>

                      {scene.characters.length > 0 && (
                        <div className="pt-6 border-t border-white/5">
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-3">On Screen</span>
                          <div className="flex flex-wrap gap-2">
                            {scene.characters.map((char, i) => (
                              <span key={i} className="text-xs px-3 py-1.5 bg-white/10 rounded-md text-white/80 font-medium">
                                {char}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}
      </div>
    </motion.div>
  );
}
