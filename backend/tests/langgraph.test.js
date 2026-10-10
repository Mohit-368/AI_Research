import test from 'node:test';
import assert from 'node:assert/strict';
import { researchGraph } from '../src/services/langgraph.service.js';

test('research graph compiles with an invoke interface', () => {
  assert.equal(typeof researchGraph.invoke, 'function');
});
