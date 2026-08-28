const NETWORK_ERROR = 'Could not reach PromptTrim. Check your connection and try again.'
const GENERIC_ERROR = 'Could not optimise the prompt. Try again.'

interface OptimiseApiResponse {
  success: boolean
  result?: string
  error?: string
}

function isOptimiseApiResponse(data: unknown): data is OptimiseApiResponse {
  return typeof data === 'object' && data !== null && 'success' in data
}

/**
 * Calls POST /api/optimise. The server owns every user-facing error string
 * (validation, rate limits, config issues) — this only adds messaging for
 * failures that happen before a response ever comes back.
 */
export async function requestOptimisedPrompt(prompt: string): Promise<string> {
  let response: Response
  try {
    response = await fetch('/api/optimise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
  } catch {
    throw new Error(NETWORK_ERROR)
  }

  const data: unknown = await response.json().catch(() => null)

  if (isOptimiseApiResponse(data) && data.success && typeof data.result === 'string') {
    return data.result
  }

  const errorMessage = isOptimiseApiResponse(data) && data.error ? data.error : GENERIC_ERROR
  throw new Error(errorMessage)
}
