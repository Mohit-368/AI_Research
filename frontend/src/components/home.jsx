import React from 'react';

const ModernHomePage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-900/10 blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-24 md:py-32 mx-auto max-w-5xl text-center min-h-[70vh]">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm text-xs font-medium text-indigo-300 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          Tavily & Gemini Integrated
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight">
          Supercharge your research with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
            Autonomous AI Swarms.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
          Input a topic and watch a specialized team of agents search, scrape, synthesize, and critique—delivering a comprehensive markdown report in seconds.
        </p>

        {/* Search/Input Interface */}
        <div className="w-full max-w-2xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-2xl">
            <svg className="w-6 h-6 text-zinc-500 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="E.g., What are the economic impacts of room-temperature superconductors?" 
              className="flex-1 bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-600 px-4 py-3 text-base md:text-lg"
            />
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              Deploy Agents
            </button>
          </div>
        </div>
      </main>

      {/* Architecture / Agent Grid Section */}
      <section className="relative z-10 px-6 pb-32 max-w-7xl mx-auto" id="pipeline">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">The Multi-Agent Pipeline</h2>
          <p className="text-zinc-500">Four specialized agents working in perfect parallel harmony.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Agent 1 */}
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm hover:border-indigo-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Search Agent</h3>
            <p className="text-sm text-zinc-400 mb-4">Finds high-quality sources using the Tavily Search API, fetching titles and URLs instantly.</p>
            <div className="text-xs font-mono text-zinc-500 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
              {'<TavilySearch>'}
            </div>
          </div>

          {/* Agent 2 */}
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm hover:border-indigo-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Scraper Agent</h3>
            <p className="text-sm text-zinc-400 mb-4">Requests and BeautifulSoup strip away noise, capturing only clean, relevant article text.</p>
            <div className="text-xs font-mono text-zinc-500 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
              {'<BS4_Extractor>'}
            </div>
          </div>

          {/* Agent 3 */}
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm hover:border-indigo-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Writer Agent</h3>
            <p className="text-sm text-zinc-400 mb-4">Gemini via LangChain synthesizes massive context arrays into structured Markdown.</p>
            <div className="text-xs font-mono text-zinc-500 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
              {'<Gemini_Write>'}
            </div>
          </div>

          {/* Agent 4 */}
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm hover:border-indigo-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center mb-6 border border-zinc-700/50 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Critic Agent</h3>
            <p className="text-sm text-zinc-400 mb-4">Reviews the draft for logical gaps and hallucinatory errors before finalizing the report.</p>
            <div className="text-xs font-mono text-zinc-500 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
              {'<Gemini_Critique>'}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ModernHomePage;