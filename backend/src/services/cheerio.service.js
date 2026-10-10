import * as cheerio from 'cheerio';
import { lookup } from 'node:dns/promises';
import net from 'node:net';

const MAX_BYTES = 1_500_000;
const MAX_REDIRECTS = 3;

function isPrivateIPv4(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  const [a, b] = parts;
  return a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) ||
    (a === 198 && (b === 18 || b === 19));
}
function isPrivateIPv6(ip) {
  const normalized = ip.toLowerCase();
  return normalized === '::' || normalized === '::1' || normalized.startsWith('fc') ||
    normalized.startsWith('fd') || normalized.startsWith('fe80:') ||
    normalized.startsWith('ff') || normalized.startsWith('::ffff:');
}

async function validatePublicHttpUrl(rawUrl) {
  let url;
  try { url = new URL(rawUrl); } catch { throw new Error('Invalid source URL'); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP(S) source URLs are allowed');
  if (url.username || url.password) throw new Error('Credentials in source URLs are not allowed');
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')) {
    throw new Error('Private network source URLs are not allowed');
  }
  if (net.isIP(hostname)) {
    if ((net.isIPv4(hostname) && isPrivateIPv4(hostname)) || (net.isIPv6(hostname) && isPrivateIPv6(hostname))) {
      throw new Error('Private network source URLs are not allowed');
    }
  } else {
    const addresses = await lookup(hostname, { all: true, verbatim: true });
    if (!addresses.length || addresses.some(({ address, family }) =>
      (family === 4 && isPrivateIPv4(address)) || (family === 6 && isPrivateIPv6(address)))) {
      throw new Error('Private network source URLs are not allowed');
    }
  }
  return url;
}

async function readLimitedBody(response) {
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (declaredLength > MAX_BYTES) throw new Error('Source page exceeds the size limit');
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) {
        await reader.cancel();
        throw new Error('Source page exceeds the size limit');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(merged);
}

export default async function scrapePage(rawUrl, maxChars = 8000) {
  let currentUrl = rawUrl;
  let response;
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const url = await validatePublicHttpUrl(currentUrl);
    response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(10_000),
      headers: { 'User-Agent': 'AIResearchBot/1.0 (+research summarization)', Accept: 'text/html,application/xhtml+xml' },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      await response.body?.cancel().catch(() => {});
      if (!location || redirects === MAX_REDIRECTS) throw new Error('Too many or invalid redirects');
      currentUrl = new URL(location, url).toString();
      continue;
    }
    break;
  }
  if (!response?.ok) throw new Error(`Source fetch failed with status ${response?.status ?? 'unknown'}`);
  const contentType = response.headers.get('content-type') || '';
  if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) throw new Error('Source URL did not return HTML');
  const html = await readLimitedBody(response);
  const $ = cheerio.load(html);
  $('script, style, nav, footer, header, aside, form, iframe, noscript, svg, canvas, template').remove();
  const container = $('article').length ? $('article') : $('main').length ? $('main') : $('body');
  const text = container.text().replace(/\s+/g, ' ').trim();
  return text.length > maxChars ? `${text.slice(0, maxChars)}… [Truncated]` : text;
}
