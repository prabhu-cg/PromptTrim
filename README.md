# PromptTrim

An AI prompt optimiser. Paste a messy, verbose prompt → get back a short, clear, direct one you can paste into any AI tool.

**Paste → Optimise → Copy.**

Cut the fluff. Keep the intent.

## Stack

React 19, TypeScript (strict), Vite, Tailwind CSS v4, Radix UI primitives, Zod. No backend framework — one serverless function (`api/optimise.ts`) calls Gemini. No database, no accounts.

## Local development

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in a Gemini API key (get one at https://aistudio.google.com/apikey — free tier, no card required at time of writing, though provider terms can change):

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

This serves the app **and** `/api/optimise` from the same Vite dev server (a small dev-only middleware in `vite.config.ts` handles the API route locally) — no `vercel dev` or Vercel login required for local work.

## Production deployment (Vercel)

1. Add the Gemini API key to the hosting environment: `vercel env add GEMINI_API_KEY` (or via the Vercel dashboard → Project → Settings → Environment Variables). **Never** prefix it `VITE_*` — that would bundle it into client-side JS.
2. Add the model: `vercel env add GEMINI_MODEL` (see current free-tier models at https://ai.google.dev/gemini-api/docs/models — check this periodically, model availability changes).
3. Deploy: `vercel deploy --prod` (or push to the connected Git branch). Vercel auto-detects the Vite framework and deploys `api/optimise.ts` as a serverless function — no `vercel.json` needed.
4. Test `/api/optimise` directly:
   ```bash
   curl -X POST https://<your-domain>/api/optimise \
     -H "Content-Type: application/json" \
     -d '{"prompt":"test prompt"}'
   ```
5. Test normal optimisation through the UI: paste a prompt, click Optimise, confirm the result and Copy work.
6. Test rate-limit handling: send several requests in quick succession and confirm a 429 from Gemini surfaces as "PromptTrim is temporarily busy. Try again later." rather than a raw error.
7. Test missing configuration: temporarily remove `GEMINI_API_KEY` in the hosting environment and confirm the endpoint returns "PromptTrim is not configured correctly. Try again later." (never a stack trace or raw provider error).

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Server-side only. Never appears in client code or bundles. |
| `GEMINI_MODEL` | Yes | e.g. `gemini-3.6-flash`. Kept out of the codebase so it can be rotated without a deploy. |

## Privacy

Prompts are sent to Gemini to generate the optimised result and are not stored, persisted, or logged — server-side code only ever logs generic status codes, never prompt content or Gemini's response text.

## Scripts

```bash
npm run dev        # local dev server (app + /api/optimise)
npm run typecheck  # tsc -b --noEmit
npm run lint       # oxlint
npm run build      # production build
```
