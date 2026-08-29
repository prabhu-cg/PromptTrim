import { AlertCircle, Check, Copy, Loader2, ScissorsLineDashed } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/features/optimiser/hooks/useCopyToClipboard'
import type { OptimiseStatus } from '@/features/optimiser/types'

interface PromptOutputPanelProps {
  status: OptimiseStatus
  output: string
  errorMessage: string | null
}

export function PromptOutputPanel({ status, output, errorMessage }: PromptOutputPanelProps) {
  const { copy, copied, copyError } = useCopyToClipboard()

  const statusAnnouncement = useMemo(() => {
    switch (status) {
      case 'loading':
        return 'Optimising your prompt.'
      case 'success':
        return 'Prompt optimised. Result ready below.'
      case 'error':
        return errorMessage ? `Error: ${errorMessage}` : 'Something went wrong.'
      default:
        // 'streaming' intentionally has no announcement — the result is
        // still growing, and announcing every chunk would spam screen
        // readers. The final "ready" announcement covers it once done.
        return ''
    }
  }, [status, errorMessage])

  return (
    <section aria-labelledby="prompt-output-heading" className="flex flex-1 flex-col">
      <h2 id="prompt-output-heading" className="text-lg font-bold text-text">
        PromptTrim result
      </h2>
      <p className="mb-3 mt-1 min-h-10 text-sm text-text-muted">Short. Clear. Direct.</p>

      <p role="status" aria-live="polite" className="sr-only">
        {statusAnnouncement}
      </p>

      <div className="flex flex-1 flex-col rounded-md border border-border-strong bg-surface-muted">
        <div className="flex-1 overflow-auto p-4">
          {status === 'idle' && (
            <div className="flex h-full min-h-56 flex-col items-center justify-center gap-2 text-center text-text-subtle">
              <ScissorsLineDashed className="size-6" aria-hidden="true" />
              <p className="max-w-xs text-sm">Your optimised prompt will appear here.</p>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex h-full min-h-56 flex-col items-center justify-center gap-2 text-center text-text-subtle">
              <Loader2 className="size-6 animate-spin" aria-hidden="true" />
              <p className="text-sm">Trimming the fluff…</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-start gap-3 rounded-md bg-danger-surface p-4 text-left">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
              <p className="text-sm text-text">{errorMessage}</p>
            </div>
          )}

          {(status === 'streaming' || status === 'success') && (
            <pre className="whitespace-pre-wrap break-words font-sans text-[15px] leading-relaxed text-text">
              {output}
            </pre>
          )}
        </div>

        {status === 'success' && (
          <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-3">
            <p className="text-xs text-text-subtle">Plain text — paste it into any AI tool.</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => copy(output)}
              aria-label={copied ? 'Copied to clipboard' : 'Copy optimised prompt to clipboard'}
            >
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        )}
      </div>

      {copyError && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {copyError}
        </p>
      )}
    </section>
  )
}
