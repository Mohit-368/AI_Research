
export default function Navbar({ navigate, currentPath = '/' }) {
  const go = (path) => (event) => { event.preventDefault(); navigate(path); };
  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={go('/')} aria-label="ResearchOS home">
        <span className="brand-mark"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 24V8h5l8 10V8h5v16h-5L12 14v10z" /></svg></span>
        <span>Research<span className="brand-light">OS</span><small>INTELLIGENCE WORKSPACE</small></span>
      </a>
      <nav className="header-links" aria-label="Main navigation">
        <a className={currentPath === '/' ? 'active' : ''} href="/" onClick={go('/')}>Overview</a>
        <a className={currentPath === '/about' ? 'active' : ''} href="/about" onClick={go('/about')}>How it works</a>
      </nav>
      <div className="header-actions">
        <a href="/login" className="button button-quiet" onClick={go('/login')}>Sign in</a>
        <a href="/register" className="button button-primary button-small" onClick={go('/register')}>Get started <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}
