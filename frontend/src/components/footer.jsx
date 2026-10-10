
export default function Footer({ navigate }) {
  const go = (path) => (event) => { event.preventDefault(); navigate(path); };
  return <footer className="site-footer"><div className="container footer-main"><a className="brand footer-brand" href="/" onClick={go('/')}><span className="brand-mark"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 24V8h5l8 10V8h5v16h-5L12 14v10z" /></svg></span><span>Research<span className="brand-light">OS</span><small>THINK CLEARLY.</small></span></a><p>Research is a process. Make the evidence part of the answer.</p><div className="footer-links"><a href="/about" onClick={go('/about')}>How it works</a><a href="/app" onClick={go('/app')}>Workspace</a><a href="/login" onClick={go('/login')}>Sign in</a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} ResearchOS</span><span>AI-assisted research. Human judgment required.</span></div></footer>;
}
