import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { requestOptimisedPromptStream } from '@/features/optimiser/lib/optimiseApi'
import { PROMPT_MAX_LENGTH, validatePrompt } from '@/features/optimiser/lib/validation'
import type { OptimiseStatus } from '@/features/optimiser/types'

const GENERIC_ERROR = 'Could not optimise the prompt. Try again.'

/** Minimum time between the start of one request and the next, to keep a
 * free, key-less-to-the-user API from being hammered by rapid double-clicks. */
const REQUEST_COOLDOWN_MS = 2000

const BUSY_STATUSES: OptimiseStatus[] = ['loading', 'streaming']

export function usePromptOptimiser() {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<OptimiseStatus>('idle')
  const [output, setOutput] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isCoolingDown, setIsCoolingDown] = useState(false)
  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [lastOptimisedInput, setLastOptimisedInput] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current)
    }
  }, [])

  const characterCount = input.length
  const isOverLimit = characterCount > PROMPT_MAX_LENGTH
  const validationMessage = useMemo(() => validatePrompt(input), [input])
  const isBusy = BUSY_STATUSES.includes(status)
  const hasResult = status === 'success'
  const isUnchangedSinceResult = hasResult && input === lastOptimisedInput
  const canOptimise =
    validationMessage === null && !isBusy && !isCoolingDown && !isUnchangedSinceResult

  const handleOptimise = useCallback(async () => {
    if (isBusy || isCoolingDown) return

    const message = validatePrompt(input)
    if (message) {
      setStatus('error')
      setErrorMessage(message)
      return
    }

    setStatus('loading')
    setErrorMessage(null)
    setOutput('')
    setIsCoolingDown(true)
    if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current)
    cooldownTimeoutRef.current = setTimeout(() => setIsCoolingDown(false), REQUEST_COOLDOWN_MS)

    let receivedAny = false
    try {
      await requestOptimisedPromptStream(input, (chunk) => {
        if (!receivedAny) {
          receivedAny = true
          setStatus('streaming')
        }
        setOutput((current) => current + chunk)
      })
      setLastOptimisedInput(input)
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : GENERIC_ERROR)
    }
  }, [input, isBusy, isCoolingDown])

  const handleInputChange = useCallback((value: string) => {
    setInput(value)
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage(null)
    }
  }, [status])

  const handleClearAll = useCallback(() => {
    if (cooldownTimeoutRef.current) clearTimeout(cooldownTimeoutRef.current)
    setLastOptimisedInput(null)
    setInput('')
    setOutput('')
    setStatus('idle')
    setErrorMessage(null)
    setIsCoolingDown(false)
  }, [])

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
    hasResult,
    handleOptimise,
    handleClearAll,
  }
}
