import { TavilySearch } from '@langchain/tavily';
import scrapePage from './cheerio.service.js';

function getTavily() {
  if (!process.env.TAVILY_API_KEY) throw new Error('TAVILY_API_KEY is not configured');
  return new TavilySearch({ maxResults: 5, topic: 'general', tavilyApiKey: process.env.TAVILY_API_KEY });
}

export async function searchWeb(query) {
  const result = await getTavily().invoke({ query });
  const results = Array.isArray(result) ? result : result?.results;
  if (!Array.isArray(results)) throw new Error('Search provider returned an invalid response');
  return results;
}

export async function processResults(results) {
  return Promise.all(results.map(async (result) => {
    let content = '';
    try { content = await scrapePage(result.url); }
    catch (error) { content = result.content || ''; }
    return {
      title: String(result.title || '').slice(0, 300),
      url: String(result.url || '').slice(0, 2048),
      snippet: String(result.content || '').slice(0, 2000),
      content: String(content || result.content || '').slice(0, 100000),
      score: typeof result.score === 'number' ? result.score : undefined,
    };
  }));
}
