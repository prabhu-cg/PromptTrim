const NETWORK_ERROR = 'Could not reach PromptTrim. Check your connection and try again.'
const GENERIC_ERROR = 'Could not optimise the prompt. Try again.'

interface OptimiseApiErrorResponse {
  success: false
  error?: string
}

function isErrorResponse(data: unknown): data is OptimiseApiErrorResponse {
  return typeof data === 'object' && data !== null && 'success' in data
}

type StreamEvent =
  | { type: 'chunk'; text: string }
  | { type: 'error'; error: string }
  | { type: 'done' }

function isStreamEvent(data: unknown): data is StreamEvent {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    (data.type === 'chunk' || data.type === 'error' || data.type === 'done')
  )
}

/**
 * Calls POST /api/optimise and streams the result, calling `onChunk` with
 * each piece of text as it arrives. The server owns every user-facing
 * error string (validation, rate limits, config issues) — this only adds
 * messaging for failures that happen before a response ever comes back.
 *
 * A non-streamed (plain JSON) response means the request failed before
 * any text was generated — those errors carry a normal HTTP status and
 * !response.ok. Once streaming starts, the response is always 200 and
 * newline-delimited JSON events instead.
 */
export async function requestOptimisedPromptStream(
  prompt: string,
  onChunk: (text: string) => void,
): Promise<void> {
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

  if (!response.ok) {
    const data: unknown = await response.json().catch(() => null)
    throw new Error(isErrorResponse(data) && data.error ? data.error : GENERIC_ERROR)
  }

  if (!response.body) {
    throw new Error(GENERIC_ERROR)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let newlineIndex = buffer.indexOf('\n')
    while (newlineIndex !== -1) {
      const line = buffer.slice(0, newlineIndex).trim()
      buffer = buffer.slice(newlineIndex + 1)
      newlineIndex = buffer.indexOf('\n')

      if (!line) continue
      const event: unknown = JSON.parse(line)
      if (!isStreamEvent(event)) continue

      if (event.type === 'chunk') {
        onChunk(event.text)
      } else if (event.type === 'error') {
        throw new Error(event.error || GENERIC_ERROR)
      } else if (event.type === 'done') {
        return
      }
    }
  }
}
