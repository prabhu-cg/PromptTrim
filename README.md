# PromptTrim

An AI prompt optimiser. Paste a messy, verbose prompt → get back a short, clear, direct one you can paste into any AI tool.

**Paste → Optimise → Copy.**

Cut the fluff. Keep the intent.

## Stack

React 19, TypeScript (strict), Vite, Tailwind CSS v4, Radix UI primitives, Zod. No backend framework — one serverless function (`api/optimise.ts`) calls Groq and streams the result back. No database, no accounts.

## Theme

Light and dark mode, toggled from the header. Defaults to the OS preference (`prefers-color-scheme`); an explicit toggle is stored in `localStorage` (`prompttrim-theme`) and overrides the OS preference from then on, applied before first paint via a small inline script in `index.html` so there's no flash of the wrong theme on reload.

## Streaming

`/api/optimise` streams the result back as newline-delimited JSON events (`{"type":"chunk","text":"..."}`, then `{"type":"done"}` or `{"type":"error","error":"..."}`) rather than one JSON blob — the result appears progressively instead of all at once. Response status/headers are only committed once the first chunk arrives, so every pre-stream failure (validation, missing config, rate limits, upstream errors) still gets a normal JSON error response with the correct HTTP status, exactly as before streaming existed; only a failure that happens *after* streaming has started has to be signalled in-band, since the 200 response is already on the wire by then. Streaming doesn't cost anything extra or change rate-limit consumption — it's the same request, same tokens, just delivered incrementally.

## Local development

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in a Groq API key (get one at https://console.groq.com/keys — free tier, no card required at time of writing, though provider terms can change):

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

This serves the app **and** `/api/optimise` from the same Vite dev server (a small dev-only middleware in `vite.config.ts` handles the API route locally) — no `vercel dev` or Vercel login required for local work.

## Production deployment (Vercel)

1. Add the Groq API key to the hosting environment: `vercel env add GROQ_API_KEY` (or via the Vercel dashboard → Project → Settings → Environment Variables). **Never** prefix it `VITE_*` — that would bundle it into client-side JS.
2. Add the model: `vercel env add GROQ_MODEL` (see current free-tier limits per model at https://console.groq.com/docs/rate-limits — check this periodically, limits change).
3. Deploy: `vercel deploy --prod` (or push to the connected Git branch). Vercel auto-detects the Vite framework and deploys `api/optimise.ts` as a serverless function — no `vercel.json` needed.
4. Test `/api/optimise` directly:
   ```bash
   curl -X POST https://<your-domain>/api/optimise \
     -H "Content-Type: application/json" \
     -d '{"prompt":"test prompt"}'
   ```
5. Test normal optimisation through the UI: paste a prompt, click Optimise, confirm the result and Copy work.
6. Test rate-limit handling: send several requests in quick succession and confirm a 429 from Groq surfaces as "PromptTrim is temporarily busy. Try again in a few minutes." (or, if the *daily* free-tier quota is exhausted, "PromptTrim's daily free usage limit is reached. Try again tomorrow.") rather than a raw error.
7. Test missing configuration: temporarily remove `GROQ_API_KEY` in the hosting environment and confirm the endpoint returns "PromptTrim is not configured correctly. Try again later." (never a stack trace or raw provider error).

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes | Server-side only. Never appears in client code or bundles. |
| `GROQ_MODEL` | Yes | `openai/gpt-oss-120b` by default — free tier: 30 RPM, 1,000 RPD, 8,000 TPM, 200,000 TPD (confirmed via its `x-ratelimit-*` response headers). It's a reasoning model, so `server/optimisePrompt.ts` sends `reasoning_effort: "low"` to keep its (invisible, never-shown) reasoning pass cheap — remove that field if you switch to a non-reasoning model. Check https://console.groq.com/docs/models for the current lineup before picking an alternative; Groq's hosted models change over time. Kept out of the codebase so it can be rotated without a deploy. |

### Why Groq over Gemini

PromptTrim originally used Gemini (`gemini-flash-latest`), but its free tier caps out at **20 requests/day** per model — too tight for public use. Groq's free tier gives **1,000 requests/day** on `openai/gpt-oss-120b` (confirmed via its `x-ratelimit-limit-requests` response header — 50x Gemini's cap), plus meaningfully lower latency (LPU-based inference vs. the 10–15s+ responses Gemini's preview models were producing). Cloudflare Workers AI was also considered: its 10,000-neuron/day pool sounds generous but empirically works out to roughly 15–25 requests/day for a mid-sized model on ~500-token responses — not clearly better than what Gemini offered, so it wasn't a good fit for this app's up-to-10,000-character prompts.

## Privacy

Prompts are sent to Groq to generate the optimised result and are not stored, persisted, or logged — server-side code only ever logs generic status codes, never prompt content or the model's response text.

## Scripts

```bash
npm run dev        # local dev server (app + /api/optimise)
npm run typecheck  # tsc -b --noEmit
npm run lint       # oxlint
npm run build      # production build
```
