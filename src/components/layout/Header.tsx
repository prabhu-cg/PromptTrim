import { HelpDrawer } from '@/components/layout/HelpDrawer'

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="" className="h-8 w-auto shrink-0" aria-hidden="true" />
          <div>
            <h1 className="text-lg font-extrabold leading-tight tracking-tight text-text">
              PromptTrim
            </h1>
            <p className="text-xs leading-tight text-text-muted">AI Prompt Optimiser</p>
          </div>
        </div>
        <HelpDrawer />
      </div>
    </header>
  )
}
