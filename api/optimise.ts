import type { IncomingMessage, ServerResponse } from 'node:http'

import { extractPromptFromBody, runPromptOptimisation } from '../server/optimisePrompt.js'

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
  const outcome = await runPromptOptimisation(prompt)

  if (outcome.success) {
    res.status(200).json({ success: true, result: outcome.result })
    return
  }

  res.status(outcome.status).json({ success: false, error: outcome.error })
}

// Gemini calls have a 20s internal timeout (server/optimisePrompt.ts); this
// gives that a comfortable margin without leaving the function able to hang
// indefinitely on a slow upstream.
export const config = {
  maxDuration: 30,
}
