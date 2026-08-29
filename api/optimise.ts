import type { IncomingMessage, ServerResponse } from 'node:http'

import { extractPromptFromBody, streamPromptOptimisation } from '../server/optimisePrompt.js'

/**
 * Vercel's Node.js function runtime passes request/response objects shaped
 * like this — IncomingMessage/ServerResponse plus the body/helper additions
 * it layers on. Typed locally to avoid depending on `@vercel/node` just for
 * these two names.
 */
interface ApiRequest extends IncomingMessage {
  method?: string
  body?: unknown
}

interface ApiResponse extends ServerResponse {
  status(code: number): ApiResponse
  json(body: unknown): void
}

// No Access-Control-* headers are set anywhere in this handler. That's
// deliberate: PromptTrim's frontend calls this endpoint same-origin only,
// so the browser's default same-origin policy is the correct restriction —
// adding a permissive CORS header would be the only thing that could open
// this endpoint up to other sites' JavaScript.
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed.' })
    return
  }

  const prompt = extractPromptFromBody(req.body)

  // Response status/headers can only be committed once — so they're only
  // set on the *first* chunk. Anything that fails before then (validation,
  // missing config, rate limits, upstream errors) still gets a normal JSON
  // error response with the right status code, exactly as before streaming
  // existed. Only once we're mid-stream does an error have to be signalled
  // in-band, since the 200 + headers are already on the wire by then.
  let streaming = false
  const outcome = await streamPromptOptimisation(prompt, (chunk) => {
    if (!streaming) {
      streaming = true
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/x-ndjson')
    }
    res.write(`${JSON.stringify({ type: 'chunk', text: chunk })}\n`)
  })

  if (!streaming) {
    // No chunk was ever emitted, which — per streamPromptOptimisation's
    // contract — only happens on failure (success requires at least one
    // non-empty chunk). The explicit check (rather than trusting
    // `streaming`) is what lets TypeScript narrow `outcome` here.
    if (!outcome.success) {
      res.status(outcome.status).json({ success: false, error: outcome.error })
    }
    return
  }

  res.write(
    `${JSON.stringify(outcome.success ? { type: 'done' } : { type: 'error', error: outcome.error })}\n`,
  )
  res.end()
}

// Groq calls have a 20s internal timeout (server/optimisePrompt.ts); this
// gives that a comfortable margin without leaving the function able to hang
// indefinitely on a slow upstream.
export const config = {
  maxDuration: 30,
}
