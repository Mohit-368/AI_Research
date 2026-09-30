import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY,
});

async function createTitle(query) {
    const response = await gemini.invoke(
        [
            {
                role: "user",
                content: `Generate a concise title for the following research paper:

${query}`,
            },
        ],
        {
            maxOutputTokens: 50,
        }
    );

    return response.content;
}

const title = await createTitle("how ai impact job market");

console.log(title);