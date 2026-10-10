import test from 'node:test';
import assert from 'node:assert/strict';
import { feedbackSchema, loginSchema, paginationSchema, registerSchema, researchSchema } from '../src/schemas/request.schemas.js';

test('registration rejects short passwords and malformed email', () => {
  assert.equal(registerSchema.safeParse({ name: 'Mohit', email: 'not-an-email', password: 'short' }).success, false);
});

test('registration normal input validates', () => {
  assert.equal(registerSchema.safeParse({ name: 'Mohit Kumar', email: 'mohit@example.com', password: 'correct-horse-battery' }).success, true);
});

test('research query is trimmed and bounded', () => {
  assert.deepEqual(researchSchema.parse({ query: '  AI safety research  ' }), { query: 'AI safety research' });
  assert.equal(researchSchema.safeParse({ query: 'ab' }).success, false);
  assert.equal(researchSchema.safeParse({ query: 'x'.repeat(1001) }).success, false);
});

test('feedback rating must be an integer from one to five', () => {
  assert.equal(feedbackSchema.safeParse({ rating: 5, feedback: 'Useful' }).success, true);
  assert.equal(feedbackSchema.safeParse({ rating: 6 }).success, false);
  assert.equal(feedbackSchema.safeParse({ rating: 2.5 }).success, false);
});

test('pagination has bounded defaults and rejects oversized limits', () => {
  assert.deepEqual(paginationSchema.parse({}), { page: 1, limit: 10 });
  assert.equal(paginationSchema.safeParse({ limit: '1000' }).success, false);
});

test('login requires an email and password', () => {
  assert.equal(loginSchema.safeParse({ email: 'mohit@example.com', password: 'pass' }).success, true);
  assert.equal(loginSchema.safeParse({ email: 'bad', password: 'pass' }).success, false);
});
