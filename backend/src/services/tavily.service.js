import 'dotenv/config';
import mongoose from 'mongoose';
import { TavilySearch } from "@langchain/tavily";
import Source from '../models/source.model'; 

const tavily = new TavilySearch({
  maxResults: 5,
  topic: "general",
});

export async function searchWeb(query) {
  const result = await tavily.invoke({
    query,
  });
  return result;
}


export async function searchAndSaveSources(query, messageId) {
    try {
        console.log(`Executing Tavily search for: "${query}"...`);
        const searchResult = await searchWeb(query);

        if (!searchResult || !searchResult.results || searchResult.results.length === 0) {
            console.log('No results found from Tavily.');
            return;
        }
        const operations = searchResult.results.map((item) => ({
            updateOne: {
                filter: { message: messageId, url: item.url },
                update: {
                    $set: {
                        message: messageId,
                        title: item.title || '',
                        url: item.url,
                        snippet: item.content ? item.content.substring(0, 2000) : '',
                        content: item.content || '',
                    },
                },
                upsert: true, 
            },
        }));
        const dbResult = await Source.bulkWrite(operations);
        console.log(`Successfully stored sources! Upserted: ${dbResult.upsertedCount}, Modified: ${dbResult.modifiedCount}`);
        
        return searchResult;

    } catch (error) {
        console.error('Error in search and save process:', error);
        throw error;
    }
}


