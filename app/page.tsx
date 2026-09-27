export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="border border-emerald-500/30 bg-emerald-950/20 rounded-2xl p-8 mb-10 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Hackathon MVP Backend
          </span>
          <span className="text-xs text-slate-400">Next.js 15 App Router</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          AI Lab: Science Practical Learning Platform
        </h1>
        <p className="mt-3 text-lg text-slate-300">
          Empowering learners in low-resource school environments through AI-guided practicals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <h2 className="text-xl font-bold text-white">1. LOCAL LAB Mode</h2>
          </div>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            Hands-on guided physical science experiments using safe, accessible household materials: red cabbage or hibiscus petal extracts, table salt, vinegar, lemon juice, baking soda, and clean wood ash filtrate.
          </p>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Low-resource substitutions (straw pipettes, plastic cups)</li>
            <li>• Physical safety alerts & handling guidelines</li>
            <li>• Step-by-step observation recording</li>
          </ul>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-indigo-400"></span>
            <h2 className="text-xl font-bold text-white">2. VIRTUAL LAB Mode</h2>
          </div>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            Digital laboratory workbench simulating multi-substance mixtures, realistic Henderson-Hasselbalch neutralization equilibrium, anthocyanin pigment transitions, effervescence, and pH curves.
          </p>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Real-time container state calculation</li>
            <li>• Multi-indicator color transitions</li>
            <li>• Safe simulation of hazardous reactions</li>
          </ul>
        </div>
      </div>

      <section className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Backend Route Handlers</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-emerald-400 font-bold">GET</span> /api/experiments
          </div>
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-emerald-400 font-bold">GET</span> /api/experiments/[id]
          </div>
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-blue-400 font-bold">POST</span> /api/experiment/start
          </div>
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-blue-400 font-bold">POST</span> /api/experiment/action
          </div>
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-blue-400 font-bold">POST</span> /api/safety/check
          </div>
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-purple-400 font-bold">POST</span> /api/ai/explain
          </div>
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-purple-400 font-bold">POST</span> /api/ai/feedback
          </div>
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-amber-400 font-bold">GET/POST</span> /api/assessment
          </div>
        </div>
      </section>
    </main>
  );
}
