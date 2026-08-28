import { PromptInputPanel } from '@/features/optimiser/components/PromptInputPanel'
import { PromptOutputPanel } from '@/features/optimiser/components/PromptOutputPanel'
import { usePromptOptimiser } from '@/features/optimiser/hooks/usePromptOptimiser'

export function OptimiserWorkspace() {
  const {
    input,
    setInput,
    status,
    output,
    errorMessage,
    characterCount,
    isOverLimit,
    validationMessage,
    canOptimise,
    handleOptimise,
  } = usePromptOptimiser()

  return (
    <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      <PromptInputPanel
        value={input}
        onChange={setInput}
        onOptimise={handleOptimise}
        characterCount={characterCount}
        isOverLimit={isOverLimit}
        validationMessage={validationMessage}
        canOptimise={canOptimise}
        status={status}
      />
      <PromptOutputPanel status={status} output={output} errorMessage={errorMessage} />
    </div>
  )
}
