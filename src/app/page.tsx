import { StoryInput } from "@/components/StoryInput";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storyboard AI — Turn Any Idea Into a Cinematic Storyboard",
  description:
    "Write a story idea, pick your visual style — Anime, Cinematic, Stickman, Kids Book, Noir & more — and watch AI generate a shot-by-shot storyboard with consistent characters. Powered by Gemini & Pollinations.ai.",
};

const FEATURES = [
  {
    icon: "🎬",
    title: "Sentence-by-Sentence Panels",
    desc: "Every single narrated sentence becomes its own storyboard panel automatically.",
  },
  {
    icon: "🎨",
    title: "8 Visual Aesthetics",
    desc: "Anime, Cinematic Movie, Stickman, Kids Book, Noir, Franco-Belgian Comic & more.",
  },
  {
    icon: "👤",
    title: "Consistent Characters",
    desc: "AI locks your characters' age, ethnicity, outfit & features across every scene.",
  },
  {
    icon: "⚡",
    title: "Two-Step Image Pipeline",
    desc: "Review the AI-written image prompt before generating. Edit or reshoot any panel.",
  },
  {
    icon: "📦",
    title: "Export as ZIP",
    desc: "Download all your panels + the full script in one click.",
  },
  {
    icon: "🌸",
    title: "Powered by Pollinations.ai",
    desc: "Free, fast, open image generation — no credits, no limits.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050510] relative overflow-x-hidden">
      {/* Background glow blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed top-[40%] left-[40%] w-[30%] h-[30%] bg-pink-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎬</span>
          <span className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            Storyboard AI
          </span>
        </div>
        <a
          href="https://pollinations.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors"
        >
          <span>🌸</span> Powered by Pollinations.ai
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-4 pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest mb-8">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          AI Storyboard Generator
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
            From Idea
          </span>
          <br />
          <span className="text-white">to Storyboard</span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-orange-300">
            in Seconds.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-4 leading-relaxed">
          Describe your story. Pick your visual style. Get a shot-by-shot cinematic storyboard with
          <strong className="text-white/80"> consistent characters</strong> and
          <strong className="text-white/80"> AI-generated images</strong> — all free.
        </p>
        <p className="text-sm text-white/30 mb-16">
          Works for films, anime, explainer videos, kids books, Bollywood & more.
        </p>

        {/* Core Input */}
        <div className="max-w-2xl mx-auto">
          <StoryInput />
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-center text-3xl md:text-4xl font-black text-white mb-4">
          Everything a Director Needs
        </h2>
        <p className="text-center text-white/40 mb-14 text-lg">
          A full AI film pre-production pipeline in your browser.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-3xl p-8 transition-all duration-300"
            >
              <div className="text-4xl mb-5">{f.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-20 border-t border-white/5">
        <h2 className="text-center text-3xl md:text-4xl font-black text-white mb-16">
          How It Works
        </h2>
        <div className="flex flex-col gap-10">
          {[
            {
              step: "01",
              color: "from-blue-500 to-cyan-500",
              title: "Write Your Idea",
              body: "Type any concept — a Bollywood romance, an anime adventure, a YouTube explainer, a kids bedtime story. Then pick your visual aesthetic.",
            },
            {
              step: "02",
              color: "from-purple-500 to-pink-500",
              title: "Review the Script",
              body: "Gemini AI generates a narrator-style voiceover script. You can read it, edit it freely, then approve it to continue.",
            },
            {
              step: "03",
              color: "from-pink-500 to-orange-400",
              title: "Generate Your Storyboard",
              body: "Every sentence becomes a panel. AI generates image prompts per shot (which you can inspect and edit), then renders the final 16:9 image.",
            },
            {
              step: "04",
              color: "from-green-500 to-teal-500",
              title: "Export & Share",
              body: "Download a ZIP with all your panels as JPEG images plus a full formatted script breakdown. Ready to share or pitch.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-8 items-start">
              <div
                className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center font-black text-white text-xl shadow-lg`}
              >
                {item.step}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/50 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-10 text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-white/30">
          <span>© 2026 Storyboard AI</span>
          <span className="hidden md:block">·</span>
          <a
            href="https://pollinations.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-pink-400 transition-colors"
          >
            <span>🌸</span> Images by Pollinations.ai
          </a>
          <span className="hidden md:block">·</span>
          <a
            href="https://github.com/GaurAk495/ai-story-board"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub →
          </a>
        </div>
      </footer>
    </main>
  );
}
