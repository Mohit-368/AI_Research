import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { criticAgent, summarizeResults } from './gemini.service.js';
import createTitle from './title.service.js';
import { processResults, searchWeb } from './tavily.service.js';

const ResearchState = Annotation.Root({
  query: Annotation({ reducer: (_, next) => next, default: () => '' }),
  title: Annotation({ reducer: (_, next) => next, default: () => '' }),
  writer_output: Annotation({ reducer: (_, next) => next, default: () => '' }),
  source: Annotation({ reducer: (_, next) => next, default: () => [] }),
  score: Annotation({ reducer: (_, next) => next, default: () => 0 }),
  strengths: Annotation({ reducer: (_, next) => next, default: () => [] }),
  weaknesses: Annotation({ reducer: (_, next) => next, default: () => [] }),
  missingInformation: Annotation({ reducer: (_, next) => next, default: () => [] }),
  suggestions: Annotation({ reducer: (_, next) => next, default: () => [] }),
  feedback: Annotation({ reducer: (_, next) => next, default: () => '' }),
});

async function sourceAgent(state) {
  const searchResults = await searchWeb(state.query);
  const source = await processResults(searchResults);
  if (!source.length) throw new Error('Search returned no sources');
  return { source };
}
async function titleAgent(state) { return { title: await createTitle(state.query) }; }
async function critiqueAndSummary(state) {
  const [critique, summary] = await Promise.all([
    criticAgent(state.source),
    summarizeResults(state.source, state.query),
  ]);
  return {
    score: critique.score,
    strengths: critique.strengths,
    weaknesses: critique.weaknesses,
    missingInformation: critique.missingInformation,
    suggestions: critique.suggestions,
    feedback: critique.feedback,
    writer_output: summary,
  };
}

const builder = new StateGraph(ResearchState)
  .addNode('sourceAgent', sourceAgent)
  .addNode('titleAgent', titleAgent)
  .addNode('analysisAgent', critiqueAndSummary)
  .addEdge(START, 'sourceAgent')
  .addEdge('sourceAgent', 'titleAgent')
  .addEdge('titleAgent', 'analysisAgent')
  .addEdge('analysisAgent', END);

export const researchGraph = builder.compile();
