import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/marketing/Hero'
import { WhySection } from '@/components/marketing/WhySection'
import { TooltipProvider } from '@/components/ui/tooltip'
import { OptimiserWorkspace } from '@/features/optimiser/components/OptimiserWorkspace'

export function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex min-h-dvh flex-col bg-background">
        <Header />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
          <Hero />
          <OptimiserWorkspace />
          <WhySection />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  )
}
