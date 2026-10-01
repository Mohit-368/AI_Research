import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
    temperature: 0.2,
    maxRetries: 1,
    maxOutputTokens: 9000
});

export async function summarizeResults(results) {

    const sources = results.map((result) => `


Content:
${result.content}
`).join("\n\n-------------------------\n\n");

    const prompt = `
You are an expert research assistant.

Analyze the following web sources and produce a comprehensive research summary.

Requirements:
- Summarize the important information from each source.
- Preserve important facts, statistics, dates, and numbers.
- Do not invent information.
- Clearly distinguish claims from established facts.
- If sources disagree, mention the disagreement.
- Remove repetitive information.
- Keep the source URL associated with its findings.
- End with a combined synthesis of all sources.
- The final response must not exceed 20,000 characters.

SOURCES:

${sources}
`;

    const response = await model.invoke(prompt);

    let output = response.content;

    // Safety limit at application level
    if (output.length > 20000) {
        output = output.substring(0, 20000) + "... [Truncated]";
    }

    return output;
}