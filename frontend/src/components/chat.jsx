import React, { useState } from 'react';

const initialChats = [
  { id: 1, title: 'Room-Temp Superconductors', time: '2m ago', active: true },
  { id: 2, title: 'Solid-State Battery Supply Chain', time: '4h ago', active: false },
  { id: 3, title: 'CRISPR Off-Target Mitigation', time: 'Yesterday', active: false },
  { id: 4, title: 'Zero-Knowledge Proofs in DeFi', time: '3d ago', active: false },
  { id: 5, title: 'EU AI Act Compliance Guide', time: '1w ago', active: false },
];

const initialSources = [
  {
    id: 1,
    title: 'Nature: Assessing Room-Temperature Superconductivity Claims',
    domain: 'nature.com',
    url: 'https://nature.com',
    relevance: '98%',
    agent: 'TavilySearch'
  },
  {
    id: 2,
    title: 'MIT Technology Review: Economic Impact of Lossless Grids',
    domain: 'technologyreview.com',
    url: 'https://technologyreview.com',
    relevance: '94%',
    agent: 'BS4_Extractor'
  },
  {
    id: 3,
    title: 'arXiv:2604.11092 - Flux Pinning & Maglev Infrastructure Costs',
    domain: 'arxiv.org',
    url: 'https://arxiv.org',
    relevance: '91%',
    agent: 'TavilySearch'
  },
  {
    id: 4,
    title: 'IEEE Spectrum: Next-Gen MRI & Quantum Computing Scaling',
    domain: 'spectrum.ieee.org',
    url: 'https://spectrum.ieee.org',
    relevance: '88%',
    agent: 'BS4_Extractor'
  }
];

const Chat = () => {
  const [chats, setChats] = useState(initialChats);
  const [activeTitle, setActiveTitle] = useState('Economic Impacts of Room-Temperature Superconductors');
  const [prompt, setPrompt] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'user',
      content: 'What are the economic impacts of room-temperature superconductors?'
    },
    {
      id: 2,
      role: 'assistant',
      agentsUsed: ['Search Agent', 'Scraper Agent', 'Writer Agent', 'Critic Agent'],
      content: {
        summary: 'A verified room-temperature, ambient-pressure superconductor would trigger an estimated $2.4T annual shift across global energy, computing, and transportation sectors by eliminating electrical resistance losses.',
        sections: [
          {
            heading: '1. Power Grid & Transmission Overhaul',
            body: 'Up to 8–15% of generated electricity is currently lost as heat in high-voltage copper and aluminum lines. Lossless HVDC superconducting cables would save over $300B annually and allow solar/wind farms in remote deserts to power distant megacities with zero attenuation.'
          },
          {
            heading: '2. AI Compute & Data Center Efficiency',
            body: 'Data centers consume massive power solely for cooling. Superconducting interconnects and Josephson-junction logic could slash server power draw by 60%, drastically lowering the marginal cost of training frontier AI models.'
          },
          {
            heading: '3. Commercial Fusion & Healthcare',
            body: 'Compact, high-field magnets without liquid helium cryogenics would cut Tokamak fusion reactor capital costs by ~45% and make portable, low-cost MRI scanners viable for rural clinics worldwide.'
          }
        ],
        criticNote: 'Critic Agent verified 4 primary sources. Flagged and removed unverified speculative claims regarding immediate consumer battery replacements.'
      }
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: prompt
    };

    const simulatedReply = {
      id: Date.now() + 1,
      role: 'assistant',
      agentsUsed: ['Search Agent', 'Scraper Agent', 'Writer Agent', 'Critic Agent'],
      content: {
        summary: `Swarm synthesis complete for: "${prompt}". Our 4-agent pipeline scraped 12 sources and cross-examined the findings for factual accuracy.`,
        sections: [
          {
            heading: 'Key Findings & Synthesis',
            body: 'The Search Agent identified high-authority benchmarks via Tavily, while the Scraper Agent stripped boilerplate HTML to isolate empirical metrics. The Writer and Critic agents confirmed strong consensus across peer-reviewed literature.'
          }
        ],
        criticNote: 'Critic Agent Score: 9.6/10 — Zero hallucinations detected across extracted citations.'
      }
    };

    setMessages((prev) => [...prev, userMessage, simulatedReply]);
    setActiveTitle(prompt);
    setPrompt('');
  };

  const handleNewChat = () => {
    const newId = Date.now();
    const updated = chats.map((c) => ({ ...c, active: false }));
    setChats([
      { id: newId, title: 'New Research Session', time: 'Just now', active: true },
      ...updated
    ]);
    setActiveTitle('New Research Session');
    setMessages([]);
  };

  const handleSelectChat = (chat) => {
    setChats(chats.map((c) => ({ ...c, active: c.id === chat.id })));
    setActiveTitle(chat.title);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim() && !rating) return;
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackText('');
      setRating(null);
      setFeedbackSubmitted(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden p-3 md:p-6 flex flex-col">
      
      {/* Background Ambient Glows (Matches ModernHomePage & AboutSimplified) */}
      <div className="absolute top-[-15%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-900/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-fuchsia-900/15 blur-[120px] pointer-events-none" />

      {/* Main Outer Frame (Matches Wireframe Outer Rounded Box) */}
      <div className="relative z-10 flex-1 w-full max-w-[1600px] mx-auto h-[calc(100vh-1.5rem)] md:h-[calc(100vh-3rem)] bg-zinc-950/80 border border-zinc-800/80 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* =========================================================
            LEFT COLUMN: RECENT CHATS & NEW CHAT BUTTON
        ========================================================= */}
        <aside className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-zinc-800/80 flex flex-col justify-between p-5 bg-zinc-900/20">
          
          {/* Top: Recent Chats Header + List */}
          <div className="flex flex-col min-h-0">
            <div className="pb-3 mb-4 border-b border-zinc-800 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                  Recent Chats
                </h2>
              </div>
            </div>

            {/* Scrollable Chat History */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-40 lg:max-h-none">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all border group flex flex-col gap-1 ${
                    chat.active
                      ? 'bg-gradient-to-r from-indigo-950/60 to-fuchsia-950/30 border-indigo-500/40 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                      : 'bg-zinc-900/30 border-transparent hover:border-zinc-800 hover:bg-zinc-900/60 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">{chat.title}</span>
                    {chat.active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">{chat.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom: New Chat Button */}
          <div className="pt-4 mt-4 border-t border-zinc-800/60">
            <button
              onClick={handleNewChat}
              className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800/90 border border-zinc-700/80 hover:border-indigo-500/50 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg group cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-indigo-400 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Chat</span>
            </button>
          </div>
        </aside>

        {/* =========================================================
            CENTER COLUMN: TITLE PILL, REPORT STREAM & INPUT BAR
        ========================================================= */}
        <main className="lg:col-span-7 flex flex-col justify-between h-full min-h-0 bg-zinc-950/40 relative">
          
          {/* Top: Floating Title Box (Matches Wireframe Title Pill) */}
          <div className="px-6 pt-6 pb-4 flex flex-col items-center border-b border-zinc-900/80">
            <div className="w-full max-w-xl px-6 py-2.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-inner flex items-center justify-center gap-3">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                Topic
              </span>
              <h1 className="text-base md:text-lg font-bold text-white truncate">
                {activeTitle}
              </h1>
            </div>

            {/* Live Multi-Agent Status Strip */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              {[
                { name: 'Search', tag: '<TavilySearch>', color: 'text-indigo-400 border-indigo-500/30' },
                { name: 'Scraper', tag: '<BS4_Extractor>', color: 'text-purple-400 border-purple-500/30' },
                { name: 'Writer', tag: '<Gemini_Write>', color: 'text-fuchsia-400 border-fuchsia-500/30' },
                { name: 'Critic', tag: '<Gemini_Critique>', color: 'text-rose-400 border-rose-500/30' }
              ].map((agent, index) => (
                <div
                  key={agent.name}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/60 border ${agent.color} text-[11px] font-mono`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-zinc-300">{index + 1}. {agent.name}</span>
                  <span className="hidden sm:inline opacity-60">{agent.tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Middle: Scrollable Messages / Research Report Canvas */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 animate-ping" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Swarm Ready for Deployment</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Enter any research topic below. The Scout, Reader, Author, and Fact-Checker agents will synthesize a cited report in seconds.
                </p>
              </div>
            ) : (
              messages.map((msg) =>
                msg.role === 'user' ? (
                  /* User Query Bubble */
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-xl bg-indigo-600/15 border border-indigo-500/30 text-zinc-100 px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-md">
                      <div className="text-[11px] font-mono text-indigo-400 mb-1 uppercase tracking-wider">
                        Research Prompt
                      </div>
                      <p className="text-sm md:text-base">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  /* AI Swarm Synthesized Report Card */
                  <div
                    key={msg.id}
                    className="p-6 md:p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm space-y-6 shadow-xl"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-zinc-800/80">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold">
                          SWARM REPORT
                        </span>
                        <span className="text-xs font-mono text-zinc-500">
                          Verified by 4 Agents
                        </span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Fact-Checked
                      </span>
                    </div>

                    {/* Executive Summary */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-fuchsia-950/20 border border-indigo-500/20">
                      <div className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-1.5">
                        Executive Summary
                      </div>
                      <p className="text-sm md:text-base text-zinc-200 leading-relaxed">
                        {msg.content.summary}
                      </p>
                    </div>

                    {/* Report Sections */}
                    <div className="space-y-4">
                      {msg.content.sections.map((sec, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <h4 className="text-base md:text-lg font-bold text-white">
                            {sec.heading}
                          </h4>
                          <p className="text-sm text-zinc-400 leading-relaxed">
                            {sec.body}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Critic Agent Audit Footer */}
                    <div className="pt-4 border-t border-zinc-800/60 flex items-start gap-3 text-xs font-mono text-zinc-400">
                      <span className="text-rose-400 shrink-0 mt-0.5">[CRITIC_AGENT]</span>
                      <span>{msg.content.criticNote}</span>
                    </div>
                  </div>
                )
              )
            )}
          </div>

          {/* Bottom: Search / Prompt Bar with Circular Up Arrow (Matches Wireframe) */}
          <div className="p-5 border-t border-zinc-900/80 bg-zinc-950/70">
            <form onSubmit={handleSend} className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative flex items-center bg-zinc-900 border border-zinc-800 focus-within:border-indigo-500/60 rounded-2xl px-4 py-2.5 shadow-2xl transition-colors">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask the AI Swarm to research a topic or follow up..."
                  className="flex-1 bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-500 text-sm md:text-base pr-3"
                />
                <button
                  type="submit"
                  aria-label="Deploy Swarm"
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-[0_0_15px_rgba(99,102,241,0.5)] cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </main>

        {/* =========================================================
            RIGHT COLUMN: SOURCES (TOP) & GIVE FEEDBACK (BOTTOM)
        ========================================================= */}
        <aside className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-zinc-800/80 flex flex-col h-full min-h-0 bg-zinc-900/20">
          
          {/* Top Half: Sources */}
          <div className="flex-1 flex flex-col min-h-0 p-5 border-b border-zinc-800/80">
            <div className="pb-3 mb-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                  Sources
                </h2>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-indigo-400">
                {initialSources.length} Scraped
              </span>
            </div>

            {/* Sources List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {initialSources.map((src, index) => (
                <a
                  key={src.id}
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/70 hover:border-indigo-500/40 hover:bg-zinc-900 transition-all group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono text-indigo-400 flex items-center gap-1">
                      <span>[{index + 1}]</span>
                      <span className="text-zinc-500">{src.domain}</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {src.relevance} match
                    </span>
                  </div>
                  <h3 className="text-xs font-medium text-zinc-200 group-hover:text-white leading-snug mb-2">
                    {src.title}
                  </h3>
                  <div className="text-[10px] font-mono text-zinc-500">
                    Extracted via {`<${src.agent}>`}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Half: Give Feedback */}
          <div className="flex-1 flex flex-col justify-between p-5 min-h-0">
            <div>
              <div className="pb-3 mb-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                    Give Feedback
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">RLHF Loop</span>
              </div>

              <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
                Help calibrate the <span className="text-rose-400 font-mono">Critic Agent</span>. Rate the accuracy and depth of this report:
              </p>

              {/* Quick Rating Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { id: 'accurate', label: '🎯 Accurate' },
                  { id: 'shallow', label: '⚡ Too Brief' },
                  { id: 'hallucination', label: '⚠️ Error' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRating(item.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      rating === item.id
                        ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-white'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Textarea & Submit */}
            <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-2.5 flex-1 justify-end">
              <textarea
                rows="3"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Any missing citations, logical gaps, or formatting notes..."
                className="w-full rounded-2xl bg-zinc-900/70 border border-zinc-800 focus:border-fuchsia-500/50 outline-none p-3 text-xs text-zinc-200 placeholder-zinc-600 resize-none transition-colors"
              />

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-semibold text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(192,38,211,0.25)] cursor-pointer"
              >
                {feedbackSubmitted ? '✓ Feedback Logged to Swarm' : 'Submit Telemetry'}
              </button>
            </form>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default Chat;