import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import {criticAgent , summarizeResults} from "./gemini.service.js";
import createTitle from "./title.service.js";
import {searchWeb, processResults} from "./tavily.service.js";


export const ResearchState = Annotation.Root({
  query: Annotation({
    default: () => "",
    reducer: (_, next) => next,
  }),

  title: Annotation({
    default: () => "",
    reducer: (_, next) => next,
  }),

  writer_output: Annotation({
    default: () => "",
    reducer: (_, next) => next,
  }),

  source: Annotation({
    default: () => [],
    reducer: (_, next) => next,
  }),

  score: Annotation({
    default: () => 0,
    reducer: (_, next) => next,
  }),

  strengths: Annotation({
    default: () => [],
    reducer: (_, next) => next,
  }),

  weaknesses: Annotation({
    default: () => [],
    reducer: (_, next) => next,
  }),

  missingInformation: Annotation({
    default: () => [],
    reducer: (_, next) => next,
  }),

  suggestions: Annotation({
    default: () => [],
    reducer: (_, next) => next,
  }),

  feedback: Annotation({
    default: () => "",
    reducer: (_, next) => next,
  }),
});



async function titleAgent(state) {
  const title = await createTitle(state.query);

  return {
    title
  };
}

async function sourceAgent(state) {
  const results = await searchWeb(state.query);
  const processedResults = await processResults(results);

  return {
    source: processedResults
  };
}

async function criticAgentWrapper(state) {
  const critique = await criticAgent(state.source);

  return {
    score: critique.score,
    strengths: critique.strengths,
    weaknesses: critique.weaknesses,
    missingInformation: critique.missingInformation,
    suggestions: critique.suggestions,
    feedback: critique.feedback
  };
}

async function summarizeResultsAgent(state) {
  const summary = await summarizeResults(state.source);

  return {
    writer_output: summary
  };
}

const researchGraph = new StateGraph(ResearchState);
researchGraph
    .addNode("titleAgent", titleAgent)
    .addNode("sourceAgent", sourceAgent)
    .addNode("criticAgent", criticAgentWrapper)
    .addNode("summarizeResultsAgent", summarizeResultsAgent);

researchGraph.addEdge(START, "titleAgent");
researchGraph.addEdge("titleAgent", "sourceAgent");
researchGraph.addEdge("sourceAgent", "criticAgent");
researchGraph.addEdge("criticAgent", "summarizeResultsAgent");
researchGraph.addEdge("summarizeResultsAgent", END);

const graph = researchGraph.compile();

const result = await graph.invoke({
  query: "India deal with Russia for Su-57"
});

console.log(result);


