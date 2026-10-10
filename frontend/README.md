# ResearchOS Frontend

React + Vite web client for the ResearchOS backend. The client uses the backend's HTTP-only cookie session and sends credentialed requests to `VITE_API_URL`.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

By default, the app calls `http://localhost:5000`. Adjust `VITE_API_URL` in `.env.local` if the backend is hosted elsewhere. Do not place Google or Tavily API keys in frontend environment variables.

## Available routes

- `/`: overview and starter research prompts
- `/about`: research workflow explanation
- `/login`: sign in
- `/register`: create an account
- `/app`: start a one-topic research session
- `/research/:id`: view a saved report, sources, critique, and feedback

The frontend build uses Vite's SPA fallback. Rewrite unknown frontend paths to `/index.html` when deploying. `vercel.json` and `public/_redirects` are included as examples.
