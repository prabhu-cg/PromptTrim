import { HelpDrawer } from '@/components/layout/HelpDrawer'

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-extrabold text-primary-foreground"
            aria-hidden="true"
          >
            Pt
          </span>
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
