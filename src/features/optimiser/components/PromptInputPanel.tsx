import { Loader2, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PROMPT_MAX_LENGTH, PROMPT_WARNING_LENGTH } from '@/features/optimiser/lib/validation'
import type { OptimiseStatus } from '@/features/optimiser/types'
import { cn } from '@/lib/utils'

interface PromptInputPanelProps {
  value: string
  onChange: (value: string) => void
  onOptimise: () => void
  characterCount: number
  isOverLimit: boolean
  validationMessage: string | null
  canOptimise: boolean
  status: OptimiseStatus
}

export function PromptInputPanel({
  value,
  onChange,
  onOptimise,
  characterCount,
  isOverLimit,
  validationMessage,
  canOptimise,
  status,
}: PromptInputPanelProps) {
  const showValidation = characterCount > 0 && validationMessage !== null
  const isLoading = status === 'loading'
  const isNearLimit = !isOverLimit && characterCount >= PROMPT_WARNING_LENGTH

  return (
    <section aria-labelledby="prompt-input-heading" className="flex flex-1 flex-col">
      <Label htmlFor="prompt-input" id="prompt-input-heading" className="text-lg font-bold">
        Your prompt
      </Label>
      <p className="mb-3 mt-1 text-sm text-text-muted">
        Paste your messy prompt. PromptTrim keeps what matters and cuts the fluff.
      </p>

      <Textarea
        id="prompt-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste your prompt here..."
        rows={14}
        aria-describedby="prompt-counter prompt-validation"
        aria-invalid={showValidation}
        className="min-h-64 flex-1"
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p
          id="prompt-validation"
          role="status"
          aria-live="polite"
          className={cn('text-sm', showValidation ? 'text-danger' : 'sr-only')}
        >
          {showValidation ? validationMessage : ''}
        </p>
        <p
          id="prompt-counter"
          className={cn(
            'ml-auto text-sm tabular-nums',
            isOverLimit && 'font-semibold text-danger',
            isNearLimit && 'font-semibold text-warning',
            !isOverLimit && !isNearLimit && 'text-text-subtle',
          )}
        >
          {characterCount.toLocaleString()} / {PROMPT_MAX_LENGTH.toLocaleString()}
        </p>
      </div>

      <Button
        type="button"
        onClick={onOptimise}
        disabled={!canOptimise}
        className="mt-4 w-full sm:w-auto sm:self-start"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles aria-hidden="true" />
        )}
        {isLoading ? 'Optimising…' : 'Optimise prompt'}
      </Button>
    </section>
  )
}
