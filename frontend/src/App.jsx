import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Home from './components/home';
import About from './components/about';
import Chat from './components/chat';
import Navbar from './components/navbar';
import Footer from './components/footer';
import AuthPage from './components/auth';

function useAppLocation() {
  const [location, setLocation] = useState(() => ({ pathname: window.location.pathname, search: window.location.search }));
  useEffect(() => {
    const update = () => setLocation({ pathname: window.location.pathname, search: window.location.search });
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  const navigate = useCallback((to, options = {}) => {
    if (options.replace) window.history.replaceState({}, '', to);
    else window.history.pushState({}, '', to);
    setLocation({ pathname: window.location.pathname, search: window.location.search });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return { ...location, navigate };
}

export default function App() {
  const location = useAppLocation();
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const researchMatch = path.match(/^\/research\/([^/]+)$/);
  const isWorkspace = path === '/app' || Boolean(researchMatch);

  let page;
  if (path === '/') page = <Home navigate={location.navigate} />;
  else if (path === '/about') page = <About navigate={location.navigate} />;
  else if (path === '/login') page = <AuthPage mode="login" navigate={location.navigate} />;
  else if (path === '/register') page = <AuthPage mode="register" navigate={location.navigate} />;
  else if (isWorkspace) page = <Chat navigate={location.navigate} researchId={researchMatch?.[1] || null} initialQuery={new URLSearchParams(location.search).get('q') || ''} />;
  else page = <main className="not-found"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>This page is off the map.</h1><p>The route you opened does not exist.</p><button className="button button-primary" onClick={() => location.navigate('/')}>Back to home</button></main>;

  return (
    <div className="app-shell">
      {!isWorkspace && <Navbar navigate={location.navigate} currentPath={path} />}
      {page}
      {!isWorkspace && <Footer navigate={location.navigate} />}
    </div>
  );
}
