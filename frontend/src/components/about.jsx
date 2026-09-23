import React from 'react';

const AboutSimplified = () => {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden py-24 px-6">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full bg-fuchsia-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/15 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm text-xs font-bold text-zinc-400 uppercase tracking-[0.1em] mb-8 shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            How It Works
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
            Stop searching. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
              Start understanding.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed font-light">
            Traditional research means opening a dozen tabs, dodging ads, and trying to connect the dots yourself. We built an AI team that does the heavy lifting for you—turning hours of reading into a clear, 3-minute summary.
          </p>
        </div>

        {/* Bento Grid: The Paradigm Shift (Old vs New) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          
          {/* Card 1: The Old Way */}
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm flex flex-col h-full">
            <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">The Exhausting Way</h3>
            <ul className="text-zinc-400 text-base leading-relaxed space-y-4 mt-2">
              <li className="flex gap-3"><span className="text-zinc-600">1.</span> Type a question into a search engine.</li>
              <li className="flex gap-3"><span className="text-zinc-600">2.</span> Scroll past the sponsored ads.</li>
              <li className="flex gap-3"><span className="text-zinc-600">3.</span> Open 10 different tabs.</li>
              <li className="flex gap-3"><span className="text-zinc-600">4.</span> Skim through long, confusing articles.</li>
              <li className="flex gap-3"><span className="text-zinc-600">5.</span> Try to piece the actual answer together.</li>
            </ul>
          </div>

          {/* Card 2: The Agentic Way */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-fuchsia-900/10 border border-indigo-500/20 backdrop-blur-sm relative overflow-hidden group h-full">
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Our Smart Way</h3>
              <ul className="text-zinc-400 text-base leading-relaxed space-y-4 mt-2">
                <li className="flex gap-3 items-center"><span className="text-indigo-400">✓</span> Tell us what you want to know.</li>
                <li className="flex gap-3 items-center"><span className="text-indigo-400">✓</span> Wait 15 seconds.</li>
                <li className="flex gap-3 items-center"><span className="text-indigo-400">✓</span> Read a perfectly written, fact-checked report.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Meet the Team Section (Replaces the complex terminal) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Meet Your AI Research Team</h2>
          <p className="text-zinc-500">Four specialized AI assistants working together behind the scenes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Agent 1 */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-900/80 transition-colors">
            <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4">
              <span className="text-xl">🔍</span>
            </div>
            <h4 className="text-white font-bold mb-2">1. The Scout</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Scours the internet instantly to find the most trustworthy and relevant articles about your topic.
            </p>
          </div>

          {/* Agent 2 */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-900/80 transition-colors">
            <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4">
              <span className="text-xl">📖</span>
            </div>
            <h4 className="text-white font-bold mb-2">2. The Reader</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Reads all the links the Scout found, ignoring the ads, pop-ups, and useless fluff to extract only the facts.
            </p>
          </div>

          {/* Agent 3 */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-900/80 transition-colors">
            <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4">
              <span className="text-xl">✍️</span>
            </div>
            <h4 className="text-white font-bold mb-2">3. The Author</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Takes all the gathered facts and writes a clean, easy-to-understand summary tailored to your question.
            </p>
          </div>

          {/* Agent 4 */}
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-900/80 transition-colors relative overflow-hidden group">
            {/* Soft highlight for the final step */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-zinc-950 border border-indigo-500/30 flex items-center justify-center mb-4 text-indigo-400">
                <span className="text-xl">🛡️</span>
              </div>
              <h4 className="text-white font-bold mb-2">4. The Fact-Checker</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Reviews the Author's work to make sure it makes sense, catches mistakes, and finalizes the report for you.
              </p>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default AboutSimplified;