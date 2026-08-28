import { Header } from '@/components/layout/Header'
import { TooltipProvider } from '@/components/ui/tooltip'
import { OptimiserWorkspace } from '@/features/optimiser/components/OptimiserWorkspace'

export function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex min-h-dvh flex-col bg-background">
        <Header />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
          <OptimiserWorkspace />
        </main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-text-muted sm:px-6">
            Your prompt is sent to Gemini to create your optimised prompt. It is not stored or logged.
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}
