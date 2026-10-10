# AI Research Backend

An Express 5 and MongoDB API for authenticated AI-assisted web research. It searches the web with Tavily, extracts accessible HTML content, synthesizes a report with Gemini, generates a structured evidence-quality critique, and stores the report and sources per user.

## Requirements

- Node.js 20 or newer
- MongoDB
- Google AI API key
- Tavily API key

## Setup

```bash
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, GOOGLE_API_KEY, and TAVILY_API_KEY
npm run dev
```

`JWT_SECRET` must contain at least 32 characters. Never commit `.env` or share it in a source archive. If a real credential was ever committed or shared, rotate it.

## API

All JSON requests should use `Content-Type: application/json`.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | No | Liveness check |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in and set an HTTP-only cookie |
| POST | `/api/auth/logout` | No | Clear the auth cookie |
| GET | `/api/auth/me` | Yes | Current account |
| POST | `/api/chat` | Yes | Run research with `{ "query": "..." }` |
| GET | `/api/chat?page=1&limit=10` | Yes | Paginated research history |
| GET | `/api/chat/:id` | Yes | Read an owned research report and critique |
| POST | `/api/chat/feedback/:id` | Yes | Submit `{ "rating": 1-5, "feedback": "..." }` for an owned report |

For clients that used the earlier `/api/chat/chat` route, a compatibility mount is retained. The login/register response includes a token for clients that use Bearer authentication; browser clients can use the HTTP-only cookie. For cross-origin cookie auth, set `CLIENT_URL` to the exact trusted frontend origin and send credentials from the frontend.

## Security and reliability notes

- Research and feedback queries are scoped to the authenticated owner.
- Request payloads are validated with Zod.
- Login, registration, and research creation are rate-limited in-process. This limiter is per process and is not suitable for multi-instance deployments without a shared store such as Redis.
- The HTML scraper applies request timeouts, response-size limits, redirect limits, and checks for private/internal destination addresses. For high-assurance production use, run scraping in an isolated worker with network-level egress restrictions to fully mitigate DNS rebinding and SSRF risks.
- Retrieved page text is treated as untrusted input in model prompts.
- The research endpoint currently runs synchronously. Add a durable queue and worker if report generation latency or concurrency requires it.
- Reports are persisted after successful generation. On failure, the job is marked `failed`; partial source and critique records are cleaned up.

## Tests

```bash
npm test
```

The current automated tests cover request schema validation. Add database-backed integration tests for authentication, owner isolation, the complete research pipeline, provider failures, and route contracts before production deployment.

## Project structure

```text
src/
  config/          MongoDB connection
  controllers/     HTTP handlers
  middlewares/     auth, validation, rate limiting, error handling
  models/          Mongoose schemas
  routes/          API route definitions
  schemas/         Zod request schemas
  services/        search, scraping, title, summary, critique, graph
```
