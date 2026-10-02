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




import { z } from "zod";

const criticSchema = z.object({
    score: z.number().int().min(0).max(10),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    missingInformation: z.array(z.string()),
    suggestions: z.array(z.string()),
    feedback: z.string()
});

export async function criticAgent(results) {

    const sources = results.map((result, index) => {
        const { content, ...sourceWithoutContent } = result;

        return {
            source: index + 1,
            ...sourceWithoutContent
        };
    });

    const prompt = `
You are a critical research reviewer.

Evaluate the quality of the provided research sources.

Review the sources based on:

1. Accuracy
2. Completeness
3. Organization
4. Clarity
5. Evidence usage
6. Objectivity
7. Source quality
8. Relevance to the research topic

Do not invent information.

Important rules:
- score must be an integer from 0 to 10.
- strengths should contain specific strengths found in the sources.
- weaknesses should contain specific weaknesses found in the sources.
- missingInformation should contain important information that is absent.
- suggestions should contain actionable improvements.
- feedback should be a concise overall assessment.

Research sources:

${JSON.stringify(sources, null, 2)}
`;

    const structuredModel = model.withStructuredOutput(criticSchema);

    const response = await structuredModel.invoke(prompt);

    return response;
}


