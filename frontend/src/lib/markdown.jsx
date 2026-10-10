
function inlineParts(text, keyPrefix) {
  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|`[^`]+`)/g;
  let last = 0;
  let match;
  let index = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={`${keyPrefix}-${index++}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('[')) {
      const splitAt = token.indexOf('](');
      const label = token.slice(1, splitAt);
      const url = token.slice(splitAt + 2, -1);
      parts.push(<a key={`${keyPrefix}-${index++}`} href={url} target="_blank" rel="noreferrer noopener">{label}</a>);
    } else {
      parts.push(<code key={`${keyPrefix}-${index++}`}>{token.slice(1, -1)}</code>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function Markdown({ children }) {
  const text = String(children || '').replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  const blocks = [];
  let list = [];
  const flushList = () => {
    if (list.length) {
      blocks.push(<ul key={`list-${blocks.length}`}>{list.map((item, index) => <li key={index}>{inlineParts(item, `list-${blocks.length}-${index}`)}</li>)}</ul>);
      list = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (/^[-*]\s+/.test(trimmed)) {
      list.push(trimmed.replace(/^[-*]\s+/, ''));
      return;
    }
    flushList();
    if (!trimmed) return;
    if (/^###\s+/.test(trimmed)) {
      blocks.push(<h3 key={index}>{inlineParts(trimmed.replace(/^###\s+/, ''), `line-${index}`)}</h3>);
    } else if (/^##\s+/.test(trimmed)) {
      blocks.push(<h2 key={index}>{inlineParts(trimmed.replace(/^##\s+/, ''), `line-${index}`)}</h2>);
    } else if (/^#\s+/.test(trimmed)) {
      blocks.push(<h1 key={index}>{inlineParts(trimmed.replace(/^#\s+/, ''), `line-${index}`)}</h1>);
    } else if (/^\d+\.\s+/.test(trimmed)) {
      blocks.push(<p className="numbered-line" key={index}>{inlineParts(trimmed, `line-${index}`)}</p>);
    } else if (/^---+$/.test(trimmed)) {
      blocks.push(<hr key={index} />);
    } else {
      blocks.push(<p key={index}>{inlineParts(trimmed, `line-${index}`)}</p>);
    }
  });
  flushList();
  return <div className="markdown-report">{blocks}</div>;
}
