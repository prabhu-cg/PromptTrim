import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { requestOptimisedPrompt } from '@/features/optimiser/lib/optimiseApi'
import { PROMPT_MAX_LENGTH, validatePrompt } from '@/features/optimiser/lib/validation'
import type { OptimiseStatus } from '@/features/optimiser/types'

const GENERIC_ERROR = 'Could not optimise the prompt. Try again.'

/** Minimum time between the start of one request and the next, to keep a
 * free, key-less-to-the-user API from being hammered by rapid double-clicks. */
const REQUEST_COOLDOWN_MS = 2000

export function usePromptOptimiser() {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<OptimiseStatus>('idle')
  const [output, setOutput] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isCoolingDown, setIsCoolingDown] = useState(false)
  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current)
    }
  }, [])

  const characterCount = input.length
  const isOverLimit = characterCount > PROMPT_MAX_LENGTH
  const validationMessage = useMemo(() => validatePrompt(input), [input])
  const canOptimise = validationMessage === null && status !== 'loading' && !isCoolingDown

  const handleOptimise = useCallback(async () => {
    if (status === 'loading' || isCoolingDown) return

    const message = validatePrompt(input)
    if (message) {
      setStatus('error')
      setErrorMessage(message)
      return
    }

    setStatus('loading')
    setErrorMessage(null)
    setIsCoolingDown(true)
    if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current)
    cooldownTimeoutRef.current = setTimeout(() => setIsCoolingDown(false), REQUEST_COOLDOWN_MS)

    try {
      const result = await requestOptimisedPrompt(input)
      setOutput(result)
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : GENERIC_ERROR)
    }
  }, [input, status, isCoolingDown])

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage(null)
    }
  }, [status])

  return {
    input,
    setInput: handleInputChange,
    status,
    output,
    errorMessage,
    characterCount,
    isOverLimit,
    validationMessage,
    canOptimise,
    handleOptimise,
  }
}
