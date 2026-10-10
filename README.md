# ResearchOS

ResearchOS is a full-stack AI-assisted research workspace. Each research session represents exactly one topic. Once a topic has been submitted, the session composer locks to that question; use **New research session** to ask something different. Completed reports, sources, critiques, and feedback are attached to the individual session.

## Features

- React + Vite responsive interface with Overview, How it works, Sign in, Register, Workspace, and per-report routes.
- Express 5 API with account registration and login, HTTP-only cookie sessions, and owner-scoped research resources.
- MongoDB persistence for users, research reports, sources, critiques, and feedback.
- LangGraph orchestration using Tavily search, Cheerio extraction, and Gemini synthesis/critique.
- Research history, source links, report copying, and 1-to-5 feedback ratings.
- Request validation, in-process rate limiting, and defensive source-fetching limits.

## Requirements

- Node.js 20.19+ or 22.12+ (use a current LTS release).
- MongoDB running locally or an accessible MongoDB URI.
- Google AI API key and Tavily API key.

## First-time setup

1. Configure backend environment variables:

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with MongoDB, JWT, Google AI and Tavily values.
   npm install
   ```

2. In one terminal, start the backend:

   ```bash
   cd backend
   npm run dev
   ```

3. In another terminal, install and start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open the Vite URL printed in the terminal, normally `http://localhost:5173`. The backend defaults to `http://localhost:5000`.

The frontend API base URL can be changed by creating `frontend/.env.local` with `VITE_API_URL=http://localhost:5000`. Do not put server-side provider API keys in any `VITE_` variable because those values are bundled into the browser.

## API routes

| Method | Route | Authentication | Description |
|---|---|---|---|
| `GET` | `/health` | No | API liveness check |
| `POST` | `/api/auth/register` | No | Register and create a session |
| `POST` | `/api/auth/login` | No | Sign in |
| `POST` | `/api/auth/logout` | No | Clear the session cookie |
| `GET` | `/api/auth/me` | Yes | Read the current user |
| `POST` | `/api/chat` | Yes | Generate a research report for one topic |
| `GET` | `/api/chat?page=1&limit=30` | Yes | Paginated research history |
| `GET` | `/api/chat/:id` | Yes | Read an owned research report, sources, and critique |
| `POST` | `/api/chat/feedback/:id` | Yes | Submit a rating and optional feedback |

The backend runs research synchronously in the request. For higher concurrency or long-running production workflows, add a durable background job queue and worker, then expose persisted job states to the client.

## Validation

Run the frontend production build and linter with:

```bash
npm run build
npm run lint
```

Run backend schema tests with:

```bash
npm test
```

These checks do not replace integration testing with a real MongoDB instance and valid provider keys.

## Security notes

- `backend/.env` and `frontend/.env.local` are ignored by Git and excluded from the provided source archive. Create your own local files from the examples.
- Use a unique JWT secret with at least 32 characters. Rotate any real credentials if they were ever committed or shared.
- Configure `CLIENT_URL` to the exact frontend origin(s) when deploying. Cookies, CORS, TLS, and frontend/backend domains must be configured together.
- The in-memory rate limiter is for a single-process setup. Use a shared store such as Redis for multi-instance deployment.
- Source scraping validates public HTTP(S) targets and bounds response size, redirects, and timeouts. For high-assurance production deployments, isolate scrapers and restrict outbound network access at the infrastructure layer.
- Retrieved pages and LLM-generated content can be inaccurate or adversarial. Treat the report as research assistance, not a certified factual determination.
