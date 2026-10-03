import 'dotenv/config';
import { TavilySearch } from "@langchain/tavily";
import scrapePage  from './cheerio.service.js';


const tavily = new TavilySearch({
  maxResults: 5,
  topic: "general",
});

export async function searchWeb(query) {
  const {results} = await tavily.invoke({
    query,
  });
  return results;
}

export async function processResults(results) {
    return await Promise.all(
        results.map(async (result) => {
            return {
                ...result,
                snippet: result.content,
                content: await scrapePage(result.url)
            };
        })
    );
}


const a= await searchWeb("how ai impact job market");
const b= await processResults(a);
console.log(b);



