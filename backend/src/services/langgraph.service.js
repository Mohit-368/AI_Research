import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import {criticAgent , summerizeResults} from "./gemini.service.js";
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
  state.title = title;
  return state;
}

async function sourceAgent(state) {
  const results = await searchWeb(state.query);
  const processedResults = await processResults(results);
  state.source = processedResults;
  return state;
}

async function criticAgentWrapper(state) {
  const critique = await criticAgent(state.source);
  state.score = critique.score;
  state.strengths = critique.strengths;
  state.weaknesses = critique.weaknesses;
  state.missingInformation = critique.missingInformation;
  state.suggestions = critique.suggestions;
  state.feedback = critique.feedback;
  return state;
}

async function summerizeResultsAgent(state) {
  const summary = await summerizeResults(state.source);
  state.writer_output = summary;
  return state;
}

const researchGraph = new StateGraph({ResearchState});
researchGraph.addEdge(START, titleAgent);
researchGraph.addEdge(titleAgent, sourceAgent);
researchGraph.addEdge(sourceAgent, criticAgentWrapper);
researchGraph.addEdge(criticAgentWrapper, summerizeResultsAgent);
researchGraph.addEdge(summerizeResultsAgent, END);

export default graph=researchGraph.compile();


