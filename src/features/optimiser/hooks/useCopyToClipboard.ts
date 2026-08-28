import { useCallback, useEffect, useRef, useState } from 'react'

const COPIED_RESET_MS = 2000

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setCopyError(null)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), COPIED_RESET_MS)
    } catch {
      setCopyError('Could not copy to clipboard. Select and copy the text manually.')
    }
  }, [])

  return { copy, copied, copyError }
}
