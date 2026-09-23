import React from 'react';

const Navbar = () => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl font-sans">
      {/* Floating Wrapper */}
      
      <nav className="flex items-center justify-between bg-zinc-900/40 backdrop-blur-2xl border border-zinc-700/50 rounded-full px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        {/* Logo / Brand */}
        <div className="flex items-center gap-2 pl-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-indigo-500 transition-colors">
            {/* Animated dot */}
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 animate-pulse" />
          </div>
          <span className="font-bold text-white tracking-tight hidden sm:block">Agentic</span>
        </div>

        {/* Core Links */}
        <div className="flex items-center gap-1 sm:gap-6 bg-zinc-950/50 rounded-full px-6 py-1.5 border border-zinc-800/50">
          <a href="#home" className="text-sm font-medium text-white px-3 py-1.5 bg-zinc-800/80 rounded-full transition-colors">
            Home
          </a>
          <a href="#about" className="text-sm font-medium text-zinc-400 hover:text-white px-3 py-1.5 transition-colors">
            About
          </a>
          <a href="#how-to-use" className="text-sm font-medium text-zinc-400 hover:text-white px-3 py-1.5 transition-colors">
            How to Use
          </a>
        </div>

        {/* Login Action */}
        <div className="pr-1">
          <button className="relative group overflow-hidden rounded-full p-[1px]">
            {/* Hover Gradient Border Effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center gap-2 bg-zinc-950 px-5 py-2 rounded-full transition-all group-hover:bg-zinc-900/80">
              <span className="text-sm font-semibold text-white">Login</span>
              <svg className="w-4 h-4 text-fuchsia-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </button>
        </div>
        
      </nav>
      
    </div>
  );
};

export default Navbar;