import { useState } from 'react';
import { authApi } from '../lib/api';

export default function AuthPage({ mode, navigate }) {
  const isRegister = mode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (isRegister && name.trim().length < 2) { setError('Enter your name (at least 2 characters).'); return; }
    if (password.length < (isRegister ? 8 : 1)) { setError(isRegister ? 'Password must be at least 8 characters.' : 'Enter your password.'); return; }
    setBusy(true);
    try {
      if (isRegister) await authApi.register(name.trim(), email.trim(), password);
      else await authApi.login(email.trim(), password);
      const next = new URLSearchParams(window.location.search).get('next');
      navigate(next && next.startsWith('/') && !next.startsWith('//') ? next : '/app');
    } catch (requestError) {
      setError(requestError.message || 'Authentication failed.');
    } finally { setBusy(false); }
  }

  return <main className="auth-layout"><div className="auth-decor"><div className="auth-glow auth-glow-a"/><div className="auth-glow auth-glow-b"/><div className="auth-decor-content"><span className="status-pill"><span className="status-dot"/> YOUR RESEARCH SPACE</span><h1>Curiosity is a<br /><span className="gradient-text">good starting point.</span></h1><p>Keep your questions focused, your sources close, and your findings in one workspace.</p><div className="auth-stat-row"><div><strong>01</strong><span>Topic per session</span></div><div><strong>↗</strong><span>Source-linked reports</span></div></div></div></div><div className="auth-panel-wrap"><section className="auth-panel"><button className="back-link" onClick={() => navigate('/')}><span>←</span> Back to overview</button><span className="eyebrow">{isRegister ? 'CREATE YOUR WORKSPACE' : 'WELCOME BACK'}</span><h2>{isRegister ? 'Start researching.' : 'Pick up where you left off.'}</h2><p className="auth-subcopy">{isRegister ? 'Create an account to save your reports and research history.' : 'Sign in to access your research history and saved reports.'}</p><form onSubmit={handleSubmit} className="auth-form">{isRegister && <label>Full name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" required minLength={2} maxLength={80}/></label>}<label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required maxLength={254}/></label><label>Password<div className="password-input"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isRegister ? 'At least 8 characters' : 'Your password'} autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={isRegister ? 8 : 1} maxLength={128}/><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>{error && <div className="form-error" role="alert">{error}</div>}<button className="button button-primary auth-submit" type="submit" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'} <span>↗</span></button></form><p className="auth-switch">{isRegister ? 'Already have an account?' : 'New to ResearchOS?'} <button onClick={() => navigate(isRegister ? '/login' : '/register')}>{isRegister ? 'Sign in' : 'Create account'}</button></p><p className="auth-legal">Your research belongs to your account. Never put API keys or confidential secrets into a research prompt.</p></section></div></main>;
}
