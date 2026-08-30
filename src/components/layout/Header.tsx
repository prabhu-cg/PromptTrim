import { HelpDrawer } from '@/components/layout/HelpDrawer'
import { Logo } from '@/components/layout/Logo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Wordmark } from '@/components/layout/Wordmark'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Logo className="h-8 w-auto shrink-0" />
          <div>
            <h1 className="text-lg font-extrabold leading-tight tracking-tight text-text">
              <Wordmark />
            </h1>
            <p className="text-xs leading-tight text-text-muted">AI Prompt Optimiser</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <HelpDrawer />
        </div>
      </div>
    </header>
  )
}
