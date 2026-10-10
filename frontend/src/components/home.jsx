import { useState } from 'react';

const examples = [
  { icon: '◈', tag: 'TECHNOLOGY', title: 'How will AI agents change software engineering?', query: 'How will AI agents change software engineering over the next five years? Compare current evidence, limitations, and adoption trends.' },
  { icon: '⌁', tag: 'CLIMATE', title: 'Can next-generation batteries scale?', query: 'What are the most promising next-generation battery technologies, and what evidence exists about their scalability, costs, and limitations?' },
  { icon: '◎', tag: 'SCIENCE', title: 'What is the state of fusion energy?', query: 'Assess the current state of fusion energy research, recent milestones, technical bottlenecks, and realistic commercialization timelines.' },
];

export default function Home({ navigate }) {
  const [query, setQuery] = useState('');
  const start = (value = query) => {
    const trimmed = value.trim();
    navigate(trimmed ? `/app?q=${encodeURIComponent(trimmed)}` : '/app');
  };
  return (
    <main className="landing-page">
      <section className="hero container">
        <div className="hero-copy">
          <div className="status-pill"><span className="status-dot" /> RESEARCH, RECONSIDERED <span className="pill-divider" /> WEB + AI</div>
          <h1>From scattered sources<br />to <span className="gradient-text">clear thinking.</span></h1>
          <p className="hero-lede">An AI research workspace that searches the web, reads relevant sources, synthesizes the evidence, and shows you where the conclusions come from.</p>
          <form className="research-prompt" onSubmit={(event) => { event.preventDefault(); start(); }}>
            <div className="prompt-topline"><span className="prompt-icon">⌕</span><span>YOUR RESEARCH QUESTION</span><span className="prompt-hint">ONE TOPIC PER SESSION</span></div>
            <textarea rows="3" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Explore a question, compare ideas, or investigate a claim…" aria-label="Research question" />
            <div className="prompt-bottom"><span className="character-count">{query.length}/1000</span><button className="button button-primary" type="submit">Start research <span aria-hidden="true">↗</span></button></div>
          </form>
          <div className="hero-proof"><span>⌁</span> Search the web <i /> <span>◈</span> Synthesize evidence <i /> <span>✓</span> Review limitations</div>
        </div>
        <div className="hero-art" aria-label="Illustration of a research synthesis workspace" role="img">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="orb-core"><span className="orb-core-symbol">R</span><span className="orb-core-label">RESEARCH<br />ENGINE</span></div>
          <div className="float-card card-search"><span className="mini-icon purple">⌕</span><div><strong>Source discovery</strong><small>Finding relevant evidence</small></div><span className="mini-state">LIVE</span></div>
          <div className="float-card card-synthesis"><span className="mini-icon teal">✳</span><div><strong>Evidence synthesis</strong><small>Cross-source patterns</small></div><div className="signal-bars"><i/><i/><i/><i/><i/></div></div>
          <div className="float-card card-review"><span className="mini-icon amber">✓</span><div><strong>Quality review</strong><small>Gaps and uncertainty</small></div><span className="review-score">03</span></div>
          <div className="art-caption"><span className="caption-line" /> A clearer path through complexity</div>
        </div>
      </section>

      <section className="metrics-strip"><div className="container metrics-inner"><div><strong>01</strong><span>Question-led research</span></div><div><strong>02</strong><span>Sources you can inspect</span></div><div><strong>03</strong><span>Critique alongside synthesis</span></div><div className="metrics-note">Built to help you think, not just generate.</div></div></section>

      <section className="section container examples-section">
        <div className="section-heading"><div><span className="eyebrow">A FEW PLACES TO START</span><h2>Good questions deserve<br className="desktop-break" /> better research.</h2></div><p>Choose a prompt to start a dedicated research session. Each session focuses on one topic, keeping its findings and sources together.</p></div>
        <div className="example-grid">{examples.map((item) => <button className="example-card" key={item.tag} onClick={() => start(item.query)}><span className="example-top"><span className="example-icon">{item.icon}</span><span>{item.tag}</span><span className="example-arrow">↗</span></span><strong>{item.title}</strong><span className="example-link">Use this question <span>→</span></span></button>)}</div>
      </section>

      <section className="closing-cta"><div className="container closing-inner"><div><span className="eyebrow">LESS TAB-HOPPING. MORE THINKING.</span><h2>Make your next deep dive<br /><span className="gradient-text">count.</span></h2></div><button className="button button-light" onClick={() => start()}>Open research workspace <span>↗</span></button></div></section>
    </main>
  );
}
