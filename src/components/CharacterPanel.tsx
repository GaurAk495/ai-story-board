"use client";

import { useState } from "react";
import { useStoryStore } from "@/store/useStoryStore";
import { Character } from "@/types";
import { User, Edit3, X, Check } from "lucide-react";
import { motion } from "framer-motion";

export function CharacterPanel() {
  const { characters, updateCharacter } = useStoryStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Character>>({});

  const startEdit = (char: Character) => {
    setEditingId(char.id);
    setEditValues(char);
  };

  const saveEdit = (id: string) => {
    updateCharacter(id, editValues);
    setEditingId(null);
  };

  if (characters.length === 0) return null;

  return (
    <div className="w-[320px] h-full overflow-y-auto border-r border-white/10 bg-black/40 backdrop-blur-md p-6 flex-shrink-0 hide-scrollbar">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-400" />
        Characters
      </h3>
      
      <div className="space-y-4">
        {characters.map((char, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={char.id} 
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group"
          >
            {editingId === char.id ? (
              <div className="space-y-3">
                <input
                  value={editValues.name || ""}
                  onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/20 rounded-md px-3 py-1 text-sm text-white font-medium"
                />
                <textarea
                  value={editValues.appearance || ""}
                  onChange={(e) => setEditValues({ ...editValues, appearance: e.target.value })}
                  className="w-full h-20 bg-black/50 border border-white/20 rounded-md px-3 py-2 text-xs text-white/80 resize-none"
                  placeholder="Appearance"
                />
                <textarea
                  value={editValues.personality || ""}
                  onChange={(e) => setEditValues({ ...editValues, personality: e.target.value })}
                  className="w-full h-16 bg-black/50 border border-white/20 rounded-md px-3 py-2 text-xs text-white/80 resize-none"
                  placeholder="Personality"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingId(null)} className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                  <button onClick={() => saveEdit(char.id)} className="p-1 hover:bg-green-500/20 rounded text-green-400 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white/90 truncate pr-2">{char.name}</h4>
                  <button 
                    onClick={() => startEdit(char)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 bg-white/10 hover:bg-blue-500/50 rounded-md text-white/70 hover:text-white transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-white/60 space-y-2">
                  <p><span className="text-white/40 font-semibold text-[10px] uppercase tracking-wider block mb-0.5">Role</span> {char.description}</p>
                  <p><span className="text-white/40 font-semibold text-[10px] uppercase tracking-wider block mb-0.5">Appearance</span> {char.appearance}</p>
                  <p><span className="text-white/40 font-semibold text-[10px] uppercase tracking-wider block mb-0.5">Personality</span> {char.personality}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
