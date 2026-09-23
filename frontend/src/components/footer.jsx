import React from 'react';

const Footer = () => {
  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800/60 overflow-hidden font-sans pt-16 pb-8 text-zinc-400">
      
      {/* Deep Background Glow */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[300px] bg-gradient-to-t from-fuchsia-900/10 via-indigo-900/10 to-transparent blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center mb-16">
          
          {/* Left Column: System Diagnostics */}
          <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="font-bold text-white text-xl tracking-tight">Agentic</span>
            </div>
            
            <div className="font-mono text-xs text-zinc-500 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Global Swarm Network: ONLINE
              </div>
              <div>Latency: 14ms (US-East)</div>
              <div>Model: Gemini-Pro-Router-v2</div>
            </div>
          </div>

          {/* Center Column: The Interactive Agent Core (Hover to activate) */}
          <div className="flex flex-col items-center justify-center group cursor-crosshair">
            <div className="text-xs font-mono text-zinc-600 mb-6 uppercase tracking-[0.2em] group-hover:text-indigo-400 transition-colors">
              Swarm Topology
            </div>
            
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Central Core */}
              <div className="absolute w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)] z-10 group-hover:border-fuchsia-500 transition-colors duration-500">
                <div className="w-4 h-4 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-full animate-pulse" />
              </div>

              {/* Orbiting Agent Nodes (Expand on hover) */}
              <div className="absolute w-6 h-6 bg-zinc-900 border border-indigo-500/50 rounded-full flex items-center justify-center transform transition-all duration-500 ease-out group-hover:-translate-y-12 group-hover:border-indigo-400 shadow-lg">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              </div>
              <div className="absolute w-6 h-6 bg-zinc-900 border border-purple-500/50 rounded-full flex items-center justify-center transform transition-all duration-500 ease-out group-hover:translate-x-12 group-hover:border-purple-400 shadow-lg delay-75">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              </div>
              <div className="absolute w-6 h-6 bg-zinc-900 border border-fuchsia-500/50 rounded-full flex items-center justify-center transform transition-all duration-500 ease-out group-hover:translate-y-12 group-hover:border-fuchsia-400 shadow-lg delay-100">
                <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full" />
              </div>
              <div className="absolute w-6 h-6 bg-zinc-900 border border-rose-500/50 rounded-full flex items-center justify-center transform transition-all duration-500 ease-out group-hover:-translate-x-12 group-hover:border-rose-400 shadow-lg delay-150">
                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
              </div>
              
              {/* Connecting lines that appear on hover */}
              <div className="absolute inset-0 border border-zinc-800 rounded-full scale-50 opacity-0 group-hover:scale-150 group-hover:opacity-100 transition-all duration-700 ease-out" />
            </div>
          </div>

          {/* Right Column: Terminal-Style Directory Links */}
          <div className="flex flex-col items-center md:items-end gap-3 font-mono text-sm">
            <a href="#about" className="group flex items-center gap-2 hover:text-white transition-colors">
              <span className="text-zinc-600 group-hover:text-fuchsia-500 transition-colors">cd</span> 
              <span>~/about_us</span>
            </a>
            <a href="#docs" className="group flex items-center gap-2 hover:text-white transition-colors">
              <span className="text-zinc-600 group-hover:text-indigo-500 transition-colors">cd</span> 
              <span>~/documentation</span>
            </a>
            <a href="#privacy" className="group flex items-center gap-2 hover:text-white transition-colors">
              <span className="text-zinc-600 group-hover:text-fuchsia-500 transition-colors">cat</span> 
              <span>privacy_policy.md</span>
            </a>
            <a href="#github" className="group flex items-center gap-2 mt-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-indigo-500 hover:bg-zinc-800/50 transition-all">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>./github_repo</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar: Continuous Data Stream / Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-zinc-800/50 text-xs font-mono text-zinc-600 gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Agentic Research Core.</span>
            <span className="hidden md:inline px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-500">v2.0.1</span>
          </div>
          
          <div className="flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
            <span>[ SYSTEM ID: A9-X44-OMEGA ]</span>
            <span className="hidden sm:inline">|</span>
            <span>END OF LINE.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;